"use client"

import { useState, useCallback } from "react"
import { ProductCard, type Product } from "@/components/product-card"
import { CartToast } from "@/components/cart-toast"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SlidersHorizontal, Grid3X3, LayoutGrid, ChevronDown } from "lucide-react"

const products: Product[] = [
  // Electronics
  {
    id: 1,
    name: "Premium Wireless Earbuds Pro",
    price: 799,
    originalPrice: 1499,
    image: "/images/earbuds.jpg",
    category: "Electronics",
    rating: 4.8,
    reviews: 234,
    isNew: true,
    isTrending: true
  },
  {
    id: 2,
    name: "Smart Fitness Watch Band",
    price: 999,
    originalPrice: 1999,
    image: "/images/smartwatch.jpg",
    category: "Electronics",
    rating: 4.6,
    reviews: 189,
    isTrending: true
  },
  {
    id: 3,
    name: "Premium Phone Case Matte",
    price: 349,
    originalPrice: 599,
    image: "/images/phone-case.jpg",
    category: "Electronics",
    rating: 4.7,
    reviews: 312,
    isNew: true
  },
  {
    id: 4,
    name: "Modern LED Desk Lamp",
    price: 899,
    originalPrice: 1499,
    image: "/images/desk-lamp.jpg",
    category: "Electronics",
    rating: 4.7,
    reviews: 124,
    isNew: true
  },
  // Fashion
  {
    id: 5,
    name: "Designer Sunglasses UV400",
    price: 499,
    originalPrice: 899,
    image: "/images/sunglasses.jpg",
    category: "Fashion",
    rating: 4.4,
    reviews: 98
  },
  {
    id: 6,
    name: "Minimalist Leather Wallet",
    price: 549,
    originalPrice: 899,
    image: "/images/wallet.jpg",
    category: "Fashion",
    rating: 4.6,
    reviews: 178
  },
  {
    id: 7,
    name: "Urban Laptop Backpack",
    price: 649,
    originalPrice: 999,
    image: "/images/backpack.jpg",
    category: "Fashion",
    rating: 4.5,
    reviews: 156
  },
  {
    id: 8,
    name: "Elegant Silk Scarf",
    price: 399,
    originalPrice: 699,
    image: "/images/silk-scarf.jpg",
    category: "Fashion",
    rating: 4.3,
    reviews: 87,
    isNew: true
  },
  {
    id: 9,
    name: "Premium Cotton Cap",
    price: 349,
    originalPrice: 549,
    image: "/images/cap.jpg",
    category: "Fashion",
    rating: 4.5,
    reviews: 203,
    isTrending: true
  },
  // Home
  {
    id: 10,
    name: "Velvet Cushion Covers Set",
    price: 599,
    originalPrice: 999,
    image: "/images/cushion-cover.jpg",
    category: "Home",
    rating: 4.6,
    reviews: 145,
    isTrending: true
  },
  {
    id: 11,
    name: "Insulated Steel Water Bottle",
    price: 399,
    originalPrice: 699,
    image: "/images/water-bottle.jpg",
    category: "Home",
    rating: 4.9,
    reviews: 445,
    isTrending: true
  },
  // Kitchen
  {
    id: 12,
    name: "Portable Mini Blender",
    price: 799,
    originalPrice: 1299,
    image: "/images/blender.jpg",
    category: "Kitchen",
    rating: 4.4,
    reviews: 167,
    isNew: true
  },
  {
    id: 13,
    name: "Compact Coffee Maker",
    price: 999,
    originalPrice: 1599,
    image: "/images/coffee-maker.jpg",
    category: "Kitchen",
    rating: 4.7,
    reviews: 234,
    isTrending: true
  },
  {
    id: 14,
    name: "Glass Food Container Set",
    price: 549,
    originalPrice: 899,
    image: "/images/food-container.jpg",
    category: "Kitchen",
    rating: 4.8,
    reviews: 312
  },
  // Beauty
  {
    id: 15,
    name: "Luxury Matte Lipstick Set",
    price: 449,
    originalPrice: 799,
    image: "/images/lipstick.jpg",
    category: "Beauty",
    rating: 4.5,
    reviews: 289,
    isTrending: true
  },
  {
    id: 16,
    name: "Skincare Essentials Kit",
    price: 699,
    originalPrice: 1199,
    image: "/images/skincare-set.jpg",
    category: "Beauty",
    rating: 4.6,
    reviews: 178,
    isNew: true
  },
  {
    id: 17,
    name: "Mini Perfume Eau de Toilette",
    price: 599,
    originalPrice: 999,
    image: "/images/perfume.jpg",
    category: "Beauty",
    rating: 4.4,
    reviews: 134
  },
  // Fitness
  {
    id: 18,
    name: "Premium Yoga Mat",
    price: 599,
    originalPrice: 999,
    image: "/images/yoga-mat.jpg",
    category: "Fitness",
    rating: 4.7,
    reviews: 267,
    isTrending: true
  },
  {
    id: 19,
    name: "Resistance Bands Set",
    price: 399,
    originalPrice: 699,
    image: "/images/resistance-bands.jpg",
    category: "Fitness",
    rating: 4.5,
    reviews: 198,
    isNew: true
  },
  {
    id: 20,
    name: "Neoprene Dumbbells Pair",
    price: 499,
    originalPrice: 799,
    image: "/images/dumbbell.jpg",
    category: "Fitness",
    rating: 4.6,
    reviews: 156
  }
]

