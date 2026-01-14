"use server"

import { auth } from "@clerk/nextjs/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import type { WishlistItem, Product } from "@/lib/types"

/**
 * Require authentication
 */
async function requireAuth() {
    const { userId } = await auth()
    if (!userId) {
        throw new Error("Authentication required")
    }
    return userId
}

/**
 * Add product to wishlist
 */
export async function addToWishlist(productId: string) {
    const userId = await requireAuth()
    const supabase = createAdminClient()

    // Upsert to handle duplicates (idempotent)
    const { error } = await supabase
        .from("wishlist_items")
        .upsert(
            {
                user_id: userId,
                product_id: productId,
                created_at: new Date().toISOString(),
            },
            { onConflict: "user_id,product_id" }
        )

    if (error) {
        console.error("Error adding to wishlist:", error)
        throw new Error("Failed to add to wishlist")
    }

    revalidatePath("/wishlist")
    return { success: true }
}

/**
 * Remove product from wishlist
 */
export async function removeFromWishlist(productId: string) {
    const userId = await requireAuth()
    const supabase = createAdminClient()

    const { error } = await supabase
        .from("wishlist_items")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", productId)

    if (error) {
        console.error("Error removing from wishlist:", error)
        throw new Error("Failed to remove from wishlist")
    }

    revalidatePath("/wishlist")
    return { success: true }
}

/**
 * Get user's wishlist with product details
 */
export async function getWishlist() {
    const userId = await requireAuth()
    const supabase = createAdminClient()

    const { data, error } = await supabase
        .from("wishlist_items")
        .select(`
      *,
      products (*)
    `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching wishlist:", error)
        throw new Error("Failed to fetch wishlist")
    }

    // Transform data to include product directly
    return data.map((item: any) => ({
        ...item,
        product: item.products as Product,
    })) as (WishlistItem & { product: Product })[]
}

/**
 * Check if product is in user's wishlist
 */
export async function isInWishlist(productId: string): Promise<boolean> {
    const { userId } = await auth()

    if (!userId) {
        return false
    }

    const supabase = createAdminClient()

    const { data, error } = await supabase
        .from("wishlist_items")
        .select("id")
        .eq("user_id", userId)
        .eq("product_id", productId)
        .maybeSingle()

    if (error) {
        console.error("Error checking wishlist:", error)
        return false
    }

    return !!data
}

/**
 * Toggle wishlist item
 */
export async function toggleWishlist(productId: string) {
    const userId = await requireAuth()
    const supabase = createAdminClient()

    // Check if already in wishlist
    const { data: existing } = await supabase
        .from("wishlist_items")
        .select("id")
        .eq("user_id", userId)
        .eq("product_id", productId)
        .maybeSingle()

    if (existing) {
        await removeFromWishlist(productId)
        return { success: true, added: false }
    } else {
        await addToWishlist(productId)
        return { success: true, added: true }
    }
}
