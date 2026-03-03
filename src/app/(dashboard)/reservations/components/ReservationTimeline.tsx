"use client";

import { Card } from "@/components/ui/card";

interface TimelineItem {
  label: string;
  date: string;
}

interface ReservationTimelineProps {
  timeline: TimelineItem[];
}

export default function ReservationTimeline({ timeline }: ReservationTimelineProps) {
  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-base font-semibold">Historial</h3>
      <div className="space-y-2">
        {timeline.map((item, index) => (
          <div key={`${item.label}-${index}`} className="text-sm text-neutral-600 dark:text-neutral-300">
            {item.date} · {item.label}
          </div>
        ))}
      </div>
    </Card>
  );
}
