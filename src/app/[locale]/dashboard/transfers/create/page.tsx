"use client"
import { useState } from "react"
import { useRouter } from "@/src/i18n/routing"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Plus, Trash2, Loader2 } from "lucide-react"
import { TooltipProvider } from "@/src/components/ui/tooltip"
import { useGetOrganizationsQuery } from "@/src/lib/service/atolyeApi"
import { useGetInventoryQuery } from "@/src/lib/service/inventoryApi"
import { useAddTransactionMutation } from "@/src/lib/service/transactionsApi"
import { toast } from "@/src/hooks/use-toast"
import type Organization from "@/src/types/organization"
import type Inventory from "@/src/types/inventory"
import { getCurrentUser } from "@/src/lib/auth"
import { useTranslations } from "next-intl"

export default function CreateTransferPage() {
  const t = useTranslations("createTransfer")
  const router = useRouter()
  const currentUser = getCurrentUser()

  const { data: receivers = [] as Organization[], isLoading: receiversLoading } = useGetOrganizationsQuery({})
  const { data: inventories = [] as Inventory[], isLoading: inventoriesLoading } = useGetInventoryQuery({
    organization: currentUser?.organization?.id,
  })

  const [addTransaction, { isLoading: isSubmitting }] = useAddTransactionMutation()

  const [receiver, setReceiver] = useState("")
  const [items, setItems] = useState<{ inventory: string; quantity: string }[]>([])
  const [currentItem, setCurrentItem] = useState({ inventory: "", quantity: "" })
  const [error, setError] = useState("")

  const parseQuantity = (quantity: any): number => {
    if (typeof quantity === "number") return quantity
    if (typeof quantity === "string") {
      const parsed = Number.parseFloat(quantity)
      return Number.isNaN(parsed) ? 0 : parsed
    }
    return 0
  }

  const availableInventories = inventories.filter((inv: Inventory) => parseQuantity(inv.quantity) > 0)

  const isValidQuantity = (quantity: string): boolean => {
    const num = Number.parseFloat(quantity)
    return !Number.isNaN(num) && num > 0
  }

  const handleAddItem = () => {
    if (!currentItem.inventory || !isValidQuantity(currentItem.quantity)) {
      setError(t("errors.invalidInventoryOrQuantity"))
      return
    }

    const selectedInv = inventories.find((inv) => String(inv.id) === currentItem.inventory)
    if (!selectedInv) {
      setError(t("errors.inventoryNotFound"))
      return
    }

    const availableQty = parseQuantity(selectedInv.quantity)
    const addQty = Number.parseFloat(currentItem.quantity)

    if (availableQty <= 0) {
      setError(`${t("errors.quantityExceedsAvailable", { name: selectedInv.name, available: 0, unit: selectedInv.unit || "dona" })}`)
      return
    }

    const existingItemIndex = items.findIndex((item) => item.inventory === currentItem.inventory)
    let newTotalQty = addQty
    if (existingItemIndex !== -1) {
      newTotalQty += Number.parseFloat(items[existingItemIndex].quantity)
    }

    if (newTotalQty > availableQty) {
      setError(
        t("errors.quantityExceedsAvailable", {
          name: selectedInv.name,
          available: availableQty.toFixed(3),
          unit: selectedInv.unit || "dona",
        }),
      )
      return
    }

    if (existingItemIndex !== -1) {
      const updatedItems = [...items]
      updatedItems[existingItemIndex].quantity = newTotalQty.toFixed(3)
      setItems(updatedItems)
    } else {
      setItems([...items, { inventory: currentItem.inventory, quantity: addQty.toFixed(3) }])
    }

    setCurrentItem({ inventory: "", quantity: "" })
    setError("")
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!receiver || items.length === 0) {
      setError(t("errors.receiverOrItemsRequired"))
      return
    }

    const payload = {
      receiver: Number(receiver),
      items: items.map((item) => ({
        inventory: Number(item.inventory),
        quantity: item.quantity,
      })),
    }

    try {
      await addTransaction(payload).unwrap()
      toast({
        title: t("success.title"),
        description: t("success.description"),
        duration: 3000,
      })
      setReceiver("")
      setItems([])
      setCurrentItem({ inventory: "", quantity: "" })
      setError("")
      setTimeout(() => router.push("/dashboard/transfers"), 1000)
    } catch (error: any) {
      const errorMessage = error?.data?.message || t("errors.transactionFailed")
      setError(errorMessage)
      toast({
        title: "Xatolik!",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const totalItems = items.length
  const totalQuantity = items.reduce((sum, it) => sum + Number.parseFloat(it.quantity || "0"), 0)

  if (receiversLoading || inventoriesLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 bg-gray-50">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span className="text-gray-600">{t("loading")}</span>
      </div>
    )
  }

  if (receivers.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 bg-gray-50">
        <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-md border border-red-200">{t("noReceivers")}</p>
      </div>
    )
  }

  if (availableInventories.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 bg-gray-50">
        <Card className="max-w-md w-full shadow-sm border border-gray-200">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-center text-lg font-semibold text-gray-800">{t("noInventoriesTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 text-center text-gray-600">{t("noInventoriesMessage")}</CardContent>
        </Card>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">{t("pageTitle")}</h1>
          <Button onClick={handleSubmit} disabled={!receiver || items.length === 0 || isSubmitting} className="text-white">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("creatingButton")}
              </>
            ) : (
              t("createButton")
            )}
          </Button>
        </div>

        {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-md border border-red-200">{error}</p>}

        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="border-b border-gray-200 pb-3">
            <CardTitle className="text-base font-medium text-gray-700">{t("receiverLabel")}</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <Select value={receiver} onValueChange={setReceiver}>
              <SelectTrigger className="w-full border-gray-300">
                <SelectValue placeholder={t("receiverPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {receivers.map((r: Organization) => (
                  <SelectItem key={r.id} value={String(r.id)}>
                    {r.name} ({r.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="border-b border-gray-200 pb-3 flex justify-between items-center">
            <CardTitle className="text-base font-medium text-gray-700">{t("inventoryLabel")}</CardTitle>
            <span className="text-sm text-gray-500">
              Jami: {totalItems} ta, {totalQuantity.toFixed(3)} birlik
            </span>
          </CardHeader>
          <CardContent className="pt-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4">
              <div>
                <Label className="text-sm text-gray-600 mb-1 block">{t("inventoryLabel")}</Label>
                <Select
                  value={currentItem.inventory}
                  onValueChange={(val) => setCurrentItem({ ...currentItem, inventory: val })}
                >
                  <SelectTrigger className="w-full border-gray-300">
                    <SelectValue placeholder={t("inventoryPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableInventories.map((inv: Inventory) => {
                      const availableQty = parseQuantity(inv.quantity)
                      const materialName = inv.material.name
                      const unit = inv.material?.unit || "g"

                      return (
                        <SelectItem key={inv.id} value={String(inv.id)}>
                          {materialName} ({availableQty.toFixed(3)} {unit})
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm text-gray-600 mb-1 block">{t("quantityLabel")}</Label>
                <Input
                  type="number"
                  value={currentItem.quantity}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
                      setCurrentItem({ ...currentItem, quantity: value })
                    }
                  }}
                  placeholder={t("quantityPlaceholder")}
                  min="0.01"
                  step="0.01"
                  className="border-gray-300"
                />
              </div>
              <div className="flex items-center">
                <Button onClick={handleAddItem} className="w-full md:w-auto  text-white">
                  <Plus className="h-4 w-4 mr-2" /> {t("addButton")}
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-gray-600">
                    <th className="p-3 text-left">{t("table.headers.inventory")}</th>
                    <th className="p-3 text-left">{t("table.headers.quantity")}</th>
                    <th className="p-3 text-left">{t("table.headers.unit")}</th>
                    <th className="p-3 text-left">{t("table.headers.available")}</th>
                    <th className="p-3 text-left">{t("table.headers.remaining")}</th>
                    <th className="p-3 text-left">{t("table.headers.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, i) => {
                    const inv = inventories.find((x) => String(x.id) === it.inventory)
                    const availableQty = parseQuantity(inv?.quantity)
                    const transferQty = Number.parseFloat(it.quantity)
                    const remaining = availableQty - transferQty
                    return (
                      <tr key={i} className="border-t border-gray-200 hover:bg-gray-50">
                        <td className="p-3">{inv?.material.name ?? "Noma'lum"}</td>
                        <td className="p-3 font-medium">{it.quantity}</td>
                        <td className="p-3">{inv?.material.unit ?? "-"}</td>
                        <td className="p-3">{availableQty.toFixed(3)}</td>
                        <td className="p-3">
                          <span className={remaining >= 0 ? "text-green-600" : "text-red-600"}>{remaining.toFixed(3)}</span>
                        </td>
                        <td className="p-3">
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(i)} className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-3 text-center text-gray-500">
                        {t("table.empty")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {process.env.NODE_ENV === "development" && (
          <Card className="shadow-sm border border-gray-200 bg-gray-50">
            <CardHeader className="border-b border-gray-200 pb-3">
              <CardTitle className="text-sm text-gray-600">{t("debug.title")}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-xs text-gray-600">
              <p>{t("debug.availableInventories", { count: availableInventories.length })}</p>
              <p>{t("debug.selectedItems", { count: items.length })}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  )
}
