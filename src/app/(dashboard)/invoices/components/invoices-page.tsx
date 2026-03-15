"use client";

import { Card } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EmptyState from "@/components/hotel/empty-state";
import { useInvoices } from "@/hooks/useInvoices";
import { useActiveMetodosPago } from "@/hooks/useMetodosPago";
import { useInvoiceOperations } from "../hooks/useInvoiceOperations";
import InvoiceMetrics from "./invoice-metrics";
import InvoiceFiltersCard from "./invoice-filters-card";
import InvoiceTableRow from "./invoice-table-row";
import InvoicePaymentDialog from "./invoice-payment-dialog";

export default function InvoicesPage() {
  // Obtener datos desde hooks individuales
  const { invoices: apiInvoices, isLoading: invoicesLoading, refreshInvoices } = useInvoices({ limit: 100 });
  const { paymentMethods, isLoading: paymentMethodsLoading } = useActiveMetodosPago();

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
    calculateBalance,
    handleOpenPayment,
    handleClosePayment,
    handlePaymentSubmit,
  } = useInvoiceOperations({
    invoices: apiInvoices,
    paymentMethods,
    refreshInvoices,
  });

  if (invoicesLoading || paymentMethodsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin mx-auto border-4 border-primary border-t-transparent rounded-full" />
          <p className="text-sm text-neutral-500">Cargando datos...</p>
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
                  calculateBalance={calculateBalance}
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
