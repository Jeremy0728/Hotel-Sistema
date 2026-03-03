# Guía de Migración: De HotelDataContext a Hooks Individuales

## 📋 Resumen

Esta migración elimina el `HotelDataContext` monolítico y lo reemplaza con:
- **Hooks individuales** para cada entidad (useRooms, useReservations, etc.)
- **AppStateContext** ligero solo para estado de UI
- **Arquitectura más escalable y mantenible**

## ✅ Completado

### 1. Hooks Creados
- ✅ `useRooms` - Gestión de habitaciones (ya existía)
- ✅ `useReservations` - Gestión de reservas (ya existía)
- ✅ `useInvoices` - Gestión de facturas (creado con datos mock)
- ✅ `useHotelSettings` - Configuración del hotel (localStorage)

### 2. Contextos
- ✅ `AppStateContext` - Estado de UI (currentHotelId, scopeMode)

### 3. Componentes Migrados
- ✅ `rooms-page.tsx` - Primer componente migrado exitosamente
- ✅ `client-root.tsx` - Actualizado para usar AppStateProvider

## 🔄 Patrón de Migración

### Antes (usando HotelDataContext):
\`\`\`typescript
import { useHotelData } from "@/contexts/HotelDataContext";

function MyComponent() {
  const {
    rooms,
    reservations,
    guests,
    updateRoom,
    addReservation,
  } = useHotelData();
  
  // ... resto del componente
}
\`\`\`

### Después (usando hooks individuales):
\`\`\`typescript
import { useRooms } from "@/hooks/useRooms";
import { useReservations } from "@/hooks/useReservations";
import { useGuests } from "@/hooks/useGuests";
import { useAppState } from "@/contexts/AppStateContext";

function MyComponent() {
  // Obtener datos desde hooks individuales
  const { rooms, updateRoomStatus } = useRooms({ limit: 100 });
  const { reservations } = useReservations({ limit: 1000 });
  const { guests } = useGuests({ limit: 1000 });
  const { currentHotelId } = useAppState();
  
  // Transformar datos de API a formato local si es necesario
  const transformedRooms = rooms.map(room => ({
    id: String(room.id),
    number: room.number,
    type: room.roomType?.name || "Standard",
    floor: room.floor,
    status: room.status,
    notes: room.notes,
  }));
  
  // ... resto del componente
}
\`\`\`

## 📝 Hooks Pendientes de Crear

Los siguientes hooks necesitan ser creados siguiendo el patrón de `useRooms` y `useReservations`:

### 1. useGuests
\`\`\`typescript
// src/hooks/useGuests.ts
import useSWR from 'swr';
import { huespedesApi } from '@/apis/huespedes.api';

export function useGuests(options = {}) {
  // Similar a useReservations
  // Llamar a huespedesApi.traerTodos()
  // Retornar: guests, isLoading, isError, mutate, refreshGuests
}
\`\`\`

### 2. useProducts
\`\`\`typescript
// src/hooks/useProducts.ts
import useSWR from 'swr';
import { productosApi } from '@/apis/productos.api';

export function useProducts(options = {}) {
  // Llamar a productosApi.traerTodos()
  // Retornar: products, isLoading, isError, mutate, refreshProducts
}
\`\`\`

### 3. useServices
\`\`\`typescript
// src/hooks/useServices.ts
import useSWR from 'swr';
import { serviciosAdicionalesApi } from '@/apis/servicios-adicionales.api';

export function useServices(options = {}) {
  // Llamar a serviciosAdicionalesApi.traerTodos()
  // Retornar: services, isLoading, isError, mutate, refreshServices
}
\`\`\`

### 4. useCorporateClients
\`\`\`typescript
// src/hooks/useCorporateClients.ts
import useSWR from 'swr';
import { clientesCorporativosApi } from '@/apis/clientes-corporativos.api';

export function useCorporateClients(options = {}) {
  // Llamar a clientesCorporativosApi.traerTodos()
  // Retornar: clients, isLoading, isError, mutate, refreshClients
}
\`\`\`

## 🎯 Componentes que Necesitan Migración

35 componentes usan `useHotelData` y necesitan ser migrados:

### Prioridad Alta (Críticos)
1. `dashboard/components/hotel-dashboard.tsx`
2. `checkin/components/checkin-page.tsx`
3. `checkout/components/checkout-page.tsx`
4. `reservations/components/reservations-page.tsx`
5. `reservations/components/reservation-wizard.tsx`

### Prioridad Media
6. `guests/components/guests-page.tsx`
7. `invoices/components/invoices-page.tsx`
8. `pos/components/pos-page.tsx`
9. `services/components/services-page.tsx`
10. `housekeeping/components/housekeeping-page.tsx`

### Prioridad Baja
11-35. Resto de componentes (analytics, settings, etc.)

## 🔧 Pasos para Migrar un Componente

### 1. Identificar dependencias
\`\`\`typescript
// Buscar en el componente:
const { rooms, guests, reservations, ... } = useHotelData();
\`\`\`

### 2. Reemplazar con hooks individuales
\`\`\`typescript
const { rooms } = useRooms({ limit: 100 });
const { guests } = useGuests({ limit: 1000 });
const { reservations } = useReservations({ limit: 1000 });
\`\`\`

### 3. Transformar datos si es necesario
Los datos de la API pueden tener formato diferente al esperado por el componente.
Ver ejemplo en `rooms-page.tsx` líneas 33-66.

### 4. Implementar funciones CRUD
Si el componente usa funciones como `updateRoom`, `addGuest`, etc.:
- Usar las funciones del hook (ej: `updateRoomStatus` de `useRooms`)
- O crear funciones temporales que llamen a las APIs directamente

### 5. Probar el componente
- Verificar que carga datos correctamente
- Verificar que las acciones CRUD funcionan
- Verificar estados de loading y error

## 🚀 Beneficios de la Nueva Arquitectura

### 1. Separación de Responsabilidades
- **Server State** (datos de API) → Hooks individuales
- **UI State** (currentHotelId, modales) → AppStateContext
- **Lógica de negocio** → Funciones en hooks o utils

### 2. Mejor Performance
- Cache automático con SWR
- Deduplicación de requests
- Revalidación inteligente
- Optimistic updates

### 3. Más Mantenible
- Cada hook maneja una entidad
- Fácil agregar nuevas entidades
- Cambios aislados no afectan otros componentes

### 4. Más Testeable
- Hooks independientes fáciles de mockear
- Componentes más simples de testear
- Lógica de negocio separada

## ⚠️ Consideraciones Importantes

### 1. Transformación de Datos
Los datos de la API pueden tener nombres de campos diferentes:
\`\`\`typescript
// API usa snake_case
{ check_in_date, check_out_date, guest_id }

// Componente espera camelCase
{ checkIn, checkOut, guestId }
\`\`\`

Solución: Crear funciones de transformación o mapear en el componente.

### 2. Funciones CRUD
Algunas APIs aún no tienen endpoints completos. Opciones:
- Implementar cuando la API esté lista
- Usar funciones temporales con console.log
- Usar datos mock temporalmente

### 3. Estados de Loading
Cada hook tiene su propio `isLoading`. Considerar:
- Mostrar loading individual por sección
- O combinar con `isLoading = roomsLoading || guestsLoading || ...`

### 4. Manejo de Errores
Cada hook tiene su propio `isError` y `error`. Considerar:
- Mostrar errores individuales
- O crear un componente de error global

## 📚 Recursos

- **Ejemplo completo**: Ver `rooms-page.tsx`
- **Patrón de hook**: Ver `useRooms.ts` o `useReservations.ts`
- **SWR Docs**: https://swr.vercel.app/

## 🎬 Próximos Pasos

1. **Crear hooks faltantes** (useGuests, useProducts, useServices, etc.)
2. **Migrar componentes críticos** uno por uno
3. **Probar cada componente** después de migrar
4. **Eliminar HotelDataContext** cuando todos los componentes estén migrados
5. **Actualizar documentación** con ejemplos reales

## 💡 Tips

- Migrar componentes de uno en uno
- Probar después de cada migración
- Mantener el código limpio y documentado
- Usar TypeScript para evitar errores
- Aprovechar SWR para cache y revalidación
