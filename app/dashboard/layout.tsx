"use client"

import type React from "react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Home, Factory, ArrowLeftRight, Bell, History, Settings, Users, Menu, LogOut, Gem, ShoppingBag, Package } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"

import useAuth from "@/hooks/auth"

import Link from "next/link"
// import { useGetNotificationsQuery } from "@/lib/api/jewelryApi"

 const user = typeof window !== "undefined" 
    ? JSON.parse(localStorage.getItem("user") || "{}") 
    : null

  const userType = user?.organization?.type

  const navigation = [
    { name: "Bosh sahifa", href: "/dashboard", icon: Home, types: ["bank", "gold_processing","silver_processing", "jewelry_making", "cleaning", "repair"] },
    { name: "Materiallar", href: "/dashboard/materials", icon: Package, types: ["bank"] },
    { name: "Inventar", href: "/dashboard/inventory", icon: ShoppingBag, types: ["bank",  "gold_processing","silver_processing", "jewelry_making", "cleaning", "repair"] },
    { name: "Atolyeler", href: "/dashboard/workshops", icon: Factory, types: ["bank"] },
    { name: "Transferlar", href: "/dashboard/transfers", icon: ArrowLeftRight, types: ["bank",  "gold_processing","silver_processing", "jewelry_making", "cleaning", "repair"]  },
    // { name: "Bildirishnomalar", href: "/dashboard/notifications", icon: Bell, types: ["bank"] },
    // { name: "Tarix", href: "/dashboard/history", icon: History, types: ["bank"] },
    { name: "Foydalanuvchilar", href: "/dashboard/users", icon: Users, types: ["bank"] },
    // { name: "Sozlamalar", href: "/dashboard/settings", icon: Settings, types: ["bank"] },
  ]

   const filteredNavigation = navigation.filter(
    (item) => !item.types || item.types.includes(userType)
  )

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  useAuth();

  const router = useRouter()
  // const { data: notifications = [] } = useGetNotificationsQuery()
  // const unreadCount = notifications.filter((n) => !n.isRead).length
  const unreadCount = 3 // Mock unread count

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn("flex flex-col h-full", mobile ? "w-full" : "w-64")}>
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-4 border-b">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Gem className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="font-bold text-lg">Zargarlik</h2>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
              onClick={() => mobile && setSidebarOpen(false)}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
              {item.href === "/dashboard/notifications" && unreadCount > 0 && (
                <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                  {unreadCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-card border-r">
          <Sidebar />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <div className="bg-card h-full">
            <Sidebar mobile />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                  <div className="bg-card h-full">
                    <Sidebar mobile />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative" asChild>
                <Link href="/dashboard/notifications">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/admin-avatar.png" alt="Admin" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Admin</p>
                      <p className="text-xs leading-none text-muted-foreground">admin@jewelry.com</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Sozlamalar</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 hover:text-red-600" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4 text-red-600" />
                    <span className="">Chiqish</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">{children}</main>
      </div>

      <Toaster />
    </div>
  )
}
