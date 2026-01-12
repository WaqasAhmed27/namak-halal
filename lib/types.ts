export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  price: number
  compare_at_price: number | null
  category: string
  shape: string | null
  size: string | null
  weight_kg: number | null
  bulb_type: string | null
  stock_quantity: number
  is_featured: boolean
  is_active: boolean
  images: string[]
  image_360_url: string | null
  usage_instructions: string | null
  safety_notes: string | null
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  user_id: string | null
  session_id: string | null
  product_id: string
  quantity: number
  product?: Product
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string | null
  guest_email: string | null
  order_number: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  subtotal: number
  shipping_cost: number
  discount_amount: number
  total: number
  shipping_address: Address
  billing_address: Address | null
  shipping_method: string | null
  payment_method: string | null
  payment_intent_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  product_price: number
  quantity: number
  created_at: string
}

export interface Address {
  id?: string
  label?: string
  full_name: string
  street_address: string
  city: string
  state?: string
  postal_code: string
  country: string
  phone?: string
}

export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface WishlistItem {
  id: string
  user_id: string
  product_id: string
  product?: Product
  created_at: string
}

export interface DiscountCode {
  id: string
  code: string
  description: string | null
  discount_type: "percentage" | "fixed"
  discount_value: number
  min_order_amount: number | null
  max_uses: number | null
  used_count: number
  is_active: boolean
  valid_from: string
  valid_until: string | null
  created_at: string
}

export interface Review {
  id: string
  product_id: string
  user_id: string | null
  rating: number
  title: string | null
  content: string | null
  is_verified_purchase: boolean
  created_at: string
}
