import { type NextRequest, NextResponse } from "next/server"

// Mock API endpoints for development
// This will be replaced with actual Django backend

const mockData = {
  workshops: [
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
      totalWorkTime: "45 soat 20 daqiqa",
      completedJobs: 23,
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
      totalWorkTime: "38 soat 45 daqiqa",
      completedJobs: 19,
    },
  ],
  transfers: [
    {
      id: "T001",
      from: "Safe",
      to: "Atolye-1",
      material: "250gr Oltin",
      materialType: "gold",
      amount: 250,
      unit: "gr",
      status: "confirmed",
      senderConfirmed: true,
      receiverConfirmed: true,
      createdAt: "2024-01-25 09:30",
      confirmedAt: "2024-01-25 09:45",
      note: "Tozalash uchun",
    },
    {
      id: "T002",
      from: "Atolye-1",
      to: "Atolye-2",
      material: "180gr Kumush",
      materialType: "silver",
      amount: 180,
      unit: "gr",
      status: "pending_receiver",
      senderConfirmed: true,
      receiverConfirmed: false,
      createdAt: "2024-01-25 14:20",
      note: "Proba o'zgartirish uchun",
    },
  ],
  notifications: [
    {
      id: "1",
      type: "transfer_pending",
      title: "Yangi transfer kutilmoqda",
      message: "Atolye-1 dan Atolye-2 ga 180gr Kumush transferi qabul qilish kutilmoqda",
      timestamp: "2024-01-25 16:30",
      isRead: false,
      priority: "high",
      relatedId: "T002",
    },
    {
      id: "2",
      type: "workshop_timeout",
      title: "Atolye ish vaqti tugadi",
      message: "Atolye-3 da ish vaqti tugadi, materiallar qaytarilmoqda",
      timestamp: "2024-01-25 15:45",
      isRead: false,
      priority: "medium",
      relatedId: "W003",
    },
  ],
  dashboardStats: {
    totalMaterials: 7865,
    activeWorkshops: 8,
    todayTransfers: 24,
    pendingConfirmations: 3,
    materialData: [
      { name: "Oltin", amount: 2500, unit: "gr" },
      { name: "Kumush", amount: 5200, unit: "gr" },
      { name: "Olmos", amount: 45, unit: "dona" },
      { name: "Marvarid", amount: 120, unit: "dona" },
    ],
    weeklyTransfers: [
      { day: "Dush", transfers: 12 },
      { day: "Sesh", transfers: 19 },
      { day: "Chor", transfers: 15 },
      { day: "Pay", transfers: 22 },
      { day: "Jum", transfers: 28 },
      { day: "Shan", transfers: 18 },
      { day: "Yak", transfers: 14 },
    ],
    workshopStatus: [
      { name: "Faol", value: 8, color: "#059669" },
      { name: "Band", value: 3, color: "#f59e0b" },
      { name: "To'xtatilgan", value: 2, color: "#dc2626" },
    ],
  },
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const endpoint = searchParams.get("endpoint")

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  switch (endpoint) {
    case "dashboard/stats":
      return NextResponse.json(mockData.dashboardStats)
    case "workshops":
      return NextResponse.json(mockData.workshops)
    case "transfers":
      return NextResponse.json(mockData.transfers)
    case "notifications":
      return NextResponse.json(mockData.notifications)
    default:
      return NextResponse.json({ error: "Endpoint not found" }, { status: 404 })
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const endpoint = searchParams.get("endpoint")
  const body = await request.json()

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  switch (endpoint) {
    case "workshops":
      const newWorkshop = {
        id: String(mockData.workshops.length + 1),
        ...body,
        createdAt: new Date().toISOString().split("T")[0],
        totalWorkTime: "0 soat",
        completedJobs: 0,
      }
      mockData.workshops.push(newWorkshop)
      return NextResponse.json(newWorkshop)

    case "transfers":
      const newTransfer = {
        id: `T${String(mockData.transfers.length + 1).padStart(3, "0")}`,
        ...body,
        status: "pending_sender",
        senderConfirmed: false,
        receiverConfirmed: false,
        createdAt: new Date().toISOString(),
      }
      mockData.transfers.push(newTransfer)
      return NextResponse.json(newTransfer)

    default:
      return NextResponse.json({ message: "Success" })
  }
}
