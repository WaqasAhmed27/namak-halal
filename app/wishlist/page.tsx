import Link from "next/link"
import { Heart } from "lucide-react"
import { Starfield } from "@/components/ui/starfield"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function WishlistPage() {
  // For now, wishlist is empty - will be populated from database when user is logged in
  const wishlistItems: any[] = []

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
              {/* Wishlist items would render here */}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
