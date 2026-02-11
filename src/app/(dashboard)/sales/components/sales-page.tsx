"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EmptyState from "@/components/hotel/empty-state";
import { useHotelData } from "@/contexts/HotelDataContext";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { Sale, SaleStatus } from "@/types/hotel";

const statusOptions: { value: SaleStatus | "all"; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "paid", label: "Pagada" },
  { value: "pending", label: "Pendiente" },
  { value: "cancelled", label: "Cancelada" },
];

const statusClasses: Record<SaleStatus, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  pending: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-neutral-200 text-neutral-700",
};

export default function SalesPage() {
  const { sales } = useHotelData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<SaleStatus | "all">("all");

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return sales.filter((sale) => {
      const matchesSearch =
        sale.number.toLowerCase().includes(query) ||
        (sale.guestName ?? "").toLowerCase().includes(query);
      const matchesStatus = statusFilter === "all" ? true : sale.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [sales, search, statusFilter]);

  return (
    <div className="space-y-6">
      <Card className="p-4 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
          <div>
            <h2 className="text-lg font-semibold">Ventas</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-300">
              Registro de ventas del punto de venta
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            placeholder="Buscar por numero o cliente"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as SaleStatus | "all")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          title="Sin ventas"
          description="No hay ventas que coincidan con los filtros actuales."
        />
      ) : (
        <Card className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numero</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Metodo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((sale: Sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.number}</TableCell>
                  <TableCell>{sale.date}</TableCell>
                  <TableCell>{sale.guestName || "-"}</TableCell>
                  <TableCell>S/ {sale.total.toFixed(2)}</TableCell>
                  <TableCell>{sale.paymentMethod || "-"}</TableCell>
                  <TableCell>
                    <Badge className={cn("rounded-full", statusClasses[sale.status])}>
                      {sale.status === "paid"
                        ? "Pagada"
                        : sale.status === "pending"
                        ? "Pendiente"
                        : "Cancelada"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={`/sales/${sale.id}`}>Ver detalle</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
