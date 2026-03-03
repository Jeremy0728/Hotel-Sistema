import { useState } from 'react';

export interface HotelSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  taxId: string;
  currency: string;
  timezone: string;
  dateFormat: string;
  language: string;
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  taxRate: number;
  taxInclusive: boolean;
}

const DEFAULT_SETTINGS: HotelSettings = {
  name: "Hotel Aurora",
  address: "Av. Larco 123, Miraflores",
  phone: "+51 987 654 321",
  email: "contacto@hotelaurora.pe",
  taxId: "20123456789",
  currency: "PEN",
  timezone: "America/Lima",
  dateFormat: "DD/MM/YYYY",
  language: "es",
  checkInTime: "15:00",
  checkOutTime: "12:00",
  cancellationPolicy: "Cancelacion gratuita hasta 24 horas antes del ingreso.",
  taxRate: 18,
  taxInclusive: true,
};

/**
 * Hook para manejar la configuración del hotel
 * Por ahora usa localStorage, pero puede migrar a API en el futuro
 */
export function useHotelSettings() {
  const [settings, setSettings] = useState<HotelSettings>(() => {
    // Check if we're in the browser (not SSR)
    if (typeof window === 'undefined') {
      return DEFAULT_SETTINGS;
    }
    
    const stored = localStorage.getItem('hotel_settings');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing hotel settings:', error);
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  const updateSettings = (updates: Partial<HotelSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hotel_settings', JSON.stringify(newSettings));
    }
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hotel_settings');
    }
  };

  return {
    settings,
    updateSettings,
    resetSettings,
  };
}
