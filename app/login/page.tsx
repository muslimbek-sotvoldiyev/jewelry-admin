"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Gem, Lock, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLoginMutation } from "@/lib/service/authApi"
import { useDispatch } from "react-redux"
import api from "@/lib/service/api"

export default function LoginPage() {
  const dispatch = useDispatch()
  const router = useRouter()
  const [login, { isLoading }] = useLoginMutation()
  
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const saveToLocalStorage = (data: {
    access: string
    refresh: string
    user: any
  }) => {
    localStorage.setItem("access", data.access)
    localStorage.setItem("refresh", data.refresh)
    localStorage.setItem("user", JSON.stringify(data.user))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const result = await login(formData).unwrap()

      if (result && result.access) {
        saveToLocalStorage(result)
        dispatch(api.util.resetApiState())
        router.push("/dashboard")
      } else {
        setError("Login failed. Please try again.")
      }
    } catch (err) {
      if (typeof err === "object" && err !== null && "data" in err) {
        setError((err.data as any).message || "Noto'g'ri username yoki parol")
      } else {
        setError("Tizimga kirishda xatolik yuz berdi")
      }
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Gem className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Zargarlik Admin Panel</CardTitle>
          <CardDescription>Tizimga kirish uchun ma'lumotlaringizni kiriting</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="admin"
                  value={formData.username}
                  onChange={handleChange}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Parol</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Kirish..." : "Tizimga kirish"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}