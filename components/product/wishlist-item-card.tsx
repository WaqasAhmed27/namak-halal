"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingBag, Trash2, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { removeFromWishlist } from "@/lib/actions/wishlist"
import { useCart } from "@/components/providers/cart-provider"
import { toast } from "sonner"
import type { WishlistItem, Product } from "@/lib/types"

interface WishlistItemCardProps {
    item: WishlistItem & { product: Product }
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price)
}

export function WishlistItemCard({ item }: WishlistItemCardProps) {
    const { addItem } = useCart()
    const [isRemoving, setIsRemoving] = useState(false)
    const [isAddingToCart, setIsAddingToCart] = useState(false)

    const handleRemove = async () => {
        setIsRemoving(true)
        try {
            await removeFromWishlist(item.product_id)
            toast.success("Removed from wishlist")
        } catch (error) {
            console.error("Failed to remove from wishlist:", error)
            toast.error("Failed to remove from wishlist")
        } finally {
            setIsRemoving(false)
        }
    }

    const handleAddToCart = async () => {
        if (!item.product) return
        setIsAddingToCart(true)
        try {
            addItem(item.product, 1)
            toast.success("Added to cart")
        } finally {
            setIsAddingToCart(false)
        }
    }

    if (!item.product) {
        return null
    }

    const product = item.product
    const discountPercentage =
        product.compare_at_price && product.compare_at_price > product.price
            ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
            : 0

    return (
        <Card className="group bg-card/50 border-border hover:border-primary/50 transition-all duration-300 overflow-hidden">
            <CardContent className="p-0">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                    <Link href={`/shop/${product.slug}`}>
                        <Image
                            src={product.images?.[0] || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </Link>

                    {/* Discount Badge */}
                    {discountPercentage > 0 && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            -{discountPercentage}%
                        </div>
                    )}

                    {/* Remove Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-3 right-3 bg-background/50 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground"
                        onClick={handleRemove}
                        disabled={isRemoving}
                    >
                        {isRemoving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Trash2 className="h-4 w-4" />
                        )}
                    </Button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                    <Link href={`/shop/${product.slug}`}>
                        <h3 className="font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors">
                            {product.name}
                        </h3>
                    </Link>

                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
                        {product.compare_at_price && product.compare_at_price > product.price && (
                            <span className="text-sm text-muted-foreground line-through">
                                {formatPrice(product.compare_at_price)}
                            </span>
                        )}
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                        className="w-full gap-2"
                        onClick={handleAddToCart}
                        disabled={isAddingToCart || product.stock_quantity === 0}
                    >
                        {isAddingToCart ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <ShoppingBag className="h-4 w-4" />
                        )}
                        {product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
