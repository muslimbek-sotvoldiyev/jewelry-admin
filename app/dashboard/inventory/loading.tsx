import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Inventar yuklanmoqda...</span>
      </div>
    </div>
  )
}

