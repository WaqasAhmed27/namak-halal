import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import type { Product } from "@/lib/types"

interface RelatedProductsProps {
  currentProductId: string
  shape: string | null
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

async function getRelatedProducts(currentId: string, shape: string | null): Promise<Product[]> {
  try {
    const supabase = await createClient()

    let query = supabase.from("products").select("*").eq("is_active", true).neq("id", currentId).limit(4)

    // Prefer same shape, but not required
    if (shape) {
      query = query.eq("shape", shape)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  } catch {
    // Return fallback products
    return []
  }
}

// Fallback related products
const fallbackProducts: Partial<Product>[] = [
  {
    id: "fp1",
    name: "Pyramid Salt Lamp",
    slug: "pyramid-salt-lamp",
    price: 5500,
    compare_at_price: 6500,
    images: ["/pyramid-shaped-pink-salt-lamp.jpg"],
    shape: "Pyramid",
    size: "Medium",
  },
  {
    id: "fp2",
    name: "Sphere Salt Lamp",
    slug: "sphere-salt-lamp",
    price: 6500,
    compare_at_price: 7500,
    images: ["/sphere-round-pink-himalayan-salt-lamp.jpg"],
    shape: "Sphere",
    size: "Medium",
  },
  {
    id: "fp3",
    name: "Heart Shape Salt Lamp",
    slug: "heart-shape-salt-lamp",
    price: 4000,
    images: ["/heart-shaped-pink-salt-lamp-romantic.jpg"],
    shape: "Heart",
    size: "Small",
  },
  {
    id: "fp4",
    name: "USB Mini Salt Lamp",
    slug: "usb-mini-salt-lamp",
    price: 1500,
    images: ["/usb-mini-himalayan-salt-lamp-desk.jpg"],
    shape: "Natural",
    size: "Mini",
  },
]

export async function RelatedProducts({ currentProductId, shape }: RelatedProductsProps) {
  let products = await getRelatedProducts(currentProductId, shape)

  if (products.length === 0) {
    products = fallbackProducts.filter((p) => p.id !== currentProductId) as Product[]
  }

  if (products.length === 0) return null

  return (
    <section>
      <h2 className="text-2xl font-bold text-foreground mb-6">You May Also Like</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {products.slice(0, 4).map((product) => (
          <Link key={product.id} href={`/shop/${product.slug}`}>
            <Card className="group bg-card/50 border-border hover:border-primary/50 transition-all duration-300 overflow-hidden h-full">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.images?.[0] || "/placeholder.svg?height=400&width=400"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <CardContent className="p-3 md:p-4">
                <div className="text-xs text-muted-foreground mb-1">
                  {product.shape} • {product.size}
                </div>
                <h3 className="font-medium text-foreground text-sm md:text-base line-clamp-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-bold text-foreground">{formatPrice(product.price)}</span>
                  {product.compare_at_price && product.compare_at_price > product.price && (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatPrice(product.compare_at_price)}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
