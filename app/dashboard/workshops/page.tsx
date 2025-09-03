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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Eye, Edit, Clock, Factory, AlertTriangle, Loader2, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import {
  useGetOrganizationsQuery,
  useAddOrganizationMutation,
  useDeleteOrganizationMutation,
  useUpdateOrganizationMutation,
} from "@/lib/service/atolyeApi"

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

export default function WorkshopsPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedWorkshop, setSelectedWorkshop] = useState<any>(null)
  const [newWorkshop, setNewWorkshop] = useState({
    name: "",
    type: "",
  })
  const [editWorkshop, setEditWorkshop] = useState({
    name: "",
    type: "",
  })

  const { data: workshops = [], isLoading, error } = useGetOrganizationsQuery({})
  const [addOrganization, { isLoading: isCreating }] = useAddOrganizationMutation()
  const [deleteOrganization, { isLoading: isDeleting }] = useDeleteOrganizationMutation()
  const [updateOrganization, { isLoading: isUpdating }] = useUpdateOrganizationMutation()

  const filteredWorkshops = workshops.filter((workshop: { name: string; owner: string; status: string }) => {
    const matchesSearch =
      workshop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workshop.owner.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || workshop.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleCreateWorkshop = async () => {
    if (!newWorkshop.name || !newWorkshop.type) {
      toast({
        title: "Xatolik",
        description: "Barcha majburiy maydonlarni to'ldiring",
        variant: "destructive",
      })
      return
    }

    try {
      await addOrganization(newWorkshop).unwrap()
      toast({
        title: "Muvaffaqiyat",
        description: "Yangi atolye yaratildi",
      })
      setIsCreateDialogOpen(false)
      setNewWorkshop({ name: "", type: "" })
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Atolye yaratishda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  const handleEditWorkshop = async () => {
    if (!editWorkshop.name || !editWorkshop.type) {
      toast({
        title: "Xatolik",
        description: "Barcha majburiy maydonlarni to'ldiring",
        variant: "destructive",
      })
      return
    }

    try {
      await updateOrganization({
        id: selectedWorkshop.id,
        ...editWorkshop,
      }).unwrap()
      toast({
        title: "Muvaffaqiyat",
        description: "Atolye ma'lumotlari yangilandi",
      })
      setIsEditDialogOpen(false)
      setSelectedWorkshop(null)
      setEditWorkshop({ name: "", type: "" })
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Atolye ma'lumotlarini yangilashda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  const handleDeleteWorkshop = async (id: string) => {
    try {
      await deleteOrganization(id).unwrap()
      toast({
        title: "Muvaffaqiyat",
        description: "Atolye o'chirildi",
      })
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Atolye o'chirishda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (workshop: any) => {
    setSelectedWorkshop(workshop)
    setEditWorkshop({
      name: workshop.name,
      type: workshop.type || "",
    })
    setIsEditDialogOpen(true)
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Xatolik</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Ma'lumotlarni yuklashda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.</p>
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
          <h1 className="text-3xl font-bold text-balance">Atolyeler</h1>
          <p className="text-muted-foreground">Barcha atolyelerni boshqarish va kuzatish</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Yangi atolye
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Yangi atolye yaratish</DialogTitle>
              <DialogDescription>Yangi atolye uchun asosiy ma'lumotlarni kiriting.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Atolye nomi *</Label>
                <Input
                  id="name"
                  placeholder="Atolye-5"
                  value={newWorkshop.name}
                  onChange={(e) => setNewWorkshop({ ...newWorkshop, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Atolye turi *</Label>
                <Select
                  value={newWorkshop.type}
                  onValueChange={(value) => setNewWorkshop({ ...newWorkshop, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Atolye turini tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gold_processing">Oltin qayta ishlash</SelectItem>
                    <SelectItem value="silver_processing">Kumush qayta ishlash</SelectItem>
                    <SelectItem value="jewelry_making">Zargarlik buyumlari yaratish</SelectItem>
                    <SelectItem value="cleaning">Tozalash</SelectItem>
                    <SelectItem value="repair">Ta'mirlash</SelectItem>
                    <SelectItem value="bank">Bank</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false)
                  setNewWorkshop({ name: "", type: "" })
                }}
              >
                Bekor qilish
              </Button>
              <Button type="submit" onClick={handleCreateWorkshop} disabled={isCreating}>
                {isCreating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Yaratish
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Atolyeni tahrirlash</DialogTitle>
            <DialogDescription>Atolye ma'lumotlarini yangilang.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Atolye nomi *</Label>
              <Input
                id="edit-name"
                placeholder="Atolye-5"
                value={editWorkshop.name}
                onChange={(e) => setEditWorkshop({ ...editWorkshop, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-type">Atolye turi *</Label>
              <Select
                value={editWorkshop.type}
                onValueChange={(value) => setEditWorkshop({ ...editWorkshop, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Atolye turini tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gold_processing">Oltin qayta ishlash</SelectItem>
                  <SelectItem value="silver_processing">Kumush qayta ishlash</SelectItem>
                  <SelectItem value="jewelry_making">Zargarlik buyumlari yaratish</SelectItem>
                  <SelectItem value="cleaning">Tozalash</SelectItem>
                  <SelectItem value="repair">Ta'mirlash</SelectItem>
                  <SelectItem value="bank">Bank</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false)
                setSelectedWorkshop(null)
                setEditWorkshop({ name: "", type: "" })
              }}
            >
              Bekor qilish
            </Button>
            <Button type="submit" onClick={handleEditWorkshop} disabled={isUpdating}>
              {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Yangilash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami atolyeler</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : workshops.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faol</CardTitle>
            <div className="h-2 w-2 bg-green-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                workshops.filter((w: { status: string }) => w.status === "active").length
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Band</CardTitle>
            <div className="h-2 w-2 bg-yellow-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                workshops.filter((w: { status: string }) => w.status === "busy").length
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">To'xtatilgan</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                workshops.filter((w: { status: string }) => w.status === "stopped").length
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Atolyeler ro'yxati</CardTitle>
          <CardDescription>Barcha atolyeler va ularning hozirgi holati</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Atolye yoki egasi bo'yicha qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Holat bo'yicha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barchasi</SelectItem>
                <SelectItem value="active">Faol</SelectItem>
                <SelectItem value="busy">Band</SelectItem>
                <SelectItem value="stopped">To'xtatilgan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Ma'lumotlar yuklanmoqda...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Atolye</TableHead>
                  <TableHead>Egasi</TableHead>
                  <TableHead>Holat</TableHead>
                  <TableHead>Hozirgi material</TableHead>
                  <TableHead>Ish vaqti</TableHead>
                  <TableHead>Jarayon</TableHead>
                  <TableHead>Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkshops.map((workshop) => (
                  <TableRow key={workshop.id}>
                    <TableCell className="font-medium">{workshop.name}</TableCell>
                    <TableCell>{workshop.owner}</TableCell>
                    <TableCell>{getStatusBadge(workshop.status)}</TableCell>
                    <TableCell>{workshop.currentMaterial || "-"}</TableCell>
                    <TableCell>
                      {workshop.workTime && workshop.workTime !== "-" ? (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {workshop.workTime}
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>{workshop.process || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link href={`/workshops/${workshop.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(workshop)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Atolyeni o'chirish</AlertDialogTitle>
                              <AlertDialogDescription>
                                Haqiqatan ham "{workshop.name}" atolyesini o'chirmoqchimisiz? Bu amalni bekor qilib
                                bo'lmaydi.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteWorkshop(workshop.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                disabled={isDeleting}
                              >
                                {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                O'chirish
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
