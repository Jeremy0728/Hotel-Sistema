import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Sparkles, AlertTriangle } from "lucide-react";

interface DashboardAlertsCardProps {
  unpaidReservations: number;
  cleaningRooms: number;
  sapStatus: string;
  overbookingRisk: number;
}

export default function DashboardAlertsCard({
  unpaidReservations,
  cleaningRooms,
  sapStatus,
  overbookingRisk,
}: DashboardAlertsCardProps) {
  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center gap-2">
        {unpaidReservations > 0 ? (
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
        ) : null}

        {cleaningRooms > 0 ? (
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
        ) : null}

        {sapStatus === "Error" ? (
          <Button size="sm" variant="destructive" className="animate-pulse" asChild>
            <Link href="/invoices">
              <AlertTriangle className="h-4 w-4" />
              Sync SAP: error · Ver detalle
            </Link>
          </Button>
        ) : (
          <Badge variant="success">Sync SAP: OK</Badge>
        )}

        {overbookingRisk > 0 ? (
          <Badge variant="danger">{overbookingRisk} riesgo overbooking</Badge>
        ) : null}

        {unpaidReservations === 0 && cleaningRooms === 0 && overbookingRisk === 0 ? (
          <span className="text-sm text-neutral-500 dark:text-neutral-300">
            Sin alertas criticas por ahora.
          </span>
        ) : null}
      </div>
    </Card>
  );
}
