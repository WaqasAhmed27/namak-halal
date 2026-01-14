"use server"

import { auth, currentUser } from "@clerk/nextjs/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import type { Order, OrderItem } from "@/lib/types"

/**
 * Check if user is authenticated
 */
async function requireAuth() {
    const { userId } = await auth()
    if (!userId) {
        throw new Error("Authentication required")
    }
    return userId
}

/**
 * Check if user is admin
 */
async function requireAdmin() {
    const user = await currentUser()
    if (!user) {
        throw new Error("Authentication required")
    }
    if (user.publicMetadata?.role !== "admin") {
        throw new Error("Admin access required")
    }
    return user.id
}

/**
 * Create a new order with items
 */
export async function createOrder(orderData: {
    email: string
    shippingAddress: {
        full_name: string
        street_address: string
        city: string
        state?: string
        postal_code: string
        country: string
        phone?: string
    }
    items: Array<{
        product_id: string
        product_name: string
        product_price: number
        quantity: number
    }>
    subtotal: number
    shippingCost: number
    discountAmount: number
    shippingMethod: string
}) {
    const { userId } = await auth()
    const supabase = createAdminClient()

    // Calculate total
    const total = orderData.subtotal + orderData.shippingCost - orderData.discountAmount

    // Create order
    const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
            user_id: userId || null,
            guest_email: userId ? null : orderData.email,
            status: "pending",
            subtotal: orderData.subtotal,
            shipping_cost: orderData.shippingCost,
            discount_amount: orderData.discountAmount,
            total,
            shipping_address: orderData.shippingAddress,
            shipping_method: orderData.shippingMethod,
            payment_method: "cod", // Cash on delivery
        })
        .select()
        .single()

    if (orderError) {
        console.error("Error creating order:", orderError)
        throw new Error("Failed to create order")
    }

    // Create order items
    const orderItems = orderData.items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_price: item.product_price,
        quantity: item.quantity,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
        console.error("Error creating order items:", itemsError)
        // Rollback order
        await supabase.from("orders").delete().eq("id", order.id)
        throw new Error("Failed to create order items")
    }

    // Update product stock quantities (best-effort, don't fail order)
    for (const item of orderData.items) {
        try {
            // Fetch current stock
            const { data: product } = await supabase
                .from("products")
                .select("stock_quantity")
                .eq("id", item.product_id)
                .single()

            if (product) {
                const newStock = Math.max(0, (product.stock_quantity || 0) - item.quantity)
                await supabase
                    .from("products")
                    .update({ stock_quantity: newStock })
                    .eq("id", item.product_id)
            }
        } catch {
            console.warn(`Failed to decrement stock for product ${item.product_id}`)
        }
    }

    // Clear user's cart if authenticated
    if (userId) {
        await supabase.from("cart_items").delete().eq("user_id", userId)
    }

    // Send order notification (best-effort, don't fail order if this fails)
    try {
        await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/order-notify`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: order.id,
                order_number: order.order_number,
                total: order.total,
                email: orderData.email,
            }),
        })
    } catch (notifyError) {
        console.warn("Failed to send order notification:", notifyError)
    }

    revalidatePath("/account/orders")
    revalidatePath("/admin/orders")

    return { success: true, orderId: order.id, orderNumber: order.order_number }
}

/**
 * Get orders for the current user
 */
export async function getUserOrders() {
    const userId = await requireAuth()
    const supabase = createAdminClient()

    const { data, error } = await supabase
        .from("orders")
        .select(`
      *,
      order_items (*)
    `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching orders:", error)
        throw new Error("Failed to fetch orders")
    }

    return data as (Order & { order_items: OrderItem[] })[]
}

/**
 * Get a single order by ID (for user)
 */
export async function getUserOrderById(orderId: string) {
    const userId = await requireAuth()
    const supabase = createAdminClient()

    const { data, error } = await supabase
        .from("orders")
        .select(`
      *,
      order_items (*)
    `)
        .eq("id", orderId)
        .eq("user_id", userId)
        .single()

    if (error) {
        console.error("Error fetching order:", error)
        throw new Error("Order not found")
    }

    return data as Order & { order_items: OrderItem[] }
}

/**
 * Update order status (admin only)
 */
export async function updateOrderStatus(orderId: string, status: string) {
    await requireAdmin()
    const supabase = createAdminClient()

    const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]
    if (!validStatuses.includes(status)) {
        throw new Error("Invalid status")
    }

    const { error } = await supabase
        .from("orders")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", orderId)

    if (error) {
        console.error("Error updating order status:", error)
        throw new Error("Failed to update order status")
    }

    revalidatePath("/admin/orders")
    revalidatePath("/account/orders")

    return { success: true }
}

/**
 * Get all orders (admin only)
 */
export async function getAllOrders() {
    await requireAdmin()
    const supabase = createAdminClient()

    const { data, error } = await supabase
        .from("orders")
        .select(`
      *,
      order_items (*),
      profiles (full_name, email)
    `)
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching all orders:", error)
        throw new Error("Failed to fetch orders")
    }

    return data
}
