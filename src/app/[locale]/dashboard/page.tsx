"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Gem, Factory, TrendingUp, Clock, AlertTriangle, Plus, Eye, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";

import { Link } from "@/src/i18n/routing";
import { useTranslations } from "next-intl";
import { useGetStatsQuery } from "@/src/lib/service/dashboard";
import { Skeleton } from "@/src/components/ui/skeleton";

export default function DashboardPage() {
  const t = useTranslations("dashboard");

  const { data, isLoading } = useGetStatsQuery();

  // Recent activities with translations
  const recentActivities = [
    {
      id: 1,
      type: "transfer",
      message: t("activities.examples.transfer"),
      time: t("activities.times.5minAgo"),
      status: "pending",
    },
    {
      id: 2,
      type: "completion",
      message: t("activities.examples.completion"),
      time: t("activities.times.15minAgo"),
      status: "completed",
    },
    {
      id: 3,
      type: "alert",
      message: t("activities.examples.alert"),
      time: t("activities.times.1hAgo"),
      status: "alert",
    },
  ];

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
              {t("newTransfer")}
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("stats.totalMaterials")}</CardTitle>
            <Gem className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-6 w-24" /> : <div className="text-2xl font-bold">{data?.inventory.total} g</div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("stats.activeWorkshops")}</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-6 w-16" /> : <div className="text-2xl font-bold">{data?.organization.count}</div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("stats.todayTransfers")}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-6 w-12" /> : <div className="text-2xl font-bold"> {data?.transaction.count} </div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("stats.pending")}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>{isLoading ? <Skeleton className="h-6 w-10" /> : <div className="text-2xl font-bold">3</div>}</CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Material Inventory Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t("charts.materialsInventory")}</CardTitle>
            <CardDescription>{t("charts.materialsInventoryDesc")}</CardDescription>
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
            <CardTitle>{t("charts.weeklyTransfers")}</CardTitle>
            <CardDescription>{t("charts.weeklyTransfersDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyTransfers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="transfers" stroke="hsl(var(--primary))" strokeWidth={2} />
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
            <CardTitle>{t("charts.workshopStatus")}</CardTitle>
            <CardDescription>{t("charts.workshopStatusDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={workshopStatus} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={5} dataKey="value">
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
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
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
            <CardTitle>{t("activities.recent")}</CardTitle>
            <CardDescription>{t("activities.recentDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex-shrink-0 mt-1">
                    {activity.type === "transfer" && <TrendingUp className="h-4 w-4 text-blue-600" />}
                    {activity.type === "completion" && <Gem className="h-4 w-4 text-green-600" />}
                    {activity.type === "alert" && <AlertTriangle className="h-4 w-4 text-amber-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-pretty">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                  <Badge
                    variant={activity.status === "completed" ? "default" : activity.status === "pending" ? "secondary" : "destructive"}
                    className="flex-shrink-0"
                  >
                    {activity.status === "completed" ? t("activities.statuses.completed") : 
                     activity.status === "pending" ? t("activities.statuses.pending") : 
                     t("activities.statuses.alert")}
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