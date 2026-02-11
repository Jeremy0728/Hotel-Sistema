"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EmptyState from "@/components/hotel/empty-state";
import StatusBadge from "@/components/hotel/status-badge";
import { useHotelData } from "@/contexts/HotelDataContext";
import { cn } from "@/lib/utils";
import type { Reservation } from "@/types/hotel";

const weekLabels = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

const formatDate = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const isBetween = (date: string, start: string, end: string) =>
  date >= start && date < end;

export default function ReservationsCalendar() {
  const { reservations, rooms } = useHotelData();
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(() => formatDate(new Date()));

  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("es-PE", {
        month: "long",
        year: "numeric",
      }).format(currentMonth),
    [currentMonth]
  );

  const monthDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startOffset = (firstDay.getDay() + 6) % 7;

    const days: Array<{ date: Date; dateStr: string } | null> = [];
    for (let i = 0; i < startOffset; i += 1) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      days.push({ date, dateStr: formatDate(date) });
    }
    return days;
  }, [currentMonth]);

  const dayReservations = useMemo(() => {
    return reservations.filter((reservation) =>
      selectedDate >= reservation.checkIn && selectedDate <= reservation.checkOut
    );
  }, [reservations, selectedDate]);

  const handlePrev = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const handleNext = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(formatDate(now));
  };

  const getDayStats = (dateStr: string) => {
    const checkIns = reservations.filter((r) => r.checkIn === dateStr).length;
    const checkOuts = reservations.filter((r) => r.checkOut === dateStr).length;
    const occupied = reservations.filter(
      (r) => r.status !== "cancelled" && isBetween(dateStr, r.checkIn, r.checkOut)
    ).length;
    const occupancyPercent = rooms.length
      ? Math.round((occupied / rooms.length) * 100)
      : 0;

    return { checkIns, checkOuts, occupancyPercent };
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Calendario de reservas</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-300">
              Ocupacion y movimientos por fecha
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" onClick={handlePrev}>
              Mes anterior
            </Button>
            <Button variant="ghost" onClick={handleToday}>
              Hoy
            </Button>
            <Button variant="ghost" onClick={handleNext}>
              Mes siguiente
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold capitalize">{monthLabel}</h3>
          <div className="flex flex-wrap gap-3 text-xs text-neutral-500 dark:text-neutral-300">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> Check-in
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-orange-500" /> Check-out
            </span>
            <span className="flex items-center gap-1">
              <span className="w-6 h-1 rounded-full bg-emerald-500" /> Ocupacion
            </span>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="grid grid-cols-7 text-xs font-medium text-neutral-500 dark:text-neutral-300">
          {weekLabels.map((label) => (
            <div key={label} className="py-2 text-center">
              {label}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {monthDays.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="min-h-[96px]" />;
            }

            const stats = getDayStats(day.dateStr);
            const isSelected = selectedDate === day.dateStr;

            return (
              <button
                key={day.dateStr}
                type="button"
                className={cn(
                  "min-h-[96px] rounded-lg border p-2 text-left hover:border-primary transition",
                  isSelected ? "border-primary bg-primary/5" : "border-neutral-200 dark:border-slate-700"
                )}
                onClick={() => setSelectedDate(day.dateStr)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{day.date.getDate()}</span>
                  <span className="text-[10px] text-neutral-400">{stats.occupancyPercent}%</span>
                </div>
                <div className="mt-2 space-y-1 text-[11px] text-neutral-500 dark:text-neutral-300">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>{stats.checkIns} check-in</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    <span>{stats.checkOuts} check-out</span>
                  </div>
                </div>
                <div className="mt-2 h-1 w-full rounded-full bg-neutral-200 dark:bg-slate-700">
                  <div
                    className="h-1 rounded-full bg-emerald-500"
                    style={{ width: `${stats.occupancyPercent}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="p-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold">Reservas del dia</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-300">
              {selectedDate}
            </p>
          </div>
          <Input
            readOnly
            value={`Total: ${dayReservations.length}`}
            className="max-w-[140px]"
          />
        </div>
        {dayReservations.length === 0 ? (
          <EmptyState
            title="Sin reservas"
            description="No hay reservas para la fecha seleccionada."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Codigo</TableHead>
                <TableHead>Huesped</TableHead>
                <TableHead>Habitacion</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dayReservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell className="font-medium">{reservation.code}</TableCell>
                  <TableCell>{reservation.guestName}</TableCell>
                  <TableCell>#{reservation.roomNumber}</TableCell>
                  <TableCell>{reservation.checkIn}</TableCell>
                  <TableCell>{reservation.checkOut}</TableCell>
                  <TableCell>
                    <StatusBadge type="reservation" status={reservation.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
