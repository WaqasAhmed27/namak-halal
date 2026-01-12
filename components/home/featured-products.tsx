import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import type { Product } from "@/lib/types"

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_featured", true)
      .eq("is_active", true)
      .limit(4)

    if (error) throw error
    return data || []
  } catch {
    return []
  }
}

export async function FeaturedProducts() {
  const products = await getFeaturedProducts()

  const displayProducts =
    products.length > 0
      ? products
      : [
        {
          id: "1",
          name: "Natural Himalayan Salt Lamp",
          slug: "natural-himalayan-salt-lamp-medium",
          short_description: "Hand-carved authentic Khewra salt lamp with warm amber glow",
          price: 4500,
          compare_at_price: 5500,
          images: ["/himalayan-salt-lamp-glowing-amber.jpg"],
          shape: "Natural",
          size: "Medium",
        },
        {
          id: "2",
          name: "Pyramid Salt Lamp",
          slug: "pyramid-salt-lamp",
          short_description: "Sacred geometry meets natural healing",
          price: 5500,
          compare_at_price: 6500,
          images: ["/pyramid-shaped-pink-salt-lamp.jpg"],
          shape: "Pyramid",
          size: "Medium",
        },
        {
          id: "3",
          name: "Sphere Salt Lamp",
          slug: "sphere-salt-lamp",
          short_description: "Perfectly polished sphere with 360-degree warm glow",
          price: 6500,
          compare_at_price: 7500,
          images: ["/sphere-round-pink-himalayan-salt-lamp.jpg"],
          shape: "Sphere",
          size: "Medium",
        },
        {
          id: "4",
          name: "Heart Shape Salt Lamp",
          slug: "heart-shape-salt-lamp",
          short_description: "Romantic heart-shaped lamp perfect for gifts",
          price: 4000,
          compare_at_price: 4800,
          images: ["/heart-shaped-pink-salt-lamp-romantic.jpg"],
          shape: "Heart",
          size: "Small",
        },
      ]

  return (
    <section className="py-12 md:py-20 px-3 md:px-4">
      <div className="container mx-auto">
        {/* Section header - smaller on mobile */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-3 md:gap-4 mb-8 md:mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-1 md:mb-2 tracking-tight">
              Featured Collection
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Our most beloved salt lamps, handpicked for you
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="group bg-transparent text-xs md:text-sm font-semibold uppercase tracking-wide"
          >
            <Link href="/shop">
              View All
              <ArrowRight className="ml-1.5 md:ml-2 h-3 w-3 md:h-4 md:w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {displayProducts.map((product: any) => (
            <Link key={product.id} href={`/shop/${product.slug}`}>
              <Card className="group bg-card/50 border-border hover:border-primary/50 transition-all duration-300 overflow-hidden">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.images?.[0] || "/placeholder.svg?height=400&width=400"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {product.compare_at_price && product.compare_at_price > product.price && (
                    <Badge className="absolute top-2 md:top-3 left-2 md:left-3 bg-accent text-accent-foreground text-[10px] md:text-xs font-bold">
                      Sale
                    </Badge>
                  )}
                </div>
                <CardContent className="p-2.5 md:p-4">
                  <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-muted-foreground mb-1 md:mb-2 uppercase tracking-wide font-medium">
                    {product.shape && <span>{product.shape}</span>}
                    {product.shape && product.size && <span>•</span>}
                    {product.size && <span>{product.size}</span>}
                  </div>
                  <h3 className="font-bold text-xs md:text-sm text-foreground mb-0.5 md:mb-1 group-hover:text-primary transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-[10px] md:text-sm text-muted-foreground line-clamp-2 mb-2 md:mb-3 hidden md:block">
                    {product.short_description}
                  </p>
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <span className="font-bold text-xs md:text-base text-foreground">{formatPrice(product.price)}</span>
                    {product.compare_at_price && product.compare_at_price > product.price && (
                      <span className="text-[10px] md:text-sm text-muted-foreground line-through">
                        {formatPrice(product.compare_at_price)}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
