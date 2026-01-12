import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Package, ShoppingCart, Users, TrendingUp, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { OrderStatusSelect } from "@/components/admin/order-status-select"
import { createClient } from "@/lib/supabase/server"

async function getOrders() {
  const supabase = await createClient()
  const { data: orders } = await supabase
    .from("orders")
    .select("*, profiles(full_name, email)")
    .order("created_at", { ascending: false })
  return orders || []
}

export default async function AdminOrders() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  // Check if user is admin using Clerk publicMetadata
  const user = await currentUser()

  if (user?.publicMetadata?.role !== "admin") {
    redirect("/")
  }

  const orders = await getOrders()

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
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Package className="h-5 w-5" />
                Products
              </Link>
              <Link
                href="/admin/orders"
                className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-primary"
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
            <h1 className="text-3xl font-bold">Orders</h1>
            <p className="text-muted-foreground">Manage customer orders</p>
          </div>

          <Card className="border-border bg-card">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Order</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Customer</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Total</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length > 0 ? (
                      orders.map((order: any) => (
                        <tr key={order.id} className="border-b border-border last:border-0">
                          <td className="px-6 py-4">
                            <Link href={`/admin/orders/${order.id}`} className="font-medium hover:text-primary">
                              #{order.id.slice(0, 8)}
                            </Link>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium">
                                {order.profiles?.full_name || order.shipping_address?.name || "Guest"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {order.profiles?.email || order.shipping_address?.email}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 font-medium">Rs. {order.total?.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                          No orders yet
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
