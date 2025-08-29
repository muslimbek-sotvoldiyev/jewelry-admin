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
import { ArrowLeft, Clock, User, Mail, Phone, Calendar, Activity, History } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

// Mock workshop detail data
const workshopDetail = {
  id: "1",
  name: "Atolye-1",
  owner: "Ahmad Karimov",
  status: "active",
  currentMaterial: "250gr Oltin",
  workTime: "2 soat 30 daqiqa",
  process: "Tozalash",
  email: "atolye1@jewelry.com",
  phone: "+998901234567",
  createdAt: "2024-01-15",
  totalWorkTime: "45 soat 20 daqiqa",
  completedJobs: 23,
  currentStartTime: "2024-01-25 09:30",
}

// Mock material history
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
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [statusNote, setStatusNote] = useState("")

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

  const handleStatusChange = () => {
    // TODO: Implement status change logic
    console.log("Changing status to:", newStatus, "Note:", statusNote)
    setIsStatusDialogOpen(false)
    setNewStatus("")
    setStatusNote("")
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/workshops">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Orqaga
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-balance">{workshopDetail.name}</h1>
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
                <DialogDescription>{workshopDetail.name} uchun yangi holat tanlang</DialogDescription>
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
                <Button onClick={handleStatusChange}>O'zgartirish</Button>
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
                <p className="text-sm text-muted-foreground">{workshopDetail.owner}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{workshopDetail.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Telefon</p>
                <p className="text-sm text-muted-foreground">{workshopDetail.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Yaratilgan</p>
                <p className="text-sm text-muted-foreground">{workshopDetail.createdAt}</p>
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
              {getStatusBadge(workshopDetail.status)}
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Hozirgi material</span>
              <span className="text-sm">{workshopDetail.currentMaterial}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Jarayon</span>
              <span className="text-sm">{workshopDetail.process}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Ish vaqti</span>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span className="text-sm">{workshopDetail.workTime}</span>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Jami ish vaqti</span>
              <span className="text-sm">{workshopDetail.totalWorkTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Bajarilgan ishlar</span>
              <span className="text-sm">{workshopDetail.completedJobs}</span>
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
