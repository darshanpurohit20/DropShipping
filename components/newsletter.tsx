"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Gift, CheckCircle2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsLoading(false)
      setIsSubmitted(true)
      setEmail("")
    }
  }

  return (
    <section className="py-16 md:py-24 pb-24 md:pb-24">
      <div className="container mx-auto px-4">
        <div className="relative bg-card rounded-2xl md:rounded-[2.5rem] border border-border p-6 sm:p-8 md:p-16 overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 md:w-72 h-48 md:h-72 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-14 md:w-16 h-14 md:h-16 rounded-xl md:rounded-2xl bg-accent/10 mb-4 md:mb-6 animate-in zoom-in duration-500">
              <Gift className="h-7 md:h-8 w-7 md:w-8 text-accent" />
            </div>

            {/* Content */}
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 animate-in fade-in slide-in-from-bottom duration-500 delay-100 text-balance">
              Get ₹100 Off Your First Order
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 animate-in fade-in slide-in-from-bottom duration-500 delay-200 text-pretty">
              Subscribe to our newsletter and unlock exclusive deals, early access to new arrivals, and insider offers!
            </p>

            {/* Form */}
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto animate-in fade-in slide-in-from-bottom duration-500 delay-300">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-12 md:h-14 rounded-full border-2 focus:border-accent transition-colors duration-300"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={isLoading}
                  className={cn(
                    "h-12 md:h-14 px-6 md:px-8 rounded-full transition-all duration-300",
                    "bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-lg"
                  )}
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </form>
            ) : (
              <div className="flex flex-col items-center gap-4 text-green-600 animate-in zoom-in duration-500">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div>
                  <p className="font-medium text-lg">You&apos;re all set!</p>
                  <p className="text-sm text-muted-foreground">Check your email for the discount code.</p>
                </div>
              </div>
            )}

            {/* Trust Text */}
            <p className="text-xs text-muted-foreground mt-4 md:mt-6 animate-in fade-in duration-500 delay-400">
              No spam, unsubscribe anytime. By subscribing, you agree to our Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
