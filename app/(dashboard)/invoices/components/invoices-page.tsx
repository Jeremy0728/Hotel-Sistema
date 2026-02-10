"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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
import MetricCard from "@/components/hotel/metric-card";
import InvoiceStatusBadge from "@/components/hotel/invoice-status-badge";
import EmptyState from "@/components/hotel/empty-state";
import { useHotelData } from "@/contexts/HotelDataContext";
import type { Invoice } from "@/types/hotel";
import type { InvoicePaymentValues } from "@/lib/hotel-schemas";
import { CircleDollarSign, AlertTriangle, Wallet } from "lucide-react";
import InvoicePaymentDialog from "./invoice-payment-dialog";

const statusOptions = [
  { value: "all", label: "Todos" },
  { value: "draft", label: "Borrador" },
  { value: "sent", label: "Enviada" },
  { value: "paid", label: "Pagada" },
  { value: "overdue", label: "Vencida" },
  { value: "cancelled", label: "Cancelada" },
];

export default function InvoicesPage() {
  const { invoices, paymentMethods, addInvoicePayment } = useHotelData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const filteredInvoices = useMemo(() => {
    const query = search.toLowerCase();
    return invoices.filter((invoice) => {
      const matchesSearch =
        invoice.number.toLowerCase().includes(query) ||
        invoice.clientName.toLowerCase().includes(query) ||
        (invoice.reservationCode?.toLowerCase().includes(query) ?? false);
      const matchesStatus = statusFilter === "all" ? true : invoice.status === statusFilter;
      const matchesFrom = dateFrom ? invoice.date >= dateFrom : true;
      const matchesTo = dateTo ? invoice.date <= dateTo : true;
      return matchesSearch && matchesStatus && matchesFrom && matchesTo;
    });
  }, [invoices, search, statusFilter, dateFrom, dateTo]);

  const totalBilled = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const totalPending = invoices.reduce((sum, invoice) => sum + invoice.balance, 0);
  const totalOverdue = invoices
    .filter((invoice) => invoice.status === "overdue")
    .reduce((sum, invoice) => sum + invoice.balance, 0);

  const handleOpenPayment = (invoice: Invoice) => {
    setActiveInvoice(invoice);
    setPaymentOpen(true);
  };

  const handlePaymentSubmit = (values: InvoicePaymentValues) => {
    if (!activeInvoice) return;
    const method = paymentMethods.find((item) => item.id === values.methodId);
    addInvoicePayment(activeInvoice.id, {
      amount: values.amount,
      methodId: values.methodId,
      methodName: method?.name ?? "Metodo",
      reference: values.reference,
      date: values.date,
      notes: values.notes,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total facturado"
          value={`S/ ${totalBilled.toFixed(2)}`}
          description="Incluye impuestos"
          icon={CircleDollarSign}
        />
        <MetricCard
          title="Pendiente de cobro"
          value={`S/ ${totalPending.toFixed(2)}`}
          description="Balance total"
          icon={Wallet}
          accentClassName="bg-yellow-100 text-yellow-700"
        />
        <MetricCard
          title="Vencido"
          value={`S/ ${totalOverdue.toFixed(2)}`}
          description="Facturas vencidas"
          icon={AlertTriangle}
          accentClassName="bg-red-100 text-red-700"
        />
      </div>

      <Card className="p-4 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input
            placeholder="Buscar por factura o cliente"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
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
          <Input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
          <Input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
        </div>
      </Card>

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
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.number}</TableCell>
                  <TableCell>{invoice.clientName}</TableCell>
                  <TableCell>{invoice.reservationCode ?? "-"}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>S/ {invoice.total.toFixed(2)}</TableCell>
                  <TableCell>S/ {invoice.balance.toFixed(2)}</TableCell>
                  <TableCell>
                    <InvoiceStatusBadge status={invoice.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={`/invoices/${invoice.id}`}>Ver detalle</Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenPayment(invoice)}
                        disabled={invoice.balance <= 0}
                      >
                        Registrar pago
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <InvoicePaymentDialog
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        invoice={activeInvoice}
        paymentMethods={paymentMethods}
        onSubmit={handlePaymentSubmit}
      />
    </div>
  );
}
