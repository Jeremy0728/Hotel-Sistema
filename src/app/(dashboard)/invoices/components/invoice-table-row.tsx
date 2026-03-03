import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import InvoiceStatusBadge from "@/components/hotel/invoice-status-badge";

interface Invoice {
  id: number;
  invoice_number: string;
  reservation_id?: number;
  guest_id?: number;
  issue_date: string;
  status: string;
  total: string;
  balance: string;
}

interface InvoiceTableRowProps {
  invoice: Invoice;
  onOpenPayment: (invoice: Invoice) => void;
}

export default function InvoiceTableRow({
  invoice,
  onOpenPayment,
}: InvoiceTableRowProps) {
  const total = parseFloat(invoice.total);
  const balance = parseFloat(invoice.balance);

  return (
    <TableRow>
      <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
      <TableCell>Cliente #{invoice.guest_id || "-"}</TableCell>
      <TableCell>Reserva #{invoice.reservation_id || "-"}</TableCell>
      <TableCell>{invoice.issue_date}</TableCell>
      <TableCell>S/ {total.toFixed(2)}</TableCell>
      <TableCell>S/ {balance.toFixed(2)}</TableCell>
      <TableCell>
        <InvoiceStatusBadge status={invoice.status as any} />
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
