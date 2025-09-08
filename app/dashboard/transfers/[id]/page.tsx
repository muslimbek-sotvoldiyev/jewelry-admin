"use client"

import { Card } from "@/components/ui/card"
// import { Card } from "@/components/ui/card"
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  AlertTriangle,
  MessageSquare,
  Calendar,
  User,
  Package,
  Building2,
  University,
} from "lucide-react"
import { useState } from "react"

// Mock transfer detail data
const transferDetail = {
  id: 7,
  items: [
    {
      id: 10,
      inventory: {
        id: 1,
        organization: { id: 2, name: "Toshkent Atolye", type: "atolye" },
        material: { id: 1, name: "Oltin (24K)", unit: "g" },
        quantity: "6.600",
      },
      quantity: "25.000",
      transaction: 7,
    },
    {
      id: 11,
      inventory: {
        id: 3,
        organization: { id: 2, name: "Toshkent Atolye", type: "atolye" },
        material: { id: 2, name: "Kumush", unit: "g" },
        quantity: "45.000",
      },
      quantity: "45.000",
      transaction: 7,
    },
  ],
  sender: { id: 2, name: "Toshkent Atolye", type: "atolye" },
  receiver: { id: 1, name: "Markaziy Bank", type: "bank" },
  created_at: "2025-09-07T19:12:12.711935Z",
  updated_at: "2025-09-07T19:12:12.711970Z",
  status: "pending",
}

const StatusBadge = ({ status }) => {
  const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"

  switch (status) {
    case "confirmed":
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

const OrganizationIcon = ({ type }) => {
  switch (type) {
    case "bank":
      return <University className="w-5 h-5" />
    case "atolye":
      return <Building2 className="w-5 h-5" />
    default:
      return <User className="w-5 h-5" />
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const Button = ({ children, onClick, variant = "default", size = "md", disabled = false, className = "" }) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"

  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500"
  }

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  )
}

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  )
}



const Alert = ({ children, type = "info" }) => {
  const types = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    error: "bg-red-50 border-red-200 text-red-800",
    success: "bg-green-50 border-green-200 text-green-800"
  }

  return (
    <div className={`p-4 rounded-lg border ${types[type]}`}>
      {children}
    </div>
  )
}

