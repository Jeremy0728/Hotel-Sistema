"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { InvoiceStatus } from "@/types/hotel";

const statusLabels: Record<InvoiceStatus, string> = {
  draft: "Borrador",
  sent: "Enviada",
  paid: "Pagada",
  overdue: "Vencida",
  cancelled: "Cancelada",
};

const statusClasses: Record<InvoiceStatus, string> = {
  draft: "bg-neutral-200 text-neutral-700",
  sent: "bg-blue-100 text-blue-700",
  paid: "bg-emerald-100 text-emerald-700",
  overdue: "bg-orange-100 text-orange-700",
  cancelled: "bg-red-100 text-red-700",
};

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
  className?: string;
}

export default function InvoiceStatusBadge({
  status,
  className,
}: InvoiceStatusBadgeProps) {
  return (
    <Badge
      className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", statusClasses[status], className)}
    >
      {statusLabels[status]}
    </Badge>
  );
}
