import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

type SaleStatus = "completed" | "cancelled" | "pending";

interface Sale {
  id: number;
  sale_number: string;
  sale_date: string;
  customer_id?: number;
  total: string;
  payment_method_id: number;
  status: SaleStatus;
}

interface SalesTableRowProps {
  sale: Sale;
}

const statusClasses: Record<SaleStatus, string> = {
  completed: "bg-emerald-100 text-emerald-700",
  pending: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-neutral-200 text-neutral-700",
};

const statusLabels: Record<SaleStatus, string> = {
  completed: "Completada",
  pending: "Pendiente",
  cancelled: "Cancelada",
};

export default function SalesTableRow({ sale }: SalesTableRowProps) {
  const total = parseFloat(sale.total);

  return (
    <TableRow>
      <TableCell className="font-medium">{sale.sale_number}</TableCell>
      <TableCell>{sale.sale_date}</TableCell>
      <TableCell>Cliente #{sale.customer_id || "-"}</TableCell>
      <TableCell>S/ {total.toFixed(2)}</TableCell>
      <TableCell>Método #{sale.payment_method_id}</TableCell>
      <TableCell>
        <Badge className={cn("rounded-full", statusClasses[sale.status])}>
          {statusLabels[sale.status]}
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
