"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { Starfield } from "@/components/ui/starfield"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/components/providers/cart-provider"

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart()

  const shippingThreshold = 5000
  const freeShipping = subtotal >= shippingThreshold

  if (items.length === 0) {
    return (
      <>
        <Starfield />
        <Header />
        <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <ShoppingBag className="h-20 w-20 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Looks like you haven&apos;t added any lamps yet</p>
            <Button asChild>
              <Link href="/shop">Start Shopping</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Starfield />
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/shop">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>

          <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

          <div className="grid lg:grid-cols-[1fr,400px] gap-8">
            {/* Cart items */}
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="bg-card/50 border-border">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Product image */}
                      <Link href={`/shop/${item.product?.slug}`} className="flex-shrink-0">
                        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-secondary">
                          <Image
                            src={item.product?.images?.[0] || "/placeholder.svg"}
                            alt={item.product?.name || ""}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </Link>

                      {/* Product details */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/shop/${item.product?.slug}`}>
                          <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                            {item.product?.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.product?.shape} • {item.product?.size}
                        </p>
                        <p className="font-bold text-foreground">{formatPrice(item.product?.price || 0)}</p>

                        {/* Quantity and remove - mobile */}
                        <div className="flex items-center justify-between mt-4 md:hidden">
                          <div className="flex items-center border border-border rounded-lg">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-10 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Quantity and remove - desktop */}
                      <div className="hidden md:flex items-center gap-6">
                        <div className="flex items-center border border-border rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <p className="w-24 text-right font-bold text-foreground">
                          {formatPrice((item.product?.price || 0) * item.quantity)}
                        </p>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order summary */}
            <div className="lg:sticky lg:top-24 h-fit">
              <Card className="bg-card/50 border-border">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold text-foreground">Order Summary</h2>

                  {/* Free shipping progress */}
                  {!freeShipping && (
                    <div className="p-3 bg-secondary/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Add{" "}
                        <span className="text-foreground font-semibold">
                          {formatPrice(shippingThreshold - subtotal)}
                        </span>{" "}
                        more for free shipping!
                      </p>
                      <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${Math.min((subtotal / shippingThreshold) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-foreground">{freeShipping ? "Free" : "Calculated at checkout"}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">{formatPrice(subtotal)}</span>
                  </div>

                  <Button asChild className="w-full">
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
