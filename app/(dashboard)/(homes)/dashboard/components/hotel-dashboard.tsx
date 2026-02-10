"use client";

import MetricCard from "@/components/hotel/metric-card";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useHotelData } from "@/contexts/HotelDataContext";
import { BedDouble, CalendarCheck2, LogIn, LogOut } from "lucide-react";
import OccupancyChartCard from "./occupancy-chart-card";
import ShiftCenter from "./shift-center";
import UpcomingReservations from "./upcoming-reservations";

export default function HotelDashboard() {
  const { rooms, reservations, invoices, sales } = useHotelData();
  const todayStr = new Date().toISOString().split("T")[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const availableRooms = rooms.filter((room) => room.status === "available")
    .length;
  const occupiedRooms = rooms.filter((room) => room.status === "occupied")
    .length;
  const checkInsToday = reservations.filter(
    (reservation) =>
      reservation.checkIn === todayStr &&
      (reservation.status === "pending" || reservation.status === "confirmed")
  ).length;
  const checkInsYesterday = reservations.filter(
    (reservation) =>
      reservation.checkIn === yesterdayStr &&
      (reservation.status === "pending" || reservation.status === "confirmed")
  ).length;
  const checkOutsToday = reservations.filter(
    (reservation) =>
      reservation.checkOut === todayStr && reservation.status === "checkin"
  ).length;
  const checkOutsYesterday = reservations.filter(
    (reservation) =>
      reservation.checkOut === yesterdayStr && reservation.status === "checkin"
  ).length;

  const paymentsToday = invoices
    .filter((invoice) => invoice.date === todayStr)
    .reduce(
      (sum, invoice) =>
        sum + invoice.payments.reduce((acc, payment) => acc + payment.amount, 0),
      0
    );
  const salesToday = sales
    .filter((sale) => sale.date === todayStr)
    .reduce((sum, sale) => sum + sale.total, 0);
  const revenueToday = paymentsToday + salesToday;
  const pendingToday = invoices
    .filter((invoice) => invoice.date === todayStr)
    .reduce((sum, invoice) => sum + invoice.balance, 0);
  const sapStatus = pendingToday > 0 ? "Error" : "OK";

  const unpaidReservations = invoices.filter((invoice) => invoice.balance > 0)
    .length;
  const cleaningRooms = rooms.filter((room) => room.status === "cleaning").length;
  const overbookingRisk = Math.max(0, checkInsToday - availableRooms);

  const trendText = (value: number) => `${value >= 0 ? "+" : ""}${value} vs ayer`;

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          {unpaidReservations > 0 ? (
            <Badge variant="warning">
              {unpaidReservations} reservas sin pago
            </Badge>
          ) : null}
          {cleaningRooms > 0 ? (
            <Badge variant="info">{cleaningRooms} habitaciones por limpiar</Badge>
          ) : null}
          {overbookingRisk > 0 ? (
            <Badge variant="danger">
              {overbookingRisk} overbooking riesgo
            </Badge>
          ) : null}
          {unpaidReservations === 0 && cleaningRooms === 0 && overbookingRisk === 0 ? (
            <span className="text-sm text-neutral-500 dark:text-neutral-300">
              Sin alertas críticas por ahora.
            </span>
          ) : null}
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          title="Habitaciones disponibles"
          value={availableRooms}
          description="En este momento"
          trend={trendText(0)}
          actionLabel="Ver disponibles"
          href="/rooms?status=available"
          icon={BedDouble}
        />
        <MetricCard
          title="Habitaciones ocupadas"
          value={occupiedRooms}
          description="En este momento"
          trend={trendText(0)}
          actionLabel="Ver ocupadas"
          href="/rooms?status=occupied"
          icon={BedDouble}
          accentClassName="bg-red-100 text-red-600"
        />
        <MetricCard
          title="Check-ins hoy"
          value={checkInsToday}
          description="Llegadas programadas"
          trend={trendText(checkInsToday - checkInsYesterday)}
          actionLabel="Ver llegadas"
          href="/checkin"
          icon={LogIn}
          accentClassName="bg-emerald-100 text-emerald-600"
        />
        <MetricCard
          title="Check-outs hoy"
          value={checkOutsToday}
          description="Salidas programadas"
          trend={trendText(checkOutsToday - checkOutsYesterday)}
          actionLabel="Ver salidas"
          href="/checkout"
          icon={LogOut}
          accentClassName="bg-orange-100 text-orange-600"
        />
      </div>

      <ShiftCenter />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <OccupancyChartCard />
        </div>
        <div className="xl:col-span-1">
          <Card className="p-5 h-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">Resumen caja</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-300">
                  Estado operativo del día
                </p>
              </div>
              <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-blue-100 text-blue-600">
                <CalendarCheck2 className="w-4.5 h-4.5" />
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Ingresos hoy</span>
                <span className="font-semibold">S/ {revenueToday.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Pendiente por cobrar</span>
                <span className="font-semibold">S/ {pendingToday.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Pagos en SAP</span>
                <Badge variant={sapStatus === "OK" ? "success" : "danger"}>
                  {sapStatus}
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <UpcomingReservations />
    </div>
  );
}
