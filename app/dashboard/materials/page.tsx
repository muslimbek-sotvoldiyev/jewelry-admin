"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreHorizontal, Edit, Trash2, Loader2, Package } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import {
  useGetMaterialsQuery,
  useAddMaterialMutation,
  useUpdateMaterialMutation,
  useDeleteMaterialMutation,
  MaterialsApi,
} from "@/lib/service/materialsApi"

import { useDispatch } from "react-redux"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Material {
  id: number
  name: string
  unit: "g" | "pcs" | "ct"
  created_at: string
  updated_at: string
}

const unitLabels = {
  g: "Gram",
  pcs: "Dona",
  ct: "Karat",
}

const unitColors = {
  g: "bg-blue-100 text-blue-800",
  pcs: "bg-green-100 text-green-800",
  ct: "bg-purple-100 text-purple-800",
}

export default function MaterialsPage() {
  const dispatch = useDispatch()

  const [searchTerm, setSearchTerm] = useState("")
  const {
    data: materials = [],
    isLoading: materialsLoading,
    error: materialsError,
  } = useGetMaterialsQuery({
    search: searchTerm,
  })
  const [addMaterial] = useAddMaterialMutation()
  const [updateMaterial] = useUpdateMaterialMutation()
  const [deleteMaterial] = useDeleteMaterialMutation()

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    unit: "" as "g" | "pcs" | "ct" | "",
  })

  const resetForm = () => {
    setFormData({
      name: "",
      unit: "",
    })
  }

  const handleCreateMaterial = async () => {
    // Validate required fields
    if (!formData.name || !formData.unit) {
      toast({
        title: "Xatolik",
        description: "Barcha majburiy maydonlarni to'ldiring",
        variant: "destructive",
      })
      return
    }

    // Check if material name already exists
    if (materials.some((material: Material) => material.name.toLowerCase() === formData.name.toLowerCase())) {
      toast({
        title: "Xatolik",
        description: "Bu material nomi allaqachon mavjud",
        variant: "destructive",
      })
      return
    }

    const apiData = {
      name: formData.name,
      unit: formData.unit,
    }

    try {
      await addMaterial(apiData).unwrap()
      resetForm()
      setIsCreateDialogOpen(false)

      toast({
        title: "Muvaffaqiyat",
        description: "Yangi material yaratildi",
      })
      dispatch(MaterialsApi.util.resetApiState())
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Material yaratishda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  const handleEditMaterial = (material: Material) => {
    setSelectedMaterial(material)
    setFormData({
      name: material.name,
      unit: material.unit,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateMaterial = async () => {
    if (!selectedMaterial) return

    // Validate required fields
    if (!formData.name || !formData.unit) {
      toast({
        title: "Xatolik",
        description: "Barcha majburiy maydonlarni to'ldiring",
        variant: "destructive",
      })
      return
    }

    // Check if material name already exists (excluding current material)
    if (
      materials.some(
        (material: Material) =>
          material.id !== selectedMaterial.id && material.name.toLowerCase() === formData.name.toLowerCase(),
      )
    ) {
      toast({
        title: "Xatolik",
        description: "Bu material nomi allaqachon mavjud",
        variant: "destructive",
      })
      return
    }

    const apiData = {
      name: formData.name,
      unit: formData.unit,
    }

    try {
      await updateMaterial({ id: selectedMaterial.id, ...apiData }).unwrap()
      resetForm()
      setIsEditDialogOpen(false)
      setSelectedMaterial(null)

      toast({
        title: "Muvaffaqiyat",
        description: "Material ma'lumotlari yangilandi",
      })
      dispatch(MaterialsApi.util.resetApiState())
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Material yangilashda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  const handleDeleteMaterial = async (materialId: number) => {
    try {
      await deleteMaterial(materialId).unwrap()
      setIsDeleteDialogOpen(false)
      setSelectedMaterial(null)

      toast({
        title: "Muvaffaqiyat",
        description: "Material o'chirildi",
      })
      dispatch(MaterialsApi.util.resetApiState())
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Material o'chirishda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  const confirmDelete = (material: Material) => {
    setSelectedMaterial(material)
    setIsDeleteDialogOpen(true)
  }

  if (materialsLoading) {
    return (
      <div className="px-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Ma'lumotlar yuklanmoqda...</span>
        </div>
      </div>
    )
  }

  if (materialsError) {
    return (
      <div className="px-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600 mb-4">Materiallarni yuklashda xatolik yuz berdi</p>
            <Button onClick={() => window.location.reload()}>Qayta urinish</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Materiallar</h1>
          <p className="text-muted-foreground">Tizim materiallarini boshqaring</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Yangi material
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Yangi material yaratish</DialogTitle>
              <DialogDescription>Tizimga yangi material qo'shing</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Material nomi *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Masalan: Oltin (24K)"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="unit">O'lchov birligi *</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value: "g" | "pcs" | "ct") => setFormData({ ...formData, unit: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="O'lchov birligini tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="g">Gram (g)</SelectItem>
                    <SelectItem value="pcs">Dona (pcs)</SelectItem>
                    <SelectItem value="ct">Karat (ct)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false)
                  resetForm()
                }}
              >
                Bekor qilish
              </Button>
              <Button onClick={handleCreateMaterial}>Yaratish</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Materiallarni qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Materiallar ro'yxati</CardTitle>
          <CardDescription>Jami {materials.length} ta material</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Nomi</TableHead>
                <TableHead>O‘lchov birligi</TableHead>
                <TableHead>Yaratilgan sana</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.map((material, index) => (
                <TableRow key={material.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{material.name}</TableCell>
                  <TableCell>
                    <Badge className={unitColors[material.unit]}>
                      {unitLabels[material.unit]} ({material.unit})
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(material.created_at).toLocaleDateString("uz-UZ")}
                  </TableCell>
                  <TableCell className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditMaterial(material)}
                    >
                      <Edit className="h-4 w-4 mr-1" /> Tahrirlash
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => confirmDelete(material)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> O‘chirish
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Materialni tahrirlash</DialogTitle>
            <DialogDescription>Material ma'lumotlarini yangilang</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Material nomi *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Masalan: Oltin (24K)"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-unit">O'lchov birligi *</Label>
              <Select
                value={formData.unit}
                onValueChange={(value: "g" | "pcs" | "ct") => setFormData({ ...formData, unit: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="O'lchov birligini tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="g">Gram (g)</SelectItem>
                  <SelectItem value="pcs">Dona (pcs)</SelectItem>
                  <SelectItem value="ct">Karat (ct)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false)
                resetForm()
                setSelectedMaterial(null)
              }}
            >
              Bekor qilish
            </Button>
            <Button onClick={handleUpdateMaterial}>Yangilash</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Materialni o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              Haqiqatan ham <strong>{selectedMaterial?.name}</strong> materialini o'chirmoqchimisiz? Bu amalni bekor
              qilib bo'lmaydi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Yo'q</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedMaterial && handleDeleteMaterial(selectedMaterial.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Ha, o'chirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
