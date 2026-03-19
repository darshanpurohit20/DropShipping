"use client"

import { ShoppingBag, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-store"
import { cn } from "@/lib/utils"

interface MobileCartBarProps {
  onOpenCart: () => void
}

export function MobileCartBar({ onOpenCart }: MobileCartBarProps) {
  const { totalItems, subtotal } = useCart()

  if (totalItems === 0) return null

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 md:hidden",
        "bg-card/95 backdrop-blur-md border-t border-border",
        "px-4 py-3 safe-area-pb",
        "animate-in slide-in-from-bottom duration-500"
      )}
    >
      <div className="flex items-center gap-3">
        {/* Cart Info */}
        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center font-bold">
              {totalItems}
            </span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{totalItems} items</p>
            <p className="text-lg font-bold font-serif">₹{subtotal}</p>
          </div>
        </div>

        {/* View Cart Button */}
        <Button
          onClick={onOpenCart}
          className="h-12 px-6 rounded-xl font-medium group"
        >
          View Cart
          <ChevronUp className="h-4 w-4 ml-2 transition-transform group-hover:-translate-y-1" />
        </Button>
      </div>
    </div>
  )
}
