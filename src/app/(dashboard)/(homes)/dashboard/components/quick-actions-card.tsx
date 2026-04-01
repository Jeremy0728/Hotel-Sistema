import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CalendarCheck2, LogIn, Receipt, UserPlus } from "lucide-react";

export default function QuickActionsCard() {
  return (
    <Card className="p-4 space-y-3">
      <div>
        <h3 className="text-base font-semibold">Acciones rapidas</h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-300">
          Flujo operativo de recepcion
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-2">
        <Button asChild>
          <Link href="/reservations/new">
            <CalendarCheck2 className="h-4 w-4" />
            Nueva reserva
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/checkin">
            <LogIn className="h-4 w-4" />
            Check-in (flujo)
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/invoices">
            <Receipt className="h-4 w-4" />
            Cobrar
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/guests">
            <UserPlus className="h-4 w-4" />
            Nuevo huesped
          </Link>
        </Button>
      </div>
    </Card>
  );
}
