"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Eye, Edit, Clock, Factory, AlertTriangle } from "lucide-react"

// Mock workshop data
const workshops = [
  {
    id: "1",
    name: "Atolye-1",
    owner: "Ahmad Karimov",
    status: "active",
    currentMaterial: "250gr Oltin",
    workTime: "2 soat 30 daqiqa",
    process: "Tozalash",
    email: "atolye1@jewelry.com",
    phone: "+998901234567",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Atolye-2",
    owner: "Dilshod Rahimov",
    status: "busy",
    currentMaterial: "180gr Kumush",
    workTime: "4 soat 15 daqiqa",
    process: "Proba o'zgartirish",
    email: "atolye2@jewelry.com",
    phone: "+998901234568",
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    name: "Atolye-3",
    owner: "Sardor Toshev",
    status: "stopped",
    currentMaterial: "-",
    workTime: "-",
    process: "-",
    email: "atolye3@jewelry.com",
    phone: "+998901234569",
    createdAt: "2024-01-20",
  },
  {
    id: "4",
    name: "Atolye-4",
    owner: "Bobur Aliev",
    status: "active",
    currentMaterial: "45 dona Olmos",
    workTime: "1 soat 45 daqiqa",
    process: "Buyum yaratish",
    email: "atolye4@jewelry.com",
    phone: "+998901234570",
    createdAt: "2024-01-12",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Faol</Badge>
    case "busy":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Band</Badge>
    case "stopped":
      return <Badge variant="destructive">To'xtatilgan</Badge>
    default:
      return <Badge variant="secondary">Noma'lum</Badge>
  }
}

export default function WorkshopsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newWorkshop, setNewWorkshop] = useState({
    name: "",
    owner: "",
    email: "",
    phone: "",
    password: "",
  })

  const filteredWorkshops = workshops.filter(
    (workshop) =>
      workshop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workshop.owner.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateWorkshop = () => {
    // TODO: Implement workshop creation logic
    console.log("Creating workshop:", newWorkshop)
    setIsCreateDialogOpen(false)
    setNewWorkshop({ name: "", owner: "", email: "", phone: "", password: "" })
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Atolyeler</h1>
          <p className="text-muted-foreground">Barcha atolyelerni boshqarish va kuzatish</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Yangi atolye
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Yangi atolye yaratish</DialogTitle>
              <DialogDescription>
                Yangi atolye uchun ma'lumotlarni kiriting. Atolye egasi login va parol oladi.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Atolye nomi</Label>
                <Input
                  id="name"
                  placeholder="Atolye-5"
                  value={newWorkshop.name}
                  onChange={(e) => setNewWorkshop({ ...newWorkshop, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="owner">Egasi</Label>
                <Input
                  id="owner"
                  placeholder="Ism Familiya"
                  value={newWorkshop.owner}
                  onChange={(e) => setNewWorkshop({ ...newWorkshop, owner: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="atolye5@jewelry.com"
                  value={newWorkshop.email}
                  onChange={(e) => setNewWorkshop({ ...newWorkshop, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  placeholder="+998901234567"
                  value={newWorkshop.phone}
                  onChange={(e) => setNewWorkshop({ ...newWorkshop, phone: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Parol</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={newWorkshop.password}
                  onChange={(e) => setNewWorkshop({ ...newWorkshop, password: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateWorkshop}>
                Yaratish
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami atolyeler</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workshops.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faol</CardTitle>
            <div className="h-2 w-2 bg-green-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workshops.filter((w) => w.status === "active").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Band</CardTitle>
            <div className="h-2 w-2 bg-yellow-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workshops.filter((w) => w.status === "busy").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">To'xtatilgan</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workshops.filter((w) => w.status === "stopped").length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Atolyeler ro'yxati</CardTitle>
          <CardDescription>Barcha atolyeler va ularning hozirgi holati</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Atolye yoki egasi bo'yicha qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Holat bo'yicha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barchasi</SelectItem>
                <SelectItem value="active">Faol</SelectItem>
                <SelectItem value="busy">Band</SelectItem>
                <SelectItem value="stopped">To'xtatilgan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Atolye</TableHead>
                <TableHead>Egasi</TableHead>
                <TableHead>Holat</TableHead>
                <TableHead>Hozirgi material</TableHead>
                <TableHead>Ish vaqti</TableHead>
                <TableHead>Jarayon</TableHead>
                <TableHead>Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkshops.map((workshop) => (
                <TableRow key={workshop.id}>
                  <TableCell className="font-medium">{workshop.name}</TableCell>
                  <TableCell>{workshop.owner}</TableCell>
                  <TableCell>{getStatusBadge(workshop.status)}</TableCell>
                  <TableCell>{workshop.currentMaterial}</TableCell>
                  <TableCell>
                    {workshop.workTime !== "-" && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {workshop.workTime}
                      </div>
                    )}
                    {workshop.workTime === "-" && "-"}
                  </TableCell>
                  <TableCell>{workshop.process}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
