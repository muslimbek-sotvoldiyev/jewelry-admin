"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface User {
  id: string
  username: string
  firstName: string
  lastName?: string
  role: "admin" | "bank_operator" | "atolye_operator"
  organization: string
  status: "active" | "inactive"
  createdAt: string
  lastLogin?: string
}

const mockUsers: User[] = [
  {
    id: "1",
    username: "admin_user",
    firstName: "Admin",
    lastName: "Adminov",
    role: "admin",
    organization: "Asosiy Bank",
    status: "active",
    createdAt: "2024-01-15",
    lastLogin: "2024-01-20 14:30",
  },
  {
    id: "2",
    username: "bank_op1",
    firstName: "Aziz",
    lastName: "Karimov",
    role: "bank_operator",
    organization: "Asosiy Bank",
    status: "active",
    createdAt: "2024-01-16",
    lastLogin: "2024-01-20 09:15",
  },
  {
    id: "3",
    username: "atolye_op1",
    firstName: "Dilshod",
    role: "atolye_operator",
    organization: "Zargarlik Atolyesi #1",
    status: "active",
    createdAt: "2024-01-17",
    lastLogin: "2024-01-19 16:45",
  },
]

const roleLabels = {
  admin: "Administrator",
  bank_operator: "Bank Operatori",
  atolye_operator: "Atolye Operatori",
}

const roleColors = {
  admin: "bg-red-100 text-red-800",
  bank_operator: "bg-blue-100 text-blue-800",
  atolye_operator: "bg-green-100 text-green-800",
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    role: "",
    organization: "",
  })

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.organization.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateUser = () => {
    // Validate required fields
    if (!formData.username || !formData.password || !formData.firstName || !formData.role || !formData.organization) {
      toast({
        title: "Xatolik",
        description: "Barcha majburiy maydonlarni to'ldiring",
        variant: "destructive",
      })
      return
    }

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Xatolik",
        description: "Parollar mos kelmaydi",
        variant: "destructive",
      })
      return
    }

    // Check if username already exists
    if (users.some((user) => user.username === formData.username)) {
      toast({
        title: "Xatolik",
        description: "Bu foydalanuvchi nomi allaqachon mavjud",
        variant: "destructive",
      })
      return
    }

    const newUser: User = {
      id: Date.now().toString(),
      username: formData.username,
      firstName: formData.firstName,
      lastName: formData.lastName || undefined,
      role: formData.role as User["role"],
      organization: formData.organization,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
    }

    setUsers([...users, newUser])
    setFormData({
      username: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      role: "",
      organization: "",
    })
    setIsCreateDialogOpen(false)

    toast({
      title: "Muvaffaqiyat",
      description: "Yangi foydalanuvchi yaratildi",
    })
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId))
    toast({
      title: "Muvaffaqiyat",
      description: "Foydalanuvchi o'chirildi",
    })
  }

  const toggleUserStatus = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: user.status === "active" ? "inactive" : "active" } : user,
      ),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Foydalanuvchilar</h1>
          <p className="text-muted-foreground">Tizim foydalanuvchilarini boshqaring</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Yangi foydalanuvchi
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Yangi foydalanuvchi yaratish</DialogTitle>
              <DialogDescription>Tizimga yangi foydalanuvchi qo'shing va unga rol bering</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Foydalanuvchi nomi *</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="foydalanuvchi_nomi"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Parol *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Parolni kiriting"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Parolni tasdiqlang *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Parolni qayta kiriting"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">Ism *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Ism"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="lastName">Familiya</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Familiya (ixtiyoriy)"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="role">Rol *</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Rolni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="bank_operator">Bank Operatori</SelectItem>
                    <SelectItem value="atolye_operator">Atolye Operatori</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="organization">Tashkilot *</Label>
                <Input
                  id="organization"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="Tashkilot nomi"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Bekor qilish
              </Button>
              <Button onClick={handleCreateUser}>Yaratish</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Foydalanuvchilarni qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Foydalanuvchilar ro'yxati</CardTitle>
          <CardDescription>Jami {filteredUsers.length} ta foydalanuvchi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.firstName.charAt(0)}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">
                        {user.firstName} {user.lastName}
                      </h3>
                      <Badge className={roleColors[user.role]}>{roleLabels[user.role]}</Badge>
                      <Badge variant={user.status === "active" ? "default" : "secondary"}>
                        {user.status === "active" ? "Faol" : "Nofaol"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                    <p className="text-sm text-muted-foreground">{user.organization}</p>
                    {user.lastLogin && <p className="text-xs text-muted-foreground">Oxirgi kirish: {user.lastLogin}</p>}
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Tahrirlash
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleUserStatus(user.id)}>
                      {user.status === "active" ? "Nofaol qilish" : "Faollashtirish"}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteUser(user.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      O'chirish
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
