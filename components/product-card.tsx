"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, ShoppingCart, Eye, Star, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/cart-store"
import { useWishlist } from "@/lib/wishlist-store"

export interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  badge?: string
  isNew?: boolean
  isTrending?: boolean
}

interface ProductCardProps {
  product: Product
  index?: number
  onAddToCart?: (product: Product) => void
}

export function ProductCard({ product, index = 0, onAddToCart }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const { addItem, items } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()

  const isInCart = items.some(item => item.id === product.id)
  const isLiked = isWishlisted(product.id.toString())
  const itemInCart = items.find(item => item.id === product.id)

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = async () => {
    setIsAdding(true)
    
    // Simulate small delay for animation
    await new Promise(resolve => setTimeout(resolve, 400))
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image
    })
    
    setIsAdding(false)
    setJustAdded(true)
    
    if (onAddToCart) {
      onAddToCart(product)
    }
    
    setTimeout(() => setJustAdded(false), 2000)
  }

  return (
    <div
      className={cn(
        "group relative bg-card rounded-3xl overflow-hidden border border-border",
        "transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2",
        "animate-in fade-in slide-in-from-bottom duration-700"
      )}
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-secondary/50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className={cn(
            "object-cover transition-all duration-700",
            isHovered ? "scale-110" : "scale-100"
          )}
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full animate-in zoom-in duration-300">
              NEW
            </span>
          )}
          {product.isTrending && (
            <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full animate-in zoom-in duration-300 delay-100">
              TRENDING
            </span>
          )}
          {discount > 0 && (
            <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-in zoom-in duration-300 delay-200">
              -{discount}%
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className={cn(
          "absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300",
          isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
        )}>
          <button
            onClick={() => toggleWishlist(product.id.toString())}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
              "bg-card/90 backdrop-blur-sm border border-border shadow-lg",
              "hover:scale-110 active:scale-95",
              isLiked && "bg-red-50 border-red-200"
            )}
          >
            <Heart className={cn(
              "h-5 w-5 transition-all duration-300",
              isLiked ? "fill-red-500 text-red-500 scale-110" : "text-muted-foreground"
            )} />
          </button>
          <button className="w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm border border-border shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300">
            <Eye className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Add to Cart Overlay */}
        <div className={cn(
          "absolute inset-x-4 bottom-4 transition-all duration-500",
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <Button 
            onClick={handleAddToCart}
            disabled={isAdding}
            className={cn(
              "w-full backdrop-blur-sm rounded-xl h-12 shadow-lg group/btn transition-all duration-300",
              justAdded 
                ? "bg-green-500 hover:bg-green-500" 
                : isInCart 
                  ? "bg-accent/95 hover:bg-accent"
                  : "bg-primary/95 hover:bg-primary"
            )}
          >
            {isAdding ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : justAdded ? (
              <Check className="h-4 w-4 mr-2 animate-in zoom-in duration-200" />
            ) : (
              <ShoppingCart className="h-4 w-4 mr-2 transition-transform duration-300 group-hover/btn:scale-110" />
            )}
            {isAdding 
              ? "Adding..." 
              : justAdded 
                ? "Added!" 
                : isInCart 
                  ? `In Cart (${itemInCart?.quantity})` 
                  : "Add to Cart"
            }
          </Button>
        </div>

        {/* Cart indicator badge */}
        {isInCart && !isHovered && (
          <div className="absolute top-4 right-4 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs font-bold animate-in zoom-in duration-300">
            {itemInCart?.quantity}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "h-3.5 w-3.5 transition-all duration-300",
                  star <= Math.floor(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-muted text-muted"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviews})
          </span>
        </div>

        {/* Name */}
        <h3 className="font-medium text-foreground mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-accent transition-colors duration-300">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold font-serif text-foreground">
            ₹{product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{product.originalPrice}
            </span>
          )}
        </div>

        {/* Free Shipping Badge */}
        {product.price >= 499 && (
          <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
            <Check className="h-3 w-3" />
            Free Shipping
          </p>
        )}
      </div>
    </div>
  )
}
