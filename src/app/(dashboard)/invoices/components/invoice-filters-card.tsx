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
  { value: "draft", label: "Borrador" },
  { value: "sent", label: "Enviada" },
  { value: "paid", label: "Pagada" },
  { value: "overdue", label: "Vencida" },
  { value: "cancelled", label: "Cancelada" },
];

interface InvoiceFiltersCardProps {
  search: string;
  setSearch: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  dateFrom: string;
  setDateFrom: (value: string) => void;
  dateTo: string;
  setDateTo: (value: string) => void;
}

export default function InvoiceFiltersCard({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
}: InvoiceFiltersCardProps) {
  return (
    <Card className="p-4 flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Input
          placeholder="Buscar por factura o cliente"
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
        <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
      </div>
    </Card>
  );
}
