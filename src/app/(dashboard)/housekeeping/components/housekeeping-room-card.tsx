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
import StatusBadge from "@/components/hotel/status-badge";
import { cn } from "@/lib/utils";

type Priority = "alta" | "media" | "baja";

const priorityStyles: Record<Priority, string> = {
  alta: "bg-red-100 text-red-700",
  media: "bg-yellow-100 text-yellow-700",
  baja: "bg-emerald-100 text-emerald-700",
};

const staffOptions = ["Ana", "Carlos", "Brenda", "Luis"];

interface Room {
  id: number;
  number: string;
  floor: number;
  status: "available" | "occupied" | "maintenance" | "cleaning" | "out_of_service";
}

interface HousekeepingRoomCardProps {
  room: Room;
  priority: Priority;
  assignment?: string;
  onAssign: (roomId: number, staff: string) => void;
  onPriorityChange: (roomId: number, priority: Priority) => void;
  onMarkClean: (roomId: number) => void;
  onBlock: (roomId: number) => void;
}

export default function HousekeepingRoomCard({
  room,
  priority,
  assignment,
  onAssign,
  onPriorityChange,
  onMarkClean,
  onBlock,
}: HousekeepingRoomCardProps) {
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold">Habitación #{room.number}</p>
          <p className="text-sm text-neutral-500">Piso {room.floor}</p>
        </div>
        <StatusBadge type="room" status={room.status} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge className={cn("rounded-full", priorityStyles[priority])}>
          Prioridad {priority}
        </Badge>
        <Badge variant="outline">
          Responsable: {assignment ?? "Sin asignar"}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Select
          value={assignment ?? "all"}
          onValueChange={(value) => onAssign(room.id, value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Asignar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Sin asignar</SelectItem>
            {staffOptions.map((staff) => (
              <SelectItem key={staff} value={staff}>
                {staff}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={priority}
          onValueChange={(value) => onPriorityChange(room.id, value as Priority)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Prioridad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="media">Media</SelectItem>
            <SelectItem value="baja">Baja</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => onMarkClean(room.id)}>
          Marcar limpia
        </Button>
        <Button size="sm" variant="outline" onClick={() => onBlock(room.id)}>
          Bloquear
        </Button>
      </div>
    </Card>
  );
}
