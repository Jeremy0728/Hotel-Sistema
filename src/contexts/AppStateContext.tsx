"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface Hotel {
  id: string;
  name: string;
  chain: string;
  city?: string;
  country?: string;
  status?: "active" | "inactive";
}

interface AppStateContextValue {
  hotels: Hotel[];
  currentHotelId: string;
  setCurrentHotelId: (id: string) => void;
  scopeMode: "chain" | "hotel";
  setScopeMode: (mode: "chain" | "hotel") => void;
}

const AppStateContext = createContext<AppStateContextValue | undefined>(
  undefined
);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [hotels] = useState<Hotel[]>(() => [
    {
      id: "hotel-aurora",
      name: "Hotel Aurora",
      chain: "Grupo Aurora",
      city: "Lima",
      country: "Perú",
      status: "active",
    },
    {
      id: "hotel-mar",
      name: "Hotel Mar Azul",
      chain: "Grupo Aurora",
      city: "Trujillo",
      country: "Perú",
      status: "active",
    },
    {
      id: "hotel-norte",
      name: "Hotel Norte",
      chain: "Grupo Aurora",
      city: "Piura",
      country: "Perú",
      status: "inactive",
    },
  ]);

  const [currentHotelId, setCurrentHotelId] = useState<string>(() => {
    const storedHotel = localStorage.getItem("hotel_current_id");
    if (storedHotel && hotels.some((hotel) => hotel.id === storedHotel)) {
      return storedHotel;
    }
    return hotels[0]?.id ?? "hotel-aurora";
  });
  
  const [scopeMode, setScopeMode] = useState<"chain" | "hotel">(() => {
    const storedMode = localStorage.getItem("hotel_scope_mode");
    if (storedMode === "chain" || storedMode === "hotel") {
      return storedMode;
    }
    return "hotel";
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("hotel_current_id", currentHotelId);
  }, [currentHotelId]);

  useEffect(() => {
    localStorage.setItem("hotel_scope_mode", scopeMode);
  }, [scopeMode]);

  const value = {
    hotels,
    currentHotelId,
    setCurrentHotelId,
    scopeMode,
    setScopeMode,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};
