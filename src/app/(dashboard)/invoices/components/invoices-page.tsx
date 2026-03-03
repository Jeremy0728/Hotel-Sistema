"use client";

import { Card } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EmptyState from "@/components/hotel/empty-state";
import { useInvoices } from "@/hooks/useInvoices";
import { useInvoiceOperations } from "../hooks/useInvoiceOperations";
import InvoiceMetrics from "./invoice-metrics";
import InvoiceFiltersCard from "./invoice-filters-card";
import InvoiceTableRow from "./invoice-table-row";
import InvoicePaymentDialog from "./invoice-payment-dialog";

export default function InvoicesPage() {
  // Obtener datos desde hooks individuales
  const { invoices: apiInvoices, isLoading: invoicesLoading } = useInvoices({ limit: 100 });

  // TODO: Obtener métodos de pago desde API cuando esté disponible
  const paymentMethods: any[] = [];

  // Función para agregar pago (TODO: implementar con API real)
  const handleAddPayment = async (invoiceId: number, payment: any) => {
    // TODO: Llamar a facturasApi para registrar pago
    console.log("Add payment:", invoiceId, payment);
  };

  // Hook de operaciones de facturas
  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    activeInvoice,
    paymentOpen,
    filteredInvoices,
    totalBilled,
    totalPending,
    totalOverdue,
    handleOpenPayment,
    handleClosePayment,
    handlePaymentSubmit,
  } = useInvoiceOperations({
    invoices: apiInvoices,
    paymentMethods,
    onAddPayment: handleAddPayment,
  });

  if (invoicesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin mx-auto border-4 border-primary border-t-transparent rounded-full" />
          <p className="text-sm text-neutral-500">Cargando facturas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <InvoiceMetrics
        totalBilled={totalBilled}
        totalPending={totalPending}
        totalOverdue={totalOverdue}
      />

      <InvoiceFiltersCard
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
      />

      {filteredInvoices.length === 0 ? (
        <EmptyState
          title="Sin facturas"
          description="No hay facturas que coincidan con los filtros actuales."
        />
      ) : (
        <Card className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Factura</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Reserva</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <InvoiceTableRow
                  key={invoice.id}
                  invoice={invoice}
                  onOpenPayment={handleOpenPayment}
                />
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <InvoicePaymentDialog
        open={paymentOpen}
        onOpenChange={handleClosePayment}
        invoice={activeInvoice as any}
        paymentMethods={paymentMethods}
        onSubmit={handlePaymentSubmit}
      />
    </div>
  );
}
