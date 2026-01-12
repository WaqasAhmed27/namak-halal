"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Product } from "@/lib/types"

interface ProductTabsProps {
  product: Product
}

export function ProductTabs({ product }: ProductTabsProps) {
  return (
    <Tabs defaultValue="description" className="mb-16">
      <TabsList className="w-full justify-start bg-secondary/30 p-1 h-auto flex-wrap">
        <TabsTrigger value="description" className="px-6 py-2">
          Description
        </TabsTrigger>
        <TabsTrigger value="usage" className="px-6 py-2">
          Usage Instructions
        </TabsTrigger>
        <TabsTrigger value="safety" className="px-6 py-2">
          Safety Notes
        </TabsTrigger>
        <TabsTrigger value="shipping" className="px-6 py-2">
          Shipping Info
        </TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="mt-6">
        <div className="prose prose-invert max-w-none">
          <p className="text-foreground leading-relaxed">{product.description}</p>
          <h4 className="text-lg font-semibold text-foreground mt-6 mb-3">Product Specifications</h4>
          <ul className="space-y-2 text-muted-foreground">
            {product.shape && (
              <li>
                <strong className="text-foreground">Shape:</strong> {product.shape}
              </li>
            )}
            {product.size && (
              <li>
                <strong className="text-foreground">Size:</strong> {product.size}
              </li>
            )}
            {product.weight_kg && (
              <li>
                <strong className="text-foreground">Approximate Weight:</strong> {product.weight_kg} kg (each lamp is
                unique)
              </li>
            )}
            {product.bulb_type && (
              <li>
                <strong className="text-foreground">Bulb Type:</strong> {product.bulb_type} (included)
              </li>
            )}
            <li>
              <strong className="text-foreground">Origin:</strong> Khewra Salt Mine, Pakistan
            </li>
            <li>
              <strong className="text-foreground">Material:</strong> 100% Natural Himalayan Pink Salt
            </li>
          </ul>
        </div>
      </TabsContent>

      <TabsContent value="usage" className="mt-6">
        <div className="prose prose-invert max-w-none">
          <p className="text-foreground leading-relaxed">{product.usage_instructions}</p>
          <h4 className="text-lg font-semibold text-foreground mt-6 mb-3">General Care Tips</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>Keep the lamp away from humid areas and water sources</li>
            <li>Clean with a dry or slightly damp cloth when turned off and cool</li>
            <li>Leave the lamp on for several hours daily for best results</li>
            <li>The warmth from the bulb helps prevent moisture absorption</li>
            <li>If the lamp becomes wet, dry it naturally in sunlight or with a hair dryer on low heat</li>
          </ul>
        </div>
      </TabsContent>

      <TabsContent value="safety" className="mt-6">
        <div className="prose prose-invert max-w-none">
          <p className="text-foreground leading-relaxed">{product.safety_notes}</p>
          <h4 className="text-lg font-semibold text-foreground mt-6 mb-3">Important Safety Guidelines</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>Use only the recommended bulb wattage to prevent overheating</li>
            <li>Place on a stable, flat surface away from edges</li>
            <li>Keep away from pets and young children who might knock it over</li>
            <li>Unplug before replacing the bulb or moving the lamp</li>
            <li>Do not leave unattended near flammable materials</li>
            <li>Check electrical cord regularly for any damage</li>
          </ul>
        </div>
      </TabsContent>

      <TabsContent value="shipping" className="mt-6">
        <div className="prose prose-invert max-w-none">
          <h4 className="text-lg font-semibold text-foreground mb-3">Shipping Information</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <strong className="text-foreground">Processing Time:</strong> 1-2 business days
            </li>
            <li>
              <strong className="text-foreground">Standard Delivery:</strong> 3-5 business days
            </li>
            <li>
              <strong className="text-foreground">Express Delivery:</strong> 1-2 business days
            </li>
            <li>
              <strong className="text-foreground">Free Shipping:</strong> On orders over Rs. 5,000
            </li>
          </ul>
          <h4 className="text-lg font-semibold text-foreground mt-6 mb-3">Packaging</h4>
          <p className="text-muted-foreground">
            Each salt lamp is carefully wrapped in protective packaging to ensure it arrives safely. The lamp includes a
            fitted bulb and power cord, ready to use out of the box.
          </p>
          <h4 className="text-lg font-semibold text-foreground mt-6 mb-3">Returns</h4>
          <p className="text-muted-foreground">
            We offer a 7-day return policy. If your lamp arrives damaged or you&apos;re not satisfied, contact us for a
            full refund or replacement. The lamp must be returned in its original packaging.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  )
}
