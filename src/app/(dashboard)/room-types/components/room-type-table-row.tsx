import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const formatRate = (value: string | number) => `S/ ${value}`;

interface RoomType {
  id: number;
  name: string;
  description?: string;
  base_price?: string;
  max_occupancy: number;
  amenities?: Record<string, unknown>;
  is_active: boolean;
}

interface RoomTypeTableRowProps {
  roomType: RoomType;
  onEdit: (roomType: RoomType) => void;
  onDelete: (roomType: RoomType) => void;
}

export default function RoomTypeTableRow({
  roomType,
  onEdit,
  onDelete,
}: RoomTypeTableRowProps) {
  // Convertir amenities de objeto a array si es necesario
  const amenitiesList = roomType.amenities
    ? Object.values(roomType.amenities).filter((v) => typeof v === 'string')
    : [];

  return (
    <TableRow>
      <TableCell className="font-medium">{roomType.name}</TableCell>
      <TableCell className="text-sm text-neutral-500 dark:text-neutral-300">
        {roomType.description || "-"}
      </TableCell>
      <TableCell>{roomType.max_occupancy} pax</TableCell>
      <TableCell className="text-xs text-neutral-500 dark:text-neutral-300">
        <div>Precio base: {roomType.base_price ? formatRate(roomType.base_price) : '-'}</div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {amenitiesList.length ? (
            amenitiesList.map((amenity, index) => (
              <Badge key={index} className="rounded-full" variant="secondary">
                {String(amenity)}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-neutral-400">-</span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge
          className={cn(
            "rounded-full",
            roomType.is_active
              ? "bg-emerald-100 text-emerald-700"
              : "bg-neutral-200 text-neutral-700"
          )}
        >
          {roomType.is_active ? "Activo" : "Inactivo"}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="ghost" onClick={() => onEdit(roomType)}>
            Editar
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onDelete(roomType)}>
            Eliminar
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
