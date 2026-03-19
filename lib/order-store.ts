"use client"

import { createClient } from "./supabase-client"
import { CartItem } from "./cart-store"

const supabase = createClient()

export interface Order {
  id: string
  user_id: string
  total_amount: number
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'unpaid' | 'paid'
  shipping_address: string
  created_at: string
  order_items?: any[]
}

export async function createOrder(items: CartItem[], totalAmount: number, shippingAddress: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("User must be logged in to place an order")

  try {
    // 1. Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: totalAmount,
        shipping_address: shippingAddress,
        status: 'pending',
        payment_status: 'unpaid'
      })
      .select()
      .single()

    if (orderError) throw orderError

    // 2. Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.id.toString(),
      quantity: item.quantity,
      price_at_purchase: item.price
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    // 3. Clear the cart from DB
    await supabase.from('cart_items').delete().eq('user_id', user.id)

    return order
  } catch (error: any) {
    console.error("Order creation failed:", error.message)
    throw error
  }
}

export async function getOrderHistory() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching orders:", error.message)
    return []
  }

  return data as Order[]
}
