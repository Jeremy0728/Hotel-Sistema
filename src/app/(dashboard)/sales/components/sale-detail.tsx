"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import EmptyState from "@/components/hotel/empty-state";
import { useSale } from "@/hooks/useSales";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { PaymentStatus } from "@/types/sale";

const statusClasses: Record<PaymentStatus, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  pending: "bg-yellow-100 text-yellow-700",
  refunded: "bg-neutral-200 text-neutral-700",
};

const statusLabels: Record<PaymentStatus, string> = {
  paid: "Pagada",
  pending: "Pendiente",
  refunded: "Reembolsada",
};

interface SaleDetailProps {
  saleId: string;
}

export default function SaleDetail({ saleId }: SaleDetailProps) {
  const { sale, isLoading, isError } = useSale(Number(saleId));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin mx-auto border-4 border-primary border-t-transparent rounded-full" />
          <p className="text-sm text-neutral-500">Cargando venta...</p>
        </div>
      </div>
    );
  }

  if (isError || !sale) {
    return (
      <EmptyState
        title="Venta no encontrada"
        description="No se encontró la venta solicitada."
        action={
          <Button asChild>
            <Link href="/sales">Volver a ventas</Link>
          </Button>
        }
      />
    );
  }

  const guestName = sale.guest && sale.guest.nombres && sale.guest.apellido_paterno
    ? `${sale.guest.nombres} ${sale.guest.apellido_paterno} ${sale.guest.apellido_materno || ''}`.trim()
    : sale.guest_id 
    ? `Huésped #${sale.guest_id}`
    : 'Sin huésped';

  const saleDate = new Date(sale.created_at).toLocaleDateString('es-PE');
  const subtotal = typeof sale.subtotal === 'string' ? parseFloat(sale.subtotal) : sale.subtotal;
  const taxAmount = typeof sale.tax_amount === 'string' ? parseFloat(sale.tax_amount) : sale.tax_amount;
  const totalAmount = typeof sale.total_amount === 'string' ? parseFloat(sale.total_amount) : sale.total_amount;

  return (
    <div className="space-y-6">
      <Card className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">{sale.sale_number}</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-300">
              Fecha: {saleDate}
            </p>
          </div>
          <Badge className={cn("rounded-full", statusClasses[sale.payment_status])}>
            {statusLabels[sale.payment_status]}
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-neutral-600 dark:text-neutral-300">
          <div>Cliente: {guestName}</div>
          <div>Método: {sale.payment_method}</div>
          <div>Ubicación: {sale.location?.name || '-'}</div>
        </div>
        {sale.reservation && (
          <div className="text-sm text-neutral-600 dark:text-neutral-300">
            <div>Reserva: {sale.reservation.confirmation_code}</div>
            <div>Check-in: {sale.reservation.check_in_date} | Check-out: {sale.reservation.check_out_date}</div>
          </div>
        )}
        {sale.invoice && (
          <div className="text-sm text-neutral-600 dark:text-neutral-300">
            Factura: {sale.invoice.invoice_number} - {sale.invoice.status}
          </div>
        )}
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Resumen de Venta</h3>
        <div className="space-y-3 text-sm text-neutral-600 dark:text-neutral-300">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span>S/ {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Impuesto</span>
            <span>S/ {taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Descuento</span>
            <span>S/ {(typeof sale.discount_amount === 'string' ? parseFloat(sale.discount_amount) : sale.discount_amount).toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between font-semibold text-base">
            <span>Total</span>
            <span>S/ {totalAmount.toFixed(2)}</span>
          </div>
        </div>
        {sale.processor && (
          <div className="mt-4 pt-4 border-t text-sm text-neutral-500">
            Procesado por: {sale.processor.name} ({sale.processor.email})
          </div>
        )}
      </Card>
    </div>
  );
}
