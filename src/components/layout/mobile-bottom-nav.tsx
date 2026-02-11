"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, CalendarCheck2, Home, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Reservas", href: "/reservations", icon: CalendarCheck2 },
  { label: "Check-in", href: "/checkin", icon: LogIn },
  { label: "Alertas", href: "/notification-alert", icon: Bell },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#1f2a3a]/95 backdrop-blur border-t border-neutral-200 dark:border-slate-700 md:hidden">
      <div className="grid grid-cols-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-3 text-xs font-medium text-neutral-500 dark:text-neutral-300",
                isActive && "text-primary"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
