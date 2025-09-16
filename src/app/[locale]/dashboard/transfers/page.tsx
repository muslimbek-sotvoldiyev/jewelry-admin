"use client"

import { useState } from "react"
import { Link } from "@/src/i18n/routing"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Input } from "@/src/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Search, Eye, CheckCircle, Clock, XCircle, ArrowLeftRight, Loader2 } from "lucide-react"
import { useGetTransactionsQuery } from "@/src/lib/service/transactionsApi"
import { getCurrentUser } from "@/src/lib/auth"
import type Organization from "@/src/types/organization"
import { useGetOrganizationsQuery } from "@/src/lib/service/atolyeApi"
import type { Transaction } from "@/src/types/transactions"
import { useTranslations } from "next-intl"

// status badge function
const getStatusBadge = (status: string, t: any) => {
  switch (status) {
    case "accepted":
    case "confirmed":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="h-3 w-3 mr-1" />
          {t("status.accepted")}
        </Badge>
      )
    case "pending":
    case "pending_sender":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <Clock className="h-3 w-3 mr-1" />
          {t("status.pending")}
        </Badge>
      )
    case "pending_receiver":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          <Clock className="h-3 w-3 mr-1" />
          {t("status.pendingReceiver")}
        </Badge>
      )
    case "returned":
      return (
        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
          <ArrowLeftRight className="h-3 w-3 mr-1" />
          {t("status.returned")}
        </Badge>
      )
    case "cancelled":
    case "rejected":
      return (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          {t("status.cancelled")}
        </Badge>
      )
    default:
      return <Badge variant="secondary">{t("status.unknown")}</Badge>
  }
}

export default function TransfersPage() {
  const t = useTranslations("transfers")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [organizationFilter, setOrganizationFilter] = useState("all")

  const user = getCurrentUser()

  const {
    data: transfers = [] as Transaction[],
    isLoading,
    error,
    refetch,
  } = useGetTransactionsQuery({
    search: searchTerm || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  })

  const { data: organizations = [] } = useGetOrganizationsQuery({})

  const filteredTransfers = transfers.filter((transfer: Transaction) => {
    const matchesSearch =
      transfer.id.toString().includes(searchTerm.toLowerCase()) ||
      transfer.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.receiver.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || transfer.status === statusFilter

    const matchesOrganization =
      organizationFilter === "all" ||
      transfer.receiver.id.toString() === organizationFilter ||
      transfer.sender.id.toString() === organizationFilter

    return matchesSearch && matchesStatus && matchesOrganization
  })

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("uz-UZ", { dateStyle: "short", timeStyle: "short" })

  if (error) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t("title")}</h1>
            <p className="text-muted-foreground">{t("subtitle")}</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/transfers/create">+ {t("new")}</Link>
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-500 mb-4">{t("error")}</p>
              <Button onClick={() => refetch()}>{t("retry")}</Button>
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
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/transfers/create">+ {t("new")}</Link>
        </Button>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{t("list.title")}</CardTitle>
          <CardDescription>
            {isLoading ? t("loading") : t("list.total", { count: transfers.length })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={t("filters.status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filters.all")}</SelectItem>
                <SelectItem value="pending">{t("filters.pending")}</SelectItem>
                <SelectItem value="accepted">{t("filters.accepted")}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={organizationFilter} onValueChange={setOrganizationFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={t("filters.organization")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filters.all")}</SelectItem>
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
              <span>{t("loading")}</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>{t("table.from")}</TableHead>
                  <TableHead>{t("table.to")}</TableHead>
                  <TableHead>{t("table.materials")}</TableHead>
                  <TableHead>{t("table.status")}</TableHead>
                  <TableHead>{t("table.date")}</TableHead>
                  <TableHead>{t("table.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransfers.length > 0 ? (
                  filteredTransfers.map((tr) => (
                    <TableRow key={tr.id}>
                      <TableCell className="font-mono">#{tr.id}</TableCell>
                      <TableCell>{tr.sender.name}</TableCell>
                      <TableCell>{tr.receiver.name}</TableCell>
                      <TableCell>
                        {tr.items && tr.items.length > 0 ? (
                          <ul className="space-y-1">
                            {tr.items.map((it: any) => (
                              <li key={it.id} className="text-sm flex justify-between">
                                <span>{it.inventory.material.name}</span>
                                <span className="font-mono">
                                  {it.quantity} {it.inventory.material.unit}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-500 text-sm">{t("table.noData")}</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(tr.status, t)}</TableCell>
                      <TableCell className="text-sm">{formatDate(tr.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/transfers/${tr.id}`}>
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
                          ? t("empty.search")
                          : t("empty.default")}
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
