import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SaleStatus = "completed" | "cancelled" | "pending";

const statusOptions: { value: SaleStatus | "all"; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "completed", label: "Completada" },
  { value: "pending", label: "Pendiente" },
  { value: "cancelled", label: "Cancelada" },
];

interface SalesFiltersCardProps {
  search: string;
  setSearch: (value: string) => void;
  statusFilter: SaleStatus | "all";
  setStatusFilter: (value: SaleStatus | "all") => void;
}

export default function SalesFiltersCard({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
}: SalesFiltersCardProps) {
  return (
    <Card className="p-4 flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
        <div>
          <h2 className="text-lg font-semibold">Ventas</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-300">
            Registro de ventas del punto de venta
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          placeholder="Buscar por numero o cliente"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as SaleStatus | "all")}
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
      </div>
    </Card>
  );
}
