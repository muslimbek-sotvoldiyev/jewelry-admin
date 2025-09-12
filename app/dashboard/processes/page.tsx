"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, CheckCircle, Clock, XCircle, Settings, Loader2 } from "lucide-react"
import { useGetProcessesQuery } from "@/lib/service/processApi"
import { useGetInventoryQuery } from "@/lib/service/inventoryApi"
import { useGetMaterialsQuery } from "@/lib/service/materialsApi"
import { getCurrentUser } from "@/lib/auth"
import type { Process } from "@/types/process"

// Status badge function for processes
const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="h-3 w-3 mr-1" />
          Tugallangan
        </Badge>
      )
    case "in_progress":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          <Settings className="h-3 w-3 mr-1" />
          Jarayonda
        </Badge>
      )
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <Clock className="h-3 w-3 mr-1" />
          Kutilmoqda
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
      return <Badge variant="secondary">Noma'lum</Badge>
  }
}

export default function ProcessesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const user = getCurrentUser()

  const {
    data: processes = [],
    isLoading,
    error,
    refetch,
  } = useGetProcessesQuery({
    search: searchTerm || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  })

  const { data: inventory = [] } = useGetInventoryQuery({})
  const { data: materials = [] } = useGetMaterialsQuery({})

  // Helper function to get inventory item by id
  const getInventoryById = (id: number) => {
    return inventory.find((inv) => inv.id === id)
  }

  // Helper function to get material by id
  const getMaterialById = (id: number) => {
    return materials.find((mat) => mat.id === id)
  }

  const filteredProcesses = processes.filter((process: Process) => {
    const matchesSearch =
      process.id.toString().includes(searchTerm.toLowerCase()) ||
      process.organization.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || process.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const formatDate = (iso: string) => new Date(iso).toLocaleString("uz-UZ", { dateStyle: "short", timeStyle: "short" })

  if (error) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Jarayonlar</h1>
            <p className="text-muted-foreground">Mahsulot ishlab chiqarish jarayonlarini boshqarish</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/processes/create">+ Yangi jarayon</Link>
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
          <h1 className="text-3xl font-bold">Jarayonlar</h1>
          <p className="text-muted-foreground">Mahsulot ishlab chiqarish jarayonlarini boshqarish</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/processes/create">+ Yangi jarayon</Link>
        </Button>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Jarayonlar roʻyxati</CardTitle>
          <CardDescription>{isLoading ? "Yuklanmoqda..." : `Jami ${processes.length} ta jarayon`}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ID yoki tashkilot nomi boʻyicha qidirish..."
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
                <SelectItem value="in_progress">Jarayonda</SelectItem>
                <SelectItem value="completed">Tugallangan</SelectItem>
                <SelectItem value="cancelled">Bekor qilingan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Jarayonlar yuklanmoqda...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tashkilot</TableHead>
                  <TableHead>Kirish materiallari</TableHead>
                  <TableHead>Chiqish mahsulotlari</TableHead>
                  <TableHead>Holat</TableHead>
                  <TableHead>Sana</TableHead>
                  <TableHead>Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProcesses.length > 0 ? (
                  filteredProcesses.map((process: Process, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono">#{process.id}</TableCell>
                      <TableCell>{process.organization.name}</TableCell>
                      <TableCell>
                        {process.inputs && process.inputs.length > 0 ? (
                          <ul className="space-y-1">
                            {process.inputs.map((input, index) => {
                              const inventoryItem = getInventoryById(input.inventory)
                              return (
                                <li key={index} className="text-sm flex justify-between">
                                  <span>{inventoryItem?.material.name || "Noma'lum"}</span>
                                  <span className="font-mono">
                                    {input.quantity} {inventoryItem?.material.unit || ""}
                                  </span>
                                </li>
                              )
                            })}
                          </ul>
                        ) : (
                          <span className="text-gray-500 text-sm">Ma'lumot yo'q</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {process.outputs && process.outputs.length > 0 ? (
                          <ul className="space-y-1">
                            {process.outputs.map((output) => {
                              const material = getMaterialById(output.material)
                              return (
                                <li key={output.id} className="text-sm flex justify-between">
                                  <span>{material?.name || "Noma'lum"}</span>
                                  <span className="font-mono">
                                    {output.quantity} {material?.unit || ""}
                                  </span>
                                </li>
                              )
                            })}
                          </ul>
                        ) : (
                          <span className="text-gray-500 text-sm">Ma'lumot yo'q</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(process.status)}</TableCell>
                      <TableCell className="text-sm">{formatDate(process.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/processes/${process.id}`}>
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
                          : "Hozircha jarayonlar yo'q"}
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
