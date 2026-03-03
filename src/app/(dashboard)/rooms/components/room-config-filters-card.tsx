import Link from "next/link";
import { Badge } from "@/components/ui/badge";
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
import type { RoomStatus } from "@/types/hotel";

const statusOptions: { value: RoomStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "available", label: "Disponible" },
  { value: "occupied", label: "Ocupada" },
  { value: "cleaning", label: "Limpieza" },
  { value: "maintenance", label: "Mantenimiento" },
  { value: "out_of_service", label: "Fuera de servicio" },
];

interface RoomConfigFiltersCardProps {
  search: string;
  setSearch: (value: string) => void;
  statusFilter: RoomStatus | "all";
  setStatusFilter: (value: RoomStatus | "all") => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  floorFilter: number | "all";
  setFloorFilter: (value: number | "all") => void;
  roomTypeOptions: string[];
  floors: number[];
  hasParamFilter: boolean;
  statusParam?: string | null;
  onOpenCreate: () => void;
}

export default function RoomConfigFiltersCard({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  floorFilter,
  setFloorFilter,
  roomTypeOptions,
  floors,
  hasParamFilter,
  statusParam,
  onOpenCreate,
}: RoomConfigFiltersCardProps) {
  return (
    <Card className="p-4 flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="warning" className="px-2 py-0.5">
              Modo configuración
            </Badge>
            <span className="text-xs text-neutral-500 dark:text-neutral-300">
              Admin: parametrización y control de inventario
            </span>
          </div>
          <h2 className="text-lg font-semibold">Configuración de habitaciones</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-300">
            Maestro de habitaciones, tipos y estados operativos
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href="/recepcion/habitaciones">Volver a recepción</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/room-types">Tipos de habitación</Link>
          </Button>
          <Button onClick={onOpenCreate}>Agregar habitación</Button>
        </div>
      </div>

      {hasParamFilter ? (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-neutral-200 dark:border-slate-700 px-3 py-2 text-sm">
          <span className="text-neutral-600 dark:text-neutral-300">
            Filtro activo: {statusOptions.find((opt) => opt.value === statusParam)?.label ?? "Estado"}
          </span>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/operaciones/habitaciones/configuracion">Quitar filtro</Link>
          </Button>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Input
          placeholder="Buscar por número o tipo"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as RoomStatus | "all")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {roomTypeOptions.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={floorFilter === "all" ? "all" : String(floorFilter)}
          onValueChange={(value) => setFloorFilter(value === "all" ? "all" : Number(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Piso" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {floors.map((floor) => (
              <SelectItem key={floor} value={String(floor)}>
                Piso {floor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}
