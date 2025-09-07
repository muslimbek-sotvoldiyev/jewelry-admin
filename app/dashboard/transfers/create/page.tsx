"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useGetOrganizationsQuery } from "@/lib/service/atolyeApi"
import Organization from "@/types/organization"

// // Fake API calls (unchanged)
// const fetchReceivers = async () => [
//   { id: 1, name: "Atolye-1" },
//   { id: 2, name: "Atolye-2" },
//   { id: 3, name: "Safe" },
// ]
const fetchInventories = async () => [
  { id: 101, name: "Oltin 999", unit: "g" },
  { id: 102, name: "Kumush", unit: "g" },
  { id: 103, name: "Olmos", unit: "ct" },
]

export default function CreateTransferPage() {
  const { data: receivers = [] as Organization[], isLoading, error: apiError } = useGetOrganizationsQuery({})

  // const [receivers, setReceivers] = useState<{ id: number; name: string }[]>([])
  const [inventories, setInventories] = useState<{ id: number; name: string; unit: string }[]>([])
  const [receiver, setReceiver] = useState("")
  const [items, setItems] = useState<{ inventory: string; quantity: string }[]>([])
  const [currentItem, setCurrentItem] = useState({ inventory: "", quantity: "" })
  const [error, setError] = useState("")

  useEffect(() => {
    // fetchReceivers().then(setReceivers)
    fetchInventories().then(setInventories)
  }, [])

  const handleAddItem = () => {
    if (!currentItem.inventory || !currentItem.quantity || parseFloat(currentItem.quantity) <= 0) {
      setError("Iltimos, material va miqdorni to'g'ri kiriting (miqdor > 0).")
      return
    }
    setItems([...items, currentItem])
    setCurrentItem({ inventory: "", quantity: "" })
    setError("")
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (!receiver || items.length === 0) {
      setError("Qabul qiluvchi va kamida bitta item kerak.")
      return
    }
    const payload = {
      receiver: Number(receiver),
      items: items.map((it) => ({
        inventory: Number(it.inventory),
        quantity: it.quantity,
      })),
    }
    console.log("Payload:", payload)
    setError("")
  }

  const totalItems = items.length
  const totalQuantity = items.reduce((sum, it) => sum + parseFloat(it.quantity || "0"), 0)

  return (
    <TooltipProvider>
      <div className="flex-1 p-6 space-y-6 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Yangi Transfer Yaratish</h1>
          <Button
            onClick={handleSubmit}
            disabled={!receiver || items.length === 0}
          >
            Transfer Yaratish
          </Button>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Card className="shadow-md border-none bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Qabul Qiluvchi</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={receiver} onValueChange={setReceiver}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Atolye yoki joyni tanlang" />
              </SelectTrigger>
              <SelectContent>
                {receivers.map((r: Organization) => (
                  <SelectItem key={r.id} value={String(r.id)}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        <Card className="shadow-md border-none bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Materiallar</CardTitle>
            <p className="text-sm text-gray-500">Jami: {totalItems} ta, {totalQuantity.toFixed(2)} birlik</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
              <div>
                <Label className="mb-2 block">Material</Label>
                <Select
                  value={currentItem.inventory}
                  onValueChange={(val) => setCurrentItem({ ...currentItem, inventory: val })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Material tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {inventories.map((inv) => (
                      <SelectItem key={inv.id} value={String(inv.id)}>
                        {inv.name} ({inv.unit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-2 block">Miqdor</Label>
                <Input
                  type="number"
                  value={currentItem.quantity}
                  onChange={(e) => setCurrentItem({ ...currentItem, quantity: e.target.value })}
                  placeholder="Miqdorni kiriting"
                  min="0.01"
                  step="0.01"
                />
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleAddItem} className="h-10">
                    <Plus className="mr-2 h-4 w-4" /> Qo'shish
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Yangisini qo'shish</TooltipContent>
              </Tooltip>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-3 font-semibold text-gray-700">Material</th>
                    <th className="p-3 font-semibold text-gray-700">Miqdor</th>
                    <th className="p-3 font-semibold text-gray-700">Birlik</th>
                    <th className="p-3 font-semibold text-gray-700">Harakat</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, i) => {
                    const inv = inventories.find((x) => String(x.id) === it.inventory)
                    return (
                      <tr key={i} className="border-t hover:bg-gray-50 transition-colors">
                        <td className="p-3">{inv?.name}</td>
                        <td className="p-3">{it.quantity}</td>
                        <td className="p-3">{inv?.unit}</td>
                        <td className="p-3">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveItem(i)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>O'chirish</TooltipContent>
                          </Tooltip>
                        </td>
                      </tr>
                    )
                  })}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-3 text-center text-gray-400 italic">
                        Hali material qo'shilmagan. Yuqoridagi formadan boshlang.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}