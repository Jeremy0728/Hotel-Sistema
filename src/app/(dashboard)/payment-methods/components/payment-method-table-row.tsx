import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface PaymentMethod {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
}

interface PaymentMethodTableRowProps {
  method: PaymentMethod;
  onEdit: (method: PaymentMethod) => void;
}

export default function PaymentMethodTableRow({
  method,
  onEdit,
}: PaymentMethodTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{method.name}</TableCell>
      <TableCell>{method.description || "-"}</TableCell>
      <TableCell>
        <Badge
          className={cn(
            "rounded-full",
            method.is_active
              ? "bg-emerald-100 text-emerald-700"
              : "bg-neutral-200 text-neutral-700"
          )}
        >
          {method.is_active ? "Activo" : "Inactivo"}
        </Badge>
      </TableCell>
      <TableCell>
        <Button size="sm" variant="ghost" onClick={() => onEdit(method)}>
          Editar
        </Button>
      </TableCell>
    </TableRow>
  );
}
