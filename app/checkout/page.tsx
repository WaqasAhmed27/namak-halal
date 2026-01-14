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
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="bg-card/30 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl p-8 md:p-12">
              <div className="text-center">
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-4">
                    <CheckCircle className="h-12 w-12 text-green-500" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Thank You for Your Order!</h1>
                  <p className="text-muted-foreground text-lg">
                    Your order has been placed successfully. We&apos;ll send you a confirmation email shortly.
                  </p>
                </div>

                <Card className="bg-card/50 border-border/50 backdrop-blur-sm mb-8">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-4 text-left">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                        <p className="font-semibold text-foreground text-lg">{orderNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Estimated Delivery</p>
                        <p className="font-semibold text-foreground text-lg">
                          {shippingMethod === "express" ? "1-2 days" : "3-5 days"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="rounded-full">
                    <Link href="/shop">Continue Shopping</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="bg-transparent rounded-full">
                    <Link href="/account/orders">View Order Status</Link>
                  </Button>
                </div>
              </div>
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
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Main Container with rounded corners */}
          <div className="bg-card/20 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl p-6 md:p-8 lg:p-10">
            {/* Back button */}
            <Button variant="ghost" asChild className="mb-6 hover:bg-primary/10 rounded-full">
              <Link href="/shop">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Shop
              </Link>
            </Button>

            <div className="grid lg:grid-cols-[1fr,420px] gap-8 lg:gap-12">
              {/* Left column - Checkout form */}
              <div>
                {/* Progress steps */}
                <div className="flex items-center gap-2 mb-10">
                  {steps.map((step, index) => (
                    <div key={step.key} className="flex items-center flex-1">
                      <button
                        onClick={() => {
                          const currentIndex = steps.findIndex((s) => s.key === currentStep)
                          if (index < currentIndex) setCurrentStep(step.key)
                        }}
                        className={`w-full px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 ${
                          step.key === currentStep
                            ? "bg-primary text-primary-foreground shadow-lg scale-105"
                            : steps.findIndex((s) => s.key === currentStep) > index
                            ? "bg-primary/20 text-primary cursor-pointer hover:bg-primary/30"
                            : "bg-secondary/50 text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </button>
                      {index < steps.length - 1 && (
                        <div className={`h-0.5 flex-1 mx-2 transition-colors ${
                          steps.findIndex((s) => s.key === currentStep) > index 
                            ? "bg-primary" 
                            : "bg-border"
                        }`} />
                      )}
                    </div>
                  ))}
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-sm">
                    {error}
                  </div>
                )}

                {/* Information Step */}
                {currentStep === "information" && (
                  <Card className="bg-card/40 backdrop-blur-sm border-border/50 rounded-2xl shadow-lg">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-foreground text-2xl">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium mb-2 block">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-background/80 border-border/50 rounded-xl h-11"
                        />
                      </div>

                      <Separator className="my-6 bg-border/50" />

                      <h3 className="font-semibold text-foreground text-lg">Shipping Address</h3>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName" className="text-sm font-medium mb-2 block">First Name</Label>
                          <Input
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="bg-background/80 border-border/50 rounded-xl h-11"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName" className="text-sm font-medium mb-2 block">Last Name</Label>
                          <Input
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="bg-background/80 border-border/50 rounded-xl h-11"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="address" className="text-sm font-medium mb-2 block">Address</Label>
                        <Input
                          id="address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="bg-background/80 border-border/50 rounded-xl h-11"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city" className="text-sm font-medium mb-2 block">City</Label>
                          <Input
                            id="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="bg-background/80 border-border/50 rounded-xl h-11"
                          />
                        </div>
                        <div>
                          <Label htmlFor="postalCode" className="text-sm font-medium mb-2 block">Postal Code</Label>
                          <Input
                            id="postalCode"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            className="bg-background/80 border-border/50 rounded-xl h-11"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium mb-2 block">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="bg-background/80 border-border/50 rounded-xl h-11"
                        />
                      </div>

                      <Button className="w-full mt-6 h-12 rounded-xl text-base font-medium shadow-lg hover:shadow-xl transition-all" onClick={handleContinue}>
                        Continue to Shipping
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Shipping Step */}
                {currentStep === "shipping" && (
                  <Card className="bg-card/40 backdrop-blur-sm border-border/50 rounded-2xl shadow-lg">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-foreground text-2xl">Shipping Method</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-4">
                        <div
                          className={`flex items-center justify-between p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            shippingMethod === "standard" 
                              ? "border-primary bg-primary/10 shadow-md" 
                              : "border-border/50 hover:border-primary/50 hover:bg-primary/5"
                          }`}
                          onClick={() => setShippingMethod("standard")}
                        >
                          <div className="flex items-center gap-4">
                            <RadioGroupItem value="standard" id="standard" className="border-2" />
                            <div>
                              <Label htmlFor="standard" className="cursor-pointer font-semibold text-base">
                                Standard Shipping
                              </Label>
                              <p className="text-sm text-muted-foreground mt-0.5">3-5 business days</p>
                            </div>
                          </div>
                          <span className="font-semibold text-base">
                            {subtotal >= 5000 ? (
                              <span className="text-green-500">Free</span>
                            ) : (
                              formatPrice(300)
                            )}
                          </span>
                        </div>

                        <div
                          className={`flex items-center justify-between p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            shippingMethod === "express" 
                              ? "border-primary bg-primary/10 shadow-md" 
                              : "border-border/50 hover:border-primary/50 hover:bg-primary/5"
                          }`}
                          onClick={() => setShippingMethod("express")}
                        >
                          <div className="flex items-center gap-4">
                            <RadioGroupItem value="express" id="express" className="border-2" />
                            <div>
                              <Label htmlFor="express" className="cursor-pointer font-semibold text-base">
                                Express Shipping
                              </Label>
                              <p className="text-sm text-muted-foreground mt-0.5">1-2 business days</p>
                            </div>
                          </div>
                          <span className="font-semibold text-base">{formatPrice(500)}</span>
                        </div>
                      </RadioGroup>

                      <div className="flex gap-4 mt-8">
                        <Button
                          variant="outline"
                          className="flex-1 h-12 rounded-xl bg-transparent border-border/50 hover:bg-primary/5"
                          onClick={() => setCurrentStep("information")}
                        >
                          Back
                        </Button>
                        <Button className="flex-1 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all" onClick={handleContinue}>
                          Continue to Payment
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Payment Step */}
                {currentStep === "payment" && (
                  <Card className="bg-card/40 backdrop-blur-sm border-border/50 rounded-2xl shadow-lg">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-foreground text-2xl">Payment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="p-5 rounded-xl border-2 border-primary/50 bg-primary/10">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-primary/20">
                            <CreditCard className="h-5 w-5 text-primary" />
                          </div>
                          <span className="font-semibold text-foreground text-lg">Cash on Delivery</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Pay when your order arrives. We accept cash and card payments at delivery.
                        </p>
                      </div>

                      <div className="p-5 rounded-xl bg-secondary/30 backdrop-blur-sm space-y-2">
                        <div className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-primary" />
                          <span className="text-sm font-medium text-foreground">Secure & Protected</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Your order is protected by our quality guarantee. Free returns within 7 days.
                        </p>
                      </div>

                      <div className="flex gap-4 mt-8">
                        <Button
                          variant="outline"
                          className="flex-1 h-12 rounded-xl bg-transparent border-border/50 hover:bg-primary/5"
                          onClick={() => setCurrentStep("shipping")}
                        >
                          Back
                        </Button>
                        <Button 
                          className="flex-1 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all font-medium" 
                          onClick={handlePlaceOrder} 
                          disabled={isProcessing}
                        >
                          {isProcessing ? "Processing..." : "Place Order"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Right column - Order summary */}
              <div className="lg:sticky lg:top-24 h-fit">
                <Card className="bg-card/40 backdrop-blur-sm border-border/50 rounded-2xl shadow-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-foreground text-2xl">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {/* Cart items */}
                    <div className="space-y-4 max-h-[340px] overflow-y-auto pr-2 custom-scrollbar">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-4 p-3 rounded-xl bg-secondary/20 hover:bg-secondary/30 transition-colors">
                          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                            <Image
                              src={item.product?.images?.[0] || "/placeholder.svg"}
                              alt={item.product?.name || ""}
                              fill
                              className="object-cover"
                            />
                            <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium shadow-lg">
                              {item.quantity}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground line-clamp-2 mb-1">
                              {item.product?.name}
                            </p>
                            <p className="text-xs text-muted-foreground">{item.product?.size}</p>
                          </div>
                          <p className="text-sm font-semibold text-foreground whitespace-nowrap">
                            {formatPrice((item.product?.price || 0) * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <Separator className="bg-border/50" />

                    {/* Promo code */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        disabled={promoApplied}
                        className="bg-background/80 border-border/50 rounded-xl h-11"
                      />
                      <Button
                        variant="outline"
                        onClick={handleApplyPromo}
                        disabled={promoApplied}
                        className="bg-transparent border-border/50 hover:bg-primary/5 rounded-xl px-6"
                      >
                        {promoApplied ? "Applied" : "Apply"}
                      </Button>
                    </div>
                    {promoApplied && (
                      <p className="text-sm text-green-500 font-medium">✓ 10% discount applied!</p>
                    )}

                    <Separator className="bg-border/50" />

                    {/* Totals */}
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="text-foreground font-medium">{formatPrice(subtotal)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-green-500 font-medium">
                          <span>Discount</span>
                          <span>-{formatPrice(discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="text-foreground font-medium">
                          {shippingCost === 0 ? (
                            <span className="text-green-500">Free</span>
                          ) : (
                            formatPrice(shippingCost)
                          )}
                        </span>
                      </div>
                    </div>

                    <Separator className="bg-border/50" />

                    <div className="flex justify-between text-xl font-bold p-4 rounded-xl bg-primary/10">
                      <span className="text-foreground">Total</span>
                      <span className="text-foreground">{formatPrice(total)}</span>
                    </div>

                    {/* Trust badges */}
                    <div className="flex items-center justify-center gap-6 pt-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        <span>Fast Delivery</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <span>Secure Checkout</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}