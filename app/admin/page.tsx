"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"
import { 
  ShieldCheck, 
  Users, 
  ShoppingBag, 
  LayoutDashboard, 
  Loader2, 
  Package, 
  ChevronRight, 
  MoreHorizontal,
  PlusCircle,
  TrendingUp,
  CreditCard,
  UserCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [stats, setStats] = useState({ orders: 0, revenue: 0, customers: 0 })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      if (!profile?.is_admin) {
        router.push("/")
        return
      }

      setIsAdmin(true)
      fetchStats()
    }
    checkAdmin()
  }, [])

  const fetchStats = async () => {
    try {
      // 1. Fetch orders count and revenue
      const { data: orders } = await supabase.from('orders').select('total_amount')
      const orderCount = orders?.length || 0
      const revenue = orders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0

      // 2. Fetch users count
      const { data: profiles } = await supabase.from('profiles').select('id')
      const customerCount = profiles?.length || 0

      // 3. Fetch recent 5 orders
      const { data: recent } = await supabase
        .from('orders')
        .select(`
          id,
          total_amount,
          status,
          created_at,
          profiles (full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      setStats({ orders: orderCount, revenue, customers: customerCount })
      setRecentOrders(recent || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (isAdmin === null || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background/50 backdrop-blur-3xl">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Authenticating Admin Access...</p>
        </div>
      </div>
    )
  }

  const statCards = [
    { title: "Total Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
    { title: "Total Orders", value: stats.orders, icon: Package, color: "text-primary", bg: "bg-primary/10" },
    { title: "Customers", value: stats.customers, icon: Users, color: "text-accent", bg: "bg-accent/10" },
    { title: "Pending Orders", value: recentOrders.filter(o => o.status === 'pending').length, icon: CreditCard, color: "text-orange-500", bg: "bg-orange-500/10" },
  ]

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="h-3 w-3" />
            Admin Dashboard
          </div>
          <h1 className="font-serif text-3xl font-bold">Welcome back, Admin</h1>
          <p className="text-muted-foreground">Here is what's happening today at Arey Beta.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl border-border hover:bg-secondary">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Product
          </Button>
          <Button className="rounded-xl shadow-lg shadow-primary/20">
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <Card key={i} className="rounded-3xl border-border/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={cn("p-3 rounded-2xl", stat.bg)}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
                <MoreHorizontal className="h-4 w-4 text-muted-foreground cursor-pointer" />
              </div>
              <div className="mt-4 space-y-1">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <Card className="lg:col-span-2 rounded-3xl border-border/50 shadow-lg shadow-primary/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-serif text-xl">Recent Orders</CardTitle>
              <CardDescription>Latest orders from your customers.</CardDescription>
            </div>
            <Button variant="ghost" className="text-sm text-primary hover:bg-primary/5 group">
              View All <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border text-muted-foreground text-sm">
                    <th className="pb-3 px-2 font-medium">Order ID</th>
                    <th className="pb-3 px-2 font-medium">Customer</th>
                    <th className="pb-3 px-2 font-medium text-center">Status</th>
                    <th className="pb-3 px-2 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="group hover:bg-secondary/30 transition-colors">
                      <td className="py-4 px-2 text-sm font-mono truncate max-w-[100px]">#{order.id.slice(0, 8)}</td>
                      <td className="py-4 px-2 text-sm font-medium">{order.profiles?.full_name || "Guest"}</td>
                      <td className="py-4 px-2 text-center">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                          order.status === 'pending' ? "bg-orange-500/10 text-orange-600" : "bg-green-500/10 text-green-600"
                        )}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-sm font-bold text-right">₹{order.total_amount?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* System Health / Quick Info */}
        <div className="space-y-8">
          <Card className="rounded-3xl border-border/50 bg-primary/95 text-primary-foreground shadow-2xl shadow-primary/20">
            <CardHeader>
              <CardTitle className="font-serif text-xl">Inventory Quick Link</CardTitle>
              <CardDescription className="text-primary-foreground/70">Manage your listings across stores.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-background text-primary hover:bg-background/90 rounded-2xl py-6 font-bold">
                Open Product Manager
              </Button>
              <div className="flex items-center gap-2 text-xs font-medium justify-center text-primary-foreground/80">
                <ShieldCheck className="h-3 w-3" />
                Verified Admin Session
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/50">
            <CardHeader>
              <CardTitle className="font-serif text-xl">Top Selling Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Electronics", val: 85 },
                { name: "Watches", val: 65 },
                { name: "Accessories", val: 45 }
              ].map((cat, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-muted-foreground">{cat.val}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${cat.val}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
