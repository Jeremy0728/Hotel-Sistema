import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ReservationStatus } from "@/types/hotel";

const statusOptions: { value: ReservationStatus | "all"; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "confirmed", label: "Confirmadas" },
  { value: "pending", label: "Pendientes" },
];

interface CheckInFiltersCardProps {
  search: string;
  setSearch: (value: string) => void;
  statusFilter: ReservationStatus | "all";
  setStatusFilter: (value: ReservationStatus | "all") => void;
  todayStr: string;
}

export default function CheckInFiltersCard({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  todayStr,
}: CheckInFiltersCardProps) {
  return (
    <Card className="p-4 flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
        <div>
          <h2 className="text-lg font-semibold">Check-in</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-300">
            Gestiona la llegada de huéspedes y asigna la habitación
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Input
          placeholder="Buscar por código, huésped o habitación"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as ReservationStatus | "all")}
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
        <Input type="date" value={todayStr} readOnly />
      </div>
    </Card>
  );
}
