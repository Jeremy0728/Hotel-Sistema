import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Sale, PaymentStatus } from "@/types/sale";

interface SalesTableRowProps {
  sale: Sale;
}

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

export default function SalesTableRow({ sale }: SalesTableRowProps) {
  const total = typeof sale.total_amount === 'string' 
    ? parseFloat(sale.total_amount) 
    : sale.total_amount;
  
  const guestName = sale.guest && sale.guest.nombres && sale.guest.apellido_paterno
    ? `${sale.guest.nombres} ${sale.guest.apellido_paterno} ${sale.guest.apellido_materno || ''}`.trim()
    : sale.guest_id 
    ? `Huésped #${sale.guest_id}`
    : 'Sin huésped';
  
  const saleDate = new Date(sale.created_at).toLocaleDateString('es-PE');

  return (
    <TableRow>
      <TableCell className="font-medium">{sale.sale_number}</TableCell>
      <TableCell>{saleDate}</TableCell>
      <TableCell>{guestName}</TableCell>
      <TableCell>S/ {total.toFixed(2)}</TableCell>
      <TableCell>{sale.payment_method}</TableCell>
      <TableCell>
        <Badge className={cn("rounded-full", statusClasses[sale.payment_status])}>
          {statusLabels[sale.payment_status]}
        </Badge>
      </TableCell>
      <TableCell>
        <Button size="sm" variant="ghost" asChild>
          <Link href={`/sales/${sale.id}`}>Ver detalle</Link>
        </Button>
      </TableCell>
    </TableRow>
  );
}
