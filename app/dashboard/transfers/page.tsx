"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
import { Plus, Search, Eye, ArrowLeftRight, Clock, CheckCircle, XCircle } from "lucide-react"

// Mock transfer data
const transfers = [
  {
    id: "T001",
    from: "Safe",
    to: "Atolye-1",
    material: "250gr Oltin",
    materialType: "gold",
    amount: 250,
    unit: "gr",
    status: "confirmed",
    senderConfirmed: true,
    receiverConfirmed: true,
    createdAt: "2024-01-25 09:30",
    confirmedAt: "2024-01-25 09:45",
    note: "Tozalash uchun",
  },
  {
    id: "T002",
    from: "Atolye-1",
    to: "Atolye-2",
    material: "180gr Kumush",
    materialType: "silver",
    amount: 180,
    unit: "gr",
    status: "pending_receiver",
    senderConfirmed: true,
    receiverConfirmed: false,
    createdAt: "2024-01-25 14:20",
    confirmedAt: null,
    note: "Proba o'zgartirish uchun",
  },
  {
    id: "T003",
    from: "Safe",
    to: "Atolye-3",
    material: "45 dona Olmos",
    materialType: "diamond",
    amount: 45,
    unit: "dona",
    status: "pending_sender",
    senderConfirmed: false,
    receiverConfirmed: false,
    createdAt: "2024-01-25 16:00",
    confirmedAt: null,
    note: "Buyum yaratish uchun",
  },
  {
    id: "T004",
    from: "Atolye-2",
    to: "Safe",
    material: "160gr Kumush",
    materialType: "silver",
    amount: 160,
    unit: "gr",
    status: "returned",
    senderConfirmed: true,
    receiverConfirmed: true,
    createdAt: "2024-01-24 18:30",
    confirmedAt: "2024-01-24 18:45",
    note: "Ish vaqti tugadi, qaytarildi",
    processLoss: 20,
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "confirmed":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="h-3 w-3 mr-1" />
          Yakunlangan
        </Badge>
      )
    case "pending_sender":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <Clock className="h-3 w-3 mr-1" />
          Yuboruvchi kutilmoqda
        </Badge>
      )
    case "pending_receiver":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          <Clock className="h-3 w-3 mr-1" />
          Qabul qiluvchi kutilmoqda
        </Badge>
      )
    case "returned":
      return (
        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
          <ArrowLeftRight className="h-3 w-3 mr-1" />
          Qaytarilgan
        </Badge>
      )
    case "cancelled":
      return (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Bekor qilindi
        </Badge>
      )
    default:
      return <Badge variant="secondary">Noma'lum</Badge>
  }
}

const getMaterialIcon = (type: string) => {
  switch (type) {
    case "gold":
      return "🥇"
    case "silver":
      return "🥈"
    case "diamond":
      return "💎"
    default:
      return "📦"
  }
}

export default function TransfersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newTransfer, setNewTransfer] = useState({
    from: "",
    to: "",
    materialType: "",
    amount: "",
    unit: "",
    note: "",
  })

  const filteredTransfers = transfers.filter((transfer) => {
    const matchesSearch =
      transfer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.material.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || transfer.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleCreateTransfer = () => {
    // TODO: Implement transfer creation logic
    console.log("Creating transfer:", newTransfer)
    setIsCreateDialogOpen(false)
    setNewTransfer({ from: "", to: "", materialType: "", amount: "", unit: "", note: "" })
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Transferlar</h1>
          <p className="text-muted-foreground">Material almashinuvi va transferlarni boshqarish</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Yangi transfer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Yangi transfer yaratish</DialogTitle>
              <DialogDescription>Material transferi uchun ma'lumotlarni kiriting</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="from">Kimdan</Label>
                  <Select
                    value={newTransfer.from}
                    onValueChange={(value) => setNewTransfer({ ...newTransfer, from: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="safe">Safe</SelectItem>
                      <SelectItem value="atolye-1">Atolye-1</SelectItem>
                      <SelectItem value="atolye-2">Atolye-2</SelectItem>
                      <SelectItem value="atolye-3">Atolye-3</SelectItem>
                      <SelectItem value="atolye-4">Atolye-4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="to">Kimga</Label>
                  <Select
                    value={newTransfer.to}
                    onValueChange={(value) => setNewTransfer({ ...newTransfer, to: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="safe">Safe</SelectItem>
                      <SelectItem value="atolye-1">Atolye-1</SelectItem>
                      <SelectItem value="atolye-2">Atolye-2</SelectItem>
                      <SelectItem value="atolye-3">Atolye-3</SelectItem>
                      <SelectItem value="atolye-4">Atolye-4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="materialType">Material turi</Label>
                <Select
                  value={newTransfer.materialType}
                  onValueChange={(value) => setNewTransfer({ ...newTransfer, materialType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Material turini tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gold">🥇 Oltin</SelectItem>
                    <SelectItem value="silver">🥈 Kumush</SelectItem>
                    <SelectItem value="diamond">💎 Olmos</SelectItem>
                    <SelectItem value="pearl">🤍 Marvarid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="amount">Miqdor</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="250"
                    value={newTransfer.amount}
                    onChange={(e) => setNewTransfer({ ...newTransfer, amount: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="unit">Birlik</Label>
                  <Select
                    value={newTransfer.unit}
                    onValueChange={(value) => setNewTransfer({ ...newTransfer, unit: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Birlik" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gr">Gramm</SelectItem>
                      <SelectItem value="kg">Kilogramm</SelectItem>
                      <SelectItem value="dona">Dona</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="note">Izoh</Label>
                <Textarea
                  id="note"
                  placeholder="Transfer maqsadi yoki qo'shimcha ma'lumot..."
                  value={newTransfer.note}
                  onChange={(e) => setNewTransfer({ ...newTransfer, note: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateTransfer}>Transfer yaratish</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami transferlar</CardTitle>
            <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transfers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yakunlangan</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transfers.filter((t) => t.status === "confirmed").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jarayonda</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transfers.filter((t) => t.status.includes("pending")).length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bekor qilingan</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {transfers.filter((t) => t.status === "cancelled" || t.status === "returned").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Transferlar ro'yxati</CardTitle>
          <CardDescription>Barcha material transferlari va ularning holati</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Transfer ID, material yoki atolye bo'yicha qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Holat bo'yicha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barchasi</SelectItem>
                <SelectItem value="confirmed">Yakunlangan</SelectItem>
                <SelectItem value="pending_sender">Yuboruvchi kutilmoqda</SelectItem>
                <SelectItem value="pending_receiver">Qabul qiluvchi kutilmoqda</SelectItem>
                <SelectItem value="returned">Qaytarilgan</SelectItem>
                <SelectItem value="cancelled">Bekor qilindi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transfer ID</TableHead>
                <TableHead>Kimdan</TableHead>
                <TableHead>Kimga</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Holat</TableHead>
                <TableHead>Sana</TableHead>
                <TableHead>Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransfers.map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell className="font-mono font-medium">{transfer.id}</TableCell>
                  <TableCell>{transfer.from}</TableCell>
                  <TableCell>{transfer.to}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{getMaterialIcon(transfer.materialType)}</span>
                      <span>{transfer.material}</span>
                      {transfer.processLoss && (
                        <Badge variant="outline" className="text-xs">
                          -{transfer.processLoss}
                          {transfer.unit} yo'qotish
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                  <TableCell className="font-mono text-sm">{transfer.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {transfer.status.includes("pending") && (
                        <Button variant="outline" size="sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Tasdiqlash
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
