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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName?: string
  role: "admin" | "bank_operator" | "atolye_operator"
  organization: number
  organizationName: string
  isActive: boolean
  isStaff: boolean
  createdAt: string
  lastLogin?: string
}

const mockUsers: User[] = [
  {
    id: "1",
    username: "admin_user",
    email: "admin@example.com",
    firstName: "Admin",
    lastName: "Adminov",
    role: "admin",
    organization: 1,
    organizationName: "Asosiy Bank",
    isActive: true,
    isStaff: true,
    createdAt: "2024-01-15",
    lastLogin: "2024-01-20 14:30",
  },
  {
    id: "2",
    username: "bank_op1",
    email: "bank@example.com",
    firstName: "Aziz",
    lastName: "Karimov",
    role: "bank_operator",
    organization: 1,
    organizationName: "Asosiy Bank",
    isActive: true,
    isStaff: true,
    createdAt: "2024-01-16",
    lastLogin: "2024-01-20 09:15",
  },
  {
    id: "3",
    username: "atolye_op1",
    email: "atolye@example.com",
    firstName: "Dilshod",
    role: "atolye_operator",
    organization: 2,
    organizationName: "Zargarlik Atolyesi #1",
    isActive: true,
    isStaff: false,
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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [organizations, setOrganizations] = useState([
    { id: 1, name: "Asosiy Bank" },
    { id: 2, name: "Zargarlik Atolyesi #1" },
    { id: 3, name: "Zargarlik Atolyesi #2" },
  ])
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    role: "",
    organization: "",
    isActive: true,
    isStaff: false,
  })

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      role: "",
      organization: "",
      isActive: true,
      isStaff: false,
    })
  }

  const handleCreateUser = async () => {
    // Validate required fields
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.firstName ||
      !formData.role ||
      !formData.organization
    ) {
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

    const apiData = {
      username: formData.username,
      email: formData.email,
      first_name: formData.firstName,
      last_name: formData.lastName || "",
      is_active: formData.isActive,
      is_staff: formData.isStaff,
      password: formData.password,
      organization: Number.parseInt(formData.organization),
    }

    try {
      // TODO: Uncomment when API is ready
      // const response = await fetch('/api/users/', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(apiData)
      // })
      // if (!response.ok) throw new Error('Failed to create user')
      // const newUser = await response.json()

      console.log("API Data being sent:", apiData)

      // Mock implementation
      const newUser: User = {
        id: Date.now().toString(),
        username: formData.username,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName || undefined,
        role: formData.role as User["role"],
        organization: Number.parseInt(formData.organization),
        organizationName: organizations.find((org) => org.id === Number.parseInt(formData.organization))?.name || "",
        isActive: formData.isActive,
        isStaff: formData.isStaff,
        createdAt: new Date().toISOString().split("T")[0],
      }

      setUsers([...users, newUser])
      resetForm()
      setIsCreateDialogOpen(false)

      toast({
        title: "Muvaffaqiyat",
        description: "Yangi foydalanuvchi yaratildi",
      })
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Foydalanuvchi yaratishda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      confirmPassword: "",
      firstName: user.firstName,
      lastName: user.lastName || "",
      role: user.role,
      organization: user.organization.toString(),
      isActive: user.isActive,
      isStaff: user.isStaff,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateUser = async () => {
    if (!selectedUser) return

    // Validate required fields
    if (!formData.username || !formData.email || !formData.firstName || !formData.role || !formData.organization) {
      toast({
        title: "Xatolik",
        description: "Barcha majburiy maydonlarni to'ldiring",
        variant: "destructive",
      })
      return
    }

    // Validate password confirmation if password is provided
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast({
        title: "Xatolik",
        description: "Parollar mos kelmaydi",
        variant: "destructive",
      })
      return
    }

    try {
      // TODO: Uncomment when API is ready
      // const response = await fetch(`/api/users/${selectedUser.id}/`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(apiData)
      // })
      // if (!response.ok) throw new Error('Failed to update user')

      // Mock implementation
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                username: formData.username,
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName || undefined,
                role: formData.role as User["role"],
                organization: Number.parseInt(formData.organization),
                organizationName:
                  organizations.find((org) => org.id === Number.parseInt(formData.organization))?.name || "",
                isActive: formData.isActive,
                isStaff: formData.isStaff,
              }
            : user,
        ),
      )

      resetForm()
      setIsEditDialogOpen(false)
      setSelectedUser(null)

      toast({
        title: "Muvaffaqiyat",
        description: "Foydalanuvchi ma'lumotlari yangilandi",
      })
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Foydalanuvchi yangilashda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      // TODO: Uncomment when API is ready
      // const response = await fetch(`/api/users/${userId}/`, {
      //   method: 'DELETE'
      // })
      // if (!response.ok) throw new Error('Failed to delete user')

      // Mock implementation
      setUsers(users.filter((user) => user.id !== userId))
      setIsDeleteDialogOpen(false)
      setSelectedUser(null)

      toast({
        title: "Muvaffaqiyat",
        description: "Foydalanuvchi o'chirildi",
      })
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Foydalanuvchi o'chirishda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  const confirmDelete = (user: User) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const toggleUserStatus = async (userId: string) => {
    try {
      // TODO: Uncomment when API is ready
      // const user = users.find(u => u.id === userId)
      // const response = await fetch(`/api/users/${userId}/`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ is_active: !user?.isActive })
      // })
      // if (!response.ok) throw new Error('Failed to update user status')

      // Mock implementation
      setUsers(users.map((user) => (user.id === userId ? { ...user, isActive: !user.isActive } : user)))

      toast({
        title: "Muvaffaqiyat",
        description: "Foydalanuvchi holati o'zgartirildi",
      })
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Foydalanuvchi holatini o'zgartirishda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="px-6 space-y-6">
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
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@example.com"
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
                <Select
                  value={formData.organization}
                  onValueChange={(value) => setFormData({ ...formData, organization: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tashkilotni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((org) => (
                      <SelectItem key={org.id} value={org.id.toString()}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <Label htmlFor="isActive" className="text-sm font-medium">
                    Faol (is_active)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isStaff"
                    checked={formData.isStaff}
                    onChange={(e) => setFormData({ ...formData, isStaff: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <Label htmlFor="isStaff" className="text-sm font-medium">
                    Xodim (is_staff)
                  </Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false)
                  resetForm()
                }}
              >
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
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "Faol" : "Nofaol"}
                      </Badge>
                      {user.isStaff && <Badge variant="outline">Xodim</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-sm text-muted-foreground">{user.organizationName}</p>
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
                    <DropdownMenuItem onClick={() => handleEditUser(user)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Tahrirlash
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleUserStatus(user.id)}>
                      {user.isActive ? "Nofaol qilish" : "Faollashtirish"}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => confirmDelete(user)}>
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Foydalanuvchini tahrirlash</DialogTitle>
            <DialogDescription>Foydalanuvchi ma'lumotlarini yangilang</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Same form fields as create dialog */}
            <div className="grid gap-2">
              <Label htmlFor="edit-username">Foydalanuvchi nomi *</Label>
              <Input
                id="edit-username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="foydalanuvchi_nomi"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="user@example.com"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-password">Yangi parol (ixtiyoriy)</Label>
              <div className="relative">
                <Input
                  id="edit-password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Yangi parolni kiriting"
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

            {formData.password && (
              <div className="grid gap-2">
                <Label htmlFor="edit-confirmPassword">Parolni tasdiqlang *</Label>
                <div className="relative">
                  <Input
                    id="edit-confirmPassword"
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
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-firstName">Ism *</Label>
                <Input
                  id="edit-firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Ism"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-lastName">Familiya</Label>
                <Input
                  id="edit-lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Familiya (ixtiyoriy)"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-role">Rol *</Label>
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
              <Label htmlFor="edit-organization">Tashkilot *</Label>
              <Select
                value={formData.organization}
                onValueChange={(value) => setFormData({ ...formData, organization: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tashkilotni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id.toString()}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <Label htmlFor="edit-isActive" className="text-sm font-medium">
                  Faol (is_active)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-isStaff"
                  checked={formData.isStaff}
                  onChange={(e) => setFormData({ ...formData, isStaff: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <Label htmlFor="edit-isStaff" className="text-sm font-medium">
                  Xodim (is_staff)
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false)
                resetForm()
                setSelectedUser(null)
              }}
            >
              Bekor qilish
            </Button>
            <Button onClick={handleUpdateUser}>Yangilash</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Foydalanuvchini o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              Haqiqatan ham{" "}
              <strong>
                {selectedUser?.firstName} {selectedUser?.lastName}
              </strong>{" "}
              foydalanuvchisini o'chirmoqchimisiz? Bu amalni bekor qilib bo'lmaydi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Yo'q</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedUser && handleDeleteUser(selectedUser.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Ha, o'chirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
