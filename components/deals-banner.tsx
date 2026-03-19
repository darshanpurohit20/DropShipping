"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, ShoppingCart, Loader2 } from "lucide-react"
import { useCart } from "@/lib/cart-store"
import { cn } from "@/lib/utils"

const saleProducts = [
  { id: 1, name: "Premium Earbuds", price: 799, originalPrice: 1499, image: "/images/earbuds.jpg", discount: 47 },
  { id: 2, name: "Smart Watch", price: 999, originalPrice: 1999, image: "/images/smartwatch.jpg", discount: 50 },
  { id: 3, name: "Backpack", price: 649, originalPrice: 999, image: "/images/backpack.jpg", discount: 35 },
]

export function DealsBanner() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  })
  const [addingId, setAddingId] = useState<number | null>(null)
  const { addItem } = useCart()

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return { hours: 23, minutes: 59, seconds: 59 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleQuickAdd = async (product: typeof saleProducts[0]) => {
    setAddingId(product.id)
    await new Promise(resolve => setTimeout(resolve, 400))
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image
    })
    setAddingId(null)
  }

  return (
    <section id="deals" className="py-16 md:py-24 bg-primary text-primary-foreground overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8 text-center lg:text-left animate-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-2 bg-accent/20 rounded-full px-4 py-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Limited Time Offer</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
              Flash Sale
              <span className="block text-accent">Up to 50% Off</span>
            </h2>

            <p className="text-base md:text-lg text-primary-foreground/80 max-w-md mx-auto lg:mx-0 text-pretty">
              Grab the best deals on trending products. Hurry up, offer ends soon!
            </p>

            {/* Countdown Timer */}
            <div className="flex justify-center lg:justify-start gap-3 md:gap-4">
              {[
                { label: "Hours", value: timeLeft.hours },
                { label: "Minutes", value: timeLeft.minutes },
                { label: "Seconds", value: timeLeft.seconds },
              ].map((item, i) => (
                <div key={item.label} className="text-center">
                  <div className={cn(
                    "w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm",
                    "flex items-center justify-center border border-primary-foreground/20",
                    "transition-all duration-300",
                    i === 2 && "animate-pulse"
                  )}>
                    <span className="text-2xl sm:text-3xl font-bold font-serif">
                      {item.value.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <p className="text-xs mt-2 text-primary-foreground/60">{item.label}</p>
                </div>
              ))}
            </div>

            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8 group w-full sm:w-auto"
            >
              Shop Sale Now
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>

          {/* Right Content - Featured Products */}
          <div className="relative animate-in slide-in-from-right duration-1000">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {/* Main Product */}
              <div className="col-span-2 relative aspect-video rounded-2xl md:rounded-3xl overflow-hidden bg-primary-foreground/10 group">
                <Image
                  src={saleProducts[0].image}
                  alt={saleProducts[0].name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 right-3 md:right-4 bg-primary-foreground/95 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-primary text-xs md:text-sm">{saleProducts[0].name}</p>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary text-lg md:text-xl">₹{saleProducts[0].price}</span>
                        <span className="text-xs md:text-sm text-muted-foreground line-through">₹{saleProducts[0].originalPrice}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleQuickAdd(saleProducts[0])}
                      disabled={addingId === saleProducts[0].id}
                      className={cn(
                        "bg-accent text-accent-foreground text-xs md:text-sm font-bold px-3 md:px-4 py-2 rounded-full",
                        "flex items-center gap-1.5 transition-all duration-300",
                        "hover:scale-105 active:scale-95",
                        addingId === saleProducts[0].id && "opacity-70"
                      )}
                    >
                      {addingId === saleProducts[0].id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <ShoppingCart className="h-3.5 w-3.5" />
                      )}
                      <span className="hidden sm:inline">{saleProducts[0].discount}% OFF</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Secondary Products */}
              {saleProducts.slice(1).map((product) => (
                <div 
                  key={product.id}
                  className="relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden bg-primary-foreground/10 group cursor-pointer"
                  onClick={() => handleQuickAdd(product)}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                  <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 right-3 md:right-4">
                    <p className="text-xs md:text-sm font-medium">{product.name}</p>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-sm md:text-lg">₹{product.price}</p>
                      <div className={cn(
                        "w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center",
                        "opacity-0 group-hover:opacity-100 transition-all duration-300",
                        addingId === product.id && "opacity-100"
                      )}>
                        {addingId === product.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ShoppingCart className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Floating Badge */}
            <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 bg-accent text-accent-foreground rounded-full w-16 h-16 md:w-24 md:h-24 flex flex-col items-center justify-center shadow-2xl animate-bounce-gentle">
              <span className="text-lg md:text-2xl font-bold">50%</span>
              <span className="text-[10px] md:text-xs">OFF</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
