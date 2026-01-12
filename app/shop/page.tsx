import { Suspense } from "react"
import { Starfield } from "@/components/ui/starfield"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProductGrid } from "@/components/shop/product-grid"
import { ProductFilters } from "@/components/shop/product-filters"
import { ProductSort } from "@/components/shop/product-sort"
import { Skeleton } from "@/components/ui/skeleton"

interface ShopPageProps {
  searchParams: Promise<{
    shape?: string
    size?: string
    minPrice?: string
    maxPrice?: string
    sort?: string
    search?: string
  }>
}

export const metadata = {
  title: "Shop | Namak Halal - Himalayan Salt Lamps",
  description: "Browse our collection of authentic hand-carved Himalayan salt lamps from Khewra.",
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="aspect-square rounded-lg" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      ))}
    </div>
  )
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams

  return (
    <>
      <Starfield />
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Our Collection</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our range of authentic Himalayan salt lamps, each hand-carved from ancient Khewra salt deposits
            </p>
          </div>

          {/* Filters and Sort Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <ProductFilters />
            <div className="flex-1" />
            <ProductSort />
          </div>

          {/* Product Grid */}
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid searchParams={params} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}
