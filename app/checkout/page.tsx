"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, CreditCard, Truck, Shield, CheckCircle } from "lucide-react"
import { Starfield } from "@/components/ui/starfield"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/components/providers/cart-provider"
import { createOrder } from "@/lib/actions/orders"
import { toast } from "sonner"

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

type CheckoutStep = "information" | "shipping" | "payment" | "confirmation"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("information")
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [error, setError] = useState("")

  // Form states
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [phone, setPhone] = useState("")
  const [shippingMethod, setShippingMethod] = useState("standard")
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)

  const shippingCost = shippingMethod === "express" ? 500 : subtotal >= 5000 ? 0 : 300
  const discount = promoApplied ? subtotal * 0.1 : 0
  const total = subtotal + shippingCost - discount

  const steps: { key: CheckoutStep; label: string }[] = [
    { key: "information", label: "Information" },
    { key: "shipping", label: "Shipping" },
    { key: "payment", label: "Payment" },
  ]

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === "namak10") {
      setPromoApplied(true)
    }
  }

  const handleContinue = () => {
    if (currentStep === "information") {
      // Basic validation
      if (!email || !firstName || !lastName || !address || !city || !postalCode) {
        setError("Please fill in all required fields")
        return
      }
      setError("")
      setCurrentStep("shipping")
    } else if (currentStep === "shipping") {
      setCurrentStep("payment")
    }
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true)
    setError("")

    try {
      const orderItems = items.map((item) => ({
        product_id: item.product_id,
        product_name: item.product?.name || "Unknown Product",
        product_price: item.product?.price || 0,
        quantity: item.quantity,
      }))

      const result = await createOrder({
        email,
        shippingAddress: {
          full_name: `${firstName} ${lastName}`,
          street_address: address,
          city,
          postal_code: postalCode,
          country: "Pakistan",
          phone: phone || undefined,
        },
        items: orderItems,
        subtotal,
        shippingCost,
        discountAmount: discount,
        shippingMethod,
      })

      setOrderNumber(result.orderNumber)
      setCurrentStep("confirmation")
      clearCart()
      toast.success("Order placed successfully!")
    } catch (err: any) {
      console.error("Order creation failed:", err)
      setError(err.message || "Failed to place order. Please try again.")
      toast.error("Failed to place order")
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0 && currentStep !== "confirmation") {
    return (
      <>
        <Starfield />
        <Header />
        <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Add some products to proceed with checkout</p>
            <Button asChild>
              <Link href="/shop">Browse Products</Link>
            </Button>
          </div>
        </main>
      </>
    )
  }

  if (currentStep === "confirmation") {
    return (
      <>
        <Starfield />
        <Header />
        <main className="min-h-screen pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <div className="mb-8">
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-foreground mb-2">Thank You for Your Order!</h1>
              <p className="text-muted-foreground">
                Your order has been placed successfully. We&apos;ll send you a confirmation email shortly.
              </p>
            </div>

            <Card className="bg-card/50 border-border mb-8">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-sm text-muted-foreground">Order Number</p>
                    <p className="font-semibold text-foreground">{orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                    <p className="font-semibold text-foreground">
                      {shippingMethod === "express" ? "1-2 days" : "3-5 days"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/shop">Continue Shopping</Link>
              </Button>
              <Button asChild variant="outline" className="bg-transparent">
                <Link href="/account/orders">View Order Status</Link>
              </Button>
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Starfield />
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back button */}
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/shop">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Link>
          </Button>

          <div className="grid lg:grid-cols-[1fr,400px] gap-8">
            {/* Left column - Checkout form */}
            <div>
              {/* Progress steps */}
              <div className="flex items-center gap-2 mb-8">
                {steps.map((step, index) => (
                  <div key={step.key} className="flex items-center">
                    <button
                      onClick={() => {
                        const currentIndex = steps.findIndex((s) => s.key === currentStep)
                        if (index < currentIndex) setCurrentStep(step.key)
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${step.key === currentStep
                          ? "bg-primary text-primary-foreground"
                          : steps.findIndex((s) => s.key === currentStep) > index
                            ? "bg-primary/20 text-primary cursor-pointer"
                            : "bg-secondary text-muted-foreground"
                        }`}
                    >
                      {step.label}
                    </button>
                    {index < steps.length - 1 && <div className="w-8 h-px bg-border mx-2" />}
                  </div>
                ))}
              </div>

              {/* Information Step */}
              {currentStep === "information" && (
                <Card className="bg-card/50 border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-background"
                      />
                    </div>

                    <Separator className="my-6" />

                    <h3 className="font-semibold text-foreground">Shipping Address</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="bg-background"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="bg-background"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="bg-background"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="bg-background"
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          className="bg-background"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="bg-background"
                      />
                    </div>

                    <Button className="w-full mt-4" onClick={handleContinue}>
                      Continue to Shipping
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Shipping Step */}
              {currentStep === "shipping" && (
                <Card className="bg-card/50 border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Shipping Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-4">
                      <div
                        className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${shippingMethod === "standard" ? "border-primary bg-primary/5" : "border-border"
                          }`}
                        onClick={() => setShippingMethod("standard")}
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="standard" id="standard" />
                          <div>
                            <Label htmlFor="standard" className="cursor-pointer font-medium">
                              Standard Shipping
                            </Label>
                            <p className="text-sm text-muted-foreground">3-5 business days</p>
                          </div>
                        </div>
                        <span className="font-medium">
                          {subtotal >= 5000 ? <span className="text-green-500">Free</span> : formatPrice(300)}
                        </span>
                      </div>

                      <div
                        className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${shippingMethod === "express" ? "border-primary bg-primary/5" : "border-border"
                          }`}
                        onClick={() => setShippingMethod("express")}
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="express" id="express" />
                          <div>
                            <Label htmlFor="express" className="cursor-pointer font-medium">
                              Express Shipping
                            </Label>
                            <p className="text-sm text-muted-foreground">1-2 business days</p>
                          </div>
                        </div>
                        <span className="font-medium">{formatPrice(500)}</span>
                      </div>
                    </RadioGroup>

                    <div className="flex gap-4 mt-6">
                      <Button
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => setCurrentStep("information")}
                      >
                        Back
                      </Button>
                      <Button className="flex-1" onClick={handleContinue}>
                        Continue to Payment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment Step */}
              {currentStep === "payment" && (
                <Card className="bg-card/50 border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Payment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 rounded-lg border border-primary bg-primary/5">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <span className="font-medium text-foreground">Cash on Delivery</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Pay when your order arrives. We accept cash and card payments at delivery.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-secondary/30 space-y-2">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span className="text-sm text-foreground">Secure & Protected</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Your order is protected by our quality guarantee. Free returns within 7 days.
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => setCurrentStep("shipping")}
                      >
                        Back
                      </Button>
                      <Button className="flex-1" onClick={handlePlaceOrder} disabled={isProcessing}>
                        {isProcessing ? "Processing..." : "Place Order"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right column - Order summary */}
            <div className="lg:sticky lg:top-24 h-fit">
              <Card className="bg-card/50 border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart items */}
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                          <Image
                            src={item.product?.images?.[0] || "/placeholder.svg"}
                            alt={item.product?.name || ""}
                            fill
                            className="object-cover"
                          />
                          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground line-clamp-1">{item.product?.name}</p>
                          <p className="text-xs text-muted-foreground">{item.product?.size}</p>
                        </div>
                        <p className="text-sm font-medium text-foreground">
                          {formatPrice((item.product?.price || 0) * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Promo code */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={promoApplied}
                      className="bg-background"
                    />
                    <Button
                      variant="outline"
                      onClick={handleApplyPromo}
                      disabled={promoApplied}
                      className="bg-transparent"
                    >
                      {promoApplied ? "Applied" : "Apply"}
                    </Button>
                  </div>
                  {promoApplied && <p className="text-sm text-green-500">10% discount applied!</p>}

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">{formatPrice(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-500">
                        <span>Discount</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-foreground">
                        {shippingCost === 0 ? <span className="text-green-500">Free</span> : formatPrice(shippingCost)}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">{formatPrice(total)}</span>
                  </div>

                  {/* Trust badges */}
                  <div className="flex items-center justify-center gap-4 pt-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Truck className="h-4 w-4" />
                      <span>Fast Delivery</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="h-4 w-4" />
                      <span>Secure Checkout</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
