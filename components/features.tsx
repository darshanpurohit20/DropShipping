"use client"

import { Truck, Shield, RotateCcw, Headphones } from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders above ₹499",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% secure checkout",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "7-day easy returns",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Always here to help",
  },
]

export function Features() {
  return (
    <section className="py-8 md:py-16 border-y border-border bg-secondary/20">
      <div className="container mx-auto px-4">
        {/* Mobile: Horizontal scroll */}
        <div className="flex md:hidden gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className={cn(
                  "flex-shrink-0 snap-center",
                  "flex items-center gap-3 bg-card rounded-2xl border border-border p-4",
                  "min-w-[200px] animate-in fade-in slide-in-from-right duration-500"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="group text-center animate-in fade-in slide-in-from-bottom duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-card border border-border shadow-sm mb-4 transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 group-hover:bg-primary group-hover:border-primary">
                  <Icon className="h-7 w-7 text-muted-foreground transition-colors duration-300 group-hover:text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
