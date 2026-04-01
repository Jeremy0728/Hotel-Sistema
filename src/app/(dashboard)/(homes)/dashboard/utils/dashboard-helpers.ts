import type { Reservation } from "@/types/hotel";

export function displayName(name: string) {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length <= 1) return name;
  return `${parts[0]} ${parts[parts.length - 1]}`;
}

export function paxLabel(reservation?: { adults?: number; children?: number }) {
  if (!reservation) return "Pax -";
  return `Pax ${(reservation.adults ?? 0) + (reservation.children ?? 0)}`;
}

export function paymentMeta(invoice?: { balance: number; total: number }): { label: string; variant: "info" | "success" | "warning" } {
  if (!invoice) return { label: "Sin factura", variant: "info" as const };
  if (invoice.balance <= 0) return { label: "Pagado", variant: "success" as const };
  if (invoice.balance < invoice.total) return { label: "Parcial", variant: "info" as const };
  return { label: "Pendiente", variant: "warning" as const };
}

export function roomNumeric(roomNumber: string) {
  const parsed = Number.parseInt(roomNumber, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function reservationStatusLabel(status: Reservation["status"]) {
  if (status === "pending") return "Pendiente";
  if (status === "confirmed") return "Confirmada";
  if (status === "checkin") return "Check-in";
  if (status === "checkout") return "Check-out";
  return "Cancelada";
}

export function trendText(value: number) {
  return `${value >= 0 ? "+" : ""}${value} vs ayer`;
}

export const staffPool = ["Ana", "Carlos", "Brenda", "Luis"];
