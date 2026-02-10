"use client";

import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, Building2, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useHotelData } from "@/contexts/HotelDataContext";
import { cn } from "@/lib/utils";

const modes = [
  { value: "hotel", label: "Modo Hotel" },
  { value: "chain", label: "Modo Cadena" },
] as const;

export default function HotelSwitcher() {
  const { hotels, currentHotelId, setCurrentHotelId, scopeMode, setScopeMode } =
    useHotelData();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const currentHotel = hotels.find((hotel) => hotel.id === currentHotelId);

  const filteredHotels = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return hotels;
    return hotels.filter((hotel) => {
      const haystack = `${hotel.name} ${hotel.chain} ${hotel.city ?? ""}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [hotels, query]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-10 gap-2 px-3 text-left text-sm font-medium"
        >
          <Building2 className="h-4 w-4 text-neutral-500" />
          <span className="hidden sm:inline">
            {currentHotel?.name ?? "Seleccionar hotel"}
          </span>
          <ChevronsUpDown className="h-4 w-4 text-neutral-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-2" align="start">
        <div className="flex items-center gap-2 mb-2">
          {modes.map((mode) => (
            <Button
              key={mode.value}
              size="sm"
              variant={scopeMode === mode.value ? "default" : "outline"}
              onClick={() => setScopeMode(mode.value)}
              className="flex-1"
            >
              <Layers className="h-4 w-4 mr-1" />
              {mode.label}
            </Button>
          ))}
        </div>
        <Command>
          <CommandInput
            placeholder="Buscar hotel o cadena..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList className="max-h-[240px]">
            <CommandEmpty>No se encontraron hoteles.</CommandEmpty>
            <CommandGroup heading="Hoteles">
              {filteredHotels.map((hotel) => {
                const isActive = hotel.id === currentHotelId;
                return (
                  <CommandItem
                    key={hotel.id}
                    value={hotel.name}
                    onSelect={() => {
                      setCurrentHotelId(hotel.id);
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <div className="font-medium">{hotel.name}</div>
                        <div className="text-xs text-neutral-500">
                          {hotel.chain}
                          {hotel.city ? ` · ${hotel.city}` : ""}
                        </div>
                      </div>
                      <Check
                        className={cn(
                          "h-4 w-4",
                          isActive ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