export default function TransferDetailPage() {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [receivedAmounts, setReceivedAmounts] = useState(
    transferDetail.items.map((item) => item.quantity)
  )
  const [confirmNote, setConfirmNote] = useState("")
  const [rejectNote, setRejectNote] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleConfirmTransfer = async () => {
    setLoading(true)
    setError("")

    try {
      // Miqdorlarni tekshirish
      const allValid = receivedAmounts.every((amount, i) => {
        const original = parseFloat(transferDetail.items[i].quantity)
        const received = parseFloat(amount)
        return !isNaN(received) && received >= 0 && received <= original
      })

      if (!allValid) {
        setError("Qabul qilingan miqdor noto'g'ri yoki asl miqdordan katta.")
        setLoading(false)
        return
      }

      // API call simulation
      await new Promise(resolve => setTimeout(resolve, 1000))

      console.log("Confirming transfer:", {
        transferId: transferDetail.id,
        receivedAmounts,
        note: confirmNote,
      })

      setIsConfirmDialogOpen(false)
      setConfirmNote("")
      setError("")
      alert("Transfer muvaffaqiyatli tasdiqlandi!")

    } catch (err) {
      setError("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.")
    } finally {
      setLoading(false)
    }
  }

  const handleRejectTransfer = async () => {
    if (!rejectNote.trim()) {
      setError("Rad etish sababini ko'rsating")
      return
    }

    setLoading(true)
    setError("")

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      console.log("Rejecting transfer:", {
        transferId: transferDetail.id,
        note: rejectNote,
      })

      setIsRejectDialogOpen(false)
      setRejectNote("")
      setError("")
      alert("Transfer rad etildi!")

    } catch (err) {
      setError("Xatolik yuz berdi.")
    } finally {
      setLoading(false)
    }
  }

  const handleReceivedAmountChange = (index, value) => {
    const newAmounts = [...receivedAmounts]
    newAmounts[index] = value
    setReceivedAmounts(newAmounts)
  }

  const totalOriginalAmount = transferDetail.items.reduce((sum, item) =>
    sum + parseFloat(item.quantity), 0
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="gap-2" onClick="">
                <ArrowLeft className="w-4 h-4" />
                Orqaga
              </Button>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold">Transfer #{transferDetail.id}</h1>
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
                  variant="destructive"
                  onClick={() => setIsRejectDialogOpen(true)}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Rad etish
                </Button>
                <Button
                  variant="success"
                  onClick={() => setIsConfirmDialogOpen(true)}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Qabul qilish
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Transfer Flow */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <ArrowRight className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Transfer yo'nalishi</h2>
              </div>

              <div className="flex items-center justify-between">
                {/* Sender */}
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg flex-1">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <OrganizationIcon type={transferDetail.sender.type} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{transferDetail.sender.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{transferDetail.sender.type}</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Yuborildi
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="px-4">
                  <ArrowRight className="w-8 h-8 text-gray-400" />
                </div>

                {/* Receiver */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg flex-1">
                  <div className="p-3 bg-gray-200 rounded-full">
                    <OrganizationIcon type={transferDetail.receiver.type} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{transferDetail.receiver.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{transferDetail.receiver.type}</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      Kutilmoqda
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Materials List */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Package className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Yuborilgan materiallar</h2>
              </div>

              <div className="space-y-4">
                {transferDetail.items.map((item, index) => (
                  <div key={item.id} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-lg">{item.inventory.material.name}</h4>
                      <span className="inline-flex items-center px-2 py-1 rounded border bg-white text-sm font-medium">
                        {item.quantity} {item.inventory.material.unit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Yuboruvchi: {item.inventory.organization.name}</span>
                      <span>Mavjud: {item.inventory.quantity} {item.inventory.material.unit}</span>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center font-semibold text-lg">
                    <span>Jami:</span>
                    <span>{totalOriginalAmount.toFixed(3)} g</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Transfer Info */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Transfer ma'lumotlari</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">ID</p>
                  <p className="font-mono">#{transferDetail.id}</p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-500 mb-1">Yaratilgan vaqt</p>
                  <p>{formatDate(transferDetail.created_at)}</p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-500 mb-1">Oxirgi yangilanish</p>
                  <p>{formatDate(transferDetail.updated_at)}</p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-500 mb-2">Holat</p>
                  <StatusBadge status={transferDetail.status} />
                </div>
              </div>
            </Card>

            {transferDetail.status === "pending" && (
              <Alert type="warning">
                <div className="flex">
                  <AlertTriangle className="w-4 h-4 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Tasdiqlash kutilmoqda</p>
                    <p className="text-sm mt-1">Bu transfer sizning tasdiqlashingizni kutmoqda. Materiallarni qabul qilganingizdan so'ng tasdiqlang.</p>
                  </div>
                </div>
              </Alert>
            )}
          </div>
        </div>

        {/* Confirmation Modal */}
        <Modal isOpen={isConfirmDialogOpen} onClose={() => setIsConfirmDialogOpen(false)}>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold">Transferni tasdiqlash</h2>
            </div>
            <p className="text-gray-600 mb-6">Qabul qilingan materiallar miqdorini kiriting va transferni tasdiqlang.</p>

            <div className="space-y-4 mb-6">
              {error && (
                <Alert type="error">
                  <div className="flex">
                    <AlertTriangle className="w-4 h-4 mr-3 mt-0.5" />
                    <p>{error}</p>
                  </div>
                </Alert>
              )}

              <div className="space-y-4">
                {transferDetail.items.map((item, index) => (
                  <div key={item.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-medium">{item.inventory.material.name}</label>
                      <span className="text-sm text-gray-500">
                        Yuborilgan: {item.quantity} {item.inventory.material.unit}
                      </span>
                    </div>
                    <input
                      type="number"
                      step="0.001"
                      value={receivedAmounts[index]}
                      onChange={(e) => handleReceivedAmountChange(index, e.target.value)}
                      placeholder="Qabul qilingan miqdor"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Maksimal: {item.quantity} {item.inventory.material.unit}
                    </p>
                  </div>
                ))}
              </div>

              <div>
                <label htmlFor="confirm-note" className="block text-sm font-medium text-gray-700 mb-1">
                  Izoh (ixtiyoriy)
                </label>
                <textarea
                  id="confirm-note"
                  value={confirmNote}
                  onChange={(e) => setConfirmNote(e.target.value)}
                  placeholder="Transfer haqida qo'shimcha ma'lumot..."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsConfirmDialogOpen(false)}
                disabled={loading}
              >
                Bekor qilish
              </Button>
              <Button
                variant="success"
                onClick={handleConfirmTransfer}
                disabled={loading}
              >
                {loading ? "Tasdiqlashda..." : "Tasdiqlash"}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Reject Modal */}
        <Modal isOpen={isRejectDialogOpen} onClose={() => setIsRejectDialogOpen(false)}>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="w-5 h-5 text-red-600" />
              <h2 className="text-xl font-semibold">Transferni rad etish</h2>
            </div>
            <p className="text-gray-600 mb-6">Transferni rad etish sababini ko'rsating.</p>

            <div className="space-y-4 mb-6">
              {error && (
                <Alert type="error">
                  <div className="flex">
                    <AlertTriangle className="w-4 h-4 mr-3 mt-0.5" />
                    <p>{error}</p>
                  </div>
                </Alert>
              )}

              <div>
                <label htmlFor="reject-note" className="block text-sm font-medium text-gray-700 mb-1">
                  Rad etish sababi <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="reject-note"
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                  placeholder="Nima sababdan rad etilayapti?"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsRejectDialogOpen(false)}
                disabled={loading}
              >
                Bekor qilish
              </Button>
              <Button
                variant="destructive"
                onClick={handleRejectTransfer}
                disabled={loading}
              >
                {loading ? "Rad etilmoqda..." : "Rad etish"}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}