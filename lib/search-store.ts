"use client"

import { useCallback } from "react"
import useSWR, { mutate } from "swr"

export interface SearchProduct {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviews: number
  isNew?: boolean
  isTrending?: boolean
}

// All products database for search - expanded with more categories
export const allProducts: SearchProduct[] = [
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

const SEARCH_KEY = "search-query"

let searchQuery = ""
let recentSearches: string[] = []

const searchFetcher = () => searchQuery

export function useSearch() {
  const { data: query = "" } = useSWR<string>(SEARCH_KEY, searchFetcher, {
    fallbackData: ""
  })

  const setSearchQuery = (newQuery: string) => {
    searchQuery = newQuery
    mutate(SEARCH_KEY, searchQuery, false)
  }

  const addToRecentSearches = (term: string) => {
    if (term.trim() && !recentSearches.includes(term.trim())) {
      recentSearches = [term.trim(), ...recentSearches.slice(0, 4)]
    }
  }

  const clearRecentSearches = () => {
    recentSearches = []
  }

  const searchProducts = useCallback((searchTerm: string): SearchProduct[] => {
    if (!searchTerm.trim()) return []
    
    const term = searchTerm.toLowerCase().trim()
    
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
    ).sort((a, b) => {
      // Prioritize exact matches in name
      const aNameMatch = a.name.toLowerCase().startsWith(term) ? 2 : a.name.toLowerCase().includes(term) ? 1 : 0
      const bNameMatch = b.name.toLowerCase().startsWith(term) ? 2 : b.name.toLowerCase().includes(term) ? 1 : 0
      return bNameMatch - aNameMatch
    })
  }, [])

  const getSuggestions = useCallback((searchTerm: string): string[] => {
    if (!searchTerm.trim()) return []
    
    const term = searchTerm.toLowerCase().trim()
    const suggestions: Set<string> = new Set()
    
    // Add matching product names
    allProducts.forEach(product => {
      if (product.name.toLowerCase().includes(term)) {
        suggestions.add(product.name)
      }
      if (product.category.toLowerCase().includes(term)) {
        suggestions.add(product.category)
      }
    })
    
    return Array.from(suggestions).slice(0, 5)
  }, [])

  const getTrendingSearches = useCallback((): string[] => {
    return ["Earbuds", "Smartwatch", "Backpack", "Wallet", "Sunglasses"]
  }, [])

  return {
    query,
    setSearchQuery,
    searchProducts,
    getSuggestions,
    recentSearches,
    addToRecentSearches,
    clearRecentSearches,
    getTrendingSearches
  }
}
