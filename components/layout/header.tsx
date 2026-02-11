"use client";

import LanguageSelect from "../shared/language-select";
import MessageDropdown from "../shared/message-dropdown";
import { ModeToggle } from "../shared/mode-toggle";
import ProfileDropdown from "../shared/profile-dropdown";
import SearchBox from "../shared/search-box";
import HotelSwitcher from "../shared/hotel-switcher";
import { SidebarTrigger } from "../ui/sidebar";
import NotificationDropdown from "./../shared/notification-dropdown";
import { usePathname, useSearchParams } from "next/navigation";
import { useHotelData } from "@/contexts/HotelDataContext";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { CalendarPlus, LogIn, Receipt, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { hotels, currentHotelId, scopeMode } = useHotelData();
  const currentHotel = hotels.find((hotel) => hotel.id === currentHotelId);

  const view = searchParams.get("view");

  const moduleMap: { match: (path: string) => boolean; module: string; sub?: string }[] = [
    { match: (path) => path === "/dashboard", module: "Dashboard" },
    { match: (path) => path.startsWith("/reservations"), module: "Recepción", sub: "Reservas" },
    { match: (path) => path.startsWith("/checkin"), module: "Recepción", sub: "Check-in" },
    { match: (path) => path.startsWith("/checkout"), module: "Recepción", sub: "Check-out" },
    { match: (path) => path.startsWith("/guests"), module: "Recepción", sub: "Huéspedes" },
    { match: (path) => path.startsWith("/rooms"), module: "Operaciones", sub: view === "housekeeping" ? "Housekeeping" : "Habitaciones" },
    { match: (path) => path.startsWith("/housekeeping"), module: "Operaciones", sub: "Housekeeping" },
    { match: (path) => path.startsWith("/inventory"), module: "Operaciones", sub: "Inventario" },
    { match: (path) => path.startsWith("/services"), module: "Operaciones", sub: "Servicios" },
    { match: (path) => path.startsWith("/invoices"), module: "Finanzas", sub: "Facturas" },
    { match: (path) => path.startsWith("/payment-methods"), module: "Finanzas", sub: "Pagos" },
    { match: (path) => path.startsWith("/sales"), module: "Finanzas", sub: "Ventas" },
    { match: (path) => path.startsWith("/analytics"), module: "Finanzas", sub: "Reportes" },
    { match: (path) => path.startsWith("/users-list"), module: "Admin", sub: "Usuarios" },
    { match: (path) => path.startsWith("/roles"), module: "Admin", sub: "Roles" },
    { match: (path) => path.startsWith("/hotel-settings"), module: "Admin", sub: "Configuración" },
    { match: (path) => path.startsWith("/hq"), module: "Admin", sub: "HQ Super-admin" },
    { match: (path) => path.startsWith("/notification-alert"), module: "Alertas", sub: "Bandeja" },
  ];

  const active = moduleMap.find((entry) => entry.match(pathname));

  const scopeLabel = scopeMode === "chain" ? "Modo Cadena" : "Modo Hotel";
  const chainLabel = currentHotel?.chain ?? "Cadena";
  const hotelLabel = scopeMode === "chain" ? "Consolidado" : currentHotel?.name ?? "Hotel";
  const moduleLabel = active?.module ?? "Módulo";
  const subLabel = active?.sub;

  return (
    <header className="dashboard-header relative z-30 flex w-full max-w-full flex-col gap-3 shrink-0 border-b border-neutral-200 bg-white px-3 py-3 transition-[width,height] ease-linear dark:border-slate-700 dark:bg-[#273142] sm:px-4 md:px-6 group-has-data-[collapsible=icon]/sidebar-wrapper:h-18">
      <div className="flex w-full min-w-0 flex-col gap-3">
        <div className="flex w-full min-w-0 flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <SidebarTrigger className="-ms-1 p-0 size-[unset] cursor-pointer" />
            <HotelSwitcher />
          </div>
          <div className="flex max-w-full items-center gap-2 shrink-0">
            <div className="hidden md:flex items-center gap-2">
              <ModeToggle />
              <LanguageSelect />
              <MessageDropdown />
            </div>
            <NotificationDropdown />
            <ProfileDropdown />
          </div>
        </div>
        <div className="flex w-full min-w-0 items-center gap-3">
          <div className="min-w-0 flex-1">
            <SearchBox />
          </div>
          <div className="hidden xl:flex items-center gap-2">
            <Button size="sm" asChild>
              <Link href="/reservations/new">
                <CalendarPlus className="h-4 w-4 mr-1" />
                Nueva reserva
              </Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href="/checkin">
                <LogIn className="h-4 w-4 mr-1" />
                Check-in
              </Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href="/invoices">
                <Receipt className="h-4 w-4 mr-1" />
                Cobrar
              </Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href="/guests">
                <UserPlus className="h-4 w-4 mr-1" />
                Nuevo huésped
              </Link>
            </Button>
          </div>
        </div>
        <div className="hidden xl:block">
          <div className="flex flex-wrap items-center gap-2 text-[11px] leading-5 text-neutral-500 dark:text-neutral-300">
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-[11px]",
                scopeMode === "chain"
                  ? "border-blue-200 text-blue-600"
                  : "border-emerald-200 text-emerald-600"
              )}
            >
              {scopeLabel}
            </span>
            <span>{chainLabel}</span>
            <span className="text-neutral-400">›</span>
            <span>{hotelLabel}</span>
            <span className="text-neutral-400">›</span>
            <span>{moduleLabel}</span>
            {subLabel ? (
              <>
                <span className="text-neutral-400">›</span>
                <span>{subLabel}</span>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
