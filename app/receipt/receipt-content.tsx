"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase-client"
import { ShoppingBag, Printer, Download, CheckCircle2, Phone, Mail, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ReceiptPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!orderId) return

    const fetchOrder = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .eq("id", orderId)
        .single()

      if (!error) {
        setOrder(data)
      }
      setLoading(false)
    }

    fetchOrder()
  }, [orderId])

  if (loading) return <div className="min-h-screen flex items-center justify-center italic">Generating Receipt...</div>
  if (!order) return <div className="min-h-screen flex items-center justify-center">Order not found.</div>

  return (
    <div className="min-h-screen bg-secondary/30 py-12 px-4 print:bg-white print:py-0">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-border print:shadow-none print:border-none print:rounded-none">
        {/* Header */}
        <div className="bg-primary p-8 text-primary-foreground flex justify-between items-center print:bg-white print:text-black print:border-b print:px-0">
          <div className="space-y-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-primary font-serif text-lg font-bold">A</span>
              </div>
              <span className="font-serif text-2xl font-bold italic">Arey Beta</span>
            </Link>
            <p className="text-sm opacity-80 print:opacity-100">Premium Lifestyle Store</p>
          </div>
          <div className="text-right">
            <h1 className="text-3xl font-black uppercase tracking-tighter">Receipt</h1>
            <p className="text-sm opacity-80 print:opacity-100">Order #{order.id.slice(0, 8)}</p>
          </div>
        </div>

        {/* Status Banner */}
        <div className="bg-green-50 p-4 border-y border-green-100 flex items-center justify-center gap-2 print:hidden">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <span className="text-green-700 font-medium">Payment Successful - Order Confirmed</span>
        </div>

        <div className="p-8 space-y-8">
          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Billed To</h3>
              <p className="font-bold text-lg">{order.shipping_address?.split(',')[0] || 'Customer'}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{order.shipping_address}</p>
            </div>
            <div className="space-y-1 text-right">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Date</h3>
              <p className="font-bold">{new Date(order.created_at).toLocaleDateString()}</p>
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mt-4">Payment Mode</h3>
              <p className="font-bold">Digital Payment</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="border-y border-border py-4">
            <table className="w-full">
              <thead>
                <tr className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  <th className="pb-4 text-left">Item Description</th>
                  <th className="pb-4 text-center">Qty</th>
                  <th className="pb-4 text-right">Price</th>
                  <th className="pb-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {order.order_items?.map((item: any, i: number) => (
                  <tr key={i} className="text-sm">
                    <td className="py-4 font-medium italic">Product ID: {item.product_id}</td>
                    <td className="py-4 text-center">{item.quantity}</td>
                    <td className="py-4 text-right">₹{item.price_at_purchase}</td>
                    <td className="py-4 text-right font-bold">₹{item.price_at_purchase * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-3">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{order.total_amount}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Shipping</span>
                <span className="text-green-600 font-bold">Free</span>
              </div>
              <div className="flex justify-between text-lg font-black pt-3 border-t border-border">
                <span>Grand Total</span>
                <span>₹{order.total_amount}</span>
              </div>
            </div>
          </div>

          {/* Contact Info (The requested part) */}
          <div className="pt-8 border-t border-border grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="h-3 w-3" />
              <span>+91 77095 63712 (Harsh Redasni)</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
              <Mail className="h-3 w-3" />
              <span>contact@areybeta.in</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground justify-end">
              <Globe className="h-3 w-3" />
              <span>www.areybeta.in</span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-8 bg-secondary/30 flex gap-4 print:hidden">
          <Button onClick={() => window.print()} className="flex-1 rounded-xl h-12 shadow-lg shadow-primary/20">
            <Printer className="h-4 w-4 mr-2" />
            Print Receipt
          </Button>
          <Button variant="outline" className="flex-1 rounded-xl h-12 border-border">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>
      
      <div className="mt-8 text-center print:hidden">
        <Link href="/">
          <Button variant="ghost" className="rounded-full">Back to Home</Button>
        </Link>
      </div>
    </div>
  )
}