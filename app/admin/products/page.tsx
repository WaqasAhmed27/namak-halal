import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Package, ShoppingCart, Users, TrendingUp, Eye, Plus, Pencil } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DeleteProductButton } from "@/components/admin/delete-product-button"
import { createClient } from "@/lib/supabase/server"

async function getProducts() {
  const supabase = await createClient()
  const { data: products } = await supabase.from("products").select("*").order("created_at", { ascending: false })
  return products || []
}

export default async function AdminProducts() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  // Check if user is admin using Clerk publicMetadata
  const user = await currentUser()

  if (user?.publicMetadata?.role !== "admin") {
    redirect("/")
  }

  const products = await getProducts()

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
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Products</h1>
              <p className="text-muted-foreground">Manage your product catalog</p>
            </div>
            <Link href="/admin/products/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </Link>
          </div>

          <Card className="border-border bg-card">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Product</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Price</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Stock</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                      <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length > 0 ? (
                      products.map((product) => (
                        <tr key={product.id} className="border-b border-border last:border-0">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-muted">
                                <Image
                                  src={product.images?.[0] || "/placeholder.svg?height=48&width=48&query=salt lamp"}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-muted-foreground">{product.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground capitalize">
                            {product.category || "Uncategorized"}
                          </td>
                          <td className="px-6 py-4">Rs. {product.price?.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`${product.stock_quantity > 10
                                ? "text-green-400"
                                : product.stock_quantity > 0
                                  ? "text-yellow-400"
                                  : "text-red-400"
                                }`}
                            >
                              {product.stock_quantity}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-block rounded-full px-2 py-0.5 text-xs ${product.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                                }`}
                            >
                              {product.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <Link href={`/admin/products/${product.id}/edit`}>
                                <Button variant="ghost" size="icon">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </Link>
                              <DeleteProductButton productId={product.id} />
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                          No products found. Add your first product to get started.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
