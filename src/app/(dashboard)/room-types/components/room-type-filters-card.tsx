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

const statusOptions = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Activo" },
  { value: "inactive", label: "Inactivo" },
];

interface RoomTypeFiltersCardProps {
  search: string;
  setSearch: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  onOpenCreate: () => void;
}

export default function RoomTypeFiltersCard({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  onOpenCreate,
}: RoomTypeFiltersCardProps) {
  return (
    <Card className="p-4 flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
        <div>
          <h2 className="text-lg font-semibold">Tipos de habitación</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-300">
            Configura tarifas, capacidad y amenidades
          </p>
        </div>
        <Button onClick={onOpenCreate}>Agregar tipo</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          placeholder="Buscar por nombre o descripción"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
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
      </div>
    </Card>
  );
}
