"use client"

import { useRef, useState } from "react"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai",
    avatar: "PS",
    rating: 5,
    review: "Amazing quality products at such affordable prices! The earbuds I bought are working perfectly. Fast delivery too!",
    product: "Wireless Earbuds"
  },
  {
    id: 2,
    name: "Rahul Kumar",
    location: "Delhi",
    avatar: "RK",
    rating: 5,
    review: "Best shopping experience ever. The smartwatch exceeded my expectations. Will definitely buy again!",
    product: "Smart Watch"
  },
  {
    id: 3,
    name: "Ananya Singh",
    location: "Bangalore",
    avatar: "AS",
    rating: 4,
    review: "Love the backpack! Great design and very durable. Perfect for my daily commute. Highly recommended!",
    product: "Urban Backpack"
  },
  {
    id: 4,
    name: "Vikram Patel",
    location: "Ahmedabad",
    avatar: "VP",
    rating: 5,
    review: "Excellent customer service and genuine products. The wallet quality is premium at this price point.",
    product: "Leather Wallet"
  },
]

export function Testimonials() {
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
    const cardWidth = scrollRef.current.querySelector("div")?.offsetWidth || 300
    scrollRef.current.scrollBy({
      left: direction === "left" ? -cardWidth - 16 : cardWidth + 16,
      behavior: "smooth"
    })
  }

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <p className="text-accent font-medium mb-2 animate-in fade-in slide-in-from-bottom duration-500">
            Customer Love
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4 animate-in fade-in slide-in-from-bottom duration-500 delay-100 text-balance">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom duration-500 delay-200 text-pretty">
            Join 50,000+ happy customers who trust us for quality products
          </p>
        </div>

        {/* Mobile: Horizontal Scroll */}
        <div className="md:hidden relative">
          {/* Scroll Buttons */}
          <div className="flex justify-end gap-2 mb-4">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={cn(
                "w-10 h-10 rounded-full border border-border flex items-center justify-center transition-all",
                canScrollLeft ? "bg-card hover:bg-secondary" : "opacity-40 cursor-not-allowed"
              )}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={cn(
                "w-10 h-10 rounded-full border border-border flex items-center justify-center transition-all",
                canScrollRight ? "bg-card hover:bg-secondary" : "opacity-40 cursor-not-allowed"
              )}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide"
          >
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} isMobile />
            ))}
          </div>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </div>

        {/* Stats */}
        <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 animate-in fade-in duration-1000 delay-500">
          {[
            { value: "50K+", label: "Happy Customers" },
            { value: "4.9", label: "Average Rating" },
            { value: "100K+", label: "Products Sold" },
            { value: "99%", label: "Satisfaction" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 bg-card rounded-2xl border border-border">
              <p className="text-2xl md:text-4xl font-bold font-serif text-foreground mb-1">{stat.value}</p>
              <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({
  testimonial,
  index,
  isMobile = false
}: {
  testimonial: typeof testimonials[0]
  index: number
  isMobile?: boolean
}) {
  return (
    <div
      className={cn(
        "group bg-card rounded-2xl md:rounded-3xl p-5 md:p-6 border border-border",
        "transition-all duration-500 hover:shadow-xl hover:-translate-y-2",
        "animate-in fade-in slide-in-from-bottom duration-700",
        isMobile && "flex-shrink-0 snap-center w-[280px]"
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Quote Icon */}
      <div className="mb-3 md:mb-4 transition-transform duration-300 group-hover:scale-110">
        <Quote className="h-6 md:h-8 w-6 md:w-8 text-accent/30" />
      </div>

      {/* Rating */}
      <div className="flex gap-1 mb-3 md:mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-3.5 md:h-4 w-3.5 md:w-4",
              star <= testimonial.rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-muted text-muted"
            )}
          />
        ))}
      </div>

      {/* Review */}
      <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 line-clamp-4 leading-relaxed">
        {`"${testimonial.review}"`}
      </p>

      {/* Product Badge */}
      <p className="text-xs text-accent font-medium mb-3 md:mb-4 bg-accent/10 rounded-full px-3 py-1 inline-block">
        Purchased: {testimonial.product}
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-3 md:pt-4 border-t border-border">
        <div className="w-9 md:w-10 h-9 md:h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-xs md:text-sm">
          {testimonial.avatar}
        </div>
        <div>
          <p className="font-medium text-sm">{testimonial.name}</p>
          <p className="text-xs text-muted-foreground">{testimonial.location}</p>
        </div>
      </div>
    </div>
  )
}
