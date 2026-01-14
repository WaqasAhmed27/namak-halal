import { Webhook } from "svix"
import { headers } from "next/headers"
import { WebhookEvent } from "@clerk/nextjs/server"
import { createAdminClient } from "@/lib/supabase/admin"

/**
 * Clerk Webhook Handler
 * 
 * Handles user lifecycle events from Clerk and syncs to Supabase.
 * All operations are idempotent to safely handle webhook retries.
 */
export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SECRET is not set")
    return new Response("Webhook secret not configured", { status: 500 })
  }

  // Get headers for verification
  const headerPayload = await headers()
  const svixId = headerPayload.get("svix-id")
  const svixTimestamp = headerPayload.get("svix-timestamp")
  const svixSignature = headerPayload.get("svix-signature")

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error("Missing svix headers")
    return new Response("Missing verification headers", { status: 400 })
  }

  // Get the body
  const payload = await req.text()

  // Create Svix webhook instance and verify
  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: WebhookEvent

  try {
    evt = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent
  } catch (err) {
    console.error("Webhook verification failed:", err)
    return new Response("Invalid signature", { status: 400 })
  }

  // Get Supabase admin client (uses service role, bypasses RLS)
  const supabase = createAdminClient()

  const eventType = evt.type

  try {
    switch (eventType) {
      case "user.created": {
        const { id, email_addresses, first_name, last_name } = evt.data
        const primaryEmail = email_addresses?.[0]?.email_address || null
        const fullName = [first_name, last_name].filter(Boolean).join(" ") || null

        // Upsert to handle retries (idempotent)
        const { error } = await supabase
          .from("profiles")
          .upsert(
            {
              id,
              email: primaryEmail,
              full_name: fullName,
              is_admin: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" }
          )

        if (error) {
          console.error("Error creating profile:", error)
          return new Response("Database error", { status: 500 })
        }

        console.log(`Profile created/updated for user: ${id}`)
        break
      }

      case "user.updated": {
        const { id, email_addresses, first_name, last_name, public_metadata } = evt.data
        const primaryEmail = email_addresses?.[0]?.email_address || null
        const fullName = [first_name, last_name].filter(Boolean).join(" ") || null

        // Check if user should be admin (from public_metadata)
        const isAdmin = public_metadata?.role === "admin"

        // Update profile (idempotent - update only)
        const { error } = await supabase
          .from("profiles")
          .upsert(
            {
              id,
              email: primaryEmail,
              full_name: fullName,
              is_admin: isAdmin,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" }
          )


        if (error) {
          console.error("Error updating profile:", error)
          return new Response("Database error", { status: 500 })
        }

        console.log(`Profile updated for user: ${id}`)
        break
      }

      case "user.deleted": {
        const { id } = evt.data

        if (!id) {
          console.error("No user ID in delete event")
          return new Response("Invalid payload", { status: 400 })
        }

        // Delete profile - cascades to related data based on FK constraints
        // This is idempotent - deleting non-existent row is fine
        const { error } = await supabase
          .from("profiles")
          .delete()
          .eq("id", id)

        if (error) {
          console.error("Error deleting profile:", error)
          return new Response("Database error", { status: 500 })
        }

        // Also clean up cart items for this user
        await supabase.from("cart_items").delete().eq("user_id", id)

        // Clean up wishlist items
        await supabase.from("wishlist_items").delete().eq("user_id", id)

        // Note: Orders are preserved for record-keeping (user_id set to null via FK)
        // Addresses are also preserved for order history

        console.log(`Profile and related data deleted for user: ${id}`)
        break
      }

      default:
        console.log(`Unhandled webhook event: ${eventType}`)
    }

    return new Response("Webhook processed successfully", { status: 200 })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return new Response("Internal server error", { status: 500 })
  }
}
