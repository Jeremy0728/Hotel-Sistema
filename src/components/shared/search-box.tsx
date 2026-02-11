"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import StatusBadge from "@/components/hotel/status-badge";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Input } from "../ui/input";
import { useHotelData } from "@/contexts/HotelDataContext";
import { cn } from "@/lib/utils";

const MAX_RESULTS = 5;
const RECENTS_STORAGE_KEY = "hotel_recent_searches_map";

interface SearchBoxProps {
  className?: string;
  placeholder?: string;
  mobileIconOnly?: boolean;
}

function loadRecentsMap() {
  if (typeof window === "undefined") return {} as Record<string, string[]>;
  try {
    const raw = localStorage.getItem(RECENTS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, string[]>;
    return parsed ?? {};
  } catch {
    return {};
  }
}

function buildHighlightedUrl(url: string, query: string) {
  const trimmed = query.trim();
  if (!trimmed) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}highlight=${encodeURIComponent(trimmed)}`;
}

const SearchBox = ({
  className,
  placeholder = "Buscar huesped, reserva o habitacion...",
  mobileIconOnly = false,
}: SearchBoxProps) => {
  const router = useRouter();
  const {
    guests,
    reservations,
    rooms,
    invoices,
    completeCheckIn,
    currentHotelId,
  } = useHotelData();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [recentByHotel, setRecentByHotel] = useState<Record<string, string[]>>(
    () => loadRecentsMap()
  );

  const recent = recentByHotel[currentHotelId] ?? [];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const updateRecents = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    setRecentByHotel((prev) => {
      const current = prev[currentHotelId] ?? [];
      const nextList = [trimmed, ...current.filter((item) => item !== trimmed)].slice(0, 6);
      const nextMap = { ...prev, [currentHotelId]: nextList };
      if (typeof window !== "undefined") {
        localStorage.setItem(RECENTS_STORAGE_KEY, JSON.stringify(nextMap));
      }
      return nextMap;
    });
  };

  const normalized = query.trim().toLowerCase();
  const roomQuery = normalized.startsWith("#") ? normalized.slice(1) : normalized;

  const guestResults = useMemo(() => {
    if (!normalized) return [];
    return guests
      .filter((guest) => {
        const fullName = `${guest.firstName} ${guest.lastName}`.toLowerCase();
        return (
          fullName.includes(normalized) ||
          guest.documentNumber.toLowerCase().includes(normalized) ||
          guest.email.toLowerCase().includes(normalized)
        );
      })
      .slice(0, MAX_RESULTS);
  }, [guests, normalized]);

  const reservationResults = useMemo(() => {
    if (!normalized) return [];
    return reservations
      .filter((reservation) => {
        return (
          reservation.code.toLowerCase().includes(normalized) ||
          reservation.guestName.toLowerCase().includes(normalized) ||
          reservation.roomNumber.toLowerCase().includes(roomQuery)
        );
      })
      .slice(0, MAX_RESULTS);
  }, [reservations, normalized, roomQuery]);

  const roomResults = useMemo(() => {
    if (!roomQuery) return [];
    return rooms
      .filter((room) => {
        return (
          room.number.toLowerCase().includes(roomQuery) ||
          room.type.toLowerCase().includes(normalized)
        );
      })
      .slice(0, MAX_RESULTS);
  }, [rooms, roomQuery, normalized]);

  const invoiceResults = useMemo(() => {
    if (!normalized) return [];
    return invoices
      .filter((invoice) => {
        return (
          invoice.number.toLowerCase().includes(normalized) ||
          invoice.clientName.toLowerCase().includes(normalized) ||
          (invoice.reservationCode ?? "").toLowerCase().includes(normalized)
        );
      })
      .slice(0, MAX_RESULTS);
  }, [invoices, normalized]);

  const goTo = (url: string, track?: string) => {
    const highlighted = buildHighlightedUrl(url, track ?? query);
    if ((track ?? query).trim()) updateRecents(track ?? query);
    setOpen(false);
    router.push(highlighted);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {mobileIconOnly ? (
        <DialogTrigger asChild>
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="md:hidden"
            aria-label="Buscar"
          >
            <Search className="h-4 w-4" />
          </Button>
        </DialogTrigger>
      ) : null}

      <DialogTrigger asChild>
        <div
          className={cn(
            "relative min-w-0 w-full cursor-pointer",
            mobileIconOnly && "hidden md:block",
            className
          )}
        >
          <Input
            className="bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 shadow-none focus-visible:ring-0 focus-visible:border-primary border border-slate-300 h-10 pe-16 ps-11 w-full cursor-pointer disabled:opacity-[1] dark:border-slate-600"
            placeholder={placeholder}
            disabled
          />
          <span className="absolute top-1/2 start-0 ms-4 -translate-y-1/2">
            <Search className="text-neutral-500 dark:text-white" width={18} height={18} />
          </span>
          <span className="hidden sm:flex items-center gap-1 absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-neutral-500 dark:text-neutral-300 border border-neutral-200 dark:border-slate-600 rounded px-1.5 py-0.5">
            Ctrl+K
          </span>
        </div>
      </DialogTrigger>

      <DialogContent className="p-0 !max-w-[720px] overflow-hidden">
        <DialogTitle className="hidden">Busqueda global</DialogTitle>
        <Command>
          <CommandInput
            placeholder="Buscar huesped, reserva o habitacion..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList className="scrollbar-thin scrollbar-invisible hover:scrollbar-visible max-h-[420px]">
            <CommandEmpty>No se encontraron resultados.</CommandEmpty>

            {recent.length > 0 && !normalized ? (
              <CommandGroup heading="Recientes" className="mt-2">
                {recent.map((item) => (
                  <CommandItem key={item} value={item} onSelect={() => setQuery(item)}>
                    {item}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}

            {guestResults.length > 0 ? (
              <CommandGroup heading="Huespedes" className="mt-2">
                {guestResults.map((guest) => (
                  <CommandItem
                    key={guest.id}
                    value={`guest-${guest.id}`}
                    onSelect={() => goTo(`/guests/${guest.id}`, query)}
                  >
                    <div className="flex items-center justify-between w-full gap-3">
                      <div>
                        <div className="font-medium">
                          {guest.firstName} {guest.lastName}
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-300">
                          Doc: {guest.documentNumber}
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" type="button">
                        Abrir
                      </Button>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}

            {reservationResults.length > 0 ? (
              <CommandGroup heading="Reservas">
                {reservationResults.map((reservation) => (
                  <CommandItem
                    key={reservation.id}
                    value={`reservation-${reservation.id}`}
                    onSelect={() => goTo(`/reservations/${reservation.id}`, query)}
                  >
                    <div className="flex items-center justify-between w-full gap-3">
                      <div>
                        <div className="font-medium">{reservation.code}</div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-300">
                          {reservation.guestName} · Hab. #{reservation.roomNumber}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge type="reservation" status={reservation.status} />
                        <Button
                          size="sm"
                          variant="ghost"
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            goTo(`/reservations/${reservation.id}`, query);
                          }}
                        >
                          Abrir
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          type="button"
                          disabled={reservation.status !== "confirmed"}
                          onClick={(event) => {
                            event.stopPropagation();
                            completeCheckIn(reservation.id);
                            updateRecents(query);
                            setOpen(false);
                          }}
                        >
                          Check-in rapido
                        </Button>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}

            {roomResults.length > 0 ? (
              <CommandGroup heading="Habitaciones">
                {roomResults.map((room) => (
                  <CommandItem
                    key={room.id}
                    value={`room-${room.id}`}
                    onSelect={() =>
                      goTo(`/recepcion/habitaciones?room=${room.number}`, query)
                    }
                  >
                    <div className="flex items-center justify-between w-full gap-3">
                      <div>
                        <div className="font-medium">Habitacion #{room.number}</div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-300">
                          {room.type} · Piso {room.floor}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge type="room" status={room.status} />
                        <Button size="sm" variant="ghost" type="button">
                          Abrir
                        </Button>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}

            {invoiceResults.length > 0 ? (
              <CommandGroup heading="Facturas">
                {invoiceResults.map((invoice) => (
                  <CommandItem
                    key={invoice.id}
                    value={`invoice-${invoice.id}`}
                    onSelect={() => goTo("/invoices", query)}
                  >
                    <div className="flex items-center justify-between w-full gap-3">
                      <div>
                        <div className="font-medium">{invoice.number}</div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-300">
                          {invoice.clientName} · {invoice.reservationCode ?? "Sin reserva"}
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" type="button">
                        Abrir
                      </Button>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}

            <CommandSeparator className="my-2" />
            <CommandGroup heading="Ayuda">
              <CommandItem value="help-ctrlk">Atajo: Ctrl+K</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default SearchBox;
