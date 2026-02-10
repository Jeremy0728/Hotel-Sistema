"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: string;
  actionLabel?: string;
  href?: string;
  icon?: LucideIcon;
  accentClassName?: string;
}

export default function MetricCard({
  title,
  value,
  description,
  trend,
  actionLabel,
  href,
  icon: Icon,
  accentClassName,
}: MetricCardProps) {
  const content = (
    <Card
      className={cn(
        "p-5 flex flex-col gap-3 transition-shadow",
        href ? "cursor-pointer hover:shadow-md" : null
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-300">
          {title}
        </p>
        {Icon ? (
          <span
            className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center bg-primary/10 text-primary",
              accentClassName
            )}
          >
            <Icon className="w-4.5 h-4.5" />
          </span>
        ) : null}
      </div>
      <div className="text-2xl font-semibold">{value}</div>
      {description ? (
        <p className="text-xs text-neutral-500 dark:text-neutral-300">
          {description}
        </p>
      ) : null}
      {trend ? (
        <p className="text-xs font-medium text-emerald-600">{trend}</p>
      ) : null}
      {actionLabel ? (
        <span className="text-xs font-semibold text-primary">
          {actionLabel}
        </span>
      ) : null}
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
