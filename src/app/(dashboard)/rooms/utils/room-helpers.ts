import type { Reservation, RoomSnapshot } from "@/types/hotel";

export function displayName(name: string): string {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length <= 1) return name;
  return `${parts[0]} ${parts[parts.length - 1]}`;
}

export function paxLabel(reservation?: Reservation): string {
  if (!reservation) return "Pax -";
  return `Pax ${(reservation.adults ?? 0) + (reservation.children ?? 0)}`;
}

export function getContextLine(
  snapshot: RoomSnapshot,
  checkInTime: string,
  checkOutTime: string
): string {
  if (snapshot.departureReservation) return `Sale ${checkOutTime}`;
  if (snapshot.arrivalReservation) return `Llega ${checkInTime}`;
  if (snapshot.room.status === "cleaning") return "Pendiente de limpieza";
  if (snapshot.room.status === "maintenance") return "Revision tecnica";
  if (snapshot.room.status === "out_of_service") return "Fuera de servicio";
  if (snapshot.room.status === "occupied") return "Huesped alojado";
  return "Lista";
}
