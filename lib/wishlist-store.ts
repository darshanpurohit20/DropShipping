"use client"

import useSWR, { mutate } from "swr"
import { createClient } from "./supabase-client"

const WISHLIST_KEY = "user-wishlist"
const supabase = createClient()

export function useWishlist() {
  const { data: items = [], mutate: mutateWishlist } = useSWR<string[]>(WISHLIST_KEY, async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('product_id')
        .eq('user_id', user.id)
      
      if (!error && data) {
        return data.map(item => item.product_id)
      }
    }
    
    // Fallback to local storage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(WISHLIST_KEY)
      return saved ? JSON.parse(saved) : []
    }
    return []
  }, {
    fallbackData: []
  })

  const toggleWishlist = async (productId: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    const isLiked = items.includes(productId)
    let newItems: string[] = []

    if (isLiked) {
      newItems = items.filter(id => id !== productId)
      if (user) {
        await supabase.from('wishlist_items').delete().eq('user_id', user.id).eq('product_id', productId)
      }
    } else {
      newItems = [...items, productId]
      if (user) {
        await supabase.from('wishlist_items').insert({ user_id: user.id, product_id: productId })
      }
    }

    if (!user) {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(newItems))
    }
    
    mutateWishlist(newItems)
  }

  return {
    items,
    toggleWishlist,
    isWishlisted: (productId: string) => items.includes(productId)
  }
}
