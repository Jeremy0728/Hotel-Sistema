"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Input } from "../ui/input";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useHotelData } from "@/contexts/HotelDataContext";
import StatusBadge from "@/components/hotel/status-badge";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const MAX_RESULTS = 5;

const SearchBox = () => {
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
  const [recent, setRecent] = useState<string[]>([]);

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

  const recentsKey = `hotel_recent_searches_${currentHotelId}`;

  useEffect(() => {
    const stored = localStorage.getItem(recentsKey);
    if (stored) {
      try {
        setRecent(JSON.parse(stored));
      } catch {
        setRecent([]);
      }
    }
  }, [recentsKey]);

  const updateRecents = (value: string) => {
    if (!value.trim()) return;
    const next = [value.trim(), ...recent.filter((item) => item !== value.trim())].slice(0, 6);
    setRecent(next);
    localStorage.setItem(recentsKey, JSON.stringify(next));
  };

  const normalized = query.trim().toLowerCase();

  const guestResults = useMemo(() => {
    if (!normalized) return [];
    return guests
      .filter((guest) => {
        const name = `${guest.firstName} ${guest.lastName}`.toLowerCase();
        return (
          name.includes(normalized) ||
          guest.email.toLowerCase().includes(normalized) ||
          guest.phone.includes(normalized)
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
          reservation.roomNumber.toLowerCase().includes(normalized)
        );
      })
      .slice(0, MAX_RESULTS);
  }, [reservations, normalized]);

  const roomResults = useMemo(() => {
    if (!normalized) return [];
    return rooms
      .filter((room) => {
        return (
          room.number.toLowerCase().includes(normalized) ||
          room.type.toLowerCase().includes(normalized)
        );
      })
      .slice(0, MAX_RESULTS);
  }, [rooms, normalized]);

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
    if (track) updateRecents(track);
    setOpen(false);
    router.push(url);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="relative min-w-0 w-full sm:max-w-[388px] cursor-pointer">
          <Input
            className={cn(
              "bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 shadow-none focus-visible:ring-0 focus-visible:border-primary border border-slate-300 h-11 sm:h-10 pe-16 ps-11 w-full cursor-pointer disabled:opacity-[1] dark:border-slate-600"
            )}
            placeholder="Buscar..."
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

      <DialogContent className={cn("p-0 !max-w-[720px] overflow-hidden")}> 
        <DialogTitle className="hidden">Search</DialogTitle>
        <Command>
          <CommandInput
            placeholder="Buscar huésped, reserva, habitación, factura"
            value={query}
            onValueChange={setQuery}
          />
          <CommandList className="scrollbar-thin scrollbar-invisible hover:scrollbar-visible max-h-[420px]">
            <CommandEmpty>No se encontraron resultados.</CommandEmpty>

            {recent.length > 0 && !normalized ? (
              <CommandGroup heading="Recientes" className="mt-2">
                {recent.map((item) => (
                  <CommandItem
                    key={item}
                    value={item}
                    onSelect={() => setQuery(item)}
                  >
                    {item}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}

            {guestResults.length > 0 ? (
              <CommandGroup heading="Huéspedes" className="mt-2">
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
                          {guest.email} · {guest.phone}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" type="button">
                          Abrir
                        </Button>
                      </div>
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
                          Check-in
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            goTo("/invoices", query);
                          }}
                        >
                          Cobrar
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
                    onSelect={() => goTo("/rooms", query)}
                  >
                    <div className="flex items-center justify-between w-full gap-3">
                      <div>
                        <div className="font-medium">Habitación #{room.number}</div>
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
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" type="button">
                          Abrir
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            goTo("/invoices", query);
                          }}
                        >
                          Cobrar
                        </Button>
                      </div>
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
