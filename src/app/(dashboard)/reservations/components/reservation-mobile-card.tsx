import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import StatusBadge from "@/components/hotel/status-badge";
import type { ReservationStatus } from "@/types/hotel";

interface Reservation {
  id: string;
  code: string;
  guestName: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  status: ReservationStatus;
  total: number;
}

interface ReservationMobileCardProps {
  reservation: Reservation;
}

export default function ReservationMobileCard({ reservation }: ReservationMobileCardProps) {
  const router = useRouter();

  return (
    <Card
      className="p-4 border border-neutral-200 dark:border-slate-700 cursor-pointer"
      onClick={() => router.push(`/reservations/${reservation.id}`)}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">{reservation.code}</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-300">
            {reservation.guestName} · Hab. #{reservation.roomNumber}
          </p>
        </div>
        <StatusBadge type="reservation" status={reservation.status} />
      </div>
      <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-300">
        {reservation.checkIn} → {reservation.checkOut} · {reservation.nights} noches
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-semibold">S/ {reservation.total}</span>
        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/reservations/${reservation.id}`);
          }}
        >
          Ver detalle
        </Button>
      </div>
    </Card>
  );
}
