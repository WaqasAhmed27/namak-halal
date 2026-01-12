import { redirect } from "next/navigation"
import { auth, currentUser } from "@clerk/nextjs/server"
import Link from "next/link"
import { Package, Heart, MapPin, User, ChevronRight } from "lucide-react"
import { Starfield } from "@/components/ui/starfield"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"

const accountLinks = [
  {
    href: "/account/orders",
    icon: Package,
    title: "Order History",
    description: "View your past orders and track shipments",
  },
  {
    href: "/account/wishlist",
    icon: Heart,
    title: "Wishlist",
    description: "Products you've saved for later",
  },
  {
    href: "/account/addresses",
    icon: MapPin,
    title: "Addresses",
    description: "Manage your shipping addresses",
  },
  {
    href: "/account/settings",
    icon: User,
    title: "Account Settings",
    description: "Update your profile and password",
  },
]

export default async function AccountPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const user = await currentUser()
  const fullName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : user?.emailAddresses[0]?.emailAddress?.split("@")[0] || "User"

  const email = user?.emailAddresses[0]?.emailAddress || ""

  return (
    <>
      <Starfield />
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Welcome section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {fullName}</h1>
            <p className="text-muted-foreground">{email}</p>
          </div>

          {/* Account navigation */}
          <div className="grid gap-4 md:grid-cols-2">
            {accountLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Card className="bg-card/50 border-border hover:border-primary/50 transition-all duration-300 h-full group">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <link.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {link.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{link.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Sign out is handled by UserButton in header */}
        </div>
      </main>
      <Footer />
    </>
  )
}
