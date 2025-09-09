"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, CheckCircle, Clock, XCircle, ArrowLeftRight, Loader2 } from "lucide-react"
import { useGetTransactionsQuery } from "@/lib/service/transactionsApi"
import { getCurrentUser } from "@/lib/auth"
import Organization from "@/types/organization"
import { useGetOrganizationsQuery } from "@/lib/service/atolyeApi"
import { Transaction } from "@/types/transactions"

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
    case "rejected":
      return (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Bekor qilingan
        </Badge>
      )
    default:
      return <Badge variant="secondary">Noma'lum</Badge>
  }
}

export default function TransfersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [organizationFilter, setOrganizationFilter] = useState("all")

  const user = getCurrentUser();

  const { data: transfers = [] as Transaction[], isLoading, error, refetch } = useGetTransactionsQuery({
    search: searchTerm || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  })

  const { data: organizations = [] } = useGetOrganizationsQuery({})


  const filteredTransfers = transfers.filter((transfer: Transaction) => {

    const matchesSearch = transfer.id.toString().includes(searchTerm.toLowerCase()) ||
      transfer.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.receiver.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || transfer.status === statusFilter

    const matchesOrganization = organizationFilter === "all" || transfer.receiver.id.toString() === organizationFilter || transfer.sender.id.toString() === organizationFilter

    return matchesSearch && matchesStatus && matchesOrganization
  })

  const formatDate = (iso: string) => new Date(iso).toLocaleString("uz-UZ", { dateStyle: "short", timeStyle: "short" })

  if (error) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Transferlar</h1>
            <p className="text-muted-foreground">Material almashinuvi va transferlarni boshqarish</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/transfers/create">+ Yangi transfer</Link>
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-500 mb-4">Ma'lumotlarni yuklashda xatolik yuz berdi</p>
              <Button onClick={() => refetch()}>Qayta urinish</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

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
          <CardDescription>{isLoading ? "Yuklanmoqda..." : `Jami ${transfers.length} ta transfer`}</CardDescription>
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
                <SelectValue placeholder="Holat bo'yicha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barchasi</SelectItem>
                <SelectItem value="pending">Kutilmoqda</SelectItem>
                <SelectItem value="accepted">Tasdiqlangan</SelectItem>
                <SelectItem value="rejected">Rad etilgan</SelectItem>
                <SelectItem value="cancelled">Bekor qilingan</SelectItem>
              </SelectContent>
            </Select>

            <Select value={organizationFilter} onValueChange={setOrganizationFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Holat bo'yicha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barchasi</SelectItem>

                {organizations.map((organization: Organization) => (
                  <SelectItem key={organization.id} value={organization.id.toString()}>
                    {organization.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Transferlar yuklanmoqda...</span>
            </div>
          ) : (
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
                {filteredTransfers.length > 0 ? (
                  filteredTransfers.map((t: any) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-mono">#{t.id}</TableCell>
                      <TableCell>{t.sender.name}</TableCell>
                      <TableCell>{t.receiver.name}</TableCell>
                      <TableCell>
                        {t.items && t.items.length > 0 ? (
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
                        ) : (
                          <span className="text-gray-500 text-sm">Ma'lumot yo'q</span>
                        )}
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
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <p className="text-gray-500">
                        {searchTerm || statusFilter !== "all"
                          ? "Qidiruv bo'yicha natija topilmadi"
                          : "Hozircha transferlar yo'q"}
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
