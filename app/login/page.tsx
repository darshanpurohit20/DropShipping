"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowRight, 
  ShoppingBag,
  Check,
  Sparkles,
  Loader2
} from "lucide-react"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isMagicLinkLoading, setIsMagicLinkLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const supabase = createClient()

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        window.location.href = "/"
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        })
        if (error) throw error
        setMessage({ type: 'success', text: "Check your email to confirm your account!" })
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    }
  }

  const handleMagicLink = async () => {
    if (!email) {
      setMessage({ type: 'error', text: "Please enter your email first" })
      return
    }
    setIsMagicLinkLoading(true)
    setMessage(null)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      })
      if (error) throw error
      setMessage({ type: 'success', text: "Magic link sent! Check your inbox." })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setIsMagicLinkLoading(false)
    }
  }

  const benefits = [
    "Track your orders in real-time",
    "Save items to your wishlist",
    "Get personalized recommendations",
    "Exclusive member-only deals"
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Image & Benefits */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <ShoppingBag className="h-5 w-5 text-background" />
            </div>
            <span className="font-serif text-2xl font-black italic tracking-tighter">Arey Beta</span>
          </Link>

          {/* Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium animate-pulse">
                <Sparkles className="h-4 w-4" />
                Welcome to Arey Beta
              </div>
              <h1 className="font-serif text-4xl xl:text-5xl font-bold leading-tight text-balance">
                Shop Smarter,<br />
                <span className="text-accent">Live Better</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-md text-pretty">
                Join millions of happy customers who save money and time with our curated collection of premium products.
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div 
                  key={benefit}
                  className="flex items-center gap-3 animate-in fade-in slide-in-from-left duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3.5 w-3.5 text-accent" />
                  </div>
                  <span className="text-foreground/80">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Featured Products Preview */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {["/images/earbuds.jpg", "/images/smartwatch.jpg", "/images/backpack.jpg", "/images/sunglasses.jpg"].map((img, i) => (
                  <div 
                    key={img} 
                    className="w-12 h-12 rounded-full border-2 border-background overflow-hidden relative animate-in fade-in zoom-in duration-300"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <Image
                      src={img}
                      alt="Product"
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <p className="font-medium">10,000+ Products</p>
                <p className="text-muted-foreground">From trusted sellers</p>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center gap-6 text-muted-foreground text-sm">
            <span>Secure Payments</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span>Easy Returns</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span>24/7 Support</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-background" />
              </div>
              <span className="font-serif text-2xl font-black italic tracking-tighter">Arey Beta</span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left">
            <h2 className="font-serif text-3xl font-bold mb-2">
              {isLogin ? "Welcome back!" : "Create account"}
            </h2>
            <p className="text-muted-foreground">
              {isLogin 
                ? "Sign in to access your account and orders" 
                : "Join us and start shopping today"}
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex bg-secondary rounded-xl p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={cn(
                "flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300",
                isLogin 
                  ? "bg-background shadow-sm text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={cn(
                "flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300",
                !isLogin 
                  ? "bg-background shadow-sm text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Sign Up
            </button>
          </div>

          {/* Messages */}
          {message && (
            <div className={cn(
              "p-4 rounded-xl text-sm animate-in fade-in slide-in-from-top-2",
              message.type === 'success' ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-red-500/10 text-red-600 dark:text-red-400"
            )}>
              {message.text}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleEmailAuth} className="space-y-5">
            {/* Name Field (Sign Up only) */}
            {!isLogin && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top duration-300">
                <label className="text-sm font-medium">Full Name</label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-4 pr-4 py-6 rounded-xl border-2 focus:border-accent transition-colors"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 pr-4 py-6 rounded-xl border-2 focus:border-accent transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Password</label>
                {isLogin && (
                  <Link 
                    href="/forgot-password" 
                    className="text-sm text-accent hover:underline"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 py-6 rounded-xl border-2 focus:border-accent transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Terms Checkbox (Sign Up only) */}
            {!isLogin && (
              <div className="flex items-start gap-3 animate-in fade-in slide-in-from-top duration-300">
                <button
                  type="button"
                  onClick={() => setAgreedToTerms(!agreedToTerms)}
                  className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200",
                    agreedToTerms 
                      ? "bg-accent border-accent" 
                      : "border-border hover:border-accent"
                  )}
                >
                  {agreedToTerms && <Check className="h-3 w-3 text-white" />}
                </button>
                <span className="text-sm text-muted-foreground">
                  I agree to the{" "}
                  <Link href="/terms" className="text-accent hover:underline">Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="text-accent hover:underline">Privacy Policy</Link>
                </span>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || (!isLogin && !agreedToTerms)}
              className="w-full py-6 rounded-xl text-base font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{isLogin ? "Signing in..." : "Creating account..."}</span>
                </div>
              ) : (
                <span className="flex items-center gap-2">
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="h-5 w-5" />
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              className="py-6 rounded-xl border-2 hover:bg-secondary transition-all duration-300"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleMagicLink}
              disabled={isMagicLinkLoading}
              className="py-6 rounded-xl border-2 hover:bg-secondary transition-all duration-300"
            >
              {isMagicLinkLoading ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-5 w-5 mr-2" />
              )}
              Magic Link
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? (
              <>
                New to Arey Beta?{" "}
                <button 
                  onClick={() => setIsLogin(false)} 
                  className="text-accent font-medium hover:underline"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button 
                  onClick={() => setIsLogin(true)} 
                  className="text-accent font-medium hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>

          {/* Back to Home */}
          <div className="text-center">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              Back to shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
