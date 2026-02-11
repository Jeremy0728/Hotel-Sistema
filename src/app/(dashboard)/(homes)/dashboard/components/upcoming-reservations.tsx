"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useHotelData } from "@/contexts/HotelDataContext";
import StatusBadge from "@/components/hotel/status-badge";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

function formatDate(dateStr: string) {
  const date = new Date(`${dateStr}T00:00:00`);
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

export default function UpcomingReservations() {
  const { reservations, updateReservation, completeCheckIn } = useHotelData();
  const router = useRouter();
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
              <TableHead>Noches</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {upcoming.map((reservation) => (
              <TableRow
                key={reservation.id}
                className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
                onClick={() => router.push(`/reservations/${reservation.id}`)}
              >
                <TableCell className="font-medium">
                  {reservation.guestName}
                </TableCell>
                <TableCell>#{reservation.roomNumber}</TableCell>
                <TableCell>{formatDate(reservation.checkIn)}</TableCell>
                <TableCell>{formatDate(reservation.checkOut)}</TableCell>
                <TableCell>{reservation.nights}</TableCell>
                <TableCell>S/ {reservation.total.toFixed(2)}</TableCell>
                <TableCell>
                  <StatusBadge type="reservation" status={reservation.status} />
                </TableCell>
                <TableCell
                  className="text-right"
                  onClick={(event) => event.stopPropagation()}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" aria-label="Acciones">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => router.push(`/reservations/${reservation.id}`)}
                      >
                        Ver detalle
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => completeCheckIn(reservation.id)}
                        disabled={reservation.status !== "confirmed"}
                      >
                        Check-in
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateReservation(reservation.id, { status: "cancelled" })}
                        disabled={reservation.status === "cancelled"}
                      >
                        Cancelar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/invoices")}>
                        Cobrar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {upcoming.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-sm text-neutral-500 dark:text-neutral-300">
                  No hay reservas próximas.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-3 md:hidden">
        {upcoming.map((reservation) => (
          <Card
            key={reservation.id}
            className="p-4 border border-neutral-200 dark:border-slate-700 cursor-pointer"
            onClick={() => router.push(`/reservations/${reservation.id}`)}
          >
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
            <div className="text-xs text-neutral-500 dark:text-neutral-300 mt-1">
              {reservation.nights} noches · S/ {reservation.total.toFixed(2)}
            </div>
            <div className="mt-3 flex justify-end" onClick={(event) => event.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost">
                    Acciones
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => router.push(`/reservations/${reservation.id}`)}
                  >
                    Ver detalle
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => completeCheckIn(reservation.id)}
                    disabled={reservation.status !== "confirmed"}
                  >
                    Check-in
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => updateReservation(reservation.id, { status: "cancelled" })}
                    disabled={reservation.status === "cancelled"}
                  >
                    Cancelar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/invoices")}>
                    Cobrar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
