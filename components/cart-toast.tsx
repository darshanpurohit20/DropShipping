"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Check, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"

interface CartToastProps {
  product: {
    name: string
    price: number
    image: string
  } | null
  onClose: () => void
}

export function CartToast({ product, onClose }: CartToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (product) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [product, onClose])

  if (!product) return null

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
        "bg-card border border-border shadow-2xl rounded-2xl p-4",
        "flex items-center gap-4 max-w-sm w-full mx-4",
        "transition-all duration-500",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      <div className="w-14 h-14 rounded-xl overflow-hidden bg-secondary flex-shrink-0 relative">
        <Image src={product.image} alt={product.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
            <Check className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-green-600 flex items-center gap-1">
          <ShoppingBag className="h-3 w-3" />
          Added to cart!
        </p>
        <p className="text-sm text-foreground line-clamp-1">{product.name}</p>
        <p className="text-sm font-bold">₹{product.price}</p>
      </div>
    </div>
  )
}
