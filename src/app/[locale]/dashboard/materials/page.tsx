"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"

import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Badge } from "@/src/components/ui/badge"
import { toast } from "@/src/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/src/components/ui/alert-dialog"
import { useGetMaterialsQuery, useAddMaterialMutation, useUpdateMaterialMutation, useDeleteMaterialMutation, MaterialsApi } from "@/src/lib/service/materialsApi"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"

import { Search, Plus, Edit, Trash2, Loader2 } from "lucide-react"
import Material from "@/src/types/material"
import { unitColors, unitLabels } from "@/src/constants/units"
import { useTranslations } from "next-intl"


export default function MaterialsPage() {
  const t = useTranslations("materials")
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
        title: t("errors.title"),
        description: t("errors.fillRequired"),
        variant: "destructive",
      })
      return
    }

    // Check if material name already exists
    if (materials.some((material: Material) => material.name.toLowerCase() === formData.name.toLowerCase())) {
      toast({
        title: t("errors.title"),
        description: t("errors.nameExists"),
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
        title: t("success.title"),
        description: t("success.created"),
      })
      dispatch(MaterialsApi.util.resetApiState())
    } catch (error) {
      toast({
        title: t("errors.title"),
        description: t("errors.createFailed"),
        variant: "destructive",
      })
    }
  }

  const handleEditMaterial = (material: Material) => {
    setSelectedMaterial(material)
    setFormData({
      name: material.name,
      unit: material.unit as "g" | "pcs" | "ct" | "",
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateMaterial = async () => {
    if (!selectedMaterial) return

    // Validate required fields
    if (!formData.name || !formData.unit) {
      toast({
        title: t("errors.title"),
        description: t("errors.fillRequired"),
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
        title: t("errors.title"),
        description: t("errors.nameExists"),
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
        title: t("success.title"),
        description: t("success.updated"),
      })
      dispatch(MaterialsApi.util.resetApiState())
    } catch (error) {
      toast({
        title: t("errors.title"),
        description: t("errors.updateFailed"),
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
        title: t("success.title"),
        description: t("success.deleted"),
      })
      dispatch(MaterialsApi.util.resetApiState())
    } catch (error) {
      toast({
        title: t("errors.title"),
        description: t("errors.deleteFailed"),
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
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">{t("loading")}</span>
        </div>
      </div>
    )
  }

  if (materialsError) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600 mb-4">{t("errors.loadFailed")}</p>
            <Button onClick={() => window.location.reload()}>{t("actions.retry")}</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t("actions.create")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>{t("dialogs.create.title")}</DialogTitle>
              <DialogDescription>{t("dialogs.create.description")}</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">{t("form.name")} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t("form.namePlaceholder")}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="unit">{t("form.unit")} *</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value: "g" | "pcs" | "ct") => setFormData({ ...formData, unit: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("form.unitPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="g">{t("units.gram")}</SelectItem>
                    <SelectItem value="pcs">{t("units.pieces")}</SelectItem>
                    <SelectItem value="ct">{t("units.carat")}</SelectItem>
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
                {t("actions.cancel")}
              </Button>
              <Button onClick={handleCreateMaterial}>{t("actions.create")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("search.placeholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("table.title")}</CardTitle>
          <CardDescription>{t("table.description", { count: materials.length })}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>{t("table.columns.name")}</TableHead>
                <TableHead>{t("table.columns.unit")}</TableHead>
                <TableHead>{t("table.columns.createdAt")}</TableHead>
                <TableHead className="text-right">{t("table.columns.actions")}</TableHead>
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
                      <Edit className="h-4 w-4 mr-1" /> {t("actions.edit")}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => confirmDelete(material)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> {t("actions.delete")}
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
            <DialogTitle>{t("dialogs.edit.title")}</DialogTitle>
            <DialogDescription>{t("dialogs.edit.description")}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">{t("form.name")} *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t("form.namePlaceholder")}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-unit">{t("form.unit")} *</Label>
              <Select
                value={formData.unit}
                onValueChange={(value: "g" | "pcs" | "ct") => setFormData({ ...formData, unit: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("form.unitPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="g">{t("units.gram")}</SelectItem>
                  <SelectItem value="pcs">{t("units.pieces")}</SelectItem>
                  <SelectItem value="ct">{t("units.carat")}</SelectItem>
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
              {t("actions.cancel")}
            </Button>
            <Button onClick={handleUpdateMaterial}>{t("actions.update")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("dialogs.delete.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("dialogs.delete.description", { name: selectedMaterial?.name || "" })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("dialogs.delete.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedMaterial && handleDeleteMaterial(selectedMaterial.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              {t("dialogs.delete.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}