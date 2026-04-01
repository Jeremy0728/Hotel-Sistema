import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/hotel/status-badge";
import type { Room } from "@/types/hotel";

interface HousekeepingItem {
  room: Room;
  assignedTo: string;
}

interface HousekeepingQueueProps {
  items: HousekeepingItem[];
  onMarkReady: (roomId: string) => void;
}

export default function HousekeepingQueue({ items, onMarkReady }: HousekeepingQueueProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-neutral-200 p-4 text-sm text-neutral-500 dark:border-slate-700 dark:text-neutral-300">
        No hay pendientes de limpieza.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.room.id}
          className="rounded-lg border border-neutral-200 p-3 dark:border-slate-700"
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold">Habitacion #{item.room.number}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-300">
                Piso {item.room.floor} · {item.assignedTo}
              </p>
            </div>
            <StatusBadge type="room" status={item.room.status} />
          </div>
          <div className="mt-2 flex justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onMarkReady(item.room.id)}
            >
              Marcar lista
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
