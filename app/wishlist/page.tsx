import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Heart } from "lucide-react"
import { Starfield } from "@/components/ui/starfield"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getWishlist } from "@/lib/actions/wishlist"
import { WishlistItemCard } from "@/components/product/wishlist-item-card"

export const metadata = {
  title: "My Wishlist | Namak Halal",
  description: "View and manage your saved products",
}

export default async function WishlistPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in?redirect_url=/wishlist")
  }

  let wishlistItems: Awaited<ReturnType<typeof getWishlist>> = []

  try {
    wishlistItems = await getWishlist()
  } catch (error) {
    console.error("Failed to load wishlist:", error)
  }

  return (
    <>
      <Starfield />
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-foreground mb-8">My Wishlist</h1>

          {wishlistItems.length === 0 ? (
            <Card className="bg-card/50 border-border">
              <CardContent className="p-12 text-center">
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">Your wishlist is empty</h2>
                <p className="text-muted-foreground mb-6">Save your favorite salt lamps here for easy access later</p>
                <Button asChild>
                  <Link href="/shop">Browse Products</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <WishlistItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
