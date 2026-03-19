"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, TrendingUp, Shield, Truck } from "lucide-react"

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return
      const { clientX, clientY } = e
      const { left, top, width, height } = heroRef.current.getBoundingClientRect()
      const x = (clientX - left - width / 2) / 25
      const y = (clientY - top - height / 2) / 25
      
      heroRef.current.style.setProperty("--mouse-x", `${x}px`)
      heroRef.current.style.setProperty("--mouse-y", `${y}px`)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section 
      ref={heroRef}
      className="relative min-h-[calc(100vh-100px)] flex items-center pt-4 md:pt-8 overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-48 md:w-72 h-48 md:h-72 bg-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-64 md:w-96 h-64 md:h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-secondary/50 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8 text-center lg:text-left animate-in slide-in-from-left duration-1000">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-secondary/80 backdrop-blur-sm rounded-full px-4 py-2 border border-border animate-in fade-in slide-in-from-bottom duration-700">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">New Collection 2026</span>
            </div>

            {/* Heading */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-balance">
              <span className="block animate-in slide-in-from-bottom duration-700 delay-100">
                Discover Your
              </span>
              <span className="block text-accent animate-in slide-in-from-bottom duration-700 delay-200">
                Perfect Style
              </span>
            </h1>

            {/* Description */}
            <p className="text-base md:text-lg text-muted-foreground max-w-md mx-auto lg:mx-0 leading-relaxed animate-in slide-in-from-bottom duration-700 delay-300 text-pretty">
              Curated collection of premium lifestyle products at unbeatable prices. 
              Free shipping across India on orders above ₹499.
            </p>

            {/* Price Range Badge - Mobile Friendly */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 animate-in slide-in-from-bottom duration-700 delay-400">
              <div className="bg-card border border-border rounded-2xl px-4 md:px-6 py-3 shadow-sm">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Starting from</p>
                <p className="text-xl md:text-2xl font-bold font-serif">₹299</p>
              </div>
              <div className="hidden sm:block h-12 w-px bg-border" />
              <div className="text-center sm:text-left">
                <p className="text-sm text-muted-foreground">Trusted by</p>
                <p className="text-base md:text-lg font-semibold">50,000+ customers</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 sm:gap-4 animate-in slide-in-from-bottom duration-700 delay-500">
              <Button size="lg" className="group bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 w-full sm:w-auto">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 border-2 hover:bg-secondary transition-all duration-300 w-full sm:w-auto">
                View Collections
              </Button>
            </div>

            {/* Trust Indicators - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-4 animate-in fade-in duration-1000 delay-700">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className="w-8 h-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-xs font-medium"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
                <span className="text-sm text-muted-foreground ml-2">4.9/5 (2.5k reviews)</span>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div 
            className="relative order-first lg:order-last animate-in slide-in-from-right duration-1000"
            style={{
              transform: "translate3d(var(--mouse-x, 0), var(--mouse-y, 0), 0)"
            }}
          >
            <div className="relative aspect-square max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
              {/* Decorative Ring */}
              <div className="absolute inset-0 border-2 border-dashed border-border rounded-full animate-spin-slow" />
              
              {/* Main Image Container */}
              <div className="absolute inset-4 rounded-full overflow-hidden bg-secondary shadow-2xl">
                <Image
                  src="/images/hero-products.jpg"
                  alt="Curated lifestyle products collection"
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-700"
                  priority
                />
              </div>

              {/* Floating Product Cards - Hidden on mobile */}
              <div className="hidden md:block absolute -left-8 top-1/4 bg-card rounded-2xl p-3 lg:p-4 shadow-xl border border-border animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 lg:w-12 h-10 lg:h-12 rounded-xl bg-secondary overflow-hidden relative">
                    <Image src="/images/earbuds.jpg" alt="Earbuds" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-medium text-xs lg:text-sm">Wireless Earbuds</p>
                    <p className="text-accent font-bold text-sm lg:text-base">₹799</p>
                  </div>
                </div>
              </div>

              <div className="hidden md:block absolute -right-4 bottom-1/3 bg-card rounded-2xl p-3 lg:p-4 shadow-xl border border-border animate-float-delayed">
                <div className="flex items-center gap-3">
                  <div className="w-10 lg:w-12 h-10 lg:h-12 rounded-xl bg-secondary overflow-hidden relative">
                    <Image src="/images/smartwatch.jpg" alt="Smartwatch" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-medium text-xs lg:text-sm">Smart Watch</p>
                    <p className="text-accent font-bold text-sm lg:text-base">₹999</p>
                  </div>
                </div>
              </div>

              {/* Stats Badge */}
              <div className="absolute -bottom-2 md:-bottom-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground rounded-full px-4 md:px-6 py-2 md:py-3 shadow-xl animate-bounce-gentle whitespace-nowrap">
                <p className="text-xs md:text-sm font-medium">200+ items sold today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-8 lg:hidden animate-in fade-in duration-1000 delay-500">
          <div className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 text-sm">
            <Truck className="h-4 w-4 text-accent" />
            <span>Free Delivery</span>
          </div>
          <div className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 text-sm">
            <Shield className="h-4 w-4 text-accent" />
            <span>Secure Pay</span>
          </div>
          <div className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 text-sm">
            <TrendingUp className="h-4 w-4 text-accent" />
            <span>Top Rated</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Hidden on mobile */}
      <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-2.5 bg-muted-foreground/50 rounded-full animate-scroll" />
        </div>
      </div>
    </section>
  )
}
