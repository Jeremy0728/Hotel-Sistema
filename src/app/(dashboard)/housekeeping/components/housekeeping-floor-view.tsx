import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/hotel/status-badge";
import { cn } from "@/lib/utils";

type Priority = "alta" | "media" | "baja";

const priorityStyles: Record<Priority, string> = {
  alta: "bg-red-100 text-red-700",
  media: "bg-yellow-100 text-yellow-700",
  baja: "bg-emerald-100 text-emerald-700",
};

interface Room {
  id: number;
  number: string;
  floor: number;
  status: "available" | "occupied" | "maintenance" | "cleaning" | "out_of_service";
}

interface FloorGroup {
  floor: number;
  rooms: Room[];
}

interface HousekeepingFloorViewProps {
  groupedByFloor: FloorGroup[];
  priorities: Record<number, Priority>;
  assignments: Record<number, string>;
  onMarkClean: (roomId: number) => void;
  onBlock: (roomId: number) => void;
}

export default function HousekeepingFloorView({
  groupedByFloor,
  priorities,
  assignments,
  onMarkClean,
  onBlock,
}: HousekeepingFloorViewProps) {
  return (
    <div className="space-y-4">
      {groupedByFloor.map((group) => (
        <Card key={group.floor} className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Piso {group.floor}</h3>
            <span className="text-xs text-neutral-500">
              {group.rooms.length} habitaciones
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {group.rooms.map((room) => {
              const priority = priorities[room.id] ?? "media";
              return (
                <div
                  key={room.id}
                  className="rounded-lg border border-neutral-200 dark:border-slate-700 p-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">Habitación #{room.number}</p>
                      <p className="text-xs text-neutral-500">
                        Responsable: {assignments[room.id] ?? "Sin asignar"}
                      </p>
                    </div>
                    <StatusBadge type="room" status={room.status} />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge className={cn("rounded-full", priorityStyles[priority])}>
                      Prioridad {priority}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onMarkClean(room.id)}
                    >
                      Marcar limpia
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onBlock(room.id)}
                    >
                      Bloquear
                    </Button>
                  </div>
                </div>
              );
            })}
            {group.rooms.length === 0 ? (
              <div className="text-sm text-neutral-500">
                Sin habitaciones para este piso.
              </div>
            ) : null}
          </div>
        </Card>
      ))}
    </div>
  );
}
