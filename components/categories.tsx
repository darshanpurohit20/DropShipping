"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { ArrowRight, Headphones, Watch, Briefcase, Smartphone, Glasses, Home, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const categories = [
  {
    name: "Electronics",
    icon: Headphones,
    count: 124,
    image: "/images/earbuds.jpg",
    color: "from-blue-500/20 to-blue-600/20"
  },
  {
    name: "Watches",
    icon: Watch,
    count: 86,
    image: "/images/smartwatch.jpg",
    color: "from-emerald-500/20 to-emerald-600/20"
  },
  {
    name: "Bags",
    icon: Briefcase,
    count: 95,
    image: "/images/backpack.jpg",
    color: "from-amber-500/20 to-amber-600/20"
  },
  {
    name: "Accessories",
    icon: Smartphone,
    count: 156,
    image: "/images/phone-case.jpg",
    color: "from-rose-500/20 to-rose-600/20"
  },
  {
    name: "Eyewear",
    icon: Glasses,
    count: 67,
    image: "/images/sunglasses.jpg",
    color: "from-violet-500/20 to-violet-600/20"
  },
  {
    name: "Home",
    icon: Home,
    count: 112,
    image: "/images/desk-lamp.jpg",
    color: "from-cyan-500/20 to-cyan-600/20"
  },
]

export function Categories() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const scrollAmount = 200
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    })
  }

  return (
    <section id="categories" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-12">
          <div>
            <p className="text-accent font-medium mb-2 animate-in fade-in slide-in-from-bottom duration-500">Browse by</p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold animate-in fade-in slide-in-from-bottom duration-500 delay-100">
              Popular Categories
            </h2>
          </div>
          <button className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300 self-start md:self-auto">
            View All Categories
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        {/* Mobile: Horizontal Scroll */}
        <div className="md:hidden relative">
          {/* Scroll Buttons */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-card/90 backdrop-blur-sm border border-border rounded-full flex items-center justify-center shadow-lg"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-card/90 backdrop-blur-sm border border-border rounded-full flex items-center justify-center shadow-lg"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide"
          >
            {categories.map((category, index) => (
              <MobileCategoryCard key={category.name} category={category} index={index} />
            ))}
          </div>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <CategoryCard key={category.name} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function MobileCategoryCard({
  category,
  index
}: {
  category: typeof categories[0]
  index: number
}) {
  const Icon = category.icon

  return (
    <div
      className={cn(
        "flex-shrink-0 snap-center w-32",
        "flex flex-col items-center text-center",
        "animate-in fade-in slide-in-from-right duration-500"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative w-24 h-24 rounded-2xl overflow-hidden mb-3 border border-border">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className={cn(
          "absolute bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-xl",
          "bg-card/90 backdrop-blur-sm flex items-center justify-center"
        )}>
          <Icon className="h-5 w-5 text-accent" />
        </div>
      </div>
      <h3 className="font-medium text-sm">{category.name}</h3>
      <p className="text-xs text-muted-foreground">{category.count} items</p>
    </div>
  )
}

function CategoryCard({ 
  category, 
  index 
}: { 
  category: typeof categories[0]
  index: number
}) {
  const Icon = category.icon

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl bg-card border border-border cursor-pointer",
        "transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-2",
        "animate-in fade-in slide-in-from-bottom duration-700"
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
      </div>

      {/* Content */}
      <div className="relative p-4 lg:p-6 flex flex-col items-center text-center aspect-square justify-center">
        {/* Icon Container */}
        <div className={cn(
          "w-12 lg:w-16 h-12 lg:h-16 rounded-xl lg:rounded-2xl flex items-center justify-center mb-3 lg:mb-4",
          "bg-gradient-to-br",
          category.color,
          "transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
        )}>
          <Icon className="h-5 lg:h-7 w-5 lg:w-7 text-foreground transition-transform duration-500 group-hover:scale-110" />
        </div>

        {/* Text */}
        <h3 className="font-medium text-sm lg:text-lg mb-1 transition-colors duration-300">
          {category.name}
        </h3>
        <p className="text-xs lg:text-sm text-muted-foreground">
          {category.count} items
        </p>

        {/* Hover Arrow */}
        <div className="absolute bottom-3 lg:bottom-4 right-3 lg:right-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <ArrowRight className="h-4 lg:h-5 w-4 lg:w-5 text-accent" />
        </div>
      </div>
    </div>
  )
}
