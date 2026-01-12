import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { Package, ShoppingCart, Users, TrendingUp, Eye, ArrowLeft } from "lucide-react"
import { ProductForm } from "@/components/admin/product-form"
import { createClient } from "@/lib/supabase/server"

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  // Check if user is admin using Clerk publicMetadata
  const user = await currentUser()

  if (user?.publicMetadata?.role !== "admin") {
    redirect("/")
  }

  const supabase = await createClient()
  const { data: product } = await supabase.from("products").select("*").eq("id", id).single()

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center border-b border-border px-6">
              <Link href="/admin" className="font-serif text-xl text-primary">
                Namak Halal
              </Link>
              <span className="ml-2 rounded bg-primary/20 px-2 py-0.5 text-xs text-primary">Admin</span>
            </div>
            <nav className="flex-1 space-y-1 p-4">
              <Link
                href="/admin"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <TrendingUp className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="/admin/products"
                className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-primary"
              >
                <Package className="h-5 w-5" />
                Products
              </Link>
              <Link
                href="/admin/orders"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <ShoppingCart className="h-5 w-5" />
                Orders
              </Link>
              <Link
                href="/admin/customers"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Users className="h-5 w-5" />
                Customers
              </Link>
            </nav>
            <div className="border-t border-border p-4">
              <Link
                href="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Eye className="h-5 w-5" />
                View Store
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-8">
          <div className="mb-8">
            <Link
              href="/admin/products"
              className="mb-4 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </Link>
            <h1 className="text-3xl font-bold">Edit Product</h1>
            <p className="text-muted-foreground">Update product details</p>
          </div>

          <ProductForm product={product} />
        </main>
      </div>
    </div>
  )
}
