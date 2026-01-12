"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { useState, useCallback } from "react"

const shapes = ["Natural", "Pyramid", "Sphere", "Heart", "Bowl", "Cylinder"]
const sizes = ["Mini", "Small", "Medium", "Large", "Extra Large"]

export function ProductFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || 15000,
  ])

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())

      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      }

      return params.toString()
    },
    [searchParams],
  )

  const handleFilterChange = (key: string, value: string | null) => {
    router.push(`${pathname}?${createQueryString({ [key]: value })}`)
  }

  const handlePriceChange = (values: number[]) => {
    setPriceRange([values[0], values[1]])
  }

  const applyPriceFilter = () => {
    router.push(
      `${pathname}?${createQueryString({
        minPrice: priceRange[0] > 0 ? priceRange[0].toString() : null,
        maxPrice: priceRange[1] < 15000 ? priceRange[1].toString() : null,
      })}`,
    )
  }

  const clearFilters = () => {
    setPriceRange([0, 15000])
    router.push(pathname)
  }

  const activeFiltersCount = [
    searchParams.get("shape"),
    searchParams.get("size"),
    searchParams.get("minPrice"),
    searchParams.get("maxPrice"),
  ].filter(Boolean).length

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="ml-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[320px] bg-background">
        <SheetHeader>
          <SheetTitle>Filter Products</SheetTitle>
          <SheetDescription>Narrow down your search by shape, size, and price</SheetDescription>
        </SheetHeader>

        <div className="mt-8 space-y-8">
          {/* Shape Filter */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Shape</Label>
            <RadioGroup
              value={searchParams.get("shape") || ""}
              onValueChange={(value) => handleFilterChange("shape", value || null)}
            >
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="" id="shape-all" />
                <Label htmlFor="shape-all" className="text-sm font-normal cursor-pointer">
                  All Shapes
                </Label>
              </div>
              {shapes.map((shape) => (
                <div key={shape} className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value={shape} id={`shape-${shape}`} />
                  <Label htmlFor={`shape-${shape}`} className="text-sm font-normal cursor-pointer">
                    {shape}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Size Filter */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Size</Label>
            <RadioGroup
              value={searchParams.get("size") || ""}
              onValueChange={(value) => handleFilterChange("size", value || null)}
            >
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="" id="size-all" />
                <Label htmlFor="size-all" className="text-sm font-normal cursor-pointer">
                  All Sizes
                </Label>
              </div>
              {sizes.map((size) => (
                <div key={size} className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value={size} id={`size-${size}`} />
                  <Label htmlFor={`size-${size}`} className="text-sm font-normal cursor-pointer">
                    {size}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Price Range Filter */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Price Range</Label>
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              min={0}
              max={15000}
              step={500}
              className="mb-4"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <span>Rs. {priceRange[0].toLocaleString()}</span>
              <span>Rs. {priceRange[1].toLocaleString()}</span>
            </div>
            <Button onClick={applyPriceFilter} variant="secondary" size="sm" className="w-full">
              Apply Price Filter
            </Button>
          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <Button onClick={clearFilters} variant="outline" className="w-full bg-transparent">
              Clear All Filters
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
