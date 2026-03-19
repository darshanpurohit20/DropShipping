"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, ShoppingBag, Search, User, Heart, Sparkles, LogOut, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/cart-store"
import { CartDrawer } from "@/components/cart-drawer"
import { SearchDropdown } from "@/components/search-dropdown"
import { createClient } from "@/lib/supabase-client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navLinks = [
  { label: "New Arrivals", href: "#new-arrivals" },
  { label: "Categories", href: "#categories" },
  { label: "Best Sellers", href: "#best-sellers" },
  { label: "Deals", href: "#deals" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [cartBounce, setCartBounce] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  const { totalItems, subtotal } = useCart()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Bounce animation when items are added
  useEffect(() => {
    if (totalItems > 0) {
      setCartBounce(true)
      const timer = setTimeout(() => setCartBounce(false), 500)
      return () => clearTimeout(timer)
    }
  }, [totalItems])

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-primary text-primary-foreground py-2 text-center text-sm overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex items-center justify-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span>FREE Shipping on orders above ₹499</span>
          <span className="mx-4">|</span>
          <span>Use code <strong>FIRST100</strong> for ₹100 off!</span>
          <span className="mx-4">|</span>
          <span>Easy 7-day returns</span>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 left-0 right-0 z-40 transition-all duration-500",
          scrolled
            ? "bg-background/95 backdrop-blur-md shadow-sm py-3"
            : "bg-background py-4"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-2 group flex-shrink-0"
            >
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-lg shadow-primary/20">
                <span className="text-primary-foreground font-serif text-lg font-black">A</span>
              </div>
              <span className="font-serif text-xl sm:text-2xl font-black italic tracking-tighter hidden sm:inline">
                Arey Beta
              </span>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-md">
              <SearchDropdown className="w-full" />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Mobile Search Toggle */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden hover:bg-secondary transition-colors duration-300"
                onClick={() => setShowSearch(!showSearch)}
              >
                <Search className="h-5 w-5" />
              </Button>

              <Button variant="ghost" size="icon" className="hidden sm:flex hover:bg-secondary transition-colors duration-300 relative group">
                <Heart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  0
                </span>
              </Button>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="hidden sm:flex items-center gap-2 hover:bg-secondary transition-colors duration-300 px-2 rounded-xl border border-transparent hover:border-border">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden">
                        {user.user_metadata?.avatar_url ? (
                          <img src={user.user_metadata.avatar_url} alt="User Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex flex-col items-start leading-none text-left">
                        <span className="text-xs font-bold text-foreground truncate max-w-[80px]">
                          {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Member</span>
                      </div>
                      <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 mt-2 rounded-2xl shadow-xl border-border bg-background/95 backdrop-blur-xl animate-in slide-in-from-top-2 duration-300 p-2" align="end">
                    <DropdownMenuLabel className="px-3 py-2 flex flex-col">
                      <span className="font-bold text-sm">{user.user_metadata?.full_name || 'My Account'}</span>
                      <span className="text-[11px] text-muted-foreground">{user.email}</span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-1 bg-secondary" />
                    <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-secondary transition-colors focus:bg-secondary group">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-background transition-colors">
                        <Heart className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">My Wishlist</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-secondary transition-colors focus:bg-secondary group">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-background transition-colors">
                        <ShoppingBag className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">Order History</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1 bg-secondary" />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-red-500/10 text-red-500 transition-colors focus:bg-red-500/10 group"
                    >
                      <div className="w-8 h-8 rounded-full bg-red-500/5 flex items-center justify-center group-hover:bg-red-500/10 transition-colors">
                        <LogOut className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">Logout Account</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button variant="ghost" size="icon" className="hidden sm:flex hover:bg-secondary transition-colors duration-300">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              )}

              {/* Cart Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "relative hover:bg-secondary transition-all duration-300",
                  cartBounce && "animate-bounce"
                )}
                onClick={() => setCartOpen(true)}
              >
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs min-w-5 h-5 px-1 rounded-full flex items-center justify-center font-medium animate-in zoom-in duration-300">
                    {totalItems}
                  </span>
                )}
              </Button>

              {/* Cart Value Badge - Desktop */}
              {totalItems > 0 && (
                <div 
                  className="hidden md:flex items-center gap-2 bg-secondary/80 rounded-full px-3 py-1.5 cursor-pointer hover:bg-secondary transition-colors"
                  onClick={() => setCartOpen(true)}
                >
                  <span className="text-xs text-muted-foreground">Cart:</span>
                  <span className="text-sm font-bold">₹{subtotal}</span>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="xl:hidden"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className={cn(
            "lg:hidden overflow-hidden transition-all duration-300",
            showSearch ? "max-h-20 opacity-100 mt-4" : "max-h-0 opacity-0"
          )}>
            <SearchDropdown 
              isMobile 
              onClose={() => setShowSearch(false)} 
            />
          </div>

          {/* Mobile Navigation */}
          <div
            className={cn(
              "xl:hidden overflow-hidden transition-all duration-500 ease-in-out",
              isOpen ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"
            )}
          >
            <nav className="flex flex-col gap-2 py-4 border-t border-border">
              {navLinks.map((link, index) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-lg font-medium text-muted-foreground hover:text-foreground hover:bg-secondary px-4 py-3 rounded-xl transition-all duration-300"
                  style={{ transitionDelay: `${index * 50}ms` }}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border mt-2 px-4 italic text-sm text-foreground/70">
                {user ? (
                  <div 
                    className="flex items-center gap-3 p-3 bg-secondary/50 rounded-2xl border border-border group active:scale-[0.98] transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden">
                      {user.user_metadata?.avatar_url ? (
                        <img src={user.user_metadata.avatar_url} alt="User Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex flex-col items-start leading-none text-left flex-1 min-w-0">
                      <span className="text-sm font-bold text-foreground truncate w-full">
                        {user.user_metadata?.full_name || user.email?.split('@')[0]}
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mt-0.5">Member</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleLogout}
                      className="h-10 w-10 text-red-500 hover:bg-red-500/10 rounded-xl"
                    >
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </div>
                ) : (
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button className="w-full rounded-2xl py-6 text-base font-bold shadow-lg shadow-primary/10">
                      Sign In to Arey Beta
                    </Button>
                  </Link>
                )}
                
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button variant="outline" size="lg" className="rounded-xl border-border hover:bg-secondary">
                    <Heart className="h-4 w-4 mr-2 text-primary" />
                    Wishlist
                  </Button>
                  <Button variant="outline" size="lg" className="rounded-xl border-border hover:bg-secondary">
                    <ShoppingBag className="h-4 w-4 mr-2 text-primary" />
                    Orders
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
