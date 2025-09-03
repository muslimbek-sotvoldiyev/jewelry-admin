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
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import {
  useGetUsersQuery,
  useAddUsersMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  UsersApi,
} from "@/lib/service/usersApi"
import { useGetOrganizationsQuery } from "@/lib/service/atolyeApi"

import { useDispatch } from "react-redux" // Redux dispatch'ni import qiling


interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name?: string
  is_active: boolean
  is_staff: boolean
  organization: number
}

interface Organization {
  id: number
  name?: string
  type?: string
}

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
    const dispatch = useDispatch() // Redux dispatch'ni olish
  
  const { data: users = [], isLoading: usersLoading, error: usersError } = useGetUsersQuery(undefined)
  const { data: organizations = [], isLoading: orgsLoading } = useGetOrganizationsQuery({})
  const [addUser] = useAddUsersMutation()
  const [updateUser] = useUpdateUserMutation()
  const [deleteUser] = useDeleteUserMutation()

  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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

  const getOrganizationInfo = (orgId: number) => {
    const org = organizations.find((o: Organization) => o.id === orgId)
    if (org && org.name && org.type) {
      return `${org.name} (${org.type})`
    }
    return `Tashkilot #${orgId}`
  }

  const filteredUsers = users.filter(
    (user: User) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.last_name && user.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getOrganizationInfo(user.organization).toLowerCase().includes(searchTerm.toLowerCase()),
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
    if (!formData.username || !formData.email || !formData.password || !formData.firstName || !formData.organization) {
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
    if (users.some((user: User) => user.username === formData.username)) {
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
      await addUser(apiData).unwrap()
      resetForm()
      setIsCreateDialogOpen(false)

      toast({
        title: "Muvaffaqiyat",
        description: "Yangi foydalanuvchi yaratildi",
      })
      dispatch(UsersApi.util.resetApiState());
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
      firstName: user.first_name,
      lastName: user.last_name || "",
      role: "", // Role is not in the API response, so we leave it empty
      organization: user.organization.toString(),
      isActive: user.is_active,
      isStaff: user.is_staff,
    })
    setIsEditDialogOpen(true)
      dispatch(UsersApi.util.resetApiState());

  }

  const handleUpdateUser = async () => {
    if (!selectedUser) return

    // Validate required fields
    if (!formData.username || !formData.email || !formData.firstName || !formData.organization) {
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

    const apiData: any = {
      username: formData.username,
      email: formData.email,
      first_name: formData.firstName,
      last_name: formData.lastName || "",
      is_active: formData.isActive,
      is_staff: formData.isStaff,
      organization: Number.parseInt(formData.organization),
    }

    // Only include password if it's provided
    if (formData.password) {
      apiData.password = formData.password
    }

    try {
      await updateUser({ id: selectedUser.id, ...apiData }).unwrap()
      resetForm()
      setIsEditDialogOpen(false)
      setSelectedUser(null)

      toast({
        title: "Muvaffaqiyat",
        description: "Foydalanuvchi ma'lumotlari yangilandi",
      })
      dispatch(UsersApi.util.resetApiState());
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Foydalanuvchi yangilashda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId).unwrap()
      setIsDeleteDialogOpen(false)
      setSelectedUser(null)
      dispatch(UsersApi.util.resetApiState());
      toast({
        title: "Muvaffaqiyat",
        description: "Foydalanuvchi o'chirildi",
      })
      dispatch(UsersApi.util.resetApiState());
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

  const toggleUserStatus = async (userId: number) => {
    const user = users.find((u: User) => u.id === userId)
    if (!user) return

    try {
      await updateUser({
        id: userId,
        is_active: !user.is_active,
      }).unwrap()

      toast({
        title: "Muvaffaqiyat",
        description: "Foydalanuvchi holati o'zgartirildi",
      })
      dispatch(UsersApi.util.resetApiState());
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Foydalanuvchi holatini o'zgartirishda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  if (usersLoading || orgsLoading) {
    return (
      <div className="px-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Ma'lumotlar yuklanmoqda...</span>
        </div>
      </div>
    )
  }

  if (usersError) {
    return (
      <div className="px-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <p className="text-red-600">Foydalanuvchilarni yuklashda xatolik yuz berdi</p>
        </div>
      </div>
    )
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
                <Label htmlFor="organization">Tashkilot *</Label>
                <Select
                  value={formData.organization}
                  onValueChange={(value) => setFormData({ ...formData, organization: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tashkilotni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((org: Organization) => (
                      <SelectItem key={org.id} value={org.id.toString()}>
                        {org.name && org.type ? `${org.name} (${org.type})` : `Tashkilot #${org.id}`}
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
            {filteredUsers.map((user: User) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.first_name.charAt(0)}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">
                        {user.first_name} {user.last_name}
                      </h3>
                      <Badge variant={user.is_active ? "default" : "secondary"}>
                        {user.is_active ? "Faol" : "Nofaol"}
                      </Badge>
                      {user.is_staff && <Badge variant="outline">Xodim</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-sm text-muted-foreground">{getOrganizationInfo(user.organization)}</p>
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
                      {user.is_active ? "Nofaol qilish" : "Faollashtirish"}
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
              <Label htmlFor="edit-organization">Tashkilot *</Label>
              <Select
                value={formData.organization}
                onValueChange={(value) => setFormData({ ...formData, organization: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tashkilotni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org: Organization) => (
                    <SelectItem key={org.id} value={org.id.toString()}>
                      {org.name && org.type ? `${org.name} (${org.type})` : `Tashkilot #${org.id}`}
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
                {selectedUser?.first_name} {selectedUser?.last_name}
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
