"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Gem,
  Factory,
  TrendingUp,
  Clock,
  AlertTriangle,
  Plus,
  Eye,
  ArrowUpRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";

import { Link } from "@/src/i18n/routing";
import { useTranslations } from "next-intl";

const recentActivities = [
  {
    id: 1,
    type: "transfer",
    message: "Atolye-1 dan Atolye-2 ga 250gr oltin yuborildi",
    time: "5 daqiqa oldin",
    status: "pending",
  },
  {
    id: 2,
    type: "completion",
    message: "Atolye-3 da tozalash jarayoni yakunlandi",
    time: "15 daqiqa oldin",
    status: "completed",
  },
  {
    id: 3,
    type: "alert",
    message: "Atolye-5 da ish vaqti tugadi, materiallar qaytarilmoqda",
    time: "1 soat oldin",
    status: "alert",
  },
];

export default function DashboardPage() {
  const t = useTranslations("dashboard");

  // Mock data for charts
  const materialData = [
    { name: t("materials.gold"), amount: 2500, unit: "gr" },
    { name: t("materials.silver"), amount: 5200, unit: "gr" },
    { name: t("materials.diamond"), amount: 45, unit: "dona" },
    { name: t("materials.pearl"), amount: 120, unit: "dona" },
  ];

  const weeklyTransfers = [
    { day: t("weekdays.mon"), transfers: 12 },
    { day: t("weekdays.tue"), transfers: 19 },
    { day: t("weekdays.wed"), transfers: 15 },
    { day: t("weekdays.thu"), transfers: 22 },
    { day: t("weekdays.fri"), transfers: 28 },
    { day: t("weekdays.sat"), transfers: 18 },
    { day: t("weekdays.sun"), transfers: 14 },
  ];

  const workshopStatus = [
    { name: t("workshopStates.active"), value: 8, color: "#059669" },
    { name: t("workshopStates.busy"), value: 3, color: "#f59e0b" },
    { name: t("workshopStates.stopped"), value: 2, color: "#dc2626" },
  ];

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            {t("report")}
          </Button>
          <Link href="/dashboard/transfers/create">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              {t("stats.totalMaterials")}
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Jami materiallar
            </CardTitle>
            <Gem className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7,865</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12.5%
              </span>
              o'tgan oyga nisbatan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Faol atolyeler
            </CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">13 ta atolyedan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bugungi transferlar
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +8.2%
              </span>
              kechaga nisbatan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kutilayotgan</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              tasdiqlash kutilmoqda
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Material Inventory Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Material inventari</CardTitle>
            <CardDescription>Hozirgi material miqdorlari</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={materialData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Transfers Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Haftalik transferlar</CardTitle>
            <CardDescription>So'nggi 7 kun davomidagi faollik</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyTransfers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="transfers"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Workshop Status */}
        <Card>
          <CardHeader>
            <CardTitle>Atolye holati</CardTitle>
            <CardDescription>Hozirgi atolyeler faolligi</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={workshopStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {workshopStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {workshopStatus.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>So'nggi faollik</CardTitle>
            <CardDescription>
              Tizimda sodir bo'lgan so'nggi hodisalar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex-shrink-0 mt-1">
                    {activity.type === "transfer" && (
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                    )}
                    {activity.type === "completion" && (
                      <Gem className="h-4 w-4 text-green-600" />
                    )}
                    {activity.type === "alert" && (
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-pretty">
                      {activity.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                  <Badge
                    variant={
                      activity.status === "completed"
                        ? "default"
                        : activity.status === "pending"
                        ? "secondary"
                        : "destructive"
                    }
                    className="flex-shrink-0"
                  >
                    {activity.status === "completed"
                      ? "Bajarildi"
                      : activity.status === "pending"
                      ? "Kutilmoqda"
                      : "Diqqat"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
