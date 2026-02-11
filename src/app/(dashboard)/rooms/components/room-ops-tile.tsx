"use client";

import type { KeyboardEvent, MouseEvent } from "react";
import { CircleAlert, CreditCard, Eye, Users, Zap } from "lucide-react";
import StatusBadge from "@/components/hotel/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Room, RoomStatus } from "@/types/hotel";

interface RoomOpsTileProps {
  room: Room;
  guestName?: string;
  paxLabel: string;
  context: string;
  hasPendingPayment: boolean;
  hasAlert: boolean;
  quickLabel: string;
  quickDisabled?: boolean;
  onView: () => void;
  onQuick: () => void;
}

function typeCode(type: string) {
  return type.replace(/\s+/g, "").slice(0, 3).toUpperCase() || "STD";
}

function accent(status: RoomStatus) {
  if (status === "occupied") {
    return "border-sky-200 dark:border-sky-900/60";
  }
  if (status === "cleaning") {
    return "border-amber-200 dark:border-amber-900/60";
  }
  if (status === "maintenance") {
    return "border-orange-200 dark:border-orange-900/60";
  }
  if (status === "out_of_service") {
    return "border-neutral-300 dark:border-slate-700";
  }

  return "border-emerald-200 dark:border-emerald-900/60";
}

export default function RoomOpsTile({
  room,
  guestName,
  paxLabel,
  context,
  hasPendingPayment,
  hasAlert,
  quickLabel,
  quickDisabled = false,
  onView,
  onQuick,
}: RoomOpsTileProps) {
  const onCardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onView();
    }
  };

  const stopAndRun = (
    event: MouseEvent<HTMLButtonElement>,
    callback: () => void
  ) => {
    event.stopPropagation();
    callback();
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      onKeyDown={onCardKeyDown}
      onClick={onView}
      className={cn(
        "group relative flex h-[168px] cursor-pointer flex-col overflow-hidden rounded-lg border bg-white p-4 shadow-sm transition hover:shadow-md dark:bg-slate-900",
        accent(room.status)
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-neutral-500 dark:text-neutral-300">Habitacion</p>
          <h3 className="text-[32px] leading-none font-semibold text-neutral-900 dark:text-white">
            #{room.number}
          </h3>
        </div>
        <StatusBadge type="room" status={room.status} />
      </div>

      <div className="mt-2.5 flex flex-1 flex-col pb-1">
        <div className="min-h-[40px] space-y-0.5">
          <p className="truncate text-sm font-semibold text-neutral-900 dark:text-white">
            {guestName ?? "Sin reserva activa"}
          </p>
          <p className="truncate text-xs text-neutral-500 dark:text-neutral-300">{context}</p>
        </div>

        <div className="mt-auto pt-2 flex items-end justify-between gap-3">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-300">
              <Users className="h-3.5 w-3.5" />
              {paxLabel}
            </span>
            <div className="flex min-h-4 items-center gap-2">
              {hasAlert ? <CircleAlert className="h-4 w-4 text-amber-500" /> : null}
              {hasPendingPayment ? <CreditCard className="h-4 w-4 text-rose-500" /> : null}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs text-neutral-500 dark:text-neutral-300">Piso {room.floor}</span>
            <span className="text-[11px] font-mono rounded bg-neutral-100 px-1.5 py-0.5 text-neutral-600 dark:bg-slate-800 dark:text-neutral-300">
              {typeCode(room.type)}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 hidden items-center justify-center border border-neutral-300 bg-white/95 p-2 backdrop-blur-[1px] md:group-hover:flex dark:border-slate-700 dark:bg-slate-900/95">
        <div className="grid w-full grid-cols-2 gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-7"
            onClick={(event) => stopAndRun(event, onView)}
          >
            <Eye className="h-3.5 w-3.5" />
            Ver
          </Button>
          <Button
            size="sm"
            className="h-7"
            disabled={quickDisabled}
            onClick={(event) => stopAndRun(event, onQuick)}
          >
            <Zap className="h-3.5 w-3.5" />
            {quickLabel}
          </Button>
        </div>
      </div>
    </Card>
  );
}
