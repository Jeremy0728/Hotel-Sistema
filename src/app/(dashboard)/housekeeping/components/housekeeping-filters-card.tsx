import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { RoomStatus } from "@/types/hotel";

type Priority = "alta" | "media" | "baja";

const statusOptions: { value: RoomStatus | "all"; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "cleaning", label: "En limpieza" },
  { value: "occupied", label: "Sucia" },
  { value: "available", label: "Limpia" },
  { value: "maintenance", label: "Mantenimiento" },
  { value: "out_of_service", label: "Fuera de servicio" },
];

interface HousekeepingFiltersCardProps {
  statusFilter: RoomStatus | "all";
  setStatusFilter: (value: RoomStatus | "all") => void;
  floorFilter: number | "all";
  setFloorFilter: (value: number | "all") => void;
  priorityFilter: Priority | "all";
  setPriorityFilter: (value: Priority | "all") => void;
  viewMode: "floor" | "list";
  setViewMode: (value: "floor" | "list") => void;
  floors: number[];
  outOfServiceCount: number;
}

export default function HousekeepingFiltersCard({
  statusFilter,
  setStatusFilter,
  floorFilter,
  setFloorFilter,
  priorityFilter,
  setPriorityFilter,
  viewMode,
  setViewMode,
  floors,
  outOfServiceCount,
}: HousekeepingFiltersCardProps) {
  return (
    <Card className="p-4 flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
        <div>
          <h2 className="text-lg font-semibold">Housekeeping</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-300">
            Asignación de tareas y estado de habitaciones
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={viewMode === "floor" ? "default" : "outline"}
            onClick={() => setViewMode("floor")}
          >
            Vista por piso
          </Button>
          <Button
            size="sm"
            variant={viewMode === "list" ? "default" : "outline"}
            onClick={() => setViewMode("list")}
          >
            Vista lista
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
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
        <Select
          value={floorFilter === "all" ? "all" : String(floorFilter)}
          onValueChange={(value) =>
            setFloorFilter(value === "all" ? "all" : Number(value))
          }
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
        <Select
          value={priorityFilter}
          onValueChange={(value) => setPriorityFilter(value as Priority | "all")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Prioridad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="media">Media</SelectItem>
            <SelectItem value="baja">Baja</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Badge variant="info">
            Fuera de servicio: {outOfServiceCount}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
