"use server"

import { auth, currentUser } from "@clerk/nextjs/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// Check if user is admin
async function checkAdmin() {
    const user = await currentUser()
    if (!user || user.publicMetadata.role !== "admin") {
        throw new Error("Unauthorized: Admin access required")
    }
    return user
}

export async function createProduct(formData: any) {
    await checkAdmin()
    const supabase = createAdminClient()

    // Ensure clean data for insertion
    const productData = {
        ...formData,
        // Ensure we don't send undefined/NaN values
        compare_at_price: formData.compare_at_price || null,
        weight_kg: formData.weight_kg || null,
        stock_quantity: formData.stock_quantity || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from("products").insert(productData).select().single()

    if (error) {
        console.error("Supabase Create Error:", error)
        throw new Error(error.message)
    }

    revalidatePath("/admin/products")
    revalidatePath("/shop")
    return { success: true, product: data }
}

export async function updateProduct(id: string, formData: any) {
    await checkAdmin()
    const supabase = createAdminClient()

    // Ensure clean data for update
    const productData = {
        ...formData,
        compare_at_price: formData.compare_at_price || null,
        weight_kg: formData.weight_kg || null,
        stock_quantity: formData.stock_quantity || 0,
        updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from("products").update(productData).eq("id", id)

    if (error) {
        console.error("Supabase Update Error:", error)
        throw new Error(error.message)
    }

    revalidatePath("/admin/products")
    revalidatePath("/shop")
    revalidatePath(`/shop/${formData.slug}`)
    return { success: true }
}
