"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, History, Calendar, Loader2, Trash2, Search, CheckCircle, Clock, XCircle, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { TooltipProvider } from "@/components/ui/tooltip"

interface InventoryItem {
  id: string
  name: string
  quantity: number
  unit: string
  purity?: string
  material: {
    name: string
    unit: string
  }
}

interface ProcessItem {
  id: string
  inventory: string
  quantity: number
}

interface ProcessHistory {
  id: string
  date: string
  status: "completed" | "in-progress" | "cancelled"
  inputs: ProcessItem[]
  outputs: ProcessItem[]
  processedBy: string
  notes?: string
}

export default function ProcessPage() {
  const [inventories, setInventories] = useState<InventoryItem[]>([
    {
      id: "1",
      name: "Toshkent Atolye - Oltin (24K)",
      quantity: 1006.6,
      unit: "g",
      purity: "24K",
      material: { name: "Oltin (24K)", unit: "g" },
    },
    {
      id: "2",
      name: "Toshkent Atolye - Kumush",
      quantity: 65.0,
      unit: "g",
      material: { name: "Kumush", unit: "g" },
    },
    {
      id: "3",
      name: "Buxoro Atolye - Olmos",
      quantity: 15.5,
      unit: "karat",
      material: { name: "Olmos", unit: "karat" },
    },
    {
      id: "4",
      name: "Samarqand Atolye - Platina",
      quantity: 25.3,
      unit: "g",
      material: { name: "Platina", unit: "g" },
    },
  ])

  const [processInputs, setProcessInputs] = useState<ProcessItem[]>([])
  const [processOutputs, setProcessOutputs] = useState<ProcessItem[]>([])
  const [currentInputItem, setCurrentInputItem] = useState({ inventory: "", quantity: "" })
  const [currentOutputItem, setCurrentOutputItem] = useState({ inventory: "", quantity: "" })
  const [error, setError] = useState("")

  const [processHistory, setProcessHistory] = useState<ProcessHistory[]>([
    {
      id: "PR-001",
      date: "2024-01-15T10:30:00Z",
      status: "completed",
      inputs: [
        { id: "1", inventory: "1", quantity: 100 },
        { id: "2", inventory: "2", quantity: 50 },
      ],
      outputs: [
        { id: "1", inventory: "uzuk", quantity: 2 },
        { id: "2", inventory: "sirga", quantity: 2 },
      ],
      processedBy: "Ahmad Karimov",
      notes: "Yuqori sifatli tilla uzuk va sirg'alar yaratildi",
    },
    {
      id: "PR-002",
      date: "2024-01-14T14:20:00Z",
      status: "in-progress",
      inputs: [{ id: "1", inventory: "3", quantity: 5 }],
      outputs: [],
      processedBy: "Malika Tosheva",
      notes: "Olmos qayta ishlash jarayoni",
    },
    {
      id: "PR-003",
      date: "2024-01-13T09:15:00Z",
      status: "completed",
      inputs: [
        { id: "1", inventory: "4", quantity: 20 },
        { id: "2", inventory: "1", quantity: 80 },
      ],
      outputs: [
        { id: "1", inventory: "zanjir", quantity: 1 },
        { id: "2", inventory: "marjon", quantity: 3 },
      ],
      processedBy: "Bobur Aliyev",
      notes: "Platina va tilla aralashmasi mahsulotlar",
    },
    {
      id: "PR-004",
      date: "2024-01-12T16:45:00Z",
      status: "cancelled",
      inputs: [{ id: "1", inventory: "2", quantity: 30 }],
      outputs: [],
      processedBy: "Zarina Nazarova",
      notes: "Texnik muammolar tufayli bekor qilindi",
    },
  ])

  const [loading, setLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [processedBy, setProcessedBy] = useState("Ahmad Karimov")
  const [notes, setNotes] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const { toast } = useToast()

  const parseQuantity = (quantity: any): number => {
    if (typeof quantity === "number") return quantity
    if (typeof quantity === "string") {
      const parsed = Number.parseFloat(quantity)
      return Number.isNaN(parsed) ? 0 : parsed
    }
    return 0
  }

  const isValidQuantity = (quantity: string): boolean => {
    const num = Number.parseFloat(quantity)
    return !Number.isNaN(num) && num > 0
  }

  const addProcessInput = () => {
    if (!currentInputItem.inventory || !isValidQuantity(currentInputItem.quantity)) {
      setError("Inventar va miqdor to'g'ri kiriting (miqdor > 0).")
      return
    }

    const selectedInv = inventories.find((inv) => inv.id === currentInputItem.inventory)
    if (!selectedInv) {
      setError("Tanlangan inventar topilmadi.")
      return
    }

    const availableQty = parseQuantity(selectedInv.quantity)
    const addQty = Number.parseFloat(currentInputItem.quantity)

    if (availableQty <= 0) {
      setError(`Bu inventar uchun mavjud miqdor yo'q: ${selectedInv.material.name}`)
      return
    }

    const existingItemIndex = processInputs.findIndex((item) => item.inventory === currentInputItem.inventory)
    let newTotalQty = addQty
    if (existingItemIndex !== -1) {
      newTotalQty += processInputs[existingItemIndex].quantity
    }

    if (newTotalQty > availableQty) {
      setError(
        `"${selectedInv.material.name}" uchun mavjud miqdor: ${availableQty.toFixed(2)} ${selectedInv.unit}. Kiritilgan miqdor oshib ketdi.`,
      )
      return
    }

    if (existingItemIndex !== -1) {
      const updatedItems = [...processInputs]
      updatedItems[existingItemIndex].quantity = newTotalQty
      setProcessInputs(updatedItems)
    } else {
      const newItem: ProcessItem = {
        id: Date.now().toString(),
        inventory: currentInputItem.inventory,
        quantity: addQty,
      }
      setProcessInputs([...processInputs, newItem])
    }

    setCurrentInputItem({ inventory: "", quantity: "" })
    setError("")
  }

  const addProcessOutput = () => {
    if (!currentOutputItem.inventory || !isValidQuantity(currentOutputItem.quantity)) {
      setError("Material va miqdorni to'g'ri kiriting (miqdor > 0).")
      return
    }

    const existingItemIndex = processOutputs.findIndex((item) => item.inventory === currentOutputItem.inventory)
    const addQty = Number.parseFloat(currentOutputItem.quantity)

    if (existingItemIndex !== -1) {
      const updatedItems = [...processOutputs]
      updatedItems[existingItemIndex].quantity += addQty
      setProcessOutputs(updatedItems)
    } else {
      const newItem: ProcessItem = {
        id: Date.now().toString(),
        inventory: currentOutputItem.inventory,
        quantity: addQty,
      }
      setProcessOutputs([...processOutputs, newItem])
    }

    setCurrentOutputItem({ inventory: "", quantity: "" })
    setError("")
  }

  const saveProcess = async () => {
    if (processInputs.length === 0) {
      setError("Kamida bitta kirish materiali qo'shing")
      return
    }

    try {
      setLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newProcess: ProcessHistory = {
        id: `PR-${String(processHistory.length + 1).padStart(3, "0")}`,
        date: new Date().toISOString(),
        status: "completed",
        inputs: processInputs,
        outputs: processOutputs,
        processedBy,
        notes: notes.trim() || undefined,
      }

      setProcessHistory([newProcess, ...processHistory])

      toast({
        title: "Muvaffaqiyat!",
        description: "Jarayon muvaffaqiyatli saqlandi",
        duration: 3000,
      })

      // Reset form
      setProcessInputs([])
      setProcessOutputs([])
      setNotes("")
      setCurrentInputItem({ inventory: "", quantity: "" })
      setCurrentOutputItem({ inventory: "", quantity: "" })
      setError("")
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Jarayonni saqlashda xatolik yuz berdi"
      setError(errorMessage)
      toast({
        title: "Xatolik!",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const removeItem = (id: string, type: "input" | "output") => {
    if (type === "input") {
      setProcessInputs(processInputs.filter((item) => item.id !== id))
    } else {
      setProcessOutputs(processOutputs.filter((item) => item.id !== id))
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Tugallangan
          </Badge>
        )
      case "in-progress":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="h-3 w-3 mr-1" />
            Jarayonda
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Bekor qilingan
          </Badge>
        )
      default:
        return <Badge variant="secondary">Noma'lum</Badge>
    }
  }

  const filteredHistory = processHistory.filter((process) => {
    const matchesSearch =
      process.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.processedBy.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || process.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getInventoryName = (inventoryId: string) => {
    const inv = inventories.find((i) => i.id === inventoryId)
    return inv ? inv.material.name : inventoryId
  }

  const totalInputItems = processInputs.length
  const totalOutputItems = processOutputs.length
  const totalInputQuantity = processInputs.reduce((sum, item) => sum + item.quantity, 0)
  const totalOutputQuantity = processOutputs.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Tilla Qayta Ishlash Tizimi</h1>
            <p className="text-gray-600 mt-1">Xom ashyo va tayyor mahsulotlarni boshqaring</p>
          </div>
          <Button onClick={saveProcess} disabled={processInputs.length === 0 || loading} className="text-white">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saqlanmoqda...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Jarayonni Saqlash
              </>
            )}
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-500 px-4 py-3 rounded-lg flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            {error}
          </div>
        )}

        <Tabs defaultValue="process" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200 p-1 rounded-lg">
            <TabsTrigger
              value="process"
              className="data-[state=active]:bg-[#dc2626] data-[state=active]:text-white rounded-md font-medium text-gray-600"
            >
              Yangi Jarayon
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-[#dc2626] data-[state=active]:text-white rounded-md font-medium text-gray-600"
            >
              <History className="w-4 h-4 mr-2" />
              Jarayonlar Tarixi
            </TabsTrigger>
          </TabsList>

          <TabsContent value="process" className="space-y-6 mt-6">
            <Card className="shadow-sm border border-gray-200 bg-white rounded-lg overflow-hidden">
              <CardHeader className="bg-gray-50 border-b border-gray-200 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      Jarayon Kirishlari
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-1">Qayta ishlanadigan xom ashyolar</CardDescription>
                  </div>
                  <div className="bg-white px-3 py-1 rounded-lg border border-gray-200">
                    <span className="text-sm font-medium text-gray-700">
                      {totalInputItems} ta • {totalInputQuantity.toFixed(2)} birlik
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_auto] gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Inventar</Label>
                    <Select
                      value={currentInputItem.inventory}
                      onValueChange={(val) => setCurrentInputItem({ ...currentInputItem, inventory: val })}
                    >
                      <SelectTrigger className="w-full border-gray-300 rounded-lg h-11">
                        <SelectValue placeholder="Inventar tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        {inventories.map((inv) => {
                          const availableQty = parseQuantity(inv.quantity)
                          const materialName = inv.material.name
                          const unit = inv.unit

                          return (
                            <SelectItem key={inv.id} value={inv.id}>
                              {materialName} ({availableQty.toFixed(2)} {unit})
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Miqdor</Label>
                    <Input
                      type="number"
                      value={currentInputItem.quantity}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
                          setCurrentInputItem({ ...currentInputItem, quantity: value })
                        }
                      }}
                      placeholder="0.00"
                      min="0.01"
                      step="0.01"
                      className="border-gray-300 rounded-lg h-11"
                    />
                    {currentInputItem.inventory && (
                      <p className="text-xs text-gray-500">
                        Maksimal:{" "}
                        {parseQuantity(
                          inventories.find((inv) => inv.id === currentInputItem.inventory)?.quantity,
                        ).toFixed(2)}{" "}
                        {inventories.find((inv) => inv.id === currentInputItem.inventory)?.unit || ""}
                      </p>
                    )}
                  </div>
                  <div className="flex items-end">
                    <Button onClick={addProcessInput} className="w-full lg:w-auto text-white">
                      <Plus className="h-4 w-4 mr-2" /> Qo'shish
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-gray-600 border-b border-gray-200">
                          <th className="p-3 text-left font-medium">Inventar</th>
                          <th className="p-3 text-left font-medium">Miqdor</th>
                          <th className="p-3 text-left font-medium">Birlik</th>
                          <th className="p-3 text-left font-medium">Mavjud</th>
                          <th className="p-3 text-left font-medium">Qolgan</th>
                          <th className="p-3 text-left font-medium"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {processInputs.map((item) => {
                          const inv = inventories.find((i) => i.id === item.inventory)
                          const availableQty = parseQuantity(inv?.quantity)
                          const remaining = availableQty - item.quantity
                          return (
                            <tr key={item.id} className="border-b border-gray-100 hover:bg-white transition-colors">
                              <td className="p-3 font-medium text-gray-900">{inv?.material.name ?? "Noma'lum"}</td>
                              <td className="p-3 font-semibold text-gray-900">{item.quantity.toFixed(2)}</td>
                              <td className="p-3 text-gray-600">{inv?.unit ?? "-"}</td>
                              <td className="p-3 text-gray-600">{availableQty.toFixed(2)}</td>
                              <td className="p-3">
                                <span className={`font-medium ${remaining >= 0 ? "text-green-600" : "text-red-600"}`}>
                                  {remaining.toFixed(2)}
                                </span>
                              </td>
                              <td className="p-3">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeItem(item.id, "input")}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          )
                        })}
                        {processInputs.length === 0 && (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-gray-500">
                              <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                  <Plus className="w-6 h-6 text-gray-400" />
                                </div>
                                <p>Inventar qo'shing</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-gray-200 bg-white rounded-lg overflow-hidden">
              <CardHeader className="bg-gray-50 border-b border-gray-200 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      Jarayon Chiqishlari
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-1">Yaratilgan tayyor mahsulotlar</CardDescription>
                  </div>
                  <div className="bg-white px-3 py-1 rounded-lg border border-gray-200">
                    <span className="text-sm font-medium text-gray-700">
                      {totalOutputItems} ta • {totalOutputQuantity.toFixed(2)} birlik
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_auto] gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Mahsulot</Label>
                    <Select
                      value={currentOutputItem.inventory}
                      onValueChange={(val) => setCurrentOutputItem({ ...currentOutputItem, inventory: val })}
                    >
                      <SelectTrigger className="w-full border-gray-300 rounded-lg h-11">
                        <SelectValue placeholder="Mahsulot tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="uzuk">Uzuk (pcs)</SelectItem>
                        <SelectItem value="sirga">Sirg'a (pcs)</SelectItem>
                        <SelectItem value="zanjir">Zanjir (pcs)</SelectItem>
                        <SelectItem value="marjon">Marjon (pcs)</SelectItem>
                        <SelectItem value="bilak">Bilak (pcs)</SelectItem>
                        <SelectItem value="kolye">Kolye (pcs)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Miqdor</Label>
                    <Input
                      type="number"
                      value={currentOutputItem.quantity}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
                          setCurrentOutputItem({ ...currentOutputItem, quantity: value })
                        }
                      }}
                      placeholder="0.00"
                      min="0.01"
                      step="0.01"
                      className="border-gray-300 rounded-lg h-11"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={addProcessOutput} className="w-full lg:w-auto text-white">
                      <Plus className="h-4 w-4 mr-2" /> Qo'shish
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-gray-600 border-b border-gray-200">
                          <th className="p-3 text-left font-medium">Mahsulot</th>
                          <th className="p-3 text-left font-medium">Miqdor</th>
                          <th className="p-3 text-left font-medium">Birlik</th>
                          <th className="p-3 text-left font-medium"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {processOutputs.map((item) => (
                          <tr key={item.id} className="border-b border-gray-100 hover:bg-white transition-colors">
                            <td className="p-3 font-medium text-gray-900 capitalize">{item.inventory}</td>
                            <td className="p-3 font-semibold text-gray-900">{item.quantity.toFixed(2)}</td>
                            <td className="p-3 text-gray-600">pcs</td>
                            <td className="p-3">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeItem(item.id, "output")}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                        {processOutputs.length === 0 && (
                          <tr>
                            <td colSpan={4} className="p-8 text-center text-gray-500">
                              <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                  <Plus className="w-6 h-6 text-gray-400" />
                                </div>
                                <p>Mahsulot qo'shing</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>

          </TabsContent>

          <TabsContent value="history" className="space-y-6 mt-6">
            <Card className="shadow-sm border border-gray-200 bg-white rounded-lg">
              <CardHeader className="border-b border-gray-200 pb-4">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  Jarayonlar Tarixi
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {historyLoading ? "Yuklanmoqda..." : `Jami ${processHistory.length} ta jarayon`}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="ID yoki ishlov beruvchi bo'yicha qidirish..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-gray-300 rounded-lg h-11"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[200px] border-gray-300 rounded-lg h-11">
                      <SelectValue placeholder="Holat bo'yicha" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Barchasi</SelectItem>
                      <SelectItem value="completed">Tugallangan</SelectItem>
                      <SelectItem value="in-progress">Jarayonda</SelectItem>
                      <SelectItem value="cancelled">Bekor qilingan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {historyLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
                      <span className="text-gray-600">Yuklanmoqda...</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredHistory.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <History className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-lg font-medium text-gray-900 mb-1">
                          {searchTerm || statusFilter !== "all"
                            ? "Qidiruv bo'yicha natija topilmadi"
                            : "Hali hech qanday jarayon mavjud emas"}
                        </p>
                        <p className="text-gray-500">
                          {searchTerm || statusFilter !== "all"
                            ? "Boshqa qidiruv so'zini sinab ko'ring"
                            : "Birinchi jarayoningizni yarating"}
                        </p>
                      </div>
                    ) : (
                      filteredHistory.map((process) => (
                        <Card
                          key={process.id}
                          className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                        >
                          <CardHeader className="pb-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <Badge variant="outline" className="text-gray-700 border-gray-300 font-mono">
                                  {process.id}
                                </Badge>
                                {getStatusBadge(process.status)}
                              </div>
                              <div className="text-sm text-gray-500 font-medium">{formatDate(process.date)}</div>
                            </div>
                            <div className="text-sm text-gray-600">
                              Ishlov beruvchi:{" "}
                              <span className="text-gray-900 font-semibold">{process.processedBy}</span>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="text-amber-600 font-semibold mb-3 flex items-center gap-2">
                                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                  Jarayondan oldin
                                </h4>
                                <div className="space-y-2">
                                  {process.inputs.map((input) => (
                                    <div
                                      key={input.id}
                                      className="flex justify-between items-center bg-amber-50 p-3 rounded-lg border border-amber-100"
                                    >
                                      <span className="text-sm font-medium text-gray-700">
                                        {getInventoryName(input.inventory)}
                                      </span>
                                      <span className="text-sm text-gray-900 font-semibold">
                                        {input.quantity.toFixed(2)}{" "}
                                        {inventories.find((i) => i.id === input.inventory)?.unit || "g"}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h4 className="text-emerald-600 font-semibold mb-3 flex items-center gap-2">
                                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                  Jarayondan keyin
                                </h4>
                                <div className="space-y-2">
                                  {process.outputs.length > 0 ? (
                                    process.outputs.map((output) => (
                                      <div
                                        key={output.id}
                                        className="flex justify-between items-center bg-emerald-50 p-3 rounded-lg border border-emerald-100"
                                      >
                                        <span className="text-sm font-medium text-gray-700 capitalize">
                                          {output.inventory}
                                        </span>
                                        <span className="text-sm text-gray-900 font-semibold">
                                          {output.quantity.toFixed(2)} pcs
                                        </span>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="text-sm text-gray-500 italic bg-gray-50 p-3 rounded-lg">
                                      Hali tugallanmagan
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {process.notes && (
                              <div className="mt-6 p-4 bg-gray-50 rounded-lg border-l-4 border-gray-400">
                                <div className="text-sm font-medium text-gray-700 mb-1">Izoh:</div>
                                <div className="text-sm text-gray-900">{process.notes}</div>
                              </div>
                            )}
                          </CardContent>
                        </Card> 
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  )
}
