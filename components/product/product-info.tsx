"use client"

import { useState } from "react"
import { Heart, ShoppingBag, Minus, Plus, Check, Truck, Shield, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/providers/cart-provider"
import type { Product } from "@/lib/types"

interface ProductInfoProps {
  product: Product
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addItem } = useCart()

  const isInStock = product.stock_quantity > 0
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5
  const discount =
    product.compare_at_price && product.compare_at_price > product.price
      ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
      : 0

  const handleAddToCart = () => {
    addItem(product, quantity)
    setQuantity(1)
  }

  return (
    <div className="flex flex-col">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground mb-4">
        <span className="hover:text-foreground cursor-pointer">Shop</span>
        <span className="mx-2">/</span>
        <span className="hover:text-foreground cursor-pointer">{product.shape}</span>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      {/* Product Name & Badges */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2 mb-2">
          {discount > 0 && <Badge className="bg-accent text-accent-foreground">Save {discount}%</Badge>}
          {product.is_featured && <Badge className="bg-primary text-primary-foreground">Featured</Badge>}
          {!isInStock && <Badge variant="secondary">Out of Stock</Badge>}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">{product.name}</h1>
      </div>

      {/* Price */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl font-bold text-foreground">{formatPrice(product.price)}</span>
        {product.compare_at_price && product.compare_at_price > product.price && (
          <span className="text-xl text-muted-foreground line-through">{formatPrice(product.compare_at_price)}</span>
        )}
      </div>

      {/* Short Description */}
      <p className="text-muted-foreground mb-6">{product.short_description}</p>

      {/* Product Attributes */}
      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        {product.shape && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Shape:</span>
            <span className="text-foreground font-medium">{product.shape}</span>
          </div>
        )}
        {product.size && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Size:</span>
            <span className="text-foreground font-medium">{product.size}</span>
          </div>
        )}
        {product.weight_kg && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Weight:</span>
            <span className="text-foreground font-medium">{product.weight_kg} kg</span>
          </div>
        )}
        {product.bulb_type && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Bulb:</span>
            <span className="text-foreground font-medium">{product.bulb_type}</span>
          </div>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2 mb-6">
        {isInStock ? (
          <>
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-500">In Stock</span>
            {isLowStock && <span className="text-sm text-accent">- Only {product.stock_quantity} left!</span>}
          </>
        ) : (
          <span className="text-sm text-muted-foreground">Currently unavailable</span>
        )}
      </div>

      {/* Quantity Selector */}
      {isInStock && (
        <div className="flex items-center gap-4 mb-6">
          <span className="text-sm text-muted-foreground">Quantity:</span>
          <div className="flex items-center border border-border rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-r-none"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-l-none"
              onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
              disabled={quantity >= product.stock_quantity}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 mb-8">
        <Button className="flex-1 h-12 text-base" onClick={handleAddToCart} disabled={!isInStock}>
          <ShoppingBag className="mr-2 h-5 w-5" />
          {isInStock ? "Add to Cart" : "Out of Stock"}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className={`h-12 w-12 bg-transparent ${isWishlisted ? "text-accent border-accent" : ""}`}
          onClick={() => setIsWishlisted(!isWishlisted)}
        >
          <Heart className={`h-5 w-5 ${isWishlisted ? "fill-accent" : ""}`} />
        </Button>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-secondary/30 rounded-xl">
        <div className="flex items-center gap-3">
          <Truck className="h-5 w-5 text-primary" />
          <div className="text-sm">
            <p className="font-medium text-foreground">Free Shipping</p>
            <p className="text-muted-foreground">On orders over Rs. 5,000</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-primary" />
          <div className="text-sm">
            <p className="font-medium text-foreground">Authentic Quality</p>
            <p className="text-muted-foreground">100% Khewra Salt</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <RotateCcw className="h-5 w-5 text-primary" />
          <div className="text-sm">
            <p className="font-medium text-foreground">Easy Returns</p>
            <p className="text-muted-foreground">7-day return policy</p>
          </div>
        </div>
      </div>
    </div>
  )
}
