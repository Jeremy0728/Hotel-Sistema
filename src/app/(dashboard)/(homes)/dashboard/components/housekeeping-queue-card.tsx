import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import StatusBadge from "@/components/hotel/status-badge";
import type { RoomStatus } from "@/types/hotel";

interface HousekeepingItem {
  room: {
    id: string;
    number: string;
    floor: number;
    status: RoomStatus;
  };
  assignedTo: string;
}

interface HousekeepingQueueCardProps {
  housekeepingQueue: HousekeepingItem[];
  updateRoom: (roomId: string, updates: Partial<{ status: string; notes?: string }>) => Promise<void>;
}

export default function HousekeepingQueueCard({
  housekeepingQueue,
  updateRoom,
}: HousekeepingQueueCardProps) {
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold">Housekeeping en cola</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-300">
            Top 5 habitaciones prioritarias
          </p>
        </div>
        <Button size="sm" variant="outline" asChild>
          <Link href="/housekeeping">Ver todo</Link>
        </Button>
      </div>

      {housekeepingQueue.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neutral-200 p-4 text-sm text-neutral-500 dark:border-slate-700 dark:text-neutral-300">
          No hay pendientes de limpieza.
        </div>
      ) : (
        <div className="space-y-2">
          {housekeepingQueue.map((item) => (
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
                  onClick={() => updateRoom(item.room.id, { status: "available" })}
                >
                  Marcar lista
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
