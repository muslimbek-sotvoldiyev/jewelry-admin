"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, ArrowLeft, Package, ArrowRight } from "lucide-react"
import { useGetInventoryQuery } from "@/lib/service/inventoryApi"
import { useGetMaterialsQuery } from "@/lib/service/materialsApi"
import { useCreateProcessMutation } from "@/lib/service/processApi"

import { getCurrentUser } from "@/lib/auth"

import Link from "next/link"
import Inventory from "@/types/inventory"

interface ProcessInputCreate {
  inventory: number | null
  quantity: number | null
}

interface ProcessOutputCreate {
  material: number | null
  quantity: number | null
}

export default function CreateProcessPage() {
  const router = useRouter()
  const currentUser = getCurrentUser()

  const [createProcess, { isLoading }] = useCreateProcessMutation()

  const [inputs, setInputs] = useState<ProcessInputCreate[]>([{ inventory: null, quantity: null }])
  const [outputs, setOutputs] = useState<ProcessOutputCreate[]>([{ material: null, quantity: null }])

  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: inventory = [] as Inventory[], isLoading: inventoriesLoading } = useGetInventoryQuery({ organization: currentUser?.organization?.id })
  const { data: materials = [] } = useGetMaterialsQuery({})

  // Add new input row
  const addInput = () => {
    setInputs([...inputs, { inventory: null, quantity: null }])
  }

  // Remove input row
  const removeInput = (index: number) => {
    if (inputs.length > 1) {
      setInputs(inputs.filter((_, i) => i !== index))
    }
  }

  // Update input
  const updateInput = (index: number, field: keyof ProcessInputCreate, value: any) => {
    const newInputs = [...inputs]
    newInputs[index] = { ...newInputs[index], [field]: value }
    setInputs(newInputs)
  }

  // Add new output row
  const addOutput = () => {
    setOutputs([...outputs, { material: null, quantity: null }])
  }

  // Remove output row
  const removeOutput = (index: number) => {
    if (outputs.length > 1) {
      setOutputs(outputs.filter((_, i) => i !== index))
    }
  }

  // Update output
  const updateOutput = (index: number, field: keyof ProcessOutputCreate, value: any) => {
    const newOutputs = [...outputs]
    newOutputs[index] = { ...newOutputs[index], [field]: value }
    setOutputs(newOutputs)
  }

  // Validate form
  const isFormValid = () => {
    const validInputs = inputs.every(
      (input) => input.inventory !== null && input.quantity !== null && input.quantity > 0,
    )
    const validOutputs = outputs.every(
      (output) => output.material !== null && output.quantity !== null && output.quantity > 0,
    )
    return validInputs && validOutputs
  }

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid()) {
      alert("Iltimos, barcha maydonlarni to'ldiring")
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare data for API
      const processData = {
        inputs: inputs.map((input) => ({
          inventory: input.inventory!,
          quantity: input.quantity!,
        })),
        outputs: outputs.map((output) => ({
          material: output.material!,
          quantity: output.quantity!,
        })),
      }

      console.log("Process data to submit:", processData)

      const result = await createProcess(processData)
      console.log("Process created successfully:", result)

      alert("Jarayon muvaffaqiyatli yaratildi!")
      router.push("/dashboard/processes")
    } catch (error) {
      console.error("Error creating process:", error)
      alert("Jarayon yaratishda xatolik yuz berdi")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/processes">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Orqaga
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-balance">Yangi jarayon yaratish</h1>
          <p className="text-muted-foreground">Mahsulot ishlab chiqarish jarayonini yarating</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Inputs */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Kirish materiallari</CardTitle>
                  <CardDescription>Jarayon uchun kerak bo'ladigan materiallar</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {inputs.map((input, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`input-inventory-${index}`} className="text-sm font-medium">
                        Material
                      </Label>
                      <Select
                        value={input.inventory?.toString() || ""}
                        onValueChange={(value) => updateInput(index, "inventory", Number.parseInt(value))}
                      >
                        <SelectTrigger id={`input-inventory-${index}`} className="mt-1">
                          <SelectValue placeholder="Material tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          {inventory.map((item) => (
                            <SelectItem key={item.id} value={item.id.toString()}>
                              {item.material.name} (Mavjud: {item.quantity} {item.material.unit})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Label htmlFor={`input-quantity-${index}`} className="text-sm font-medium">
                          Miqdor
                        </Label>
                        <Input
                          id={`input-quantity-${index}`}
                          type="number"
                          min="0"
                          step="0.001"
                          placeholder="Miqdorni kiriting"
                          value={input.quantity || ""}
                          onChange={(e) => updateInput(index, "quantity", Number.parseFloat(e.target.value) || null)}
                          className="mt-1"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeInput(index)}
                        disabled={inputs.length === 1}
                        className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addInput}
                className="w-full border-dashed bg-transparent"
              >
                <Plus className="h-4 w-4 mr-2" />
                Kirish materiali qo'shish
              </Button>
            </CardContent>
          </Card>

          {/* Right Column - Outputs */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <ArrowRight className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Chiqish mahsulotlari</CardTitle>
                  <CardDescription>Jarayon natijasida hosil bo'ladigan mahsulotlar</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {outputs.map((output, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`output-material-${index}`} className="text-sm font-medium">
                        Mahsulot
                      </Label>
                      <Select
                        value={output.material?.toString() || ""}
                        onValueChange={(value) => updateOutput(index, "material", Number.parseInt(value))}
                      >
                        <SelectTrigger id={`output-material-${index}`} className="mt-1">
                          <SelectValue placeholder="Mahsulot tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          {materials.map((material) => (
                            <SelectItem key={material.id} value={material.id.toString()}>
                              {material.name} ({material.unit})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Label htmlFor={`output-quantity-${index}`} className="text-sm font-medium">
                          Miqdor
                        </Label>
                        <Input
                          id={`output-quantity-${index}`}
                          type="number"
                          min="0"
                          step="0.001"
                          placeholder="Miqdorni kiriting"
                          value={output.quantity || ""}
                          onChange={(e) => updateOutput(index, "quantity", Number.parseFloat(e.target.value) || null)}
                          className="mt-1"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeOutput(index)}
                        disabled={outputs.length === 1}
                        className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addOutput}
                className="w-full border-dashed bg-transparent"
              >
                <Plus className="h-4 w-4 mr-2" />
                Chiqish mahsuloti qo'shish
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Submit Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Jarayon yaratilgandan so'ng uni boshqarish mumkin bo'ladi
                </p>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard/processes">Bekor qilish</Link>
                </Button>
                <Button type="submit" disabled={!isFormValid() || isSubmitting}>
                  {isSubmitting ? "Yaratilmoqda..." : "Jarayon yaratish"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
