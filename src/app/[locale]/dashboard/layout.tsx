"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"

import { Button } from "@/src/components/ui/button"
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/src/components/ui/sheet"
import { Home, Factory, ArrowLeftRight, Bell, Settings, Users, Menu, LogOut, ShoppingBag, Package } from "lucide-react"
import { Toaster } from "@/src/components/ui/toaster"
import { cn } from "@/src/lib/utils"
import { usePathname } from "@/src/i18n/routing"
import { useRouter } from "@/src/i18n/routing"
import { LanguageSwitcher } from "@/src/components/language-switcher"

import useAuth from "@/src/hooks/auth"

import { Link } from "@/src/i18n/routing"
import { getCurrentUser } from "@/src/lib/auth"
import type { User } from "@/src/types/user"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations("Navigation")
  const tAuth = useTranslations("Auth")
  const tCommon = useTranslations("Common")

  const unreadCount = 3

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  const userType = user?.organization?.type

  const navigation = [
    { name: t("dashboard"), href: "/dashboard", icon: Home },
    { name: t("materials"), href: "/dashboard/materials", icon: Package, types: ["bank"] },
    { name: t("inventory"), href: "/dashboard/inventory", icon: ShoppingBag },
    { name: t("workshops"), href: "/dashboard/workshops", icon: Factory, types: ["bank"] },
    { name: t("transfers"), href: "/dashboard/transfers", icon: ArrowLeftRight },
    // { name: t('notifications'), href: "/dashboard/notifications", icon: Bell, types: ["bank"] },
    // { name: t('history'), href: "/dashboard/history", icon: History, types: ["bank"] },
    { name: t("users"), href: "/dashboard/users", icon: Users, types: ["bank"] },
    { name: t("processes"), href: "/dashboard/processes", icon: Settings },
    // { name: t('settings'), href: "/dashboard/settings", icon: Settings, types: ["bank"] },
  ]

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  const filteredNavigation = navigation.filter((item) => !item.types || (userType && item.types.includes(userType)))

  useAuth()

  const handleLogout = () => {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("user")

    router.push("/login")
  }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn("flex flex-col h-full", mobile ? "w-full" : "w-64")}>
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-4 border-b">
        <div className="h-14 w-14">
          <img src="/logo.jpg" alt="logo" />
          {/* <Gem className="h-6 w-6 text-primary" /> */}
        </div>
        <div>
          <h2 className="font-bold text-lg">FergaGold</h2>
          <p className="text-xs text-muted-foreground">
            {user ? `${user.organization.name}(${user.organization.type})` : tCommon("loading")}{" "}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {filteredNavigation.map((item) => {
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
              <LanguageSwitcher />

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
                      {/* <AvatarImage src="/admin-avatar.png" alt="Admin" /> */}
                      <AvatarFallback>FG</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.username || user?.first_name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {/* <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t('settings')}</span>
                  </DropdownMenuItem> */}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 hover:text-red-600" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4 text-red-600" />
                    <span className="">{tAuth("logout")}</span>
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
