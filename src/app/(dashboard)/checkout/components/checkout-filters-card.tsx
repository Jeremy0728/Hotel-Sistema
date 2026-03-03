import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface CheckOutFiltersCardProps {
  search: string;
  setSearch: (value: string) => void;
  todayStr: string;
}

export default function CheckOutFiltersCard({
  search,
  setSearch,
  todayStr,
}: CheckOutFiltersCardProps) {
  return (
    <Card className="p-4 flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
        <div>
          <h2 className="text-lg font-semibold">Check-out</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-300">
            Cierre de estadía, cargos finales y facturación
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          placeholder="Buscar por código, huésped o habitación"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Input type="date" value={todayStr} readOnly />
      </div>
    </Card>
  );
}
