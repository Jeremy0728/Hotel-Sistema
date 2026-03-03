"use client";

import Link from "next/link";
import { Building2, CircleCheck, LoaderCircle, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { RoomStatus } from "@/types/hotel";

type StatusFilter = RoomStatus | "all";

interface FloorSummary {
  floor: number;
  total: number;
  available: number;
  occupied: number;
  cleaning: number;
}

interface StatusCounts {
  all: number;
  available: number;
  occupied: number;
  cleaning: number;
  maintenance: number;
  out_of_service: number;
}

interface RoomFiltersCardProps {
  statusFilter: StatusFilter;
  setStatusFilter: (filter: StatusFilter) => void;
  search: string;
  setSearch: (search: string) => void;
  selectedFloor: number;
  setSelectedFloor: (floor: number) => void;
  floorSummaries: FloorSummary[];
  counts: StatusCounts;
}

export default function RoomFiltersCard({
  statusFilter,
  setStatusFilter,
  search,
  setSearch,
  selectedFloor,
  setSelectedFloor,
  floorSummaries,
  counts,
}: RoomFiltersCardProps) {
  return (
    <Card className="p-4 space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="info" className="px-2 py-0.5">
              Modo operacion
            </Badge>
            <span className="text-xs text-neutral-500 dark:text-neutral-300">
              Recepcion: ejecutar sin editar datos maestros
            </span>
          </div>
          <h2 className="text-lg font-semibold">Habitaciones</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-300">
            Disponibilidad y estado operativo en tiempo real
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href="/reservations/new">Nueva reserva</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/housekeeping">Housekeeping</Link>
          </Button>
          <Button asChild>
            <Link href="/operaciones/habitaciones/configuracion">
              Configuracion habitaciones
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
        <Button
          size="sm"
          variant={statusFilter === "all" ? "default" : "outline"}
          onClick={() => setStatusFilter("all")}
        >
          Todo ({counts.all})
        </Button>
        <Button
          size="sm"
          variant={statusFilter === "available" ? "default" : "outline"}
          onClick={() => setStatusFilter("available")}
        >
          <CircleCheck className="h-4 w-4" />
          Disponible ({counts.available})
        </Button>
        <Button
          size="sm"
          variant={statusFilter === "occupied" ? "default" : "outline"}
          onClick={() => setStatusFilter("occupied")}
        >
          <Building2 className="h-4 w-4" />
          Ocupada ({counts.occupied})
        </Button>
        <Button
          size="sm"
          variant={statusFilter === "cleaning" ? "default" : "outline"}
          onClick={() => setStatusFilter("cleaning")}
        >
          <LoaderCircle className="h-4 w-4" />
          Limpieza ({counts.cleaning})
        </Button>
        <Button
          size="sm"
          variant={statusFilter === "maintenance" ? "default" : "outline"}
          onClick={() => setStatusFilter("maintenance")}
        >
          <Wrench className="h-4 w-4" />
          Mant. ({counts.maintenance})
        </Button>
        <Button
          size="sm"
          variant={statusFilter === "out_of_service" ? "default" : "outline"}
          onClick={() => setStatusFilter("out_of_service")}
        >
          F/S ({counts.out_of_service})
        </Button>
      </div>

      <Input
        placeholder="Buscar por numero, tipo o huesped"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <div className="flex gap-2 overflow-x-auto pb-2">
        {floorSummaries.map((summary) => (
          <button
            key={summary.floor}
            type="button"
            onClick={() => setSelectedFloor(summary.floor)}
            className={`min-w-[170px] rounded-lg border px-3 py-2 text-left transition ${
              selectedFloor === summary.floor
                ? "border-primary bg-primary/10"
                : "border-neutral-200 bg-white dark:border-slate-700 dark:bg-slate-900"
            }`}
          >
            <p className="text-sm font-semibold">Piso {summary.floor}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-300">
              D:{summary.available} O:{summary.occupied} L:{summary.cleaning}
            </p>
          </button>
        ))}
      </div>
    </Card>
  );
}
