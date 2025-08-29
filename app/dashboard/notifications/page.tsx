"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bell,
  Search,
  CheckCircle,
  AlertTriangle,
  Info,
  ArrowLeftRight,
  Factory,
  Clock,
  MoreHorizontal,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock notifications data
const notifications = [
  {
    id: "1",
    type: "transfer_pending",
    title: "Yangi transfer kutilmoqda",
    message: "Atolye-1 dan Atolye-2 ga 180gr Kumush transferi qabul qilish kutilmoqda",
    timestamp: "2024-01-25 16:30",
    isRead: false,
    priority: "high",
    relatedId: "T002",
  },
  {
    id: "2",
    type: "workshop_timeout",
    title: "Atolye ish vaqti tugadi",
    message: "Atolye-3 da ish vaqti tugadi, materiallar qaytarilmoqda",
    timestamp: "2024-01-25 15:45",
    isRead: false,
    priority: "medium",
    relatedId: "W003",
  },
  {
    id: "3",
    type: "transfer_confirmed",
    title: "Transfer tasdiqlandi",
    message: "Safe dan Atolye-1 ga 250gr Oltin transferi muvaffaqiyatli yakunlandi",
    timestamp: "2024-01-25 09:45",
    isRead: true,
    priority: "low",
    relatedId: "T001",
  },
  {
    id: "4",
    type: "material_loss",
    title: "Material yo'qotish xabarnomasi",
    message: "Atolye-2 da tozalash jarayonida 20gr Kumush yo'qotildi",
    timestamp: "2024-01-24 18:20",
    isRead: true,
    priority: "medium",
    relatedId: "T004",
  },
  {
    id: "5",
    type: "workshop_status",
    title: "Atolye holati o'zgartirildi",
    message: "Atolye-4 holati 'Faol' ga o'zgartirildi",
    timestamp: "2024-01-24 14:15",
    isRead: true,
    priority: "low",
    relatedId: "W004",
  },
]

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "transfer_pending":
      return <Clock className="h-4 w-4 text-yellow-600" />
    case "transfer_confirmed":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "workshop_timeout":
      return <AlertTriangle className="h-4 w-4 text-red-600" />
    case "material_loss":
      return <AlertTriangle className="h-4 w-4 text-orange-600" />
    case "workshop_status":
      return <Factory className="h-4 w-4 text-blue-600" />
    default:
      return <Info className="h-4 w-4 text-gray-600" />
  }
}

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return <Badge variant="destructive">Yuqori</Badge>
    case "medium":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">O'rta</Badge>
    case "low":
      return <Badge variant="secondary">Past</Badge>
    default:
      return <Badge variant="secondary">Noma'lum</Badge>
  }
}

export default function NotificationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || notification.type === typeFilter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "unread" && !notification.isRead) ||
      (statusFilter === "read" && notification.isRead)

    return matchesSearch && matchesType && matchesStatus
  })

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const handleMarkAsRead = (id: string) => {
    // TODO: Implement mark as read logic
    console.log("Marking as read:", id)
  }

  const handleMarkAllAsRead = () => {
    // TODO: Implement mark all as read logic
    console.log("Marking all as read")
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Bildirishnomalar</h1>
          <p className="text-muted-foreground">
            Tizim xabarlari va muhim hodisalar {unreadCount > 0 && `(${unreadCount} ta o'qilmagan)`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Barchasini o'qilgan deb belgilash
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami bildirishnomalar</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">O'qilmagan</CardTitle>
            <div className="h-2 w-2 bg-red-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yuqori muhimlik</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.filter((n) => n.priority === "high").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bugungi xabarlar</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {notifications.filter((n) => n.timestamp.startsWith("2024-01-25")).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Bildirishnomalar ro'yxati</CardTitle>
          <CardDescription>Barcha tizim xabarlari va hodisalar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Xabar mazmuni bo'yicha qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tur bo'yicha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barchasi</SelectItem>
                <SelectItem value="transfer_pending">Transfer kutilmoqda</SelectItem>
                <SelectItem value="transfer_confirmed">Transfer tasdiqlandi</SelectItem>
                <SelectItem value="workshop_timeout">Atolye vaqti tugadi</SelectItem>
                <SelectItem value="material_loss">Material yo'qotish</SelectItem>
                <SelectItem value="workshop_status">Atolye holati</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Holat bo'yicha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barchasi</SelectItem>
                <SelectItem value="unread">O'qilmagan</SelectItem>
                <SelectItem value="read">O'qilgan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-colors ${
                  notification.isRead ? "bg-background" : "bg-muted/50 border-primary/20"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-medium ${!notification.isRead ? "font-semibold" : ""}`}>
                            {notification.title}
                          </h3>
                          {!notification.isRead && <div className="h-2 w-2 bg-primary rounded-full" />}
                        </div>
                        <p className="text-sm text-muted-foreground text-pretty">{notification.message}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-muted-foreground font-mono">{notification.timestamp}</span>
                          {getPriorityBadge(notification.priority)}
                          {notification.relatedId && (
                            <Badge variant="outline" className="text-xs">
                              {notification.relatedId}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!notification.isRead && (
                            <DropdownMenuItem onClick={() => handleMarkAsRead(notification.id)}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              O'qilgan deb belgilash
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <ArrowLeftRight className="h-4 w-4 mr-2" />
                            Bog'liq sahifaga o'tish
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredNotifications.length === 0 && (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Bildirishnomalar topilmadi</h3>
                <p className="text-muted-foreground">Qidiruv shartlariga mos bildirishnomalar mavjud emas.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
