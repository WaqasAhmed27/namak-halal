import { notFound } from "next/navigation"
import { Starfield } from "@/components/ui/starfield"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProductGallery } from "@/components/product/product-gallery"
import { ProductInfo } from "@/components/product/product-info"
import { ProductTabs } from "@/components/product/product-tabs"
import { RelatedProducts } from "@/components/product/related-products"
import { createClient } from "@/lib/supabase/server"
import type { Product } from "@/lib/types"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

// Demo products for fallback
const demoProducts: Record<string, Product> = {
  "natural-himalayan-salt-lamp-medium": {
    id: "1",
    name: "Natural Himalayan Salt Lamp - Medium",
    slug: "natural-himalayan-salt-lamp-medium",
    description:
      "Hand-carved from authentic Khewra salt mine crystals, this medium-sized lamp creates a warm, amber glow that transforms any space. Each lamp is unique, featuring natural variations in color and texture that reflect millions of years of geological formation. Perfect for bedrooms, living rooms, or meditation spaces.",
    short_description: "Hand-carved authentic Khewra salt lamp with warm amber glow",
    price: 4500,
    compare_at_price: 5500,
    category: "salt-lamp",
    shape: "Natural",
    size: "Medium",
    weight_kg: 2.5,
    bulb_type: "E14 15W",
    stock_quantity: 50,
    is_featured: true,
    is_active: true,
    images: [
      "/himalayan-salt-lamp-glowing-amber.jpg",
      "/himalayan-salt-lamp-side-view.jpg",
      "/himalayan-salt-lamp-detail-texture.jpg",
    ],
    image_360_url: null,
    usage_instructions:
      "Place on a stable surface away from moisture. Use the included E14 15W bulb or lower wattage for a softer glow. Leave on for 4-6 hours daily to enjoy full benefits.",
    safety_notes:
      "Keep away from water and high humidity. Use only approved bulb wattages. Ensure proper ventilation around the lamp. Not recommended for bathrooms.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  "pyramid-salt-lamp": {
    id: "2",
    name: "Pyramid Salt Lamp",
    slug: "pyramid-salt-lamp",
    description:
      "Geometrically carved into a perfect pyramid shape, this unique lamp combines ancient sacred geometry with the natural healing properties of Himalayan pink salt. The pyramid shape is believed to amplify energy and create a focal point of positive vibrations in your space.",
    short_description: "Sacred geometry meets natural healing in this pyramid-shaped lamp",
    price: 5500,
    compare_at_price: 6500,
    category: "salt-lamp",
    shape: "Pyramid",
    size: "Medium",
    weight_kg: 3.0,
    bulb_type: "E14 15W",
    stock_quantity: 30,
    is_featured: true,
    is_active: true,
    images: [
      "/pyramid-shaped-pink-salt-lamp.jpg",
      "/pyramid-salt-lamp-angle-view.jpg",
      "/pyramid-salt-lamp-illuminated.jpg",
    ],
    image_360_url: null,
    usage_instructions:
      "Display on a flat surface in a dry area. The pyramid shape directs light upward, making it ideal for corner placements or as a centerpiece.",
    safety_notes:
      "Handle with care - geometric shapes have precise edges. Keep away from moisture and direct sunlight.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  "sphere-salt-lamp": {
    id: "3",
    name: "Sphere Salt Lamp",
    slug: "sphere-salt-lamp",
    description:
      "Perfectly rounded and polished, this sphere salt lamp offers a 360-degree glow that radiates warmth evenly throughout your space. The smooth surface showcases the beautiful pink and orange hues of authentic Himalayan salt, creating a stunning visual centerpiece.",
    short_description: "Perfectly polished sphere with 360-degree warm glow",
    price: 6500,
    compare_at_price: 7500,
    category: "salt-lamp",
    shape: "Sphere",
    size: "Medium",
    weight_kg: 3.5,
    bulb_type: "E14 15W",
    stock_quantity: 25,
    is_featured: true,
    is_active: true,
    images: [
      "/sphere-round-pink-himalayan-salt-lamp.jpg",
      "/sphere-salt-lamp-wooden-base.jpg",
      "/sphere-salt-lamp-close-up.jpg",
    ],
    image_360_url: null,
    usage_instructions:
      "The sphere sits on an included wooden base. Rotate occasionally for even light distribution. Ideal for living rooms and common areas.",
    safety_notes: "Handle carefully due to weight. Ensure the wooden base is stable before placing the sphere.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  "usb-mini-salt-lamp": {
    id: "4",
    name: "USB Mini Salt Lamp",
    slug: "usb-mini-salt-lamp",
    description:
      "Perfect for your desk or bedside table, this compact USB-powered salt lamp brings the benefits of Himalayan salt to your workspace. No electrical outlet needed - simply plug into any USB port for a gentle, soothing glow during work or rest.",
    short_description: "Compact USB-powered lamp perfect for desks and nightstands",
    price: 1500,
    compare_at_price: 2000,
    category: "salt-lamp",
    shape: "Natural",
    size: "Mini",
    weight_kg: 0.5,
    bulb_type: "USB LED",
    stock_quantity: 100,
    is_featured: false,
    is_active: true,
    images: ["/usb-mini-himalayan-salt-lamp-desk.jpg"],
    image_360_url: null,
    usage_instructions:
      "Connect to any USB port (computer, power bank, or adapter). LED bulb included - no heat generation. Perfect for continuous use.",
    safety_notes:
      "Do not expose to water. USB cable should not be bent or damaged. Keep away from liquids on your desk.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  "heart-shape-salt-lamp": {
    id: "5",
    name: "Heart Shape Salt Lamp",
    slug: "heart-shape-salt-lamp",
    description:
      "Express love and warmth with this beautifully carved heart-shaped salt lamp. Perfect as a romantic gift or to add a touch of affection to any room. The heart shape symbolizes love while the warm glow creates an intimate atmosphere.",
    short_description: "Romantic heart-shaped lamp perfect for gifts",
    price: 4000,
    compare_at_price: 4800,
    category: "salt-lamp",
    shape: "Heart",
    size: "Small",
    weight_kg: 1.8,
    bulb_type: "E14 15W",
    stock_quantity: 40,
    is_featured: true,
    is_active: true,
    images: ["/heart-shaped-pink-salt-lamp-romantic.jpg"],
    image_360_url: null,
    usage_instructions:
      "Display in bedrooms or living spaces. Makes an excellent gift for loved ones. Use lower wattage bulbs for a subtle, romantic glow.",
    safety_notes: "Delicate carved edges - handle with care. Not suitable for high-humidity areas.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  "bowl-salt-lamp-chunks": {
    id: "6",
    name: "Bowl Salt Lamp with Chunks",
    slug: "bowl-salt-lamp-chunks",
    description:
      "A wooden bowl filled with natural Himalayan salt chunks, illuminated from within for a stunning crystalline display. Arrange the chunks as you like for a personalized look. The multiple surfaces catch and reflect light beautifully.",
    short_description: "Wooden bowl with illuminated salt chunks for customizable display",
    price: 3500,
    compare_at_price: 4200,
    category: "salt-lamp",
    shape: "Bowl",
    size: "Medium",
    weight_kg: 2.0,
    bulb_type: "E14 15W",
    stock_quantity: 35,
    is_featured: false,
    is_active: true,
    images: ["/bowl-himalayan-salt-lamp-chunks-wooden.jpg"],
    image_360_url: null,
    usage_instructions:
      "Arrange chunks for different light effects. Remove chunks occasionally to clean dust. The wooden bowl adds a natural, rustic touch.",
    safety_notes: "Ensure the bulb does not directly touch the salt chunks. Keep the wooden bowl dry.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  "extra-large-natural-salt-lamp": {
    id: "7",
    name: "Extra Large Natural Salt Lamp",
    slug: "extra-large-natural-salt-lamp",
    description:
      "Make a bold statement with this impressive extra-large salt lamp. Weighing over 10kg, this magnificent piece serves as both a functional lamp and a stunning centerpiece. The substantial size means more surface area for the warm, healing glow to emanate.",
    short_description: "Statement piece for large spaces with powerful ambient glow",
    price: 12000,
    compare_at_price: 14000,
    category: "salt-lamp",
    shape: "Natural",
    size: "Extra Large",
    weight_kg: 12.0,
    bulb_type: "E14 25W",
    stock_quantity: 15,
    is_featured: true,
    is_active: true,
    images: ["/extra-large-himalayan-salt-lamp.jpg"],
    image_360_url: null,
    usage_instructions:
      "Requires a sturdy surface due to weight. Use a 25W bulb for optimal heat and glow. Ideal for large living rooms, offices, or commercial spaces.",
    safety_notes:
      "Very heavy - handle with assistance. Ensure electrical components can handle extended use. Keep away from edges.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  "cylinder-salt-lamp": {
    id: "8",
    name: "Cylinder Salt Lamp",
    slug: "cylinder-salt-lamp",
    description:
      "Sleek and modern, this cylindrical salt lamp adds contemporary elegance to any space. The smooth, uniform shape creates an even distribution of warm light, perfect for minimalist interiors and modern decor styles.",
    short_description: "Modern cylindrical design for contemporary spaces",
    price: 5000,
    compare_at_price: 5800,
    category: "salt-lamp",
    shape: "Cylinder",
    size: "Medium",
    weight_kg: 2.8,
    bulb_type: "E14 15W",
    stock_quantity: 28,
    is_featured: false,
    is_active: true,
    images: ["/cylinder-himalayan-salt-lamp-modern.jpg"],
    image_360_url: null,
    usage_instructions:
      "Perfect for modern and minimalist interiors. The vertical shape saves table space while maximizing light output.",
    safety_notes: "Smooth surface - wipe gently with a dry cloth. Avoid using water or cleaning solutions.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("products").select("*").eq("slug", slug).eq("is_active", true).single()

    if (error) throw error
    return data
  } catch {
    // Return demo product if database lookup fails
    return demoProducts[slug] || null
  }
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    return { title: "Product Not Found | Namak Halal" }
  }

  return {
    title: `${product.name} | Namak Halal`,
    description: product.short_description || product.description,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  return (
    <>
      <Starfield />
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Product Main Section */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
            <ProductGallery images={product.images} name={product.name} />
            <ProductInfo product={product} />
          </div>

          {/* Product Details Tabs */}
          <ProductTabs product={product} />

          {/* Related Products */}
          <RelatedProducts currentProductId={product.id} shape={product.shape} />
        </div>
      </main>
      <Footer />
    </>
  )
}
