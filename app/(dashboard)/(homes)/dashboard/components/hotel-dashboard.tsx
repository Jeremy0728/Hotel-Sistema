"use client";

import MetricCard from "@/components/hotel/metric-card";
import { useHotelData } from "@/contexts/HotelDataContext";
import { BedDouble, CalendarCheck2, LogIn, LogOut } from "lucide-react";
import OccupancyChartCard from "./occupancy-chart-card";
import UpcomingReservations from "./upcoming-reservations";

export default function HotelDashboard() {
  const { rooms, reservations } = useHotelData();
  const todayStr = new Date().toISOString().split("T")[0];

  const availableRooms = rooms.filter((room) => room.status === "available")
    .length;
  const occupiedRooms = rooms.filter((room) => room.status === "occupied")
    .length;
  const checkInsToday = reservations.filter(
    (reservation) =>
      reservation.checkIn === todayStr &&
      (reservation.status === "pending" || reservation.status === "confirmed")
  ).length;
  const checkOutsToday = reservations.filter(
    (reservation) =>
      reservation.checkOut === todayStr && reservation.status === "checkin"
  ).length;
  const revenueToday = reservations
    .filter((reservation) => reservation.checkIn === todayStr)
    .reduce((acc, reservation) => acc + reservation.total, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          title="Habitaciones disponibles"
          value={availableRooms}
          description="En este momento"
          icon={BedDouble}
        />
        <MetricCard
          title="Habitaciones ocupadas"
          value={occupiedRooms}
          description="En este momento"
          icon={BedDouble}
          accentClassName="bg-red-100 text-red-600"
        />
        <MetricCard
          title="Check-ins hoy"
          value={checkInsToday}
          description="Llegadas programadas"
          icon={LogIn}
          accentClassName="bg-emerald-100 text-emerald-600"
        />
        <MetricCard
          title="Check-outs hoy"
          value={checkOutsToday}
          description="Salidas programadas"
          icon={LogOut}
          accentClassName="bg-orange-100 text-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <OccupancyChartCard />
        </div>
        <div className="xl:col-span-1">
          <MetricCard
            title="Ingresos del día"
            value={`S/ ${revenueToday.toFixed(0)}`}
            description="Ingresos estimados"
            icon={CalendarCheck2}
            accentClassName="bg-blue-100 text-blue-600"
          />
        </div>
      </div>

      <UpcomingReservations />
    </div>
  );
}
