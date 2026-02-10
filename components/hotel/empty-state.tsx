"use client";

import { Card } from "@/components/ui/card";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Card className="p-6 text-center">
      <h3 className="text-base font-semibold">{title}</h3>
      {description ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-300 mt-2">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </Card>
  );
}
