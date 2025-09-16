"use client"

import type React from "react"

import { useParams } from "next/navigation"
import { useRouter } from "@/src/i18n/routing"
import { Card } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Textarea } from "@/src/components/ui/textarea"
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  AlertTriangle,
  Calendar,
  User,
  Building2,
  University,
  Loader2,
} from "lucide-react"
import { useState } from "react"
import { useGetTransactionByIdQuery, useAcceptTransactionMutation } from "@/src/lib/service/transactionsApi"
import { toast } from "@/src/hooks/use-toast"
import { useTranslations } from "next-intl"

const StatusBadge = ({ status, t }: { status: string, t: any }) => {
  const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"

  switch (status) {
    case "confirmed":
    case "accepted":
      return (
        <span className={`${baseClasses} bg-green-100 text-green-800`}>
          <CheckCircle className="w-3 h-3 mr-1" />
          {t("status.confirmed")}
        </span>
      )
    case "pending":
      return (
        <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
          <Clock className="w-3 h-3 mr-1" />
          {t("status.pending")}
        </span>
      )
    case "rejected":
      return (
        <span className={`${baseClasses} bg-red-100 text-red-800`}>
          <XCircle className="w-3 h-3 mr-1" />
          {t("status.rejected")}
        </span>
      )
    default:
      return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{t("status.unknown")}</span>
  }
}

const OrganizationIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "bank":
      return <University className="w-5 h-5" />
    case "atolye":
      return <Building2 className="w-5 h-5" />
    default:
      return <User className="w-5 h-5" />
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const Alert = ({ children, type = "info" }: { children: React.ReactNode; type?: string }) => {
  const types = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    error: "bg-red-50 border-red-200 text-red-800",
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
  }

  return <div className={`p-4 rounded-xl border-2 ${types[type as keyof typeof types]} shadow-sm`}>{children}</div>
}

