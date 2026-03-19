"use client"

import useSWR, { mutate } from "swr"
import { createClient } from "./supabase-client"

export interface CartItem {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  quantity: number
}

const supabase = createClient()

export interface Coupon {
  code: string
  discount: number
  minOrder: number
  type: "percentage" | "fixed"
  description: string
}

export const availableCoupons: Coupon[] = [
  { code: "SAVE10", discount: 10, minOrder: 500, type: "percentage", description: "10% off on orders above ₹500" },
  { code: "FLAT50", discount: 50, minOrder: 800, type: "fixed", description: "₹50 off on orders above ₹800" },
  { code: "FIRST100", discount: 100, minOrder: 600, type: "fixed", description: "₹100 off for first-time users" },
  { code: "MEGA20", discount: 20, minOrder: 1500, type: "percentage", description: "20% off on orders above ₹1500" },
]

const CART_KEY = "shopping-cart"

// Fetcher for SWR
const cartFetcher = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    const { data: dbItems, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
    
    if (!error && dbItems) {
      return dbItems.map(item => ({
        ...item.metadata,
        id: parseInt(item.product_id),
        quantity: item.quantity
      })) as CartItem[]
    }
  }
  
  // Fallback to local storage or memory if not logged in
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(CART_KEY)
    return saved ? JSON.parse(saved) : []
  }
  return []
}

export function useCart() {
  const { data: items = [], mutate: mutateCart } = useSWR<CartItem[]>(CART_KEY, cartFetcher, {
    fallbackData: []
  })

  // Helper to persist if logged in
  const syncToDb = async (newItems: CartItem[]) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      // Clear existing and insert new (simple sync strategy)
      await supabase.from('cart_items').delete().eq('user_id', user.id)
      
      const toInsert = newItems.map(item => ({
        user_id: user.id,
        product_id: item.id.toString(),
        quantity: item.quantity,
        metadata: {
          name: item.name,
          price: item.price,
          originalPrice: item.originalPrice,
          image: item.image
        }
      }))
      
      if (toInsert.length > 0) {
        await supabase.from('cart_items').insert(toInsert)
      }
    } else {
      localStorage.setItem(CART_KEY, JSON.stringify(newItems))
    }
  }

  const addItem = async (product: Omit<CartItem, "quantity">) => {
    let newItems: CartItem[] = []
    const existingIndex = items.findIndex(item => item.id === product.id)
    
    if (existingIndex > -1) {
      newItems = items.map((item, index) =>
        index === existingIndex
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    } else {
      newItems = [...items, { ...product, quantity: 1 }]
    }
    
    mutateCart(newItems, false)
    await syncToDb(newItems)
  }

  const removeItem = async (productId: number) => {
    const newItems = items.filter(item => item.id !== productId)
    mutateCart(newItems, false)
    await syncToDb(newItems)
  }

  const updateQuantity = async (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    
    const newItems = items.map(item =>
      item.id === productId ? { ...item, quantity } : item
    )
    mutateCart(newItems, false)
    await syncToDb(newItems)
  }

  const clearCart = async () => {
    mutateCart([], false)
    await syncToDb([])
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  
  const totalSavings = items.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + ((item.originalPrice - item.price) * item.quantity)
    }
    return sum
  }, 0)

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    totalSavings
  }
}


// Coupon state management
let couponState: Coupon | null = null

const couponFetcher = () => couponState

export function useCoupon() {
  const { data: coupon } = useSWR<Coupon | null>("applied-coupon", couponFetcher, {
    fallbackData: null
  })

  const applyCoupon = (code: string, subtotal: number): { success: boolean; message: string } => {
    const foundCoupon = availableCoupons.find(c => c.code.toUpperCase() === code.toUpperCase())
    
    if (!foundCoupon) {
      return { success: false, message: "Invalid coupon code" }
    }
    
    if (subtotal < foundCoupon.minOrder) {
      return { success: false, message: `Add ₹${foundCoupon.minOrder - subtotal} more to use this coupon` }
    }
    
    couponState = foundCoupon
    mutate("applied-coupon", couponState, false)
    return { success: true, message: "Coupon applied successfully!" }
  }

  const removeCoupon = () => {
    couponState = null
    mutate("applied-coupon", null, false)
  }

  const getCouponDiscount = (subtotal: number): number => {
    if (!coupon) return 0
    if (subtotal < coupon.minOrder) return 0
    
    if (coupon.type === "percentage") {
      return Math.round((subtotal * coupon.discount) / 100)
    }
    return coupon.discount
  }

  return {
    coupon,
    applyCoupon,
    removeCoupon,
    getCouponDiscount
  }
}
