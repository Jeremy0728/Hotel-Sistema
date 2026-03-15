"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EmptyState from "@/components/hotel/empty-state";
import InvoiceStatusBadge from "@/components/hotel/invoice-status-badge";
import { useInvoiceById } from "@/hooks/useInvoices";
import { useActiveMetodosPago } from "@/hooks/useMetodosPago";
import { pagosApi } from "@/apis/pagos.api";
import { toast } from "react-hot-toast";
import type { Invoice } from "@/types/invoice";
import type { InvoicePaymentValues } from "@/lib/hotel-schemas";
import InvoicePaymentDialog from "./invoice-payment-dialog";

interface InvoiceDetailProps {
  invoiceId: string;
}

export default function InvoiceDetail({ invoiceId }: InvoiceDetailProps) {
  const { invoice, isLoading: invoiceLoading, refreshInvoice } = useInvoiceById({ invoiceId: parseInt(invoiceId) });
  const { paymentMethods, isLoading: paymentMethodsLoading } = useActiveMetodosPago();
  const [paymentOpen, setPaymentOpen] = useState(false);

  // Calcular balance de la factura
  const calculateBalance = (invoice: Invoice) => {
    const total = typeof invoice.total_amount === 'string' ? parseFloat(invoice.total_amount) : invoice.total_amount;
    const paid = invoice.all_related_payments?.reduce((sum, payment) => {
      const amount = typeof payment.amount === 'string' ? parseFloat(payment.amount) : payment.amount;
      return sum + (payment.status === 'completed' ? amount : 0);
    }, 0) || 0;
    return total - paid;
  };

  const handlePaymentSubmit = async (values: InvoicePaymentValues) => {
    if (!invoice) return;
    try {
      await pagosApi.crear({
        invoice_id: invoice.id,
        amount: values.amount,
        payment_method_id: values.methodId ? parseInt(values.methodId) : undefined,
        payment_date: values.date || new Date().toISOString(),
        status: 'completed',
        notes: values.notes || undefined,
      });
      toast.success('Pago registrado exitosamente');
      refreshInvoice();
      setPaymentOpen(false);
    } catch (error) {
      console.error('Error al registrar pago:', error);
      toast.error('Error al registrar pago');
    }
  };

  if (invoiceLoading || paymentMethodsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin mx-auto border-4 border-primary border-t-transparent rounded-full" />
          <p className="text-sm text-neutral-500">Cargando factura...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <EmptyState
        title="Factura no encontrada"
        description="No existe la factura solicitada."
      />
    );
  }

  const balance = calculateBalance(invoice);
  
  // Calcular total pagado usando all_related_payments que incluye pagos directos, de reserva y de ventas
  const totalPaid = invoice.all_related_payments?.reduce((sum, payment) => {
    const amount = typeof payment.amount === 'string' ? parseFloat(payment.amount) : payment.amount;
    return sum + (payment.status === 'completed' ? amount : 0);
  }, 0) || 0;

  return (
    <div className="space-y-6">
      <Card className="p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-300">Factura</p>
            <h2 className="text-2xl font-semibold">{invoice.invoice_number}</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-300">
              Emision: {new Date(invoice.issue_date).toLocaleDateString('es-PE')}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <InvoiceStatusBadge status={invoice.status} />
            <Button variant="ghost">Imprimir</Button>
            <Button variant="ghost">Enviar email</Button>
            <Button onClick={() => setPaymentOpen(true)} disabled={balance <= 0}>
              Registrar pago
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-neutral-500">Cliente</p>
            <p className="font-medium">
              {invoice.guest 
                ? `${invoice.guest.nombres} ${invoice.guest.apellido_paterno}`
                : invoice.corporateClient?.company_name || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-neutral-500">Reserva</p>
            <p className="font-medium">{invoice.reservation?.confirmation_code ?? "-"}</p>
          </div>
          <div>
            <p className="text-neutral-500">Balance pendiente</p>
            <p className="font-medium">S/ {balance.toFixed(2)}</p>
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
            {invoice.sales?.flatMap(sale => 
              sale.items?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.product?.name || 'Producto'}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>S/ {parseFloat(item.unit_price).toFixed(2)}</TableCell>
                  <TableCell>S/ {parseFloat(item.total_price).toFixed(2)}</TableCell>
                </TableRow>
              )) || []
            ) || (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-neutral-500">
                  No hay items registrados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-neutral-500">Subtotal</p>
            <p className="font-semibold">S/ {(typeof invoice.subtotal === 'string' ? parseFloat(invoice.subtotal) : invoice.subtotal).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-neutral-500">Impuestos</p>
            <p className="font-semibold">S/ {(typeof invoice.tax_amount === 'string' ? parseFloat(invoice.tax_amount) : invoice.tax_amount).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-neutral-500">Total</p>
            <p className="font-semibold">S/ {(typeof invoice.total_amount === 'string' ? parseFloat(invoice.total_amount) : invoice.total_amount).toFixed(2)}</p>
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
        {!invoice.all_related_payments || invoice.all_related_payments.length === 0 ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-300">
            No hay pagos registrados.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Pago</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.all_related_payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.payment_number}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      payment.relation_type === 'direct_invoice' ? 'bg-blue-100 text-blue-800' :
                      payment.relation_type === 'reservation' ? 'bg-purple-100 text-purple-800' :
                      payment.relation_type === 'sale' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {payment.relation_type === 'direct_invoice' ? 'Factura' :
                       payment.relation_type === 'reservation' ? 'Reserva' :
                       payment.relation_type === 'sale' ? 'Venta' :
                       'Otro'}
                    </span>
                  </TableCell>
                  <TableCell>{payment.paymentMethod?.name || '-'}</TableCell>
                  <TableCell>{new Date(payment.payment_date).toLocaleDateString('es-PE')}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {payment.status === 'completed' ? 'Completado' :
                       payment.status === 'pending' ? 'Pendiente' :
                       payment.status === 'failed' ? 'Fallido' :
                       payment.status}
                    </span>
                  </TableCell>
                  <TableCell>S/ {(typeof payment.amount === 'string' ? parseFloat(payment.amount) : payment.amount).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <InvoicePaymentDialog
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        invoice={invoice}
        paymentMethods={paymentMethods}
        onSubmit={handlePaymentSubmit}
      />
    </div>
  );
}
