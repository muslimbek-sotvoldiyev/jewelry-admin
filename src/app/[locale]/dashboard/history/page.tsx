"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Calendar } from "@/src/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover"
import { format } from "date-fns"
import { uz } from "date-fns/locale"
import {
  History,
  Search,
  Download,
  Filter,
  CalendarIcon,
  ArrowLeftRight,
  Factory,
  User,
  Gem,
  Clock,
} from "lucide-react"

// Mock history data
const historyData = [
  {
    id: "H001",
    timestamp: "2024-01-25 16:30",
    type: "transfer_created",
    actor: "Admin",
    action: "Transfer yaratildi",
    details: "Atolye-1 dan Atolye-2 ga 180gr Kumush",
    relatedId: "T002",
    status: "pending",
  },
  {
    id: "H002",
    timestamp: "2024-01-25 15:45",
    type: "workshop_timeout",
    actor: "System",
    action: "Atolye ish vaqti tugadi",
    details: "Atolye-3 da ish vaqti tugadi, materiallar qaytarilmoqda",
    relatedId: "W003",
    status: "completed",
  },
  {
    id: "H003",
    timestamp: "2024-01-25 14:25",
    type: "transfer_sent",
    actor: "Ahmad Karimov",
    action: "Transfer yuborildi",
    details: "180gr Kumush Atolye-2 ga yuborildi",
    relatedId: "T002",
    status: "completed",
  },
  {
    id: "H004",
    timestamp: "2024-01-25 09:45",
    type: "transfer_received",
    actor: "Ahmad Karimov",
    action: "Transfer qabul qilindi",
    details: "250gr Oltin Safe dan qabul qilindi",
    relatedId: "T001",
    status: "completed",
  },
  {
    id: "H005",
    timestamp: "2024-01-25 09:30",
    type: "transfer_created",
    actor: "Admin",
    action: "Transfer yaratildi",
    details: "Safe dan Atolye-1 ga 250gr Oltin",
    relatedId: "T001",
    status: "completed",
  },
  {
    id: "H006",
    timestamp: "2024-01-24 18:45",
    type: "material_processed",
    actor: "Dilshod Rahimov",
    action: "Material qayta ishlandi",
    details: "200gr Kumush → 180gr Kumush (20gr yo'qotish)",
    relatedId: "T004",
    status: "completed",
  },
  {
    id: "H007",
    timestamp: "2024-01-24 14:15",
    type: "workshop_status_changed",
    actor: "Admin",
    action: "Atolye holati o'zgartirildi",
    details: "Atolye-4 holati 'Faol' ga o'zgartirildi",
    relatedId: "W004",
    status: "completed",
  },
]

const getActionIcon = (type: string) => {
  switch (type) {
    case "transfer_created":
    case "transfer_sent":
    case "transfer_received":
      return <ArrowLeftRight className="h-4 w-4 text-blue-600" />
    case "workshop_timeout":
    case "workshop_status_changed":
      return <Factory className="h-4 w-4 text-purple-600" />
    case "material_processed":
      return <Gem className="h-4 w-4 text-green-600" />
    case "user_login":
      return <User className="h-4 w-4 text-gray-600" />
    default:
      return <History className="h-4 w-4 text-gray-600" />
  }
}

const getStatusBadge = (status: string, t: any) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{t("history.status.completed")}</Badge>
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{t("history.status.pending")}</Badge>
    case "failed":
      return <Badge variant="destructive">{t("history.status.failed")}</Badge>
    default:
      return <Badge variant="secondary">{t("history.status.unknown")}</Badge>
  }
}

