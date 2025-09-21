"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/routing";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Search, Eye, CheckCircle, Clock, XCircle, Settings, Loader2, SquareCheckBig, Trash2 } from "lucide-react";
import {
  useCompleteProcessMutation,
  useDeleteProcessMutation,
  useGetProcessesQuery,
} from "@/src/lib/service/processApi";
import { useGetInventoryQuery } from "@/src/lib/service/inventoryApi";
import { useGetMaterialsQuery } from "@/src/lib/service/materialsApi";
import { getCurrentUser } from "@/src/lib/auth";
import type { Process } from "@/src/types/process";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { toast } from "@/src/hooks/use-toast";

export default function ProcessesPage() {
  const t = useTranslations("processes");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [completeOpen, setCompleteOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [completeProcess, { isLoading: completing }] = useCompleteProcessMutation();
  const [deleteProcess, { isLoading: deleting }] = useDeleteProcessMutation();

  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);

  const openCompleteModal = (process: Process) => {
    setSelectedProcess(process);
    setCompleteOpen(true);
  };

  const openDeleteModal = (process: Process) => {
    setSelectedProcess(process);
    setDeleteOpen(true);
  };

  const {
    data: processes = [],
    isLoading,
    error,
    refetch,
  } = useGetProcessesQuery({
    search: searchTerm || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const { data: inventory = [] } = useGetInventoryQuery({});
  const { data: materials = [] } = useGetMaterialsQuery({});

  const handleComplete = async () => {
    if (!selectedProcess) return;
    try {
      await completeProcess(selectedProcess.id).unwrap();
      toast({
        description: "Jarayon tasdiqlandi ✅",
        variant: "default",
      });
      setCompleteOpen(false);
    } catch (err: any) {
      toast({
        title: t("common.error"),
        description: t(err?.data?.detail || "Noma’lum xato"),
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedProcess) return;
    try {
      await deleteProcess(selectedProcess.id).unwrap();
      toast({
        description: "Jarayon o'chirildi ✅",
        variant: "default",
      });
      setDeleteOpen(false);
    } catch (err: any) {
      toast({
        title: t("common.error"),
        description: t(err?.data?.detail || "Noma’lum xato"),
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    console.log(status);

    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            {t("status.completed")}
          </Badge>
        );
      case "in process":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Settings className="h-3 w-3 mr-1" />
            {t("status.inProgress")}
          </Badge>
        );
    }
  };

  // Helper function to get inventory item by id
  const getInventoryById = (id: number) => {
    return inventory.find((inv) => inv.id === id);
  };

  // Helper function to get material by id
  const getMaterialById = (id: number) => {
    return materials.find((mat) => mat.id === id);
  };

  const filteredProcesses = processes.filter((process: Process) => {
    const matchesSearch =
      process.id.toString().includes(searchTerm.toLowerCase()) ||
      process.organization.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || process.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (iso: string) => new Date(iso).toLocaleString("uz-UZ", { dateStyle: "short", timeStyle: "short" });

  if (error) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t("title")}</h1>
            <p className="text-muted-foreground">{t("subtitle")}</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/processes/create">+ {t("actions.create")}</Link>
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-500 mb-4">{t("errors.loadFailed")}</p>
              <Button onClick={() => refetch()}>{t("actions.retry")}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/processes/create">+ {t("actions.create")}</Link>
        </Button>
      </div>

      <Dialog open={completeOpen} onOpenChange={setCompleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tasdiqlaysizmi?</DialogTitle>
            <DialogDescription>Ushbu jarayonni tasdiqlashni xohlaysizmi?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCompleteOpen(false)}>
              Bekor qilish
            </Button>

            <Button variant="default" disabled={completing} onClick={handleComplete}>
              {completing ? "Tasdiqlanmoqda..." : "Ha, tasdiqlayman"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>O‘chirishni xohlaysizmi?</DialogTitle>
            <DialogDescription>Bu amalni ortga qaytarib bo‘lmaydi.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteOpen(false)}>
              Bekor qilish
            </Button>
            <Button variant="destructive" disabled={deleting} onClick={handleDelete}>
              {deleting ? "O‘chirilmoqda..." : "O‘chirish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Search & Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{t("table.title")}</CardTitle>
          <CardDescription>
            {isLoading ? t("loading") : t("table.description", { count: processes.length })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("search.placeholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={t("filters.status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filters.all")}</SelectItem>
                <SelectItem value="pending">{t("status.pending")}</SelectItem>
                <SelectItem value="in_progress">{t("status.inProgress")}</SelectItem>
                <SelectItem value="completed">{t("status.completed")}</SelectItem>
                <SelectItem value="cancelled">{t("status.cancelled")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>{t("loading")}</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("table.columns.id")}</TableHead>
                  <TableHead>{t("table.columns.organization")}</TableHead>
                  <TableHead>{t("table.columns.inputs")}</TableHead>
                  <TableHead>{t("table.columns.outputs")}</TableHead>
                  <TableHead>{t("table.columns.status")}</TableHead>
                  <TableHead>{t("table.columns.date")}</TableHead>
                  <TableHead>{t("table.columns.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProcesses.length > 0 ? (
                  filteredProcesses.map((process: Process, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono">#{process.id}</TableCell>
                      <TableCell>{process.organization.name}</TableCell>
                      <TableCell>
                        {process.inputs && process.inputs.length > 0 ? (
                          <ul className="space-y-1">
                            {process.inputs.map((input, index) => {
                              const inventoryItem = getInventoryById(input.inventory);
                              return (
                                <li key={index} className="text-sm flex justify-between">
                                  <span>{inventoryItem?.material.name || t("unknown")}</span>
                                  <span className="font-mono">
                                    {input.quantity} {inventoryItem?.material.unit || ""}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          <span className="text-gray-500 text-sm">{t("noData")}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {process.outputs && process.outputs.length > 0 ? (
                          <ul className="space-y-1">
                            {process.outputs.map((output) => {
                              const material = getMaterialById(output.material);
                              return (
                                <li key={output.id} className="text-sm flex justify-between">
                                  <span>{material?.name || t("unknown")}</span>
                                  <span className="font-mono">
                                    {output.quantity} {material?.unit || ""}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          <span className="text-gray-500 text-sm">{t("noData")}</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(process.status)}</TableCell>
                      <TableCell className="text-sm">{formatDate(process.created_at)}</TableCell>
                      <TableCell>
                        {process.status == "in process" && (
                          <div className="flex gap-2">
                            <Button
                              className="cursor-pointer"
                              variant="ghost"
                              size="sm"
                              onClick={() => openCompleteModal(process)}
                            >
                              <SquareCheckBig className="h-4 w-4" />
                            </Button>
                            <Button
                              className="cursor-pointer"
                              variant="destructive"
                              size="sm"
                              onClick={() => openDeleteModal(process)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <p className="text-gray-500">
                        {searchTerm || statusFilter !== "all" ? t("empty.filtered") : t("empty.noProcesses")}
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
