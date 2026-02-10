"use client";

import { cn } from "@/lib/utils";

type StrengthLevel = "weak" | "medium" | "strong";

interface PasswordStrengthIndicatorProps {
  password: string;
}

function getStrength(password: string): { level: StrengthLevel; score: number } {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  if (score <= 2) return { level: "weak", score };
  if (score <= 4) return { level: "medium", score };
  return { level: "strong", score };
}

const levelLabel: Record<StrengthLevel, string> = {
  weak: "Weak",
  medium: "Medium",
  strong: "Strong",
};

const levelColor: Record<StrengthLevel, string> = {
  weak: "bg-red-500",
  medium: "bg-yellow-500",
  strong: "bg-green-600",
};

export default function PasswordStrengthIndicator({
  password,
}: PasswordStrengthIndicatorProps) {
  const { level, score } = getStrength(password);
  const width = Math.min(100, Math.max(10, (score / 5) * 100));

  return (
    <div className="mt-2">
      <div className="h-2 w-full rounded-full bg-neutral-200 dark:bg-slate-700 overflow-hidden">
        <div
          className={cn("h-full transition-all", levelColor[level])}
          style={{ width: `${width}%` }}
        />
      </div>
      <div className="mt-1 text-xs text-neutral-600 dark:text-neutral-300">
        Password strength:{" "}
        <span className="font-semibold">{levelLabel[level]}</span>
      </div>
    </div>
  );
}
