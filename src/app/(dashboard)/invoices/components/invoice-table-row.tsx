import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import InvoiceStatusBadge from "@/components/hotel/invoice-status-badge";
import type { Invoice } from "@/types/invoice";

interface InvoiceTableRowProps {
  invoice: Invoice;
  calculateBalance: (invoice: Invoice) => number;
  onOpenPayment: (invoice: Invoice) => void;
}

export default function InvoiceTableRow({
  invoice,
  calculateBalance,
  onOpenPayment,
}: InvoiceTableRowProps) {
  const total = typeof invoice.total_amount === 'string' ? parseFloat(invoice.total_amount) : invoice.total_amount;
  const balance = calculateBalance(invoice);
  
  const clientName = invoice.guest 
    ? `${invoice.guest.nombres} ${invoice.guest.apellido_paterno}`
    : invoice.corporateClient?.company_name || 'N/A';

  return (
    <TableRow>
      <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
      <TableCell>{clientName}</TableCell>
      <TableCell>{invoice.reservation?.confirmation_code || "-"}</TableCell>
      <TableCell>{new Date(invoice.issue_date).toLocaleDateString('es-PE')}</TableCell>
      <TableCell>S/ {total.toFixed(2)}</TableCell>
      <TableCell>S/ {balance.toFixed(2)}</TableCell>
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
            onClick={() => onOpenPayment(invoice)}
            disabled={balance <= 0}
          >
            Registrar pago
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
