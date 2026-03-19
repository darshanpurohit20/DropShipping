"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, Minus, Plus, Trash2, Tag, ShoppingBag, Truck, Shield, Gift, ChevronRight, Sparkles, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart, useCoupon, availableCoupons } from "@/lib/cart-store"
import { cn } from "@/lib/utils"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalItems, subtotal, totalSavings, clearCart } = useCart()
  const { coupon, applyCoupon, removeCoupon, getCouponDiscount } = useCoupon()
  const [couponCode, setCouponCode] = useState("")
  const [couponMessage, setCouponMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [showCoupons, setShowCoupons] = useState(false)
  const [removingId, setRemovingId] = useState<number | null>(null)

  // Charges
  const deliveryCharge = subtotal >= 499 ? 0 : 49
  const packagingCharge = 19
  const platformFee = 9
  const couponDiscount = getCouponDiscount(subtotal)
  
  // Total calculation
  const grandTotal = subtotal + deliveryCharge + packagingCharge + platformFee - couponDiscount

  // Free shipping progress
  const freeShippingThreshold = 499
  const freeShippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100)
  const amountForFreeShipping = Math.max(freeShippingThreshold - subtotal, 0)

  // Suggested coupon based on cart value
  const suggestedCoupon = availableCoupons.find(c => subtotal >= c.minOrder && (!coupon || c.discount > (coupon.type === "percentage" ? coupon.discount : 0)))

  const handleApplyCoupon = () => {
    const result = applyCoupon(couponCode, subtotal)
    setCouponMessage({ type: result.success ? "success" : "error", text: result.message })
    if (result.success) {
      setCouponCode("")
      setShowCoupons(false)
    }
    setTimeout(() => setCouponMessage(null), 3000)
  }

  const handleRemoveItem = (id: number) => {
    setRemovingId(id)
    setTimeout(() => {
      removeItem(id)
      setRemovingId(null)
    }, 300)
  }

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-500",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-[480px] bg-background z-50 shadow-2xl",
          "transition-transform duration-500 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold">Your Cart</h2>
                <p className="text-sm text-muted-foreground">{totalItems} {totalItems === 1 ? "item" : "items"}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {items.length === 0 ? (
            /* Empty Cart State */
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-6 animate-bounce-gentle">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="font-serif text-2xl font-bold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-6 max-w-xs">
                Looks like you haven&apos;t added anything to your cart yet. Start shopping!
              </p>
              <Button onClick={onClose} className="rounded-full px-8">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              {/* Free Shipping Progress */}
              <div className="p-4 sm:px-6 bg-secondary/50">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-4 w-4 text-accent" />
                  {amountForFreeShipping > 0 ? (
                    <p className="text-sm">
                      Add <span className="font-bold text-accent">₹{amountForFreeShipping}</span> more for{" "}
                      <span className="font-bold text-green-600">FREE Delivery!</span>
                    </p>
                  ) : (
                    <p className="text-sm font-medium text-green-600">
                      Yay! You&apos;ve unlocked FREE Delivery!
                    </p>
                  )}
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent to-green-500 transition-all duration-700 ease-out rounded-full"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex gap-4 p-4 bg-card rounded-2xl border border-border",
                      "transition-all duration-300",
                      "animate-in slide-in-from-right",
                      removingId === item.id && "opacity-0 translate-x-full"
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Image */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm sm:text-base line-clamp-2 mb-1">{item.name}</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-foreground">₹{item.price}</span>
                        {item.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">₹{item.originalPrice}</span>
                        )}
                        {item.originalPrice && (
                          <span className="text-xs text-green-600 font-medium">
                            Save ₹{(item.originalPrice - item.price) * item.quantity}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 bg-secondary rounded-full p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Coupon Section */}
                <div className="bg-card rounded-2xl border border-border overflow-hidden">
                  <button
                    onClick={() => setShowCoupons(!showCoupons)}
                    className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                        <Tag className="h-5 w-5 text-accent" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">Apply Coupon</p>
                        {coupon ? (
                          <p className="text-sm text-green-600 flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            {coupon.code} applied - You save ₹{couponDiscount}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground">Save more with coupons</p>
                        )}
                      </div>
                    </div>
                    <ChevronRight className={cn(
                      "h-5 w-5 text-muted-foreground transition-transform duration-300",
                      showCoupons && "rotate-90"
                    )} />
                  </button>

                  {showCoupons && (
                    <div className="p-4 border-t border-border space-y-4 animate-in slide-in-from-top duration-300">
                      {/* Coupon Input */}
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="rounded-xl uppercase"
                        />
                        <Button onClick={handleApplyCoupon} className="rounded-xl px-6">
                          Apply
                        </Button>
                      </div>

                      {/* Message */}
                      {couponMessage && (
                        <div className={cn(
                          "flex items-center gap-2 p-3 rounded-xl text-sm animate-in fade-in duration-300",
                          couponMessage.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                        )}>
                          {couponMessage.type === "success" ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <AlertCircle className="h-4 w-4" />
                          )}
                          {couponMessage.text}
                        </div>
                      )}

                      {/* Applied Coupon */}
                      {coupon && (
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-600" />
                            <span className="font-medium text-green-700">{coupon.code}</span>
                          </div>
                          <button
                            onClick={removeCoupon}
                            className="text-sm text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      )}

                      {/* Available Coupons */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Available Coupons:</p>
                        {availableCoupons.map((c) => {
                          const canApply = subtotal >= c.minOrder
                          return (
                            <button
                              key={c.code}
                              onClick={() => {
                                if (canApply) {
                                  const result = applyCoupon(c.code, subtotal)
                                  setCouponMessage({ type: result.success ? "success" : "error", text: result.message })
                                  setTimeout(() => setCouponMessage(null), 3000)
                                }
                              }}
                              className={cn(
                                "w-full flex items-center justify-between p-3 rounded-xl border transition-all",
                                canApply
                                  ? "border-accent/30 bg-accent/5 hover:border-accent cursor-pointer"
                                  : "border-border bg-muted/50 opacity-60 cursor-not-allowed"
                              )}
                            >
                              <div className="text-left">
                                <p className="font-mono font-bold text-sm">{c.code}</p>
                                <p className="text-xs text-muted-foreground">{c.description}</p>
                              </div>
                              {canApply ? (
                                <span className="text-xs font-medium text-accent">APPLY</span>
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  Add ₹{c.minOrder - subtotal} more
                                </span>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Suggested Coupon Banner */}
                {suggestedCoupon && !coupon && (
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-accent/10 to-accent/5 rounded-2xl border border-accent/20 animate-in fade-in duration-500">
                    <Sparkles className="h-5 w-5 text-accent flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Use code <span className="font-mono font-bold text-accent">{suggestedCoupon.code}</span></p>
                      <p className="text-xs text-muted-foreground">{suggestedCoupon.description}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const result = applyCoupon(suggestedCoupon.code, subtotal)
                        setCouponMessage({ type: result.success ? "success" : "error", text: result.message })
                        setTimeout(() => setCouponMessage(null), 3000)
                      }}
                      className="rounded-full text-xs"
                    >
                      Apply
                    </Button>
                  </div>
                )}
              </div>

              {/* Price Summary & Checkout */}
              <div className="border-t border-border bg-card p-4 sm:p-6 space-y-4">
                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Shield className="h-3 w-3" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Truck className="h-3 w-3" />
                    <span>Fast Delivery</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Gift className="h-3 w-3" />
                    <span>Easy Returns</span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                    <span className="font-medium">₹{subtotal}</span>
                  </div>
                  
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Product Discount</span>
                      <span className="font-medium">-₹{totalSavings}</span>
                    </div>
                  )}

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon Discount ({coupon?.code})</span>
                      <span className="font-medium">-₹{couponDiscount}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Charges</span>
                    {deliveryCharge === 0 ? (
                      <span className="text-green-600 font-medium">FREE</span>
                    ) : (
                      <span className="font-medium">₹{deliveryCharge}</span>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Packaging Fee</span>
                    <span className="font-medium">₹{packagingCharge}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform Fee</span>
                    <span className="font-medium">₹{platformFee}</span>
                  </div>

                  <div className="h-px bg-border my-2" />

                  <div className="flex justify-between items-center">
                    <span className="font-serif text-lg font-bold">Total Amount</span>
                    <div className="text-right">
                      <span className="font-serif text-xl font-bold">₹{grandTotal}</span>
                      {(totalSavings + couponDiscount) > 0 && (
                        <p className="text-xs text-green-600 font-medium">
                          You save ₹{totalSavings + couponDiscount} on this order!
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button className="w-full h-14 text-lg font-medium rounded-2xl bg-primary hover:bg-primary/90 transition-all duration-300 group">
                  <span>Proceed to Checkout</span>
                  <ChevronRight className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>

                {/* Clear Cart */}
                <button
                  onClick={clearCart}
                  className="w-full text-center text-sm text-muted-foreground hover:text-destructive transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
