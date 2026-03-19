import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-client'

// Since we are in the App Router, we can't use createClient direct easily because it expects browser context.
// But we want a simple "Dummy Order" API. Let's use it for testing.

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { items, totalAmount, shippingAddress, userId } = body

    // 1. Create Order
    const supabase = createClient()
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: totalAmount,
        shipping_address: shippingAddress,
        status: 'pending',
        payment_status: 'paid' // Dummy order, assume paid
      })
      .select()
      .single()

    if (error) throw error

    // 2. Add Items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id.toString(),
      quantity: item.quantity,
      price_at_purchase: item.price
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
