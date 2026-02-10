"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EmptyState from "@/components/hotel/empty-state";
import { useHotelData } from "@/contexts/HotelDataContext";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { Sale, SaleStatus } from "@/types/hotel";

const statusClasses: Record<SaleStatus, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  pending: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-neutral-200 text-neutral-700",
};

interface SaleDetailProps {
  saleId: string;
}

export default function SaleDetail({ saleId }: SaleDetailProps) {
  const { sales } = useHotelData();
  const sale = sales.find((item) => item.id === saleId);

  if (!sale) {
    return (
      <EmptyState
        title="Venta no encontrada"
        description="No se encontro la venta solicitada."
        action={
          <Button asChild>
            <Link href="/sales">Volver a ventas</Link>
          </Button>
        }
      />
    );
  }

  const statusLabel =
    sale.status === "paid" ? "Pagada" : sale.status === "pending" ? "Pendiente" : "Cancelada";

  return (
    <div className="space-y-6">
      <Card className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">{sale.number}</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-300">
              Fecha: {sale.date}
            </p>
          </div>
          <Badge className={cn("rounded-full", statusClasses[sale.status])}>
            {statusLabel}
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-neutral-600 dark:text-neutral-300">
          <div>Cliente: {sale.guestName || "-"}</div>
          <div>Metodo: {sale.paymentMethod || "-"}</div>
          <div>Items: {sale.items.length}</div>
        </div>
        {sale.notes ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-300">{sale.notes}</p>
        ) : null}
      </Card>

      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descripcion</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sale.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.description}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>S/ {item.unitPrice}</TableCell>
                <TableCell>S/ {item.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 space-y-1 text-sm text-neutral-600 dark:text-neutral-300">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span>S/ {sale.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Impuesto</span>
            <span>S/ {sale.tax.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between font-semibold">
            <span>Total</span>
            <span>S/ {sale.total.toFixed(2)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
