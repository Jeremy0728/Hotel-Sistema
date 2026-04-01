import MetricCard from "@/components/hotel/metric-card";
import { CircleCheck, BedDouble, LogIn, LogOut } from "lucide-react";

interface DashboardMetricsGridProps {
  availableRooms: number;
  totalRooms: number;
  occupiedRooms: number;
  checkInsToday: number;
  checkInsYesterday: number;
  checkOutsToday: number;
  checkOutsYesterday: number;
  trendText: (value: number) => string;
}

export default function DashboardMetricsGrid({
  availableRooms,
  totalRooms,
  occupiedRooms,
  checkInsToday,
  checkInsYesterday,
  checkOutsToday,
  checkOutsYesterday,
  trendText,
}: DashboardMetricsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <MetricCard
        title="Disponibles"
        value={`${availableRooms}/${totalRooms}`}
        description="Capacidad actual"
        trend={`${Math.round((availableRooms / Math.max(totalRooms, 1)) * 100)}% del total`}
        actionLabel="Ver habitaciones"
        href="/rooms?status=available"
        icon={CircleCheck}
        accentClassName="bg-emerald-100 text-emerald-600"
      />
      <MetricCard
        title="Ocupadas"
        value={`${occupiedRooms}/${totalRooms}`}
        description="En este momento"
        trend={`${Math.round((occupiedRooms / Math.max(totalRooms, 1)) * 100)}% del total`}
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
        actionLabel="Ir a check-in"
        href="/checkin"
        icon={LogIn}
        accentClassName="bg-emerald-100 text-emerald-600"
      />
      <MetricCard
        title="Check-outs hoy"
        value={checkOutsToday}
        description="Salidas programadas"
        trend={trendText(checkOutsToday - checkOutsYesterday)}
        actionLabel="Ir a check-out"
        href="/checkout"
        icon={LogOut}
        accentClassName="bg-orange-100 text-orange-600"
      />
    </div>
  );
}
