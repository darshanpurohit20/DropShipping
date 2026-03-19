"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Search, X, TrendingUp, Clock, ArrowRight, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { allProducts, type SearchProduct } from "@/lib/search-store"
import { useCart } from "@/lib/cart-store"

// Search functions defined outside component to maintain stable references
function searchProducts(searchTerm: string): SearchProduct[] {
  if (!searchTerm.trim()) return []
  const term = searchTerm.toLowerCase().trim()
  return allProducts.filter(product => 
    product.name.toLowerCase().includes(term) ||
    product.category.toLowerCase().includes(term)
  ).sort((a, b) => {
    const aNameMatch = a.name.toLowerCase().startsWith(term) ? 2 : a.name.toLowerCase().includes(term) ? 1 : 0
    const bNameMatch = b.name.toLowerCase().startsWith(term) ? 2 : b.name.toLowerCase().includes(term) ? 1 : 0
    return bNameMatch - aNameMatch
  })
}

function getSuggestions(searchTerm: string): string[] {
  if (!searchTerm.trim()) return []
  const term = searchTerm.toLowerCase().trim()
  const suggestionSet: Set<string> = new Set()
  allProducts.forEach(product => {
    if (product.name.toLowerCase().includes(term)) suggestionSet.add(product.name)
    if (product.category.toLowerCase().includes(term)) suggestionSet.add(product.category)
  })
  return Array.from(suggestionSet).slice(0, 5)
}

interface SearchDropdownProps {
  className?: string
  onClose?: () => void
  isMobile?: boolean
}

export function SearchDropdown({ className, onClose, isMobile }: SearchDropdownProps) {
  const [inputValue, setInputValue] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<SearchProduct[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { addItem } = useCart()
  
  const trendingSearches = ["Earbuds", "Smartwatch", "Backpack", "Wallet", "Sunglasses"]

  const addToRecentSearches = (term: string) => {
    if (term.trim()) {
      setRecentSearches(prev => {
        if (prev.includes(term.trim())) return prev
        return [term.trim(), ...prev.slice(0, 4)]
      })
    }
  }

  // Search as user types
  useEffect(() => {
    if (inputValue.trim()) {
      setResults(searchProducts(inputValue))
      setSuggestions(getSuggestions(inputValue))
    } else {
      setResults([])
      setSuggestions([])
    }
  }, [inputValue])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (term: string) => {
    setInputValue(term)
    addToRecentSearches(term)
    const searchResults = searchProducts(term)
    setResults(searchResults)
  }

  const handleAddToCart = (product: SearchProduct) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image
    })
  }

  const clearSearch = () => {
    setInputValue("")
    setResults([])
    setSuggestions([])
    inputRef.current?.focus()
  }

  const trendingList = trendingSearches

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search for products..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className={cn(
            "pl-10 pr-10 rounded-full border-border bg-secondary/50 focus:bg-background transition-all duration-300",
            isOpen && "ring-2 ring-accent/50"
          )}
        />
        {inputValue && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className={cn(
          "absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200",
          isMobile ? "max-h-[70vh]" : "max-h-[500px]"
        )}>
          {/* Search Results */}
          {results.length > 0 ? (
            <div className="p-2">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {results.length} Results found
                </span>
                {inputValue && (
                  <button
                    onClick={() => {
                      addToRecentSearches(inputValue)
                      setIsOpen(false)
                      onClose?.()
                    }}
                    className="text-xs text-accent hover:underline flex items-center gap-1"
                  >
                    View all <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </div>
              
              <div className="max-h-[350px] overflow-y-auto">
                {results.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/80 transition-all duration-200 cursor-pointer group animate-in fade-in slide-in-from-top-1"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Product Image */}
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate group-hover:text-accent transition-colors">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-accent font-bold text-sm">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-muted-foreground text-xs line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-muted-foreground">{product.rating}</span>
                        <span className="text-xs text-muted-foreground">({product.reviews})</span>
                      </div>
                    </div>

                    {/* Add to Cart */}
                    <Button
                      size="sm"
                      variant="secondary"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full text-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAddToCart(product)
                      }}
                    >
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : inputValue.trim() ? (
            // No Results
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-2">No products found for "{inputValue}"</p>
              <p className="text-xs text-muted-foreground">Try searching for something else</p>
            </div>
          ) : (
            // Initial State - Trending & Recent
            <div className="p-4">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 px-1 mb-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Recent Searches
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSearch(term)}
                        className="px-3 py-1.5 bg-secondary text-sm rounded-full hover:bg-secondary/80 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              <div>
                <div className="flex items-center gap-2 px-1 mb-2">
                  <TrendingUp className="h-4 w-4 text-accent" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Trending Searches
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingList.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSearch(term)}
                      className="px-3 py-1.5 bg-accent/10 text-accent text-sm rounded-full hover:bg-accent/20 transition-colors flex items-center gap-1"
                    >
                      <TrendingUp className="h-3 w-3" />
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1">
                    Suggestions
                  </span>
                  <div className="mt-2 space-y-1">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => handleSearch(suggestion)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-secondary transition-colors flex items-center gap-2"
                      >
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{suggestion}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
