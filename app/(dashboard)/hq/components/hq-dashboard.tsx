"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useHotelData } from "@/contexts/HotelDataContext";
import { cn } from "@/lib/utils";

type HotelMetric = {
  id: string;
  name: string;
  chain: string;
  city?: string;
  occupancy: number;
  revenueToday: number;
  alerts: number;
};

function seedMetric(index: number) {
  const occupancy = 62 + (index * 11) % 28;
  const revenueToday = 1200 + index * 540 + (index % 2) * 230;
  const alerts = index % 3 === 0 ? 3 : index % 3 === 1 ? 1 : 0;
  return { occupancy, revenueToday, alerts };
}

export default function HqDashboard() {
  const { hotels } = useHotelData();
  const [selected, setSelected] = useState<string[]>([]);

  const metrics = useMemo<HotelMetric[]>(() => {
    return hotels.map((hotel, index) => {
      const { occupancy, revenueToday, alerts } = seedMetric(index);
      return {
        id: hotel.id,
        name: hotel.name,
        chain: hotel.chain,
        city: hotel.city,
        occupancy,
        revenueToday,
        alerts,
      };
    });
  }, [hotels]);

  const totalRevenue = metrics.reduce((sum, metric) => sum + metric.revenueToday, 0);
  const avgOccupancy = Math.round(
    metrics.reduce((sum, metric) => sum + metric.occupancy, 0) / metrics.length
  );
  const totalAlerts = metrics.reduce((sum, metric) => sum + metric.alerts, 0);

  const topByRevenue = [...metrics].sort((a, b) => b.revenueToday - a.revenueToday);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-neutral-500">Ingresos hoy (consolidado)</p>
          <p className="text-2xl font-semibold">S/ {totalRevenue.toFixed(0)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-neutral-500">Ocupación promedio</p>
          <p className="text-2xl font-semibold">{avgOccupancy}%</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-neutral-500">Alertas activas</p>
          <p className="text-2xl font-semibold">{totalAlerts}</p>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-semibold">Hoteles</h3>
            <p className="text-sm text-neutral-500">
              KPIs del día por hotel
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline">
              Comparar seleccionados
            </Button>
            <Button size="sm">Ver ranking completo</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {metrics.map((hotel) => (
            <Card
              key={hotel.id}
              className={cn(
                "p-4 border border-neutral-200 dark:border-slate-700",
                selected.includes(hotel.id) ? "border-primary" : ""
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{hotel.name}</p>
                  <p className="text-xs text-neutral-500">
                    {hotel.chain} {hotel.city ? `· ${hotel.city}` : ""}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={selected.includes(hotel.id) ? "default" : "outline"}
                  onClick={() => toggleSelect(hotel.id)}
                >
                  {selected.includes(hotel.id) ? "Seleccionado" : "Seleccionar"}
                </Button>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-neutral-500">Ocupación</p>
                  <p className="font-semibold">{hotel.occupancy}%</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Ingresos</p>
                  <p className="font-semibold">S/ {hotel.revenueToday}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Alertas</p>
                  <p className="font-semibold">{hotel.alerts}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline">
                  Ver detalle
                </Button>
                {hotel.alerts > 0 ? (
                  <Badge variant="warning">{hotel.alerts} alertas</Badge>
                ) : (
                  <Badge variant="success">Sin alertas</Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Ranking por ingresos</h3>
          <Badge variant="info">Hoy</Badge>
        </div>
        <div className="space-y-2">
          {topByRevenue.map((hotel, index) => (
            <div
              key={hotel.id}
              className="flex items-center justify-between rounded-lg border border-neutral-200 dark:border-slate-700 px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold">#{index + 1}</span>
                <div>
                  <p className="font-medium">{hotel.name}</p>
                  <p className="text-xs text-neutral-500">
                    Ocupación {hotel.occupancy}%
                  </p>
                </div>
              </div>
              <div className="text-sm font-semibold">
                S/ {hotel.revenueToday}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
