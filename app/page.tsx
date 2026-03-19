"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Categories } from "@/components/categories"
import { ProductsSection } from "@/components/products-section"
import { DealsBanner } from "@/components/deals-banner"
import { Testimonials } from "@/components/testimonials"
import { Newsletter } from "@/components/newsletter"
import { Footer } from "@/components/footer"
import { MobileCartBar } from "@/components/mobile-cart-bar"
import { CartDrawer } from "@/components/cart-drawer"

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <Categories />
      <ProductsSection />
      <DealsBanner />
      <Testimonials />
      <Newsletter />
      <Footer />
      
      {/* Mobile Cart Bar */}
      <MobileCartBar onOpenCart={() => setCartOpen(true)} />
      
      {/* Cart Drawer (for mobile bar) */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </main>
  )
}
