"use client"

import type React from "react"

import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, CheckCircle, XCircle, Clock, ArrowRight, AlertTriangle, Calendar, User, Building2, University, Loader2 } from "lucide-react"
import { useState } from "react"
import { useGetTransactionByIdQuery, useAcceptTransactionMutation, useRejectTransactionMutation } from "@/lib/service/transactionsApi"
import { toast } from "@/hooks/use-toast"

const StatusBadge = ({ status }: { status: string }) => {
  const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"

  switch (status) {
    case "confirmed":
    case "accepted":
      return (
        <span className={`${baseClasses} bg-green-100 text-green-800`}>
          <CheckCircle className="w-3 h-3 mr-1" />
          Tasdiqlangan
        </span>
      )
    case "pending":
      return (
        <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
          <Clock className="w-3 h-3 mr-1" />
          Tasdiqlash kutilmoqda
        </span>
      )
    case "rejected":
      return (
        <span className={`${baseClasses} bg-red-100 text-red-800`}>
          <XCircle className="w-3 h-3 mr-1" />
          Rad etilgan
        </span>
      )
    default:
      return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Noma'lum</span>
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
  const params = useParams()
  const router = useRouter()
  const transferId = params.id as string

  const { data: transferDetail, isLoading, error, refetch } = useGetTransactionByIdQuery(transferId)

  const [acceptTransaction, { isLoading: isAccepting }] = useAcceptTransactionMutation()
  const [rejectTransaction, { isLoading: isRejecting }] = useRejectTransactionMutation()

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [rejectNote, setRejectNote] = useState("")
  const [formError, setFormError] = useState("")

  const handleConfirmTransfer = async () => {
    try {
      const payload = {
        id: transferId,
        note: "", // Empty note as requested by user
        items: transferDetail.items.map((item: any) => ({
          inventory_id: item.inventory.id,
          received_quantity: item.quantity, // Use the requested quantity as received quantity
        })),
      }

      await acceptTransaction(payload).unwrap()

      toast({
        title: "Muvaffaqiyat!",
        description: "Transfer muvaffaqiyatli tasdiqlandi.",
      })

      setIsConfirmDialogOpen(false)
      refetch()
    } catch (err: any) {
      const errorMessage = err?.data?.detail || err?.data?.message || "Transfer tasdiqlashda xatolik yuz berdi."

      toast({
        title: "Xatolik!",
        description: errorMessage,
        variant: "destructive",
      })

      setIsConfirmDialogOpen(false)
    }
  }

  const handleRejectTransfer = async () => {
    if (!rejectNote.trim()) {
      setFormError("Rad etish sababini ko'rsating")
      return
    }

    setFormError("")

    try {
      await rejectTransaction({
        id: transferId,
        note: rejectNote,
      }).unwrap()

      toast({
        title: "Transfer rad etildi",
        description: "Transfer muvaffaqiyatli rad etildi.",
      })

      setIsRejectDialogOpen(false)
      setRejectNote("")
      setFormError("")
      refetch()
    } catch (err: any) {
      const errorMessage = err?.data?.message || "Transfer rad etishda xatolik yuz berdi."
      setFormError(errorMessage)
      toast({
        title: "Xatolik!",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="flex items-center gap-6">
          <div className="relative">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <div className="absolute inset-0 h-10 w-10 rounded-full border-4 border-blue-50 animate-pulse"></div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">Yuklanmoqda</h3>
            <p className="text-gray-500">Transfer ma'lumotlari yuklanmoqda...</p>
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
            <h2 className="text-lg font-semibold mb-2">Xatolik yuz berdi</h2>
            <p className="text-gray-600 mb-4">Transfer ma'lumotlarini yuklashda muammo yuz berdi.</p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => router.back()}>
                Orqaga
              </Button>
              <Button onClick={() => refetch()}>Qayta urinish</Button>
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
            <h2 className="text-lg font-semibold mb-2">Transfer topilmadi</h2>
            <p className="text-gray-600 mb-4">Bunday ID bilan transfer mavjud emas.</p>
            <Button onClick={() => router.back()}>Orqaga</Button>
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
                Orqaga
              </Button>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-semibold text-gray-900">Transfer #{transferDetail.id}</h1>
                  <StatusBadge status={transferDetail.status} />
                </div>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(transferDetail.created_at)}
                </p>
              </div>
            </div>

            {transferDetail.status === "pending" && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsRejectDialogOpen(true)}
                  disabled={isRejecting}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Rad etish
                </Button>
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
                  Tasdiqlash
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Transfer yo'nalishi</h2>

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
              <h2 className="text-lg font-medium text-gray-900 mb-4">Yuborilgan materiallar</h2>

              <div className="space-y-3">
                {transferDetail.items.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{item.inventory.material.name}</h4>
                      <p className="text-sm text-gray-500">Yuboruvchi: {item.inventory.organization.name}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">
                        {item.quantity} {item.inventory.material.unit}
                      </span>
                      <p className="text-sm text-gray-500">
                        Mavjud: {item.inventory.quantity} {item.inventory.material.unit}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center font-medium">
                    <span>Jami:</span>
                    <span>{totalOriginalAmount.toFixed(3)} g</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Ma'lumotlar</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">ID</p>
                  <p className="font-mono">#{transferDetail.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Yaratilgan</p>
                  <p className="text-sm">{formatDate(transferDetail.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Yangilangan</p>
                  <p className="text-sm">{formatDate(transferDetail.updated_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Holat</p>
                  <StatusBadge status={transferDetail.status} />
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Tasdiqlashda...</h3>
                  <p className="text-gray-600">Transfer tasdiqlash jarayonida</p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h2 className="text-xl font-medium text-gray-900 mb-2">Transferni tasdiqlash</h2>
                    <p className="text-gray-600">Bu transferni tasdiqlashni xohlaysizmi?</p>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)} className="flex-1">
                      Bekor qilish
                    </Button>
                    <Button onClick={handleConfirmTransfer} className="flex-1 bg-green-600 hover:bg-green-700">
                      Tasdiqlash
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
                <h2 className="text-xl font-medium text-gray-900 mb-2">Transferni rad etish</h2>
                <p className="text-gray-600">Rad etish sababini ko'rsating</p>
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
                  placeholder="Nima sababdan rad etilayapti?"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsRejectDialogOpen(false)}
                  disabled={isRejecting}
                  className="flex-1"
                >
                  Bekor qilish
                </Button>
                <Button variant="destructive" onClick={handleRejectTransfer} disabled={isRejecting} className="flex-1">
                  {isRejecting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Rad etish
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
