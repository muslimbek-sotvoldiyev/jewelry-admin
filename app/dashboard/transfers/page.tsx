"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, CheckCircle, Clock, XCircle, ArrowLeftRight } from "lucide-react"



const apiData = [
  {
    "id": 1,
    "items": [],
    "sender": {
      "id": 1,
      "created_at": "2025-09-01T15:42:47.969307Z",
      "updated_at": "2025-09-01T15:42:47.980843Z",
      "name": "Markaziy Bank",
      "type": "bank"
    },
    "receiver": {
      "id": 2,
      "created_at": "2025-09-01T15:42:47.969307Z",
      "updated_at": "2025-09-01T15:42:47.980843Z",
      "name": "Toshkent Atolye",
      "type": "atolye"
    },
    "created_at": "2025-09-07T17:43:19.923359Z",
    "updated_at": "2025-09-07T18:39:02.819548Z",
    "status": "pending"
  },
  {
    "id": 7,
    "items": [
      {
        "id": 10,
        "inventory": {
          "id": 1,
          "organization": {
            "id": 2,
            "created_at": "2025-09-01T15:42:47.969307Z",
            "updated_at": "2025-09-01T15:42:47.980843Z",
            "name": "Toshkent Atolye",
            "type": "atolye"
          },
          "material": {
            "id": 1,
            "created_at": "2025-09-01T15:42:48.001630Z",
            "updated_at": "2025-09-01T15:45:36.296176Z",
            "name": "Oltin (24K)",
            "unit": "g"
          },
          "quantity": "6.600",
          "created_at": "2025-09-01T15:44:03.269589Z",
          "updated_at": "2025-09-01T15:44:03.269704Z"
        },
        "quantity": "25.000",
        "transaction": 7
      },
      {
        "id": 11,
        "inventory": {
          "id": 3,
          "organization": {
            "id": 2,
            "created_at": "2025-09-01T15:42:47.969307Z",
            "updated_at": "2025-09-01T15:42:47.980843Z",
            "name": "Toshkent Atolye",
            "type": "atolye"
          },
          "material": {
            "id": 2,
            "created_at": "2025-09-01T15:42:48.001630Z",
            "updated_at": "2025-09-07T19:55:36.590075Z",
            "name": "Kumush",
            "unit": "g"
          },
          "quantity": "45.000",
          "created_at": "2025-09-07T17:34:46.654824Z",
          "updated_at": "2025-09-07T17:34:46.654959Z"
        },
        "quantity": "45.000",
        "transaction": 7
      }
    ],
    "sender": {
      "id": 2,
      "created_at": "2025-09-01T15:42:47.969307Z",
      "updated_at": "2025-09-01T15:42:47.980843Z",
      "name": "Toshkent Atolye",
      "type": "atolye"
    },
    "receiver": {
      "id": 1,
      "created_at": "2025-09-01T15:42:47.969307Z",
      "updated_at": "2025-09-01T15:42:47.980843Z",
      "name": "Markaziy Bank",
      "type": "bank"
    },
    "created_at": "2025-09-07T19:12:12.711935Z",
    "updated_at": "2025-09-07T19:12:12.711970Z",
    "status": "pending"
  },

]



// status badge function
const getStatusBadge = (status: string) => {
  switch (status) {
    case "accepted":
    case "confirmed":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="h-3 w-3 mr-1" />
          Tasdiqlangan
        </Badge>
      )
    case "pending":
    case "pending_sender":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <Clock className="h-3 w-3 mr-1" />
          Tasdiqlash kutilmoqda
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
          Bekor qilingan
        </Badge>
      )
    default:
      return <Badge variant="secondary">Noma’lum</Badge>
  }
}

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    // API dan ma’lumot olish (hozircha mock JSON qo‘yilgan)
    // fetch("/api/transfers") // ← sizning endpointingiz
    // .then((res) => res.json())
    // .then((data) => setTransfers(data))
    setTransfers(apiData)
  }, [])

  const filteredTransfers = transfers.filter((transfer) => {
    const matchesSearch =
      transfer.id.toString().includes(searchTerm.toLowerCase()) ||
      transfer.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.receiver.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || transfer.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("uz-UZ", { dateStyle: "short", timeStyle: "short" })

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transferlar</h1>
          <p className="text-muted-foreground">Material almashinuvi va transferlarni boshqarish</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/transfers/create">+ Yangi transfer</Link>
        </Button>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Transferlar roʻyxati</CardTitle>
          <CardDescription>API’dan olingan maʼlumotlar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ID, yuboruvchi yoki qabul qiluvchi boʻyicha qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Holat bo‘yicha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barchasi</SelectItem>
                <SelectItem value="pending">Kutilmoqda</SelectItem>
                <SelectItem value="accepted">Tasdiqlangan</SelectItem>
                <SelectItem value="returned">Qaytarilgan</SelectItem>
                <SelectItem value="cancelled">Bekor qilingan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Kimdan</TableHead>
                <TableHead>Kimga</TableHead>
                <TableHead>Materiallar</TableHead>
                <TableHead>Holat</TableHead>
                <TableHead>Sana</TableHead>
                <TableHead>Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransfers.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono">#{t.id}</TableCell>
                  <TableCell>{t.sender.name}</TableCell>
                  <TableCell>{t.receiver.name}</TableCell>
                  <TableCell>
                    <ul className="space-y-1">
                      {t.items.map((it: any) => (
                        <li key={it.id} className="text-sm flex justify-between">
                          <span>{it.inventory.material.name}</span>
                          <span className="font-mono">
                            {it.quantity} {it.inventory.material.unit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>{getStatusBadge(t.status)}</TableCell>
                  <TableCell className="text-sm">{formatDate(t.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/transfers/${t.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      {t.status === "pending" && (
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



