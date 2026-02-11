"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import MetricCard from "@/components/hotel/metric-card";
import ShiftCenter from "@/app/(dashboard)/(homes)/dashboard/components/shift-center";
import OccupancyChartCard from "@/app/(dashboard)/(homes)/dashboard/components/occupancy-chart-card";
import { useHotelData } from "@/contexts/HotelDataContext";

const channelOptions = [
  { value: "all", label: "Todos" },
  { value: "direct", label: "Directo" },
  { value: "ota", label: "OTA" },
  { value: "corporate", label: "Corporativo" },
];

const paymentOptions = [
  { value: "all", label: "Todos" },
  { value: "paid", label: "Pagado" },
  { value: "pending", label: "Pendiente" },
];

export default function HotelAnalytics() {
  const { rooms, reservations, invoices, roomTypes } = useHotelData();
  const todayStr = new Date().toISOString().split("T")[0];
  const [dateFrom, setDateFrom] = useState(todayStr);
  const [dateTo, setDateTo] = useState(todayStr);
  const [channel, setChannel] = useState("all");
  const [roomType, setRoomType] = useState("all");
  const [payment, setPayment] = useState("all");

  const totalRooms = rooms.length || 1;
  const occupiedRooms = rooms.filter((room) => room.status === "occupied").length;
  const cleaningRooms = rooms.filter((room) => room.status === "cleaning").length;
  const outOfServiceRooms = rooms.filter((room) => room.status === "out_of_service").length;

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
    .reduce((sum, reservation) => sum + reservation.total, 0);
  const pendingBalance = invoices.reduce((sum, invoice) => sum + invoice.balance, 0);
  const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);
  const adr = occupiedRooms > 0 ? Math.round(revenueToday / occupiedRooms) : 0;
  const revPar = Math.round(revenueToday / totalRooms);

  const channelMix = useMemo(() => {
    const direct = reservations.filter((res) => res.channel === "direct").length;
    const ota = reservations.filter((res) => res.channel === "ota").length;
    const corporate = reservations.filter((res) => res.channel === "corporate").length;
    const total = direct + ota + corporate || 1;
    return [
      { label: "Directo", value: Math.round((direct / total) * 100) },
      { label: "OTA", value: Math.round((ota / total) * 100) },
      { label: "Corporativo", value: Math.round((corporate / total) * 100) },
    ];
  }, [reservations]);

  const topRoomTypes = useMemo(() => {
    const map = new Map<string, number>();
    rooms.forEach((room) => {
      map.set(room.type, (map.get(room.type) ?? 0) + 1);
    });
    return Array.from(map.entries()).map(([type, count]) => ({
      type,
      count,
    }));
  }, [rooms]);

  const paymentMix = useMemo(() => {
    const map = new Map<string, number>();
    invoices.forEach((invoice) => {
      invoice.payments.forEach((payment) => {
        map.set(payment.methodName, (map.get(payment.methodName) ?? 0) + payment.amount);
      });
    });
    return Array.from(map.entries());
  }, [invoices]);

  return (
    <div className="space-y-6">
      <Card className="p-4 flex flex-col gap-4 md:sticky md:top-4 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
          <div>
            <h2 className="text-lg font-semibold">Analytics PMS</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-300">
              KPIs hoteleros con filtros operativos
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              Exportar
            </Button>
            <Button size="sm">Actualizar</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <Input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
          <Input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
          <Select value={channel} onValueChange={setChannel}>
            <SelectTrigger>
              <SelectValue placeholder="Canal" />
            </SelectTrigger>
            <SelectContent>
              {channelOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={roomType} onValueChange={setRoomType}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo habitación" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {roomTypes.map((type) => (
                <SelectItem key={type.id} value={type.name}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={payment} onValueChange={setPayment}>
            <SelectTrigger>
              <SelectValue placeholder="Pago" />
            </SelectTrigger>
            <SelectContent>
              {paymentOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="info" className="justify-center">
            Scope: Hotel
          </Badge>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard title="Ocupación hoy" value={`${occupancyRate}%`} actionLabel="Ver habitaciones" href="/rooms" />
        <MetricCard title="ADR" value={`S/ ${adr}`} actionLabel="Ver tarifas" href="/room-types" />
        <MetricCard title="RevPAR" value={`S/ ${revPar}`} actionLabel="Ver ingresos" href="/invoices" />
        <MetricCard title="Pendiente por cobrar" value={`S/ ${pendingBalance.toFixed(0)}`} actionLabel="Cobrar" href="/invoices" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <OccupancyChartCard />
        </div>
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="text-base font-semibold mb-2">Check-ins / Check-outs</h3>
            <div className="flex items-center justify-between text-sm">
              <span>Check-ins hoy</span>
              <span className="font-semibold">{checkInsToday}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span>Check-outs hoy</span>
              <span className="font-semibold">{checkOutsToday}</span>
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="text-base font-semibold mb-2">Estado habitaciones</h3>
            <div className="flex items-center justify-between text-sm">
              <span>En limpieza</span>
              <span className="font-semibold">{cleaningRooms}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span>Fuera de servicio</span>
              <span className="font-semibold">{outOfServiceRooms}</span>
            </div>
          </Card>
        </div>
      </div>

      <ShiftCenter />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="text-base font-semibold mb-3">Mix de canales</h3>
          <div className="space-y-2 text-sm">
            {channelMix.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span>{item.label}</span>
                <span className="font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="text-base font-semibold mb-3">Top tipos de habitación</h3>
          <div className="space-y-2 text-sm">
            {topRoomTypes.map((item) => (
              <div key={item.type} className="flex items-center justify-between">
                <span>{item.type}</span>
                <span className="font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="text-base font-semibold mb-3">Pagos por método</h3>
          <div className="space-y-2 text-sm">
            {paymentMix.length === 0 ? (
              <div className="text-neutral-500">Sin pagos registrados</div>
            ) : (
              paymentMix.map(([method, amount]) => (
                <div key={method} className="flex items-center justify-between">
                  <span>{method}</span>
                  <span className="font-semibold">S/ {amount.toFixed(0)}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
