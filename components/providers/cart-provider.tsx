"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { useUser } from "@clerk/nextjs"
import type { CartItem, Product } from "@/lib/types"
import {
  getCartItems,
  addToCart as serverAddToCart,
  updateCartItemQuantity,
  removeCartItem as serverRemoveCartItem,
  clearCart as serverClearCart,
  syncGuestCart
} from "@/lib/actions/cart"

interface CartContextType {
  items: CartItem[]
  itemCount: number
  subtotal: number
  addItem: (product: Product, quantity?: number) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const GUEST_CART_KEY = "guest_cart"

export function CartProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded } = useUser()
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Load cart on mount and when auth state changes
  useEffect(() => {
    if (!isLoaded) return

    const loadCart = async () => {
      setIsLoading(true)

      if (isSignedIn) {
        // Sync guest cart to server first (if any)
        const guestCartData = localStorage.getItem(GUEST_CART_KEY)
        if (guestCartData) {
          try {
            const guestItems = JSON.parse(guestCartData) as CartItem[]
            if (guestItems.length > 0) {
              await syncGuestCart(
                guestItems.map(item => ({
                  product_id: item.product_id,
                  quantity: item.quantity,
                }))
              )
              localStorage.removeItem(GUEST_CART_KEY)
            }
          } catch (e) {
            console.error("Failed to sync guest cart:", e)
          }
        }

        // Load cart from server
        try {
          const serverItems = await getCartItems()
          setItems(serverItems)
        } catch (e) {
          console.error("Failed to load cart:", e)
        }
      } else {
        // Load guest cart from localStorage
        const guestCartData = localStorage.getItem(GUEST_CART_KEY)
        if (guestCartData) {
          try {
            setItems(JSON.parse(guestCartData))
          } catch {
            setItems([])
          }
        }
      }

      setIsLoading(false)
    }

    loadCart()
  }, [isSignedIn, isLoaded])

  // Save guest cart to localStorage
  const saveGuestCart = useCallback((cartItems: CartItem[]) => {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartItems))
  }, [])

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const subtotal = items.reduce((total, item) => {
    const price = item.product?.price || 0
    return total + price * item.quantity
  }, 0)

  const addItem = useCallback(async (product: Product, quantity = 1) => {
    if (isSignedIn) {
      // Add to server
      try {
        await serverAddToCart(product.id, quantity)
        // Refetch cart
        const serverItems = await getCartItems()
        setItems(serverItems)
      } catch (e) {
        console.error("Failed to add to cart:", e)
      }
    } else {
      // Add to local state
      setItems((prev) => {
        const existingItem = prev.find((item) => item.product_id === product.id)
        let newItems: CartItem[]

        if (existingItem) {
          newItems = prev.map((item) =>
            item.product_id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        } else {
          const newItem: CartItem = {
            id: crypto.randomUUID(),
            user_id: null,
            session_id: null,
            product_id: product.id,
            quantity,
            product,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
          newItems = [...prev, newItem]
        }

        saveGuestCart(newItems)
        return newItems
      })
    }
    setIsCartOpen(true)
  }, [isSignedIn, saveGuestCart])

  const removeItem = useCallback(async (itemId: string) => {
    if (isSignedIn) {
      try {
        await serverRemoveCartItem(itemId)
        const serverItems = await getCartItems()
        setItems(serverItems)
      } catch (e) {
        console.error("Failed to remove from cart:", e)
      }
    } else {
      setItems((prev) => {
        const newItems = prev.filter((item) => item.id !== itemId)
        saveGuestCart(newItems)
        return newItems
      })
    }
  }, [isSignedIn, saveGuestCart])

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(itemId)
      return
    }

    if (isSignedIn) {
      try {
        await updateCartItemQuantity(itemId, quantity)
        const serverItems = await getCartItems()
        setItems(serverItems)
      } catch (e) {
        console.error("Failed to update quantity:", e)
      }
    } else {
      setItems((prev) => {
        const newItems = prev.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
        saveGuestCart(newItems)
        return newItems
      })
    }
  }, [isSignedIn, removeItem, saveGuestCart])

  const clearCart = useCallback(async () => {
    if (isSignedIn) {
      try {
        await serverClearCart()
        setItems([])
      } catch (e) {
        console.error("Failed to clear cart:", e)
      }
    } else {
      setItems([])
      localStorage.removeItem(GUEST_CART_KEY)
    }
  }, [isSignedIn])

  const openCart = useCallback(() => setIsCartOpen(true), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