export default function HistoryPage() {
  const t = useTranslations()
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [actorFilter, setActorFilter] = useState("all")
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()

  const filteredHistory = historyData.filter((item) => {
    const matchesSearch =
      item.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.actor.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || item.type === typeFilter
    const matchesActor = actorFilter === "all" || item.actor === actorFilter

    const itemDate = new Date(item.timestamp)
    const matchesDateFrom = !dateFrom || itemDate >= dateFrom
    const matchesDateTo = !dateTo || itemDate <= dateTo

    return matchesSearch && matchesType && matchesActor && matchesDateFrom && matchesDateTo
  })

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Exporting history data")
  }

  const clearFilters = () => {
    setSearchTerm("")
    setTypeFilter("all")
    setActorFilter("all")
    setDateFrom(undefined)
    setDateTo(undefined)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">{t("history.title")}</h1>
          <p className="text-muted-foreground">{t("history.subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={clearFilters}>
            <Filter className="h-4 w-4 mr-2" />
            {t("history.actions.clearFilters")}
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            {t("history.actions.export")}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("history.stats.totalEvents")}</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{historyData.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("history.stats.todayEvents")}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {historyData.filter((item) => item.timestamp.startsWith("2024-01-25")).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("history.stats.transfers")}</CardTitle>
            <ArrowLeftRight className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {historyData.filter((item) => item.type.includes("transfer")).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("history.stats.workshopEvents")}</CardTitle>
            <Factory className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {historyData.filter((item) => item.type.includes("workshop")).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{t("history.filters.title")}</CardTitle>
          <CardDescription>{t("history.filters.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <Label>{t("history.filters.search")}</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("history.filters.searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("history.filters.eventType")}</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t("history.filters.selectType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("history.filters.all")}</SelectItem>
                  <SelectItem value="transfer_created">{t("history.eventTypes.transferCreated")}</SelectItem>
                  <SelectItem value="transfer_sent">{t("history.eventTypes.transferSent")}</SelectItem>
                  <SelectItem value="transfer_received">{t("history.eventTypes.transferReceived")}</SelectItem>
                  <SelectItem value="workshop_timeout">{t("history.eventTypes.workshopTimeout")}</SelectItem>
                  <SelectItem value="workshop_status_changed">
                    {t("history.eventTypes.workshopStatusChanged")}
                  </SelectItem>
                  <SelectItem value="material_processed">{t("history.eventTypes.materialProcessed")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t("history.filters.user")}</Label>
              <Select value={actorFilter} onValueChange={setActorFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t("history.filters.selectUser")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("history.filters.all")}</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="System">System</SelectItem>
                  <SelectItem value="Ahmad Karimov">Ahmad Karimov</SelectItem>
                  <SelectItem value="Dilshod Rahimov">Dilshod Rahimov</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t("history.filters.startDate")}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "dd.MM.yyyy", { locale: uz }) : t("history.filters.selectDate")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>{t("history.filters.endDate")}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "dd.MM.yyyy", { locale: uz }) : t("history.filters.selectDate")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("history.table.title")}</CardTitle>
          <CardDescription>
            {t("history.table.description", { count: filteredHistory.length })}
            {(dateFrom || dateTo) && (
              <span>
                {" "}
                ({dateFrom && format(dateFrom, "dd.MM.yyyy", { locale: uz })}
                {dateFrom && dateTo && " - "}
                {dateTo && format(dateTo, "dd.MM.yyyy", { locale: uz })})
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("history.table.date")}</TableHead>
                <TableHead>{t("history.table.action")}</TableHead>
                <TableHead>{t("history.table.user")}</TableHead>
                <TableHead>{t("history.table.details")}</TableHead>
                <TableHead>{t("history.table.status")}</TableHead>
                <TableHead>ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-sm">{item.timestamp}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getActionIcon(item.type)}
                      <span className="font-medium">{item.action}</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.actor}</TableCell>
                  <TableCell className="max-w-md">
                    <p className="text-sm text-pretty">{item.details}</p>
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status, t)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {item.relatedId}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredHistory.length === 0 && (
            <div className="text-center py-8">
              <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">{t("history.empty")}</h3>
              <p className="text-muted-foreground">{t("history.emptyDescription")}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
