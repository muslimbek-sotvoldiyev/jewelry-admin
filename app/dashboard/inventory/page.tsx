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
import { Search, Plus, MoreHorizontal, Edit, Trash2, Loader2, Package2, Building2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import {
  useGetInventoryQuery,
  useAddInventoryMutation,
  useUpdateInventoryMutation,
  useDeleteInventoryMutation,
  InventoryApi,
} from "@/lib/service/inventoryApi"
import { useGetMaterialsQuery } from "@/lib/service/materialsApi"
import { useGetOrganizationsQuery } from "@/lib/service/atolyeApi"
import { useDispatch } from "react-redux"

import Material from "@/types/material"
import Inventory from "@/types/inventory"
import Organization from "@/types/organization"
import { unitColors, unitLabels } from "@/constants/units"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"



export default function InventoryPage() {
  const dispatch = useDispatch()

  const [searchTerm, setSearchTerm] = useState("")
  const {
    data: inventory = [],
    isLoading: inventoryLoading,
    error: inventoryError,
  } = useGetInventoryQuery({
    search: searchTerm,
  })
  const { data: materials = [], isLoading: materialsLoading } = useGetMaterialsQuery(undefined)
  const { data: organizations = [], isLoading: organizationsLoading } = useGetOrganizationsQuery(undefined)

  const [addInventory] = useAddInventoryMutation()
  const [updateInventory] = useUpdateInventoryMutation()
  const [deleteInventory] = useDeleteInventoryMutation()

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(null)

  const [formData, setFormData] = useState({
    quantity: "",
    organization_id: "",
    material_id: "",
  })

  const resetForm = () => {
    setFormData({
      quantity: "",
      organization_id: "",
      material_id: "",
    })
  }

  const getSelectedMaterial = (): Material | undefined => {
    return materials.find((m: Material) => m.id.toString() === formData.material_id)
  }

  const getQuantityLabel = () => {
    const material = getSelectedMaterial()
    if (!material) return "Miqdor"
    return `Miqdor (${unitLabels[material.unit]})`
  }

  const handleCreateInventory = async () => {
    if (!formData.quantity || !formData.organization_id || !formData.material_id) {
      toast({
        title: "Xatolik",
        description: "Barcha majburiy maydonlarni to'ldiring",
        variant: "destructive",
      })
      return
    }

    const apiData = {
      quantity: formData.quantity,
      organization_id: Number.parseInt(formData.organization_id),
      material_id: Number.parseInt(formData.material_id),
    }

    try {
      await addInventory(apiData).unwrap()
      resetForm()
      setIsCreateDialogOpen(false)

      toast({
        title: "Muvaffaqiyat",
        description: "Yangi inventar yaratildi",
      })
      dispatch(InventoryApi.util.resetApiState())
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Inventar yaratishda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  const handleEditInventory = (inventoryItem: Inventory) => {
    setSelectedInventory(inventoryItem)
    setFormData({
      quantity: inventoryItem.quantity,
      organization_id: inventoryItem.organization.id.toString(),
      material_id: inventoryItem.material.id.toString(),
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateInventory = async () => {
    if (!selectedInventory) return

    if (!formData.quantity || !formData.organization_id || !formData.material_id) {
      toast({
        title: "Xatolik",
        description: "Barcha majburiy maydonlarni to'ldiring",
        variant: "destructive",
      })
      return
    }

    const apiData = {
      quantity: formData.quantity,
      organization_id: Number.parseInt(formData.organization_id),
      material_id: Number.parseInt(formData.material_id),
    }

    try {
      await updateInventory({ id: selectedInventory.id, ...apiData }).unwrap()
      resetForm()
      setIsEditDialogOpen(false)
      setSelectedInventory(null)

      toast({
        title: "Muvaffaqiyat",
        description: "Inventar ma'lumotlari yangilandi",
      })
      dispatch(InventoryApi.util.resetApiState())
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Inventar yangilashda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  const handleDeleteInventory = async (inventoryId: number) => {
    try {
      await deleteInventory(inventoryId).unwrap()
      setIsDeleteDialogOpen(false)
      setSelectedInventory(null)

      toast({
        title: "Muvaffaqiyat",
        description: "Inventar o'chirildi",
      })
      dispatch(InventoryApi.util.resetApiState())
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Inventar o'chirishda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  const confirmDelete = (inventoryItem: Inventory) => {
    setSelectedInventory(inventoryItem)
    setIsDeleteDialogOpen(true)
  }

  if (inventoryLoading || materialsLoading || organizationsLoading) {
    return (
      <div className="px-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Ma'lumotlar yuklanmoqda...</span>
        </div>
      </div>
    )
  }

  if (inventoryError) {
    return (
      <div className="px-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600 mb-4">Inventarni yuklashda xatolik yuz berdi</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Inventar</h1>
          <p className="text-muted-foreground">Material inventarini boshqaring</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Yangi inventar
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Yangi inventar yaratish</DialogTitle>
              <DialogDescription>Tizimga yangi inventar qo'shing</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="material">Material *</Label>
                <Select
                  value={formData.material_id}
                  onValueChange={(value) => setFormData({ ...formData, material_id: value, quantity: "" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Materialni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.length === 0 ? (
                      <SelectItem value="no-materials" disabled>
                        Material topilmadi
                      </SelectItem>
                    ) : (
                      materials.map((material: Material) => (
                        <SelectItem key={material.id} value={material.id.toString()}>
                          {material.name} ({unitLabels[material.unit]})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="organization">Tashkilot *</Label>
                <Select
                  value={formData.organization_id}
                  onValueChange={(value) => setFormData({ ...formData, organization_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tashkilotni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.length === 0 ? (
                      <SelectItem value="no-organizations" disabled>
                        Tashkilot topilmadi
                      </SelectItem>
                    ) : (
                      organizations.map((org: Organization) => (
                        <SelectItem key={org.id} value={org.id.toString()}>
                          {org.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="quantity">{getQuantityLabel()} *</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.01"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder={`Masalan: ${getSelectedMaterial()?.unit === "g" ? "100.5" : "10"}`}
                  disabled={!formData.material_id}
                />
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
              <Button onClick={handleCreateInventory}>Yaratish</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Inventarni qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventar ro'yxati</CardTitle>
          <CardDescription>Jami {inventory.length} ta inventar yozuvi</CardDescription>
        </CardHeader>
        <CardContent>
          {inventory.length === 0 ? (
            <div className="text-center py-12">
              <Package2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Inventar topilmadi</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "Qidiruv bo'yicha natija topilmadi" : "Hozircha inventar yozuvlari yo'q"}
              </p>
              {searchTerm && (
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  Qidiruvni tozalash
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead>Miqdor</TableHead>
                  <TableHead>Tashkilot</TableHead>
                  <TableHead>Yaratilgan sana</TableHead>
                  <TableHead className="text-right">Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((item: Inventory) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-sm">INV-{item.id}</TableCell>
                    <TableCell className="font-medium">{item.material.name}</TableCell>
                    <TableCell>
                      <Badge className={unitColors[item.material.unit]}>
                        {item.quantity} {unitLabels[item.material.unit]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span>{item.organization.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {item.organization.type}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(item.created_at).toLocaleDateString("uz-UZ")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditInventory(item)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Tahrirlash
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => confirmDelete(item)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            O‘chirish
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Inventarni tahrirlash</DialogTitle>
            <DialogDescription>Inventar ma'lumotlarini yangilang</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-material">Material *</Label>
              <Select
                value={formData.material_id}
                onValueChange={(value) => setFormData({ ...formData, material_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Materialni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {materials.map((material: Material) => (
                    <SelectItem key={material.id} value={material.id.toString()}>
                      {material.name} ({unitLabels[material.unit]})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-organization">Tashkilot *</Label>
              <Select
                value={formData.organization_id}
                onValueChange={(value) => setFormData({ ...formData, organization_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tashkilotni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org: Organization) => (
                    <SelectItem key={org.id} value={org.id.toString()}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-quantity">{getQuantityLabel()} *</Label>
              <Input
                id="edit-quantity"
                type="number"
                step="0.01"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder={`Masalan: ${getSelectedMaterial()?.unit === "g" ? "100.5" : "10"}`}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false)
                resetForm()
                setSelectedInventory(null)
              }}
            >
              Bekor qilish
            </Button>
            <Button onClick={handleUpdateInventory}>Yangilash</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Inventarni o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              Haqiqatan ham bu inventar yozuvini o'chirmoqchimisiz? Bu amalni bekor qilib bo'lmaydi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Yo'q</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedInventory && handleDeleteInventory(selectedInventory.id)}
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
