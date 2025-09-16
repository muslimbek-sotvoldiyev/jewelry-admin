"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Separator } from "@/src/components/ui/separator"
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
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Textarea } from "@/src/components/ui/textarea"
import { ArrowLeft, Clock, User, Mail, Phone, Calendar, Activity, History, Loader2 } from "lucide-react"
import { Link } from "@/src/i18n/routing"
import { useParams } from "next/navigation"
import { useToast } from "@/src/hooks/use-toast"
import { useGetOrganizationByIdQuery, useUpdateOrganizationMutation } from "@/src/lib/service/atolyeApi"
import { useTranslations } from "next-intl"

// Mock material history - this would come from a separate API endpoint
const materialHistory = [
  {
    id: "1",
    date: "2024-01-25 09:30",
    action: "received",
    material: "250gr Oltin",
    from: "Safe",
    status: "received",
  },
  {
    id: "2",
    date: "2024-01-24 16:45",
    action: "sent",
    material: "180gr Kumush",
    to: "Atolye-2",
    status: "sent",
  },
  {
    id: "3",
    date: "2024-01-24 14:20",
    action: "processed",
    material: "200gr Kumush → 180gr Kumush",
    note: "20gr yo'qotish tozalash jarayonida",
    status: "processed",
  },
]

export default function WorkshopDetailPage() {
  const t = useTranslations('WorkshopDetailPage')
  
  const params = useParams()
  const { toast } = useToast()
  const workshopId = params.id as string

  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [statusNote, setStatusNote] = useState("")

  // API hooks
  const { data: workshop, isLoading, error, refetch } = useGetOrganizationByIdQuery(workshopId)
  const [updateOrganization, { isLoading: isUpdating }] = useUpdateOrganizationMutation()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{t('status.active')}</Badge>
      case "busy":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{t('status.busy')}</Badge>
      case "stopped":
        return <Badge variant="destructive">{t('status.stopped')}</Badge>
      default:
        return <Badge variant="secondary">{t('status.unknown')}</Badge>
    }
  }

  const getActionBadge = (status: string) => {
    switch (status) {
      case "received":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{t('actions.received')}</Badge>
      case "sent":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">{t('actions.sent')}</Badge>
      case "processed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{t('actions.processed')}</Badge>
      default:
        return <Badge variant="secondary">{t('status.unknown')}</Badge>
    }
  }

  const handleStatusChange = async () => {
    if (!newStatus) {
      toast({
        title: t('errors.title'),
        description: t('errors.selectNewStatus'),
        variant: "destructive",
      })
      return
    }

    try {
      const updateData = {
        id: workshopId,
        status: newStatus as "active" | "busy" | "stopped",
      }

      await updateOrganization(updateData).unwrap()

      toast({
        title: t('success.title'),
        description: t('success.statusChanged'),
      })

      setIsStatusDialogOpen(false)
      setNewStatus("")
      setStatusNote("")

      refetch()
    } catch (error) {
      console.error("Status update error:", error)
      toast({
        title: t('errors.title'),
        description: t('errors.statusChangeFailed'),
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="flex items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span>{t('loading.text')}</span>
        </div>
      </div>
    )
  }

  if (error || !workshop) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">{t('errors.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{t('errors.loadWorkshopFailed')}</p>
            <div className="flex gap-2 mt-4">
              <Button onClick={() => refetch()} variant="outline">
                {t('buttons.tryAgain')}
              </Button>
              <Link href="/workshops">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('buttons.goBack')}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/workshops">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('buttons.back')}
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-balance">{workshop.name}</h1>
          <p className="text-muted-foreground">{t('header.description')}</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Activity className="h-4 w-4 mr-2" />
                {t('buttons.changeStatus')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('dialogs.changeStatus.title')}</DialogTitle>
                <DialogDescription>{t('dialogs.changeStatus.description', { name: workshop.name })}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>{t('form.newStatus')}</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('form.selectStatus')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t('status.active')}</SelectItem>
                      <SelectItem value="busy">{t('status.busy')}</SelectItem>
                      <SelectItem value="stopped">{t('status.stopped')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>{t('form.note')}</Label>
                  <Textarea
                    placeholder={t('form.notePlaceholder')}
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleStatusChange} disabled={isUpdating}>
                  {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {t('buttons.change')}
                </Button>
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
            <CardTitle>{t('sections.basicInfo.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{t('sections.basicInfo.owner')}</p>
                <p className="text-sm text-muted-foreground">{workshop.owner}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{t('sections.basicInfo.email')}</p>
                <p className="text-sm text-muted-foreground">{workshop.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{t('sections.basicInfo.phone')}</p>
                <p className="text-sm text-muted-foreground">{workshop.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{t('sections.basicInfo.created')}</p>
                <p className="text-sm text-muted-foreground">{workshop.createdAt}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Status */}
        <Card>
          <CardHeader>
            <CardTitle>{t('sections.currentStatus.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t('sections.currentStatus.status')}</span>
              {getStatusBadge(workshop.status)}
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t('sections.currentStatus.currentMaterial')}</span>
              <span className="text-sm">{workshop.currentMaterial || "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t('sections.currentStatus.process')}</span>
              <span className="text-sm">{workshop.process || "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t('sections.currentStatus.workTime')}</span>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span className="text-sm">{workshop.workTime || "-"}</span>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t('sections.currentStatus.totalWorkTime')}</span>
              <span className="text-sm">{workshop.totalWorkTime || "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t('sections.currentStatus.completedJobs')}</span>
              <span className="text-sm">{workshop.completedJobs || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Material History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            {t('sections.materialHistory.title')}
          </CardTitle>
          <CardDescription>{t('sections.materialHistory.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('sections.materialHistory.headers.date')}</TableHead>
                <TableHead>{t('sections.materialHistory.headers.action')}</TableHead>
                <TableHead>{t('sections.materialHistory.headers.material')}</TableHead>
                <TableHead>{t('sections.materialHistory.headers.destination')}</TableHead>
                <TableHead>{t('sections.materialHistory.headers.note')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materialHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-sm">{item.date}</TableCell>
                  <TableCell>{getActionBadge(item.status)}</TableCell>
                  <TableCell className="font-medium">{item.material}</TableCell>
                  <TableCell>
                    {item.from && `${item.from} ${t('sections.materialHistory.from')}`}
                    {item.to && `${item.to} ${t('sections.materialHistory.to')}`}
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