// Category filters matching the image design
const categories = [
  { id: "all", label: "ALL PRODUCTS" },
  { id: "Electronics", label: "ELECTRONICS" },
  { id: "Fashion", label: "FASHION" },
  { id: "Home", label: "HOME" },
  { id: "Kitchen", label: "KITCHEN" },
  { id: "Beauty", label: "BEAUTY" },
  { id: "Fitness", label: "FITNESS" }
]

const sortOptions = ["Popular", "Newest", "Price: Low to High", "Price: High to Low", "Rating"]

export function ProductsSection() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [gridView, setGridView] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("Popular")
  const [showSort, setShowSort] = useState(false)
  const [toastProduct, setToastProduct] = useState<Product | null>(null)
  const [visibleCount, setVisibleCount] = useState(8)

  const handleAddToCart = useCallback((product: Product) => {
    setToastProduct(product)
  }, [])

  const filteredProducts = products.filter(product => {
    if (activeCategory === "all") return true
    return product.category === activeCategory
  }).sort((a, b) => {
    if (sortBy === "Newest") return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
    if (sortBy === "Price: Low to High") return a.price - b.price
    if (sortBy === "Price: High to Low") return b.price - a.price
    if (sortBy === "Rating") return b.rating - a.rating
    return b.reviews - a.reviews // Popular
  })

  const visibleProducts = filteredProducts.slice(0, visibleCount)
  const hasMore = visibleCount < filteredProducts.length

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 8, filteredProducts.length))
  }

  return (
    <section id="new-arrivals" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <p className="text-accent font-medium mb-2 animate-in fade-in slide-in-from-bottom duration-500">
            Our Collection
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4 animate-in fade-in slide-in-from-bottom duration-500 delay-100 text-balance">
            Trending Products
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom duration-500 delay-200 text-pretty">
            Discover our handpicked selection of premium products, all priced between ₹300-1000
          </p>
        </div>

        {/* Category Pills - Matching the image design */}
        <div className="mb-8 animate-in fade-in duration-500 delay-300">
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 bg-secondary/50 p-4 rounded-2xl">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id)
                  setVisibleCount(8)
                }}
                className={cn(
                  "px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-semibold rounded-full border-2 transition-all duration-300 uppercase tracking-wide",
                  activeCategory === category.id 
                    ? "bg-foreground text-background border-foreground shadow-lg scale-105" 
                    : "bg-background text-foreground border-border hover:border-foreground/50 hover:scale-105"
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort & View Controls */}
        <div className="flex items-center justify-between border-y border-border py-4 mb-8">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{filteredProducts.length}</span> products found
          </p>

          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full gap-2"
                onClick={() => setShowSort(!showSort)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">{sortBy}</span>
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform duration-300",
                  showSort && "rotate-180"
                )} />
              </Button>

              {showSort && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                  {sortOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortBy(option)
                        setShowSort(false)
                      }}
                      className={cn(
                        "w-full px-4 py-2.5 text-left text-sm hover:bg-secondary transition-colors",
                        sortBy === option && "bg-secondary font-medium"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Grid Toggle */}
            <div className="hidden sm:flex items-center gap-1 bg-secondary rounded-full p-1">
              <button
                onClick={() => setGridView("grid")}
                className={cn(
                  "p-2 rounded-full transition-all duration-300",
                  gridView === "grid" ? "bg-background shadow-sm" : "hover:bg-muted"
                )}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setGridView("list")}
                className={cn(
                  "p-2 rounded-full transition-all duration-300",
                  gridView === "list" ? "bg-background shadow-sm" : "hover:bg-muted"
                )}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className={cn(
          "grid gap-4 md:gap-6 transition-all duration-500",
          gridView === "grid" 
            ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2"
        )}>
          {visibleProducts.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              index={index} 
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No products found for this category.</p>
            <Button 
              variant="link" 
              onClick={() => setActiveCategory("all")}
              className="mt-2"
            >
              View all products
            </Button>
          </div>
        )}

        {/* Load More */}
        {hasMore && (
          <div className="text-center mt-12 animate-in fade-in duration-500">
            <Button 
              variant="outline" 
              size="lg" 
              className="rounded-full px-10 border-2 hover:bg-secondary transition-all duration-300 hover:scale-105"
              onClick={loadMore}
            >
              Load More Products ({filteredProducts.length - visibleCount} remaining)
            </Button>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      <CartToast 
        product={toastProduct} 
        onClose={() => setToastProduct(null)} 
      />
    </section>
  )
}
