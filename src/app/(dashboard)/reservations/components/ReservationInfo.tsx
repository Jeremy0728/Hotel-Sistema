"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import StatusBadge from "@/components/hotel/status-badge";
import type { Reservation } from "@/types/hotel";

interface ReservationInfoProps {
  reservation: Reservation;
  isUpdating: boolean;
  onConfirm: () => void;
  onCheckIn: () => void;
  onCancel: () => void;
}

export default function ReservationInfo({
  reservation,
  isUpdating,
  onConfirm,
  onCheckIn,
  onCancel,
}: ReservationInfoProps) {
  return (
    <Card className="p-5 space-y-4">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <p className="text-sm text-neutral-500 dark:text-neutral-300">Reserva</p>
          <h2 className="text-2xl font-semibold">{reservation.code}</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-300">
            {reservation.checkIn} - {reservation.checkOut}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge type="reservation" status={reservation.status} />
          <Button
            variant="ghost"
            onClick={onConfirm}
            disabled={reservation.status !== "pending" || isUpdating}
          >
            Confirmar
          </Button>
          <Button
            variant="ghost"
            onClick={onCheckIn}
            disabled={reservation.status !== "confirmed" || isUpdating}
          >
            Check-in
          </Button>
          <Button
            variant="ghost"
            onClick={onCancel}
            disabled={reservation.status === "cancelled" || isUpdating}
          >
            Cancelar
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-neutral-500">Habitacion</p>
          <p className="font-medium">#{reservation.roomNumber}</p>
        </div>
        <div>
          <p className="text-neutral-500">Noches</p>
          <p className="font-medium">{reservation.nights}</p>
        </div>
        <div>
          <p className="text-neutral-500">Huesped principal</p>
          <p className="font-medium">{reservation.guestName}</p>
        </div>
        <div>
          <p className="text-neutral-500">Total</p>
          <p className="font-medium">S/ {reservation.total}</p>
        </div>
      </div>
    </Card>
  );
}
