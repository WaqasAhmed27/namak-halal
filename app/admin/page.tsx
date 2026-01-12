import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"

async function getAdminStats() {
  const supabase = await createClient()

  const [productsResult, ordersResult, customersResult] = await Promise.all([
    supabase.from("products").select("*", { count: "exact" }),
    supabase.from("orders").select("*"),
    supabase.from("profiles").select("*", { count: "exact" }),
  ])

  const products = productsResult.data || []
  const orders = ordersResult.data || []
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
  const pendingOrders = orders.filter((o) => o.status === "pending").length

  return {
    totalProducts: productsResult.count || 0,
    totalOrders: orders.length,
    totalCustomers: customersResult.count || 0,
    totalRevenue,
    pendingOrders,
    recentOrders: orders.slice(0, 5),
  }
}

export default async function AdminDashboard() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  // Check if user is admin using Clerk publicMetadata
  const user = await currentUser()

  if (user?.publicMetadata?.role !== "admin") {
    redirect("/")
  }

  const stats = await getAdminStats()

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
              <Link href="/admin" className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-primary">
                <TrendingUp className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="/admin/products"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
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
                {stats.pendingOrders > 0 && (
                  <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                    {stats.pendingOrders}
                  </span>
                )}
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
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here&apos;s your store overview.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rs. {stats.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">From {stats.totalOrders} orders</p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <p className="text-xs text-muted-foreground">{stats.pendingOrders} pending</p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Products</CardTitle>
                <Package className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
                <p className="text-xs text-muted-foreground">Active listings</p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Customers</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCustomers}</div>
                <p className="text-xs text-muted-foreground">Registered users</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card className="mt-8 border-border bg-card">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentOrders.map((order: any) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">Rs. {order.total?.toLocaleString()}</p>
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-xs ${order.status === "delivered"
                              ? "bg-green-500/20 text-green-400"
                              : order.status === "shipped"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No orders yet</p>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
