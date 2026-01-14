"use server"

import { auth } from "@clerk/nextjs/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import type { CartItem, Product } from "@/lib/types"

/**
 * Get cart items for the current user
 */
export async function getCartItems(): Promise<(CartItem & { product: Product })[]> {
    const { userId } = await auth()

    if (!userId) {
        // For guests, cart is handled client-side
        return []
    }

    const supabase = createAdminClient()

    const { data, error } = await supabase
        .from("cart_items")
        .select(`
      *,
      products (*)
    `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching cart:", error)
        return []
    }

    return data.map((item: any) => ({
        ...item,
        product: item.products as Product,
    })) as (CartItem & { product: Product })[]
}

/**
 * Add item to cart
 */
export async function addToCart(productId: string, quantity: number = 1) {
    const { userId } = await auth()

    if (!userId) {
        // Return that user should use client-side cart
        return { success: false, requiresAuth: true }
    }

    const supabase = createAdminClient()

    // Check if product already in cart
    const { data: existing } = await supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("user_id", userId)
        .eq("product_id", productId)
        .maybeSingle()

    if (existing) {
        // Update quantity
        const { error } = await supabase
            .from("cart_items")
            .update({
                quantity: existing.quantity + quantity,
                updated_at: new Date().toISOString(),
            })
            .eq("id", existing.id)

        if (error) {
            console.error("Error updating cart item:", error)
            throw new Error("Failed to update cart")
        }
    } else {
        // Insert new item
        const { error } = await supabase
            .from("cart_items")
            .insert({
                user_id: userId,
                product_id: productId,
                quantity,
            })

        if (error) {
            console.error("Error adding to cart:", error)
            throw new Error("Failed to add to cart")
        }
    }

    revalidatePath("/cart")
    return { success: true }
}

/**
 * Update cart item quantity
 */
export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
    const { userId } = await auth()

    if (!userId) {
        return { success: false, requiresAuth: true }
    }

    const supabase = createAdminClient()

    if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return removeCartItem(cartItemId)
    }

    const { error } = await supabase
        .from("cart_items")
        .update({
            quantity,
            updated_at: new Date().toISOString(),
        })
        .eq("id", cartItemId)
        .eq("user_id", userId) // Ensure user owns the item

    if (error) {
        console.error("Error updating cart item:", error)
        throw new Error("Failed to update cart")
    }

    revalidatePath("/cart")
    return { success: true }
}

/**
 * Remove item from cart
 */
export async function removeCartItem(cartItemId: string) {
    const { userId } = await auth()

    if (!userId) {
        return { success: false, requiresAuth: true }
    }

    const supabase = createAdminClient()

    const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", cartItemId)
        .eq("user_id", userId) // Ensure user owns the item

    if (error) {
        console.error("Error removing cart item:", error)
        throw new Error("Failed to remove from cart")
    }

    revalidatePath("/cart")
    return { success: true }
}

/**
 * Clear entire cart
 */
export async function clearCart() {
    const { userId } = await auth()

    if (!userId) {
        return { success: false, requiresAuth: true }
    }

    const supabase = createAdminClient()

    const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", userId)

    if (error) {
        console.error("Error clearing cart:", error)
        throw new Error("Failed to clear cart")
    }

    revalidatePath("/cart")
    return { success: true }
}

/**
 * Sync guest cart to user cart after login
 */
export async function syncGuestCart(guestItems: Array<{ product_id: string; quantity: number }>) {
    const { userId } = await auth()

    if (!userId || !guestItems.length) {
        return { success: false }
    }

    const supabase = createAdminClient()

    // Add each guest item to user's cart
    for (const item of guestItems) {
        await addToCart(item.product_id, item.quantity).catch((err) => {
            console.error("Error syncing cart item:", err)
        })
    }

    return { success: true }
}
