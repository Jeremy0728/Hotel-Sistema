import type { Room, RoomStatus } from "@/types/hotel";

export const DAY_MS = 24 * 60 * 60 * 1000;

export function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * DAY_MS);
}

export function toDateString(date: Date) {
  return date.toISOString().split("T")[0];
}

export function formatWeekday(date: Date) {
  return new Intl.DateTimeFormat("es-PE", { weekday: "short" }).format(date);
}

export function calculateNights(checkIn: string, checkOut: string) {
  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);
  const diff = Math.max(1, Math.round((end.getTime() - start.getTime()) / DAY_MS));
  return diff;
}

export function generateCode() {
  const stamp = Date.now().toString().slice(-6);
  return `RSV-${stamp}`;
}

export function createInitialRooms(): Room[] {
  const rooms: Room[] = [];

  const statusOverrides: Record<string, RoomStatus> = {
    "102": "occupied",
    "103": "occupied",
    "106": "cleaning",
    "108": "maintenance",
    "201": "cleaning",
    "202": "maintenance",
    "204": "occupied",
    "208": "out_of_service",
    "301": "out_of_service",
    "304": "occupied",
    "307": "cleaning",
    "402": "occupied",
    "406": "cleaning",
    "408": "maintenance",
    "504": "occupied",
    "506": "cleaning",
    "608": "out_of_service",
    "702": "occupied",
    "706": "cleaning",
    "804": "maintenance",
    "902": "occupied",
    "908": "out_of_service",
    "1003": "occupied",
    "1006": "cleaning",
    "1008": "maintenance",
  };

  for (let floor = 1; floor <= 10; floor += 1) {
    for (let index = 1; index <= 8; index += 1) {
      const number = String(floor * 100 + index);
      const type =
        index <= 3 ? "Individual" : index <= 6 ? "Doble" : "Suite";
      const status = statusOverrides[number] ?? "available";

      rooms.push({
        id: `room-${number}`,
        number,
        type,
        floor,
        status,
      });
    }
  }

  return rooms;
}
