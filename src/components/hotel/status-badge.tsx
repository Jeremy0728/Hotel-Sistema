"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ReservationStatus, RoomStatus } from "@/types/hotel";
import {
  BadgeCheck,
  Ban,
  CircleOff,
  Clock,
  LogIn,
  LogOut,
  Sparkles,
  Wrench,
  CheckCircle2,
  BedDouble,
} from "lucide-react";

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

const roomStatusIcons: Record<RoomStatus, typeof CheckCircle2> = {
  available: CheckCircle2,
  occupied: BedDouble,
  cleaning: Sparkles,
  maintenance: Wrench,
  out_of_service: CircleOff,
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

const reservationStatusIcons: Record<ReservationStatus, typeof CheckCircle2> = {
  pending: Clock,
  confirmed: BadgeCheck,
  checkin: LogIn,
  checkout: LogOut,
  cancelled: Ban,
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
  const Icon =
    type === "room"
      ? roomStatusIcons[status as RoomStatus]
      : reservationStatusIcons[status as ReservationStatus];

  return (
    <Badge
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-semibold inline-flex items-center gap-1",
        colorClass,
        className
      )}
    >
      {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
      {label}
    </Badge>
  );
}
