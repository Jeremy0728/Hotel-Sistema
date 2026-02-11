"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarInput,
} from "@/components/ui/sidebar";
import { useHotelData } from "@/contexts/HotelDataContext";
import { useSidebarCollapsed } from "@/hooks/useSidebarCollapsed";
import { cn } from "@/lib/utils";
import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type BadgeKey = "checkins" | "checkouts" | "alerts";

interface SidebarSubItem {
  title: string;
  url: string;
  circleColor: string;
  badgeKey?: BadgeKey | string;
}

interface SidebarItem {
  title?: string;
  url?: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: SidebarSubItem[];
  label?: string;
}

export function NavMain({ items }: { items: SidebarItem[] }) {
  const pathname = usePathname();
  const isCollapsed = useSidebarCollapsed();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const { rooms, reservations, invoices } = useHotelData();

  const todayStr = new Date().toISOString().split("T")[0];
  const checkInsCount = reservations.filter(
    (reservation) =>
      reservation.checkIn === todayStr &&
      (reservation.status === "pending" || reservation.status === "confirmed")
  ).length;
  const checkOutsCount = reservations.filter(
    (reservation) =>
      reservation.checkOut === todayStr && reservation.status === "checkin"
  ).length;
  const unpaidReservations = invoices.filter((invoice) => invoice.balance > 0)
    .length;
  const cleaningRooms = rooms.filter((room) => room.status === "cleaning").length;
  const overbookingRisk = Math.max(
    0,
    checkInsCount - rooms.filter((room) => room.status === "available").length
  );
  const alertCount = [
    unpaidReservations > 0,
    cleaningRooms > 0,
    overbookingRisk > 0,
  ].filter(Boolean).length;

  const badgeMap: Record<BadgeKey, number> = {
    checkins: checkInsCount,
    checkouts: checkOutsCount,
    alerts: alertCount,
  };

  const normalizedQuery = query.trim().toLowerCase();

  const filteredItems = useMemo(() => {
    if (!normalizedQuery) return items;

    return items
      .map((item) => {
        if (item.items && item.items.length > 0) {
          const titleMatches = item.title
            ? item.title.toLowerCase().includes(normalizedQuery)
            : false;
          if (titleMatches) return item;

          const filteredSub = item.items.filter((subItem) =>
            subItem.title.toLowerCase().includes(normalizedQuery)
          );
          if (filteredSub.length === 0) return null;
          return { ...item, items: filteredSub };
        }

        if (item.label) return null;

        const titleMatches = item.title
          ? item.title.toLowerCase().includes(normalizedQuery)
          : false;
        return titleMatches ? item : null;
      })
      .filter(Boolean) as SidebarItem[];
  }, [items, normalizedQuery]);

  useEffect(() => {
    const activeGroup = filteredItems.find((item) =>
      item.items?.some(
        (subItem) => pathname === subItem.url || pathname.startsWith(subItem.url)
      )
    );

    if (activeGroup?.title) {
      setOpenGroup(activeGroup.title);
      return;
    }

    if (normalizedQuery) {
      const firstGroup = filteredItems.find((item) => item.items?.length);
      if (firstGroup?.title) {
        setOpenGroup(firstGroup.title);
      }
    }
  }, [filteredItems, normalizedQuery, pathname]);

  const handleToggleGroup = (title?: string) => {
    if (!title) return;
    setOpenGroup((prev) => (prev === title ? null : title));
  };

  return (
    <SidebarGroup className={`${isCollapsed ? "px-1.5" : ""}`}>
      <div className="px-2 pb-2 group-data-[collapsible=icon]:hidden">
        <SidebarInput
          placeholder="Buscar en menú"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <SidebarMenu>
        {filteredItems.map((item) => {
          const isGroupActive = item.items?.some(
            (subItem) => pathname === subItem.url || pathname.startsWith(subItem.url)
          );

          if (item.items && item.items.length > 0) {
            const isOpen = openGroup === item.title || isGroupActive;

            return (
              <Collapsible
                key={item.title}
                asChild
                open={isOpen}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      onClick={() => handleToggleGroup(item.title)}
                      className={cn(
                        "cursor-pointer py-5.5 px-3 text-base text-[#4b5563] dark:text-white data-[state=open]:bg-primary data-[state=open]:text-white hover:data-[state=open]:bg-primary dark:hover:data-[state=open]:bg-primary hover:data-[state=open]:text-white hover:bg-primary/10 active:bg-primary/10 dark:hover:bg-slate-700",
                        isOpen
                          ? "bg-primary text-white hover:bg-primary hover:text-white dark:bg-primary dark:hover:bg-primary"
                          : ""
                      )}
                    >
                      {item.icon && <item.icon className="!w-4.5 !h-4.5" />}
                      <span>{item.title}</span>
                      <ChevronRight className="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="gap-0 mt-2 space-y-1">
                      {item.items.map((subItem) => {
                        const isSubActive =
                          pathname === subItem.url ||
                          pathname.startsWith(subItem.url);
                        const badgeKey =
                          subItem.badgeKey &&
                          (subItem.badgeKey === "checkins" ||
                            subItem.badgeKey === "checkouts" ||
                            subItem.badgeKey === "alerts")
                            ? (subItem.badgeKey as BadgeKey)
                            : null;
                        const badgeValue = badgeKey ? badgeMap[badgeKey] : 0;
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              className={cn(
                                "py-5.5 px-3 text-base text-[#4b5563] dark:text-white hover:bg-primary/10 active:bg-primary/10 dark:hover:bg-slate-700",
                                isSubActive
                                  ? "bg-primary/10 font-bold dark:bg-slate-600"
                                  : ""
                              )}
                            >
                              <Link
                                href={subItem.url}
                                className="flex items-center gap-3.5"
                              >
                                <span
                                  className={`w-2 h-2 rounded-[50%] ${subItem.circleColor}`}
                                ></span>
                                <span>{subItem.title}</span>
                                {badgeValue > 0 ? (
                                  <span className="ml-auto rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                                    {badgeValue}
                                  </span>
                                ) : null}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }

          if (item.label) {
            return null;
          }

          if (item.url && item.title) {
            const isMenuActive =
              pathname === item.url || pathname.startsWith(item.url);

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={cn(
                    "cursor-pointer py-5.5 px-3 text-base text-[#4b5563] dark:text-white hover:bg-primary/10 active:bg-primary/10 dark:hover:bg-slate-700",
                    isMenuActive
                      ? "bg-primary hover:bg-primary text-white dark:hover:bg-primary hover:text-white"
                      : ""
                  )}
                >
                  <Link href={item.url} className="flex items-center gap-2">
                    {item.icon && <item.icon className="!w-4.5 !h-4.5" />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          return null;
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
