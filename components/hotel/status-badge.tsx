"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ReservationStatus, RoomStatus } from "@/types/hotel";

type StatusType = "room" | "reservation";

const roomStatusLabels: Record<RoomStatus, string> = {
  available: "Disponible",
  occupied: "Ocupada",
  cleaning: "Limpieza",
  maintenance: "Mantenimiento",
  out_of_service: "Fuera de servicio",
};

const roomStatusClasses: Record<RoomStatus, string> = {
  available: "bg-emerald-100 text-emerald-700",
  occupied: "bg-red-100 text-red-700",
  cleaning: "bg-yellow-100 text-yellow-700",
  maintenance: "bg-orange-100 text-orange-700",
  out_of_service: "bg-neutral-200 text-neutral-700",
};

const reservationStatusLabels: Record<ReservationStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  checkin: "Check-in",
  checkout: "Check-out",
  cancelled: "Cancelada",
};

const reservationStatusClasses: Record<ReservationStatus, string> = {
  pending: "bg-neutral-200 text-neutral-700",
  confirmed: "bg-blue-100 text-blue-700",
  checkin: "bg-emerald-100 text-emerald-700",
  checkout: "bg-purple-100 text-purple-700",
  cancelled: "bg-red-100 text-red-700",
};

interface StatusBadgeProps {
  type: StatusType;
  status: RoomStatus | ReservationStatus;
  className?: string;
}

export default function StatusBadge({
  type,
  status,
  className,
}: StatusBadgeProps) {
  const label =
    type === "room"
      ? roomStatusLabels[status as RoomStatus]
      : reservationStatusLabels[status as ReservationStatus];
  const colorClass =
    type === "room"
      ? roomStatusClasses[status as RoomStatus]
      : reservationStatusClasses[status as ReservationStatus];

  return (
    <Badge
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-semibold",
        colorClass,
        className
      )}
    >
      {label}
    </Badge>
  );
}
