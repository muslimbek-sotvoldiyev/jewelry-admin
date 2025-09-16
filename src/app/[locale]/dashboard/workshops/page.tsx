"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Input } from "@/src/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog"
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
} from "@/src/components/ui/alert-dialog"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Plus, Search, Eye, Edit, Clock, Factory, AlertTriangle, Loader2, Trash2 } from "lucide-react"
import { useToast } from "@/src/hooks/use-toast"
import {
  useGetOrganizationsQuery,
  useAddOrganizationMutation,
  useDeleteOrganizationMutation,
  useUpdateOrganizationMutation,
} from "@/src/lib/service/atolyeApi"
import { Link } from "@/src/i18n/routing"
import { useTranslations } from "next-intl"

export default function WorkshopsPage() {
    const t = useTranslations()
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{t('WorkshopsPage.status.active')}</Badge>
      case "busy":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{t('WorkshopsPage.status.busy')}</Badge>
      case "stopped":
        return <Badge variant="destructive">{t('WorkshopsPage.status.stopped')}</Badge>
      default:
        return <Badge variant="secondary">{t('WorkshopsPage.status.unknown')}</Badge>
    }
  }

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
        title: t('WorkshopsPage.errors.title'),
        description: t('WorkshopsPage.errors.fillAllFields'),
        variant: "destructive",
      })
      return
    }

    try {
      await addOrganization(newWorkshop).unwrap()
      toast({
        title: t('WorkshopsPage.success.title'),
        description: t('WorkshopsPage.success.workshopCreated'),
      })
      setIsCreateDialogOpen(false)
      setNewWorkshop({ name: "", type: "" })
    } catch (error) {
      toast({
        title: t('WorkshopsPage.errors.title'),
        description: t('WorkshopsPage.errors.createWorkshopFailed'),
        variant: "destructive",
      })
    }
  }

  const handleEditWorkshop = async () => {
    if (!editWorkshop.name || !editWorkshop.type) {
      toast({
        title: t('WorkshopsPage.errors.title'),
        description: t('WorkshopsPage.errors.fillAllFields'),
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
        title: t('WorkshopsPage.success.title'),
        description: t('WorkshopsPage.success.workshopUpdated'),
      })
      setIsEditDialogOpen(false)
      setSelectedWorkshop(null)
      setEditWorkshop({ name: "", type: "" })
    } catch (error) {
      toast({
        title: t('WorkshopsPage.errors.title'),
        description: t('WorkshopsPage.errors.updateWorkshopFailed'),
        variant: "destructive",
      })
    }
  }

  const handleDeleteWorkshop = async (id: string) => {
    try {
      await deleteOrganization(id).unwrap()
      toast({
        title: t('WorkshopsPage.success.title'),
        description: t('WorkshopsPage.success.workshopDeleted'),
      })
    } catch (error) {
      toast({
        title: t('WorkshopsPage.errors.title'),
        description: t('WorkshopsPage.errors.deleteWorkshopFailed'),
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
            <CardTitle className="text-destructive">{t('WorkshopsPage.errors.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{t('WorkshopsPage.errors.loadDataFailed')}</p>
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
          <h1 className="text-3xl font-bold text-balance">{t('WorkshopsPage.header.title')}</h1>
          <p className="text-muted-foreground">{t('WorkshopsPage.header.description')}</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t('WorkshopsPage.buttons.newWorkshop')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t('WorkshopsPage.dialogs.create.title')}</DialogTitle>
              <DialogDescription>{t('WorkshopsPage.dialogs.create.description')}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">{t('WorkshopsPage.form.workshopName')} *</Label>
                <Input
                  id="name"
                  placeholder={t('WorkshopsPage.form.workshopNamePlaceholder')}
                  value={newWorkshop.name}
                  onChange={(e) => setNewWorkshop({ ...newWorkshop, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">{t('WorkshopsPage.form.workshopType')} *</Label>
                <Select
                  value={newWorkshop.type}
                  onValueChange={(value) => setNewWorkshop({ ...newWorkshop, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('WorkshopsPage.form.selectWorkshopType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gold_processing">{t('WorkshopsPage.types.goldProcessing')}</SelectItem>
                    <SelectItem value="silver_processing">{t('WorkshopsPage.types.silverProcessing')}</SelectItem>
                    <SelectItem value="jewelry_making">{t('WorkshopsPage.types.jewelryMaking')}</SelectItem>
                    <SelectItem value="cleaning">{t('WorkshopsPage.types.cleaning')}</SelectItem>
                    <SelectItem value="repair">{t('WorkshopsPage.types.repair')}</SelectItem>
                    <SelectItem value="bank">{t('WorkshopsPage.types.bank')}</SelectItem>
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
                {t('WorkshopsPage.buttons.cancel')}
              </Button>
              <Button type="submit" onClick={handleCreateWorkshop} disabled={isCreating}>
                {isCreating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {t('WorkshopsPage.buttons.create')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('WorkshopsPage.dialogs.edit.title')}</DialogTitle>
            <DialogDescription>{t('WorkshopsPage.dialogs.edit.description')}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">{t('WorkshopsPage.form.workshopName')} *</Label>
              <Input
                id="edit-name"
                placeholder={t('WorkshopsPage.form.workshopNamePlaceholder')}
                value={editWorkshop.name}
                onChange={(e) => setEditWorkshop({ ...editWorkshop, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-type">{t('WorkshopsPage.form.workshopType')} *</Label>
              <Select
                value={editWorkshop.type}
                onValueChange={(value) => setEditWorkshop({ ...editWorkshop, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('WorkshopsPage.form.selectWorkshopType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gold_processing">{t('WorkshopsPage.types.goldProcessing')}</SelectItem>
                  <SelectItem value="silver_processing">{t('WorkshopsPage.types.silverProcessing')}</SelectItem>
                  <SelectItem value="jewelry_making">{t('WorkshopsPage.types.jewelryMaking')}</SelectItem>
                  <SelectItem value="cleaning">{t('WorkshopsPage.types.cleaning')}</SelectItem>
                  <SelectItem value="repair">{t('WorkshopsPage.types.repair')}</SelectItem>
                  <SelectItem value="bank">{t('WorkshopsPage.types.bank')}</SelectItem>
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
              {t('WorkshopsPage.buttons.cancel')}
            </Button>
            <Button type="submit" onClick={handleEditWorkshop} disabled={isUpdating}>
              {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t('WorkshopsPage.buttons.update')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('WorkshopsPage.stats.totalWorkshops')}</CardTitle>
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
            <CardTitle className="text-sm font-medium">{t('WorkshopsPage.stats.active')}</CardTitle>
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
            <CardTitle className="text-sm font-medium">{t('WorkshopsPage.stats.busy')}</CardTitle>
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
            <CardTitle className="text-sm font-medium">{t('WorkshopsPage.stats.stopped')}</CardTitle>
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
          <CardTitle>{t('WorkshopsPage.table.title')}</CardTitle>
          <CardDescription>{t('WorkshopsPage.table.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('WorkshopsPage.search.placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('WorkshopsPage.filters.statusPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('WorkshopsPage.filters.all')}</SelectItem>
                <SelectItem value="active">{t('WorkshopsPage.status.active')}</SelectItem>
                <SelectItem value="busy">{t('WorkshopsPage.status.busy')}</SelectItem>
                <SelectItem value="stopped">{t('WorkshopsPage.status.stopped')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">{t('WorkshopsPage.loading.text')}</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('WorkshopsPage.table.headers.workshop')}</TableHead>
                  <TableHead>{t('WorkshopsPage.table.headers.owner')}</TableHead>
                  <TableHead>{t('WorkshopsPage.table.headers.status')}</TableHead>
                  <TableHead>{t('WorkshopsPage.table.headers.currentMaterial')}</TableHead>
                  <TableHead>{t('WorkshopsPage.table.headers.workTime')}</TableHead>
                  <TableHead>{t('WorkshopsPage.table.headers.process')}</TableHead>
                  <TableHead>{t('WorkshopsPage.table.headers.actions')}</TableHead>
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
                        <Link href={`/dashboard/workshops/${workshop.id}`}>
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
                              <AlertDialogTitle>{t('WorkshopsPage.dialogs.delete.title')}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {t('WorkshopsPage.dialogs.delete.description', { name: workshop.name })}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t('WorkshopsPage.buttons.cancel')}</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteWorkshop(workshop.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                disabled={isDeleting}
                              >
                                {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                {t('WorkshopsPage.buttons.delete')}
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