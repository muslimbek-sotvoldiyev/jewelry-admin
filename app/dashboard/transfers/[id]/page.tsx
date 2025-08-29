"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

// Mock transfer detail data
const transferDetail = {
  id: "T002",
  from: "Atolye-1",
  fromOwner: "Ahmad Karimov",
  to: "Atolye-2",
  toOwner: "Dilshod Rahimov",
  material: "180gr Kumush",
  materialType: "silver",
  originalAmount: 200,
  currentAmount: 180,
  unit: "gr",
  status: "pending_receiver",
  senderConfirmed: true,
  receiverConfirmed: false,
  createdAt: "2024-01-25 14:20",
  senderConfirmedAt: "2024-01-25 14:25",
  receiverConfirmedAt: null,
  note: "Proba o'zgartirish uchun",
  processLoss: 20,
  processNote: "Tozalash jarayonida 20gr yo'qotish",
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "confirmed":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="h-3 w-3 mr-1" />
          Tasdiqlangan
        </Badge>
      )
    case "pending_sender":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <Clock className="h-3 w-3 mr-1" />
          Yuboruvchi kutilmoqda
        </Badge>
      )
    case "pending_receiver":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          <Clock className="h-3 w-3 mr-1" />
          Qabul qiluvchi kutilmoqda
        </Badge>
      )
    default:
      return <Badge variant="secondary">Noma'lum</Badge>
  }
}

export default function TransferDetailPage() {
  const params = useParams()
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [confirmationType, setConfirmationType] = useState<"receive" | "send">("receive")
  const [receivedAmount, setReceivedAmount] = useState(transferDetail.currentAmount.toString())
  const [confirmNote, setConfirmNote] = useState("")

  const handleConfirmTransfer = () => {
    // TODO: Implement transfer confirmation logic
    console.log("Confirming transfer:", {
      type: confirmationType,
      receivedAmount,
      note: confirmNote,
    })
    setIsConfirmDialogOpen(false)
    setConfirmNote("")
  }

  const handleRejectTransfer = () => {
    // TODO: Implement transfer rejection logic
    console.log("Rejecting transfer")
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/transfers">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Orqaga
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-balance">Transfer {transferDetail.id}</h1>
          <p className="text-muted-foreground">Transfer tafsilotlari va tasdiqlash</p>
        </div>
        <div className="flex gap-2">
          {transferDetail.status === "pending_receiver" && (
            <>
              <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setConfirmationType("receive")
                      setIsConfirmDialogOpen(true)
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Qabul qilish
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Transferni tasdiqlash</DialogTitle>
                    <DialogDescription>
                      Qabul qilingan material miqdorini va qo'shimcha ma'lumotlarni kiriting
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Qabul qilingan miqdor</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          value={receivedAmount}
                          onChange={(e) => setReceivedAmount(e.target.value)}
                          placeholder="180"
                        />
                        <div className="flex items-center px-3 py-2 bg-muted rounded-md text-sm">
                          {transferDetail.unit}
                        </div>
                      </div>
                      {Number(receivedAmount) !== transferDetail.currentAmount && (
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            Miqdor farqi: {transferDetail.currentAmount - Number(receivedAmount)} {transferDetail.unit}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label>Izoh</Label>
                      <Textarea
                        placeholder="Qo'shimcha ma'lumot yoki yo'qotish sababi..."
                        value={confirmNote}
                        onChange={(e) => setConfirmNote(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
                      Bekor qilish
                    </Button>
                    <Button onClick={handleConfirmTransfer}>Tasdiqlash</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="outline" onClick={handleRejectTransfer}>
                <XCircle className="h-4 w-4 mr-2" />
                Rad etish
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Transfer Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Transfer holati
            {getStatusBadge(transferDetail.status)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {/* From */}
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-muted rounded-full">
                <User className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="font-medium">{transferDetail.from}</p>
                <p className="text-sm text-muted-foreground">{transferDetail.fromOwner}</p>
                {transferDetail.senderConfirmed ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 mt-1">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Yuborildi
                  </Badge>
                ) : (
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    Kutilmoqda
                  </Badge>
                )}
              </div>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center gap-2">
              <ArrowRight className="h-8 w-8 text-muted-foreground" />
              <div className="text-center">
                <p className="font-medium text-lg">{transferDetail.material}</p>
                {transferDetail.processLoss > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Asl: {transferDetail.originalAmount}
                    {transferDetail.unit}
                  </p>
                )}
              </div>
            </div>

            {/* To */}
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-muted rounded-full">
                <User className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="font-medium">{transferDetail.to}</p>
                <p className="text-sm text-muted-foreground">{transferDetail.toOwner}</p>
                {transferDetail.receiverConfirmed ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 mt-1">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Qabul qilindi
                  </Badge>
                ) : (
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    Kutilmoqda
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transfer Details */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Material Information */}
        <Card>
          <CardHeader>
            <CardTitle>Material ma'lumotlari</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Material turi</span>
              <span className="text-sm">
                {transferDetail.materialType === "silver" ? "🥈 Kumush" : transferDetail.materialType}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Asl miqdor</span>
              <span className="text-sm">
                {transferDetail.originalAmount} {transferDetail.unit}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Hozirgi miqdor</span>
              <span className="text-sm">
                {transferDetail.currentAmount} {transferDetail.unit}
              </span>
            </div>
            {transferDetail.processLoss > 0 && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Yo'qotish</span>
                  <span className="text-sm text-destructive">
                    -{transferDetail.processLoss} {transferDetail.unit}
                  </span>
                </div>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{transferDetail.processNote}</AlertDescription>
                </Alert>
              </>
            )}
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Transfer tarixi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-1 bg-blue-100 rounded-full mt-1">
                <Calendar className="h-3 w-3 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Transfer yaratildi</p>
                <p className="text-xs text-muted-foreground">{transferDetail.createdAt}</p>
              </div>
            </div>

            {transferDetail.senderConfirmedAt && (
              <div className="flex items-start gap-3">
                <div className="p-1 bg-green-100 rounded-full mt-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Yuboruvchi tasdiqladi</p>
                  <p className="text-xs text-muted-foreground">{transferDetail.senderConfirmedAt}</p>
                </div>
              </div>
            )}

            {transferDetail.receiverConfirmedAt ? (
              <div className="flex items-start gap-3">
                <div className="p-1 bg-green-100 rounded-full mt-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Qabul qiluvchi tasdiqladi</p>
                  <p className="text-xs text-muted-foreground">{transferDetail.receiverConfirmedAt}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <div className="p-1 bg-yellow-100 rounded-full mt-1">
                  <Clock className="h-3 w-3 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Qabul qilish kutilmoqda</p>
                  <p className="text-xs text-muted-foreground">Hali tasdiqlanmagan</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      {transferDetail.note && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Izohlar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{transferDetail.note}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
