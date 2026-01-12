import Link from "next/link"
import Image from "next/image"
import { Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import type { Product } from "@/lib/types"

interface ProductGridProps {
  searchParams: {
    shape?: string
    size?: string
    minPrice?: string
    maxPrice?: string
    sort?: string
    search?: string
  }
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

async function getProducts(searchParams: ProductGridProps["searchParams"]): Promise<Product[]> {
  try {
    const supabase = await createClient()
    let query = supabase.from("products").select("*").eq("is_active", true)

    // Apply filters
    if (searchParams.shape) {
      query = query.eq("shape", searchParams.shape)
    }
    if (searchParams.size) {
      query = query.eq("size", searchParams.size)
    }
    if (searchParams.minPrice) {
      query = query.gte("price", Number.parseFloat(searchParams.minPrice))
    }
    if (searchParams.maxPrice) {
      query = query.lte("price", Number.parseFloat(searchParams.maxPrice))
    }
    if (searchParams.search) {
      query = query.ilike("name", `%${searchParams.search}%`)
    }

    // Apply sorting
    switch (searchParams.sort) {
      case "price-asc":
        query = query.order("price", { ascending: true })
        break
      case "price-desc":
        query = query.order("price", { ascending: false })
        break
      case "newest":
        query = query.order("created_at", { ascending: false })
        break
      default:
        query = query.order("is_featured", { ascending: false }).order("created_at", { ascending: false })
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  } catch {
    return []
  }
}

// Fallback products for demo
const fallbackProducts: Partial<Product>[] = [
  {
    id: "1",
    name: "Natural Himalayan Salt Lamp - Medium",
    slug: "natural-himalayan-salt-lamp-medium",
    short_description: "Hand-carved authentic Khewra salt lamp with warm amber glow",
    price: 4500,
    compare_at_price: 5500,
    images: ["/himalayan-salt-lamp-glowing-amber.jpg"],
    shape: "Natural",
    size: "Medium",
    stock_quantity: 50,
    is_featured: true,
  },
  {
    id: "2",
    name: "Pyramid Salt Lamp",
    slug: "pyramid-salt-lamp",
    short_description: "Sacred geometry meets natural healing in this pyramid-shaped lamp",
    price: 5500,
    compare_at_price: 6500,
    images: ["/pyramid-shaped-pink-salt-lamp.jpg"],
    shape: "Pyramid",
    size: "Medium",
    stock_quantity: 30,
    is_featured: true,
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
    stock_quantity: 25,
    is_featured: true,
  },
  {
    id: "4",
    name: "USB Mini Salt Lamp",
    slug: "usb-mini-salt-lamp",
    short_description: "Compact USB-powered lamp perfect for desks and nightstands",
    price: 1500,
    compare_at_price: 2000,
    images: ["/usb-mini-himalayan-salt-lamp-desk.jpg"],
    shape: "Natural",
    size: "Mini",
    stock_quantity: 100,
    is_featured: false,
  },
  {
    id: "5",
    name: "Heart Shape Salt Lamp",
    slug: "heart-shape-salt-lamp",
    short_description: "Romantic heart-shaped lamp perfect for gifts",
    price: 4000,
    compare_at_price: 4800,
    images: ["/heart-shaped-pink-salt-lamp-romantic.jpg"],
    shape: "Heart",
    size: "Small",
    stock_quantity: 40,
    is_featured: true,
  },
  {
    id: "6",
    name: "Bowl Salt Lamp with Chunks",
    slug: "bowl-salt-lamp-chunks",
    short_description: "Wooden bowl with illuminated salt chunks for customizable display",
    price: 3500,
    compare_at_price: 4200,
    images: ["/bowl-himalayan-salt-lamp-chunks-wooden.jpg"],
    shape: "Bowl",
    size: "Medium",
    stock_quantity: 35,
    is_featured: false,
  },
  {
    id: "7",
    name: "Extra Large Natural Salt Lamp",
    slug: "extra-large-natural-salt-lamp",
    short_description: "Statement piece for large spaces with powerful ambient glow",
    price: 12000,
    compare_at_price: 14000,
    images: ["/extra-large-himalayan-salt-lamp.jpg"],
    shape: "Natural",
    size: "Extra Large",
    stock_quantity: 15,
    is_featured: true,
  },
  {
    id: "8",
    name: "Cylinder Salt Lamp",
    slug: "cylinder-salt-lamp",
    short_description: "Modern cylindrical design for contemporary spaces",
    price: 5000,
    compare_at_price: 5800,
    images: ["/cylinder-himalayan-salt-lamp-modern.jpg"],
    shape: "Cylinder",
    size: "Medium",
    stock_quantity: 28,
    is_featured: false,
  },
]

export async function ProductGrid({ searchParams }: ProductGridProps) {
  let products = await getProducts(searchParams)

  // Use fallback products if database is empty
  if (products.length === 0) {
    products = fallbackProducts as Product[]

    // Apply client-side filtering for demo
    if (searchParams.shape) {
      products = products.filter((p) => p.shape === searchParams.shape)
    }
    if (searchParams.size) {
      products = products.filter((p) => p.size === searchParams.size)
    }
    if (searchParams.minPrice) {
      products = products.filter((p) => p.price >= Number.parseFloat(searchParams.minPrice!))
    }
    if (searchParams.maxPrice) {
      products = products.filter((p) => p.price <= Number.parseFloat(searchParams.maxPrice!))
    }
    if (searchParams.sort === "price-asc") {
      products.sort((a, b) => a.price - b.price)
    } else if (searchParams.sort === "price-desc") {
      products.sort((a, b) => b.price - a.price)
    }
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
        <p className="text-muted-foreground text-sm mt-2">Try adjusting your filters.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <Link key={product.id} href={`/shop/${product.slug}`}>
          <Card className="group bg-card/50 border-border hover:border-primary/50 transition-all duration-300 overflow-hidden h-full">
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={product.images?.[0] || "/placeholder.svg?height=600&width=600"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Sale badge */}
              {product.compare_at_price && product.compare_at_price > product.price && (
                <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">Sale</Badge>
              )}
              {/* Out of stock badge */}
              {product.stock_quantity === 0 && (
                <Badge variant="secondary" className="absolute top-3 left-3">
                  Out of Stock
                </Badge>
              )}
              {/* Featured badge */}
              {product.is_featured && product.stock_quantity > 0 && (
                <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">Featured</Badge>
              )}
              {/* Quick wishlist button - wrapped in Link for server component */}
              <Link
                href={`/wishlist?add=${product.id}`}
                className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Button variant="secondary" size="icon">
                  <Heart className="h-4 w-4" />
                  <span className="sr-only">Add to wishlist</span>
                </Button>
              </Link>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                {product.shape && <span>{product.shape}</span>}
                {product.shape && product.size && <span>•</span>}
                {product.size && <span>{product.size}</span>}
              </div>
              <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3 min-h-[40px]">
                {product.short_description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{formatPrice(product.price)}</span>
                  {product.compare_at_price && product.compare_at_price > product.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(product.compare_at_price)}
                    </span>
                  )}
                </div>
                {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
                  <span className="text-xs text-accent">Only {product.stock_quantity} left</span>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
