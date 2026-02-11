"use client";

import { Card } from "@/components/ui/card";
import StatusBadge from "@/components/hotel/status-badge";
import type { Room } from "@/types/hotel";

interface RoomCardProps {
  room: Room;
  onClick: () => void;
}

export default function RoomCard({ room, onClick }: RoomCardProps) {
  return (
    <Card
      onClick={onClick}
      className="p-4 cursor-pointer border border-neutral-200 dark:border-slate-700 hover:border-primary/60 transition"
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          onClick();
        }
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-neutral-500 dark:text-neutral-300">
            Habitación
          </p>
          <h3 className="text-lg font-semibold">#{room.number}</h3>
        </div>
        <StatusBadge type="room" status={room.status} />
      </div>
      <div className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
        <p>{room.type}</p>
        <p>Piso {room.floor}</p>
      </div>
      {room.notes ? (
        <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
          {room.notes}
        </p>
      ) : null}
    </Card>
  );
}
