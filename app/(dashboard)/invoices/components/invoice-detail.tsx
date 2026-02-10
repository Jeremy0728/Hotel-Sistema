"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EmptyState from "@/components/hotel/empty-state";
import InvoiceStatusBadge from "@/components/hotel/invoice-status-badge";
import { useHotelData } from "@/contexts/HotelDataContext";
import type { Invoice } from "@/types/hotel";
import type { InvoicePaymentValues } from "@/lib/hotel-schemas";
import InvoicePaymentDialog from "./invoice-payment-dialog";

interface InvoiceDetailProps {
  invoiceId: string;
}

export default function InvoiceDetail({ invoiceId }: InvoiceDetailProps) {
  const { invoices, paymentMethods, addInvoicePayment } = useHotelData();
  const [paymentOpen, setPaymentOpen] = useState(false);

  const invoice = useMemo(
    () => invoices.find((item) => item.id === invoiceId) ?? null,
    [invoices, invoiceId]
  );

  const handlePaymentSubmit = (values: InvoicePaymentValues) => {
    if (!invoice) return;
    const method = paymentMethods.find((item) => item.id === values.methodId);
    addInvoicePayment(invoice.id, {
      amount: values.amount,
      methodId: values.methodId,
      methodName: method?.name ?? "Metodo",
      reference: values.reference,
      date: values.date,
      notes: values.notes,
    });
  };

  if (!invoice) {
    return (
      <EmptyState
        title="Factura no encontrada"
        description="No existe la factura solicitada."
      />
    );
  }

  const totalPaid = invoice.payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-6">
      <Card className="p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-300">Factura</p>
            <h2 className="text-2xl font-semibold">{invoice.number}</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-300">
              Emision: {invoice.date}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <InvoiceStatusBadge status={invoice.status} />
            <Button variant="ghost">Imprimir</Button>
            <Button variant="ghost">Enviar email</Button>
            <Button onClick={() => setPaymentOpen(true)} disabled={invoice.balance <= 0}>
              Registrar pago
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-neutral-500">Cliente</p>
            <p className="font-medium">{invoice.clientName}</p>
          </div>
          <div>
            <p className="text-neutral-500">Reserva</p>
            <p className="font-medium">{invoice.reservationCode ?? "-"}</p>
          </div>
          <div>
            <p className="text-neutral-500">Balance pendiente</p>
            <p className="font-medium">S/ {invoice.balance.toFixed(2)}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Concepto</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Precio unitario</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoice.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.description}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>S/ {item.unitPrice.toFixed(2)}</TableCell>
                <TableCell>S/ {item.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-neutral-500">Subtotal</p>
            <p className="font-semibold">S/ {invoice.subtotal.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-neutral-500">Impuestos</p>
            <p className="font-semibold">S/ {invoice.tax.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-neutral-500">Total</p>
            <p className="font-semibold">S/ {invoice.total.toFixed(2)}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">Pagos registrados</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-300">
            Total pagado: S/ {totalPaid.toFixed(2)}
          </p>
        </div>
        {invoice.payments.length === 0 ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-300">
            No hay pagos registrados.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Metodo</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Referencia</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>{payment.methodName}</TableCell>
                  <TableCell>S/ {payment.amount.toFixed(2)}</TableCell>
                  <TableCell>{payment.reference || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <InvoicePaymentDialog
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        invoice={invoice as Invoice}
        paymentMethods={paymentMethods}
        onSubmit={handlePaymentSubmit}
      />
    </div>
  );
}
