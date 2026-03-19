"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, Minus, Plus, ShoppingCart, Heart, Star, Truck, Shield, RotateCcw, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-store"
import { cn } from "@/lib/utils"
import type { Product } from "./product-card"

interface QuickViewModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const { addItem, items } = useCart()

  const isInCart = product ? items.some(item => item.id === product.id) : false

  // Reset state when product changes
  useEffect(() => {
    setQuantity(1)
    setSelectedImage(0)
    setJustAdded(false)
  }, [product])

  // Lock body scroll
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

  if (!product) return null

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = async () => {
    setIsAdding(true)
    await new Promise(resolve => setTimeout(resolve, 500))

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image
      })
    }

    setIsAdding(false)
    setJustAdded(true)
    setTimeout(() => {
      setJustAdded(false)
      onClose()
    }, 1500)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-50",
          "transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50",
          "w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto",
          "bg-background rounded-3xl shadow-2xl",
          "transition-all duration-500",
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="relative aspect-square md:aspect-auto md:h-full bg-secondary/50 p-6">
            <div className="relative h-full rounded-2xl overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            {/* Badges */}
            <div className="absolute top-8 left-8 flex flex-col gap-2">
              {product.isNew && (
                <span className="bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
                  NEW
                </span>
              )}
              {discount > 0 && (
                <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  -{discount}% OFF
                </span>
              )}
            </div>

            {/* Wishlist */}
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={cn(
                "absolute top-8 right-8 w-10 h-10 rounded-full flex items-center justify-center",
                "bg-card/90 backdrop-blur-sm border border-border shadow-lg",
                "transition-all duration-300 hover:scale-110",
                isLiked && "bg-red-50 border-red-200"
              )}
            >
              <Heart className={cn(
                "h-5 w-5 transition-all",
                isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"
              )} />
            </button>
          </div>

          {/* Content Section */}
          <div className="p-6 md:p-8 flex flex-col">
            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "h-4 w-4",
                      star <= Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-muted text-muted"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Title */}
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4 text-balance">
              {product.name}
            </h2>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-serif text-3xl font-bold">₹{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    ₹{product.originalPrice}
                  </span>
                  <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    Save ₹{product.originalPrice - product.price}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground mb-6">
              Premium quality product with excellent durability and design. Perfect for everyday use with modern aesthetics.
            </p>

            {/* Quantity Selector */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-2">Quantity</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-secondary rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-muted rounded-l-xl transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-muted rounded-r-xl transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-muted-foreground">
                  Total: <span className="font-bold text-foreground">₹{product.price * quantity}</span>
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={isAdding}
              size="lg"
              className={cn(
                "w-full h-14 text-lg rounded-2xl transition-all duration-300",
                justAdded && "bg-green-500 hover:bg-green-500"
              )}
            >
              {isAdding ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Adding to Cart...
                </>
              ) : justAdded ? (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {isInCart ? "Add More to Cart" : "Add to Cart"}
                </>
              )}
            </Button>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                </div>
                <span className="text-xs text-muted-foreground">Free Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                </div>
                <span className="text-xs text-muted-foreground">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                  <RotateCcw className="h-5 w-5 text-muted-foreground" />
                </div>
                <span className="text-xs text-muted-foreground">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
