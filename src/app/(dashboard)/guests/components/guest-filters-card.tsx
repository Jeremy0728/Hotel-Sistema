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

const pageSizes = [10, 25, 50];

interface GuestFiltersCardProps {
  search: string;
  setSearch: (value: string) => void;
  nationalityFilter: string;
  setNationalityFilter: (value: string) => void;
  documentFilter: string;
  setDocumentFilter: (value: string) => void;
  pageSize: number;
  setPageSize: (value: number) => void;
  nationalities: (string | undefined)[];
  documentTypes: (string | undefined)[];
  onOpenCreate: () => void;
}

export default function GuestFiltersCard({
  search,
  setSearch,
  nationalityFilter,
  setNationalityFilter,
  documentFilter,
  setDocumentFilter,
  pageSize,
  setPageSize,
  nationalities,
  documentTypes,
  onOpenCreate,
}: GuestFiltersCardProps) {
  return (
    <Card className="p-4 flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
        <div>
          <h2 className="text-lg font-semibold">Huéspedes</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-300">
            Base de datos de huéspedes y contactos
          </p>
        </div>
        <Button onClick={onOpenCreate}>Agregar huésped</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Input
          placeholder="Buscar por nombre, documento o email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={nationalityFilter} onValueChange={setNationalityFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Nacionalidad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {nationalities.filter((item): item is string => !!item).map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={documentFilter} onValueChange={setDocumentFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Documento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {documentTypes.filter((item): item is string => !!item).map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={String(pageSize)}
          onValueChange={(value) => setPageSize(Number(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filas" />
          </SelectTrigger>
          <SelectContent>
            {pageSizes.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size} por página
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}
