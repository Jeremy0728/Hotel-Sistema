import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/hotel/empty-state";
import { cn } from "@/lib/utils";
import type { InventoryLocation, InventoryLocationType } from "@/types/inventory";

const locationTypeLabels: Record<InventoryLocationType, string> = {
  reception: "Recepcion",
  minibar: "Minibar",
  storage: "Almacen",
  restaurant: "Restaurante",
  warehouse: "Bodega",
};

const statusBadgeClass = (active: boolean) =>
  active ? "bg-emerald-100 text-emerald-700" : "bg-neutral-200 text-neutral-700";

interface InventoryLocationsTabProps {
  locationSearch: string;
  setLocationSearch: (value: string) => void;
  filteredLocations: InventoryLocation[];
  onOpenCreateLocation: () => void;
  onOpenEditLocation: (location: InventoryLocation) => void;
}

export default function InventoryLocationsTab({
  locationSearch,
  setLocationSearch,
  filteredLocations,
  onOpenCreateLocation,
  onOpenEditLocation,
}: InventoryLocationsTabProps) {
  return (
    <>
      <Card className="p-4 flex flex-col gap-4">
        <Input
          placeholder="Buscar ubicacion"
          value={locationSearch}
          onChange={(event) => setLocationSearch(event.target.value)}
        />
      </Card>

      {filteredLocations.length === 0 ? (
        <EmptyState
          title="Sin ubicaciones"
          description="No hay ubicaciones registradas."
          action={<Button onClick={onOpenCreateLocation}>Agregar ubicacion</Button>}
        />
      ) : (
        <Card className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ubicacion</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Habitacion</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLocations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell className="font-medium">
                    {location.name}
                  </TableCell>
                  <TableCell>
                    {locationTypeLabels[location.location_type] ?? location.location_type}
                  </TableCell>
                  <TableCell>
                    {location.roomNumber ? `#${location.roomNumber}` : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "rounded-full",
                        statusBadgeClass(location.is_active)
                      )}
                    >
                      {location.is_active ? "Activa" : "Inactiva"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onOpenEditLocation(location)}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </>
  );
}
