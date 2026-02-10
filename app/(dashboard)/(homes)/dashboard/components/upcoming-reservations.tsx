"use client";

import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useHotelData } from "@/contexts/HotelDataContext";
import StatusBadge from "@/components/hotel/status-badge";

function formatDate(dateStr: string) {
  const date = new Date(`${dateStr}T00:00:00`);
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

export default function UpcomingReservations() {
  const { reservations } = useHotelData();
  const todayStr = new Date().toISOString().split("T")[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const upcoming = reservations
    .filter((reservation) =>
      [todayStr, tomorrowStr].includes(reservation.checkIn)
    )
    .sort((a, b) => a.checkIn.localeCompare(b.checkIn));

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold">Reservas próximas</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-300">
            Hoy y mañana
          </p>
        </div>
      </div>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Huésped</TableHead>
              <TableHead>Habitación</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {upcoming.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell className="font-medium">
                  {reservation.guestName}
                </TableCell>
                <TableCell>#{reservation.roomNumber}</TableCell>
                <TableCell>{formatDate(reservation.checkIn)}</TableCell>
                <TableCell>{formatDate(reservation.checkOut)}</TableCell>
                <TableCell>
                  <StatusBadge type="reservation" status={reservation.status} />
                </TableCell>
              </TableRow>
            ))}
            {upcoming.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-sm text-neutral-500 dark:text-neutral-300">
                  No hay reservas próximas.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-3 md:hidden">
        {upcoming.map((reservation) => (
          <Card key={reservation.id} className="p-4 border border-neutral-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{reservation.guestName}</p>
              <StatusBadge type="reservation" status={reservation.status} />
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-300 mt-1">
              Habitación #{reservation.roomNumber}
            </p>
            <div className="text-xs text-neutral-500 dark:text-neutral-300 mt-2">
              {formatDate(reservation.checkIn)} → {formatDate(reservation.checkOut)}
            </div>
          </Card>
        ))}
        {upcoming.length === 0 ? (
          <div className="text-sm text-neutral-500 dark:text-neutral-300 text-center">
            No hay reservas próximas.
          </div>
        ) : null}
      </div>
    </Card>
  );
}
