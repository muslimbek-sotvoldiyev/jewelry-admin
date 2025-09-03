"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Clock, User, Mail, Phone, Calendar, Activity, History, Loader2 } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useGetOrganizationByIdQuery, useUpdateOrganizationMutation } from "@/lib/service/atolyeApi"

// Mock material history - this would come from a separate API endpoint
const materialHistory = [
  {
    id: "1",
    date: "2024-01-25 09:30",
    action: "Qabul qilindi",
    material: "250gr Oltin",
    from: "Safe",
    status: "received",
  },
  {
    id: "2",
    date: "2024-01-24 16:45",
    action: "Yuborildi",
    material: "180gr Kumush",
    to: "Atolye-2",
    status: "sent",
  },
  {
    id: "3",
    date: "2024-01-24 14:20",
    action: "Qayta ishlandi",
    material: "200gr Kumush → 180gr Kumush",
    note: "20gr yo'qotish tozalash jarayonida",
    status: "processed",
  },
]

export default function WorkshopDetailPage() {
  const params = useParams()
  const { toast } = useToast()
  const workshopId = params.id as string

  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [statusNote, setStatusNote] = useState("")

  // API hooks
  const { data: workshop, isLoading, error, refetch } = useGetOrganizationByIdQuery(workshopId)
  const [updateOrganization, { isLoading: isUpdating }] = useUpdateOrganizationMutation()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Faol</Badge>
      case "busy":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Band</Badge>
      case "stopped":
        return <Badge variant="destructive">To'xtatilgan</Badge>
      default:
        return <Badge variant="secondary">Noma'lum</Badge>
    }
  }

  const getActionBadge = (status: string) => {
    switch (status) {
      case "received":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Qabul</Badge>
      case "sent":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Yuborish</Badge>
      case "processed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Qayta ishlash</Badge>
      default:
        return <Badge variant="secondary">Noma'lum</Badge>
    }
  }

  const handleStatusChange = async () => {
    if (!newStatus) {
      toast({
        title: "Xatolik",
        description: "Yangi holatni tanlang",
        variant: "destructive",
      })
      return
    }

    try {
      const updateData = {
        id: workshopId,
        status: newStatus as "active" | "busy" | "stopped",
      }

      await updateOrganization(updateData).unwrap()

      toast({
        title: "Muvaffaqiyat",
        description: "Atolye holati o'zgartirildi",
      })

      setIsStatusDialogOpen(false)
      setNewStatus("")
      setStatusNote("")

      refetch()
    } catch (error) {
      console.error("Status update error:", error)
      toast({
        title: "Xatolik",
        description: "Holat o'zgartirishda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="flex items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span>Ma'lumotlar yuklanmoqda...</span>
        </div>
      </div>
    )
  }

  if (error || !workshop) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Xatolik</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Atolye ma'lumotlarini yuklashda xatolik yuz berdi.</p>
            <div className="flex gap-2 mt-4">
              <Button onClick={() => refetch()} variant="outline">
                Qayta urinish
              </Button>
              <Link href="/workshops">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Orqaga qaytish
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/workshops">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Orqaga
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-balance">{workshop.name}</h1>
          <p className="text-muted-foreground">Atolye tafsilotlari va faollik tarixi</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Activity className="h-4 w-4 mr-2" />
                Holatni o'zgartirish
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Atolye holatini o'zgartirish</DialogTitle>
                <DialogDescription>{workshop.name} uchun yangi holat tanlang</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Yangi holat</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Holatni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Faol</SelectItem>
                      <SelectItem value="busy">Band</SelectItem>
                      <SelectItem value="stopped">To'xtatilgan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Izoh (ixtiyoriy)</Label>
                  <Textarea
                    placeholder="Holat o'zgarishi sababi..."
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleStatusChange} disabled={isUpdating}>
                  {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  O'zgartirish
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Workshop Info Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Asosiy ma'lumotlar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Egasi</p>
                <p className="text-sm text-muted-foreground">{workshop.owner}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{workshop.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Telefon</p>
                <p className="text-sm text-muted-foreground">{workshop.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Yaratilgan</p>
                <p className="text-sm text-muted-foreground">{workshop.createdAt}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Status */}
        <Card>
          <CardHeader>
            <CardTitle>Hozirgi holat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Holat</span>
              {getStatusBadge(workshop.status)}
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Hozirgi material</span>
              <span className="text-sm">{workshop.currentMaterial || "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Jarayon</span>
              <span className="text-sm">{workshop.process || "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Ish vaqti</span>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span className="text-sm">{workshop.workTime || "-"}</span>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Jami ish vaqti</span>
              <span className="text-sm">{workshop.totalWorkTime || "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Bajarilgan ishlar</span>
              <span className="text-sm">{workshop.completedJobs || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Material History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Material tarixi
          </CardTitle>
          <CardDescription>So'nggi material harakatlari va qayta ishlash tarixi</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sana</TableHead>
                <TableHead>Harakat</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Manzil</TableHead>
                <TableHead>Izoh</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materialHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-sm">{item.date}</TableCell>
                  <TableCell>{getActionBadge(item.status)}</TableCell>
                  <TableCell className="font-medium">{item.material}</TableCell>
                  <TableCell>
                    {item.from && `${item.from} dan`}
                    {item.to && `${item.to} ga`}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.note || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
