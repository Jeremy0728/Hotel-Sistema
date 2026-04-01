import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CreditCard, Sparkles, AlertTriangle } from "lucide-react";

interface DashboardAlertsProps {
  unpaidReservations: number;
  cleaningRooms: number;
  sapStatus: string;
  pendingToday: number;
}

export default function DashboardAlerts({
  unpaidReservations,
  cleaningRooms,
  sapStatus,
  pendingToday,
}: DashboardAlertsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {unpaidReservations > 0 && (
        <Button
          size="sm"
          variant="outline"
          className="border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
          asChild
        >
          <Link href="/reservations?payment=pending">
            <CreditCard className="h-4 w-4" />
            {unpaidReservations} reservas sin pago · Ver cuentas por cobrar
          </Link>
        </Button>
      )}

      {cleaningRooms > 0 && (
        <Button
          size="sm"
          variant="outline"
          className="border-cyan-300 bg-cyan-50 text-cyan-700 hover:bg-cyan-100"
          asChild
        >
          <Link href="/housekeeping?status=cleaning">
            <Sparkles className="h-4 w-4" />
            {cleaningRooms} habitaciones por limpiar · Ver pendientes HK
          </Link>
        </Button>
      )}

      {sapStatus === "Error" && (
        <Button
          size="sm"
          variant="outline"
          className="border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
          asChild
        >
          <Link href="/invoices?status=pending">
            <AlertTriangle className="h-4 w-4" />
            ${pendingToday.toFixed(2)} pendiente de facturar · Revisar SAP
          </Link>
        </Button>
      )}
    </div>
  );
}