export default function TransferDetailPage() {
  const t = useTranslations("TransferDetail")
  const params = useParams()
  const router = useRouter()
  const transferId = params.id as string

  const { data: transferDetail, isLoading, error, refetch } = useGetTransactionByIdQuery(transferId)

  const [acceptTransaction, { isLoading: isAccepting }] = useAcceptTransactionMutation()

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [rejectNote, setRejectNote] = useState("")
  const [formError, setFormError] = useState("")

  const handleConfirmTransfer = async () => {
    try {
      const payload = {
        id: transferId,
        note: "",
        items: transferDetail.items.map((item: any) => ({
          inventory_id: item.inventory.id,
          received_quantity: item.quantity,
        })),
      }

      await acceptTransaction(payload).unwrap()

      toast({
        title: t("success.title"),
        description: t("success.transferConfirmed"),
      })

      setIsConfirmDialogOpen(false)
      refetch()
    } catch (err: any) {
      const errorMessage = err?.data?.detail || err?.data?.message || t("errors.transferConfirmError")

      toast({
        title: t("errors.title"),
        description: errorMessage,
        variant: "destructive",
      })

      setIsConfirmDialogOpen(false)
    }
  }

  const handleRejectTransfer = async () => {
    if (!rejectNote.trim()) {
      setFormError(t("errors.rejectReasonRequired"))
      return
    }

    setFormError("")
  }

  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : null

  const isSender = user?.organization?.id === transferDetail?.sender?.id
  const canConfirm = transferDetail?.status === "pending" && !isSender

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="flex items-center gap-6">
          <div className="relative">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <div className="absolute inset-0 h-10 w-10 rounded-full border-4 border-blue-50 animate-pulse"></div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{t("loading.title")}</h3>
            <p className="text-gray-500">{t("loading.description")}</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 max-w-md">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">{t("errors.errorOccurred")}</h2>
            <p className="text-gray-600 mb-4">{t("errors.transferLoadError")}</p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => router.back()}>
                {t("actions.back")}
              </Button>
              <Button onClick={() => refetch()}>{t("actions.retry")}</Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (!transferDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 max-w-md">
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-2">{t("errors.transferNotFound")}</h2>
            <p className="text-gray-600 mb-4">{t("errors.transferNotFoundDesc")}</p>
            <Button onClick={() => router.back()}>{t("actions.back")}</Button>
          </div>
        </Card>
      </div>
    )
  }

  const totalOriginalAmount =
    transferDetail.items?.reduce((sum: number, item: any) => sum + Number.parseFloat(item.quantity), 0) || 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto px-12 py-8 space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4" />
                {t("actions.back")}
              </Button>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-semibold text-gray-900">{t("header.title", { id: transferDetail.id })}</h1>
                  <StatusBadge status={transferDetail.status} t={t} />
                </div>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(transferDetail.created_at)}
                </p>
              </div>
            </div>

            {canConfirm && (
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsConfirmDialogOpen(true)}
                  disabled={isAccepting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isAccepting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  {t("actions.confirm")}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">{t("sections.transferDirection")}</h2>

          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <OrganizationIcon type={transferDetail.sender.type} />
              </div>
              <h3 className="font-medium text-gray-900">{transferDetail.sender.name}</h3>
              <p className="text-sm text-gray-500 capitalize">{transferDetail.sender.type}</p>
            </div>

            <div className="px-8">
              <ArrowRight className="w-8 h-8 text-gray-400" />
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <OrganizationIcon type={transferDetail.receiver.type} />
              </div>
              <h3 className="font-medium text-gray-900">{transferDetail.receiver.name}</h3>
              <p className="text-sm text-gray-500 capitalize">{transferDetail.receiver.type}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">{t("sections.sentMaterials")}</h2>

              <div className="space-y-3">
                {transferDetail.items.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{item.inventory.material.name}</h4>
                      <p className="text-sm text-gray-500">{t("labels.sender")}: {item.inventory.organization.name}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">
                        {item.quantity} {item.inventory.material.unit}
                      </span>
                      <p className="text-sm text-gray-500">
                        {t("labels.available")}: {item.inventory.quantity} {item.inventory.material.unit}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center font-medium">
                    <span>{t("labels.total")}:</span>
                    <span>{totalOriginalAmount.toFixed(3)} g</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">{t("sections.information")}</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">{t("labels.id")}</p>
                  <p className="font-mono">#{transferDetail.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t("labels.created")}</p>
                  <p className="text-sm">{formatDate(transferDetail.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t("labels.updated")}</p>
                  <p className="text-sm">{formatDate(transferDetail.updated_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t("labels.status")}</p>
                  <StatusBadge status={transferDetail.status} t={t} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {isConfirmDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => !isAccepting && setIsConfirmDialogOpen(false)}
            ></div>
            <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              {isAccepting ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{t("dialogs.confirming.title")}</h3>
                  <p className="text-gray-600">{t("dialogs.confirming.description")}</p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h2 className="text-xl font-medium text-gray-900 mb-2">{t("dialogs.confirmTransfer.title")}</h2>
                    <p className="text-gray-600">{t("dialogs.confirmTransfer.description")}</p>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)} className="flex-1">
                      {t("actions.cancel")}
                    </Button>
                    <Button onClick={handleConfirmTransfer} className="flex-1 bg-green-600 hover:bg-green-700">
                      {t("actions.confirm")}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {isRejectDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsRejectDialogOpen(false)}></div>
            <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <div className="mb-6">
                <h2 className="text-xl font-medium text-gray-900 mb-2">{t("dialogs.rejectTransfer.title")}</h2>
                <p className="text-gray-600">{t("dialogs.rejectTransfer.description")}</p>
              </div>

              {formError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{formError}</p>
                </div>
              )}

              <div className="mb-6">
                <Textarea
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                  placeholder={t("dialogs.rejectTransfer.placeholder")}
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsRejectDialogOpen(false)}
                  className="flex-1"
                >
                  {t("actions.cancel")}
                </Button>
                <Button variant="destructive" onClick={handleRejectTransfer} className="flex-1">
                  {t("actions.reject")}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}