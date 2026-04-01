import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck2, Info, RefreshCw } from "lucide-react";

interface CashierSummaryCardProps {
  revenueToday: number;
  pendingToday: number;
  sapStatus: string;
  maintenanceRooms: number;
  outOfServiceRooms: number;
}

export default function CashierSummaryCard({
  revenueToday,
  pendingToday,
  sapStatus,
  maintenanceRooms,
  outOfServiceRooms,
}: CashierSummaryCardProps) {
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold">Caja compacta</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-300">
            Pendientes y sincronizacion
          </p>
        </div>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
          <CalendarCheck2 className="h-4 w-4" />
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span>Ingresos hoy</span>
          <span className="font-semibold">S/ {revenueToday.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Pendiente por cobrar</span>
          <span className="font-semibold">S/ {pendingToday.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Pagos en SAP</span>
          <Badge variant={sapStatus === "OK" ? "success" : "danger"}>{sapStatus}</Badge>
        </div>
        {sapStatus === "Error" ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-2 py-1.5 text-xs text-red-700">
            No se pudo sincronizar. Reintentar o revisar detalle de integracion.
          </div>
        ) : (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1.5 text-xs text-emerald-700">
            Sincronizacion correcta con SAP.
          </div>
        )}
        <div className="flex items-center justify-between">
          <span>Mantenimiento / F/S</span>
          <span className="font-semibold">{maintenanceRooms + outOfServiceRooms}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-2">
        <Button size="sm" variant="outline" asChild>
          <Link href="/invoices?status=overdue">
            <Info className="h-4 w-4" />
            Ver detalle
          </Link>
        </Button>
        <Button size="sm" variant="outline" asChild>
          <Link href="/invoices">
            <RefreshCw className="h-4 w-4" />
            Reintentar sync
          </Link>
        </Button>
      </div>
    </Card>
  );
}
