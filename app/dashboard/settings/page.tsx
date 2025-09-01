"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Moon, Sun, Monitor, Bell, Shield, Globe, Save } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const [theme, setTheme] = useState("system")
  const [notifications, setNotifications] = useState({
    transfers: true,
    workshops: true,
    system: false,
    email: true,
  })
  const [language, setLanguage] = useState("uz")
  const [autoLogout, setAutoLogout] = useState("30")

  const handleSaveSettings = () => {
    // Here you would save settings to backend
    toast({
      title: "Muvaffaqiyat",
      description: "Sozlamalar saqlandi",
    })
  }

  const themeOptions = [
    { value: "light", label: "Yorug'", icon: Sun },
    { value: "dark", label: "Qorong'u", icon: Moon },
    { value: "system", label: "Tizim", icon: Monitor },
  ]

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sozlamalar</h1>
        <p className="text-muted-foreground">Tizim sozlamalarini boshqaring</p>
      </div>

      <div className="grid gap-6">
        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              Ko'rinish
            </CardTitle>
            <CardDescription>Tizim ko'rinishini sozlang</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Mavzu</Label>
              <div className="grid grid-cols-3 gap-3">
                {themeOptions.map((option) => {
                  const Icon = option.icon
                  return (
                    <Button
                      key={option.value}
                      variant={theme === option.value ? "default" : "outline"}
                      className="flex flex-col gap-2 h-auto p-4"
                      onClick={() => setTheme(option.value)}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm">{option.label}</span>
                    </Button>
                  )
                })}
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Til</Label>
                <p className="text-sm text-muted-foreground">Tizim tilini tanlang</p>
              </div>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uz">O'zbekcha</SelectItem>
                  <SelectItem value="ru">Русский</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Bildirishnomalar
            </CardTitle>
            <CardDescription>Qaysi bildirishnomalarni olishni sozlang</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Transfer bildirish</Label>
                  <p className="text-sm text-muted-foreground">Yangi transferlar haqida xabar olish</p>
                </div>
                <Switch
                  checked={notifications.transfers}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, transfers: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Atolye holati</Label>
                  <p className="text-sm text-muted-foreground">Atolye holati o'zgarishi haqida</p>
                </div>
                <Switch
                  checked={notifications.workshops}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, workshops: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Tizim xabarlari</Label>
                  <p className="text-sm text-muted-foreground">Tizim yangilanishlari va xatoliklar</p>
                </div>
                <Switch
                  checked={notifications.system}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, system: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Email bildirishnomalar</Label>
                  <p className="text-sm text-muted-foreground">Muhim xabarlarni emailga yuborish</p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Xavfsizlik
            </CardTitle>
            <CardDescription>Hisobingiz xavfsizligini sozlang</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Avtomatik chiqish</Label>
                <p className="text-sm text-muted-foreground">Faolsizlik vaqtidan keyin avtomatik chiqish</p>
              </div>
              <Select value={autoLogout} onValueChange={setAutoLogout}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 daqiqa</SelectItem>
                  <SelectItem value="30">30 daqiqa</SelectItem>
                  <SelectItem value="60">1 soat</SelectItem>
                  <SelectItem value="120">2 soat</SelectItem>
                  <SelectItem value="0">O'chirish</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Parolni o'zgartirish</Label>
              <div className="grid gap-3">
                <Input type="password" placeholder="Joriy parol" />
                <Input type="password" placeholder="Yangi parol" />
                <Input type="password" placeholder="Yangi parolni tasdiqlang" />
                <Button variant="outline" className="w-fit bg-transparent">
                  Parolni yangilash
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Tizim ma'lumotlari
            </CardTitle>
            <CardDescription>Tizim versiyasi va ma'lumotlar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Versiya</Label>
                <Badge variant="secondary">v1.0.0</Badge>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium">Oxirgi yangilanish</Label>
                <p className="text-sm text-muted-foreground">2024-01-20</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium">Foydalanuvchilar soni</Label>
                <p className="text-sm text-muted-foreground">12 ta</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium">Faol atolyeler</Label>
                <p className="text-sm text-muted-foreground">8 ta</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Sozlamalarni saqlash
          </Button>
        </div>
      </div>
    </div>
  )
}
