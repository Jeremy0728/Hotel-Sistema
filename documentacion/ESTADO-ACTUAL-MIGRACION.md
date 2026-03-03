# Estado Actual de la Migración

**Fecha:** 20 de febrero de 2026  
**Estado:** Migración gradual en progreso

## 🎯 Objetivo

Migrar de `HotelDataContext` (contexto monolítico) a hooks individuales para mejorar:
- Rendimiento (menos re-renders innecesarios)
- Mantenibilidad (código más modular)
- Escalabilidad (fácil agregar nuevas entidades)

## 📊 Arquitectura Actual (Híbrida)

### ✅ Hooks Individuales Creados

Estos hooks ya están implementados y funcionando:

| Hook | Archivo | Estado | Usa API Real |
|------|---------|--------|--------------|
| `useRooms` | `src/hooks/useRooms.ts` | ✅ Funcional | ✅ Sí |
| `useReservations` | `src/hooks/useReservations.ts` | ✅ Funcional | ✅ Sí |
| `useInvoices` | `src/hooks/useInvoices.ts` | ✅ Funcional | ✅ Sí (mock) |
| `useGuests` | `src/hooks/useGuests.ts` | ✅ Funcional | ✅ Sí |
| `useCheckIns` | `src/hooks/useCheckIns.ts` | ✅ Funcional | ✅ Sí |
| `useCheckOuts` | `src/hooks/useCheckOuts.ts` | ✅ Funcional | ✅ Sí |
| `useRoomTypes` | `src/hooks/useRoomTypes.ts` | ✅ Funcional | ✅ Sí |
| `useProducts` | `src/hooks/useProducts.ts` | ✅ Funcional | ✅ Sí |
| `useProductCategories` | `src/hooks/useProductCategories.ts` | ✅ Funcional | ✅ Sí |
| `useInventory` | `src/hooks/useInventory.ts` | ✅ Funcional | ✅ Sí |
| `useInventoryLocations` | `src/hooks/useInventoryLocations.ts` | ✅ Funcional | ✅ Sí |
| `usePaymentMethods` | `src/hooks/usePaymentMethods.ts` | ✅ Funcional | ✅ Sí |
| `useSales` | `src/hooks/useSales.ts` | ✅ Funcional | ✅ Sí |
| `useUsers` | `src/hooks/useUsers.ts` | ✅ Funcional | ✅ Sí |
| `useRoles` | `src/hooks/useRoles.ts` | ✅ Funcional | ✅ Sí |
| `useHotelSettings` | `src/hooks/useHotelSettings.ts` | ✅ Funcional | ❌ localStorage |

### 🔄 HotelDataContext (Todavía Activo)

**Archivo:** `src/contexts/HotelDataContext.tsx`

**Estado:** Funcional, usado por 35+ componentes

**Cambios aplicados:**
- ✅ Ahora usa hooks internamente (`useRooms`, `useReservations`, `useInvoices`, `useHotelSettings`)
- ✅ Carga datos reales de APIs (ya no usa mocks)
- ✅ Compatible con SSR (verificaciones de `typeof window`)
- ✅ Mock setters para compatibilidad con funciones de `actions.ts`

**Componentes que todavía lo usan:**
- Dashboard principal
- Navegación (`nav-main.tsx`)
- Todos los módulos excepto `rooms-page.tsx`

## 🚀 Componentes Migrados

| Componente | Archivo | Hooks Usados | Estado |
|------------|---------|--------------|--------|
| RoomsPage | `src/app/(dashboard)/rooms/components/rooms-page.tsx` | `useRooms`, `useReservations`, `useInvoices`, `useHotelSettings` | ✅ Migrado |
| ReservationsPage | `src/app/(dashboard)/reservations/components/reservations-page.tsx` | `useReservations`, `useRooms`, `useGuests`, `useInvoices` | ✅ Migrado |
| CheckInPage | `src/app/(dashboard)/checkin/components/checkin-page.tsx` | `useReservations`, `useRooms`, `useGuests` | ✅ Migrado |
| CheckOutPage | `src/app/(dashboard)/checkout/components/checkout-page.tsx` | `useReservations`, `useRooms`, `useGuests` | ✅ Migrado |
| GuestsPage | `src/app/(dashboard)/guests/components/guests-page.tsx` | `useGuests` | ✅ Migrado |
| RoomsConfigPage | `src/app/(dashboard)/rooms/components/rooms-config-page.tsx` | `useRooms` | ✅ Migrado |
| RoomTypesPage | `src/app/(dashboard)/room-types/components/room-types-page.tsx` | `useRoomTypes` | ✅ Migrado |
| InventoryPage | `src/app/(dashboard)/(homes)/inventory/components/inventory-page.tsx` | `useProducts`, `useProductCategories`, `useInventory`, `useInventoryLocations` | ✅ Migrado |
| InvoicesPage | `src/app/(dashboard)/invoices/components/invoices-page.tsx` | `useInvoices` | ✅ Migrado |
| PaymentMethodsPage | `src/app/(dashboard)/payment-methods/components/payment-methods-page.tsx` | `usePaymentMethods` | ✅ Migrado |
| SalesPage | `src/app/(dashboard)/sales/components/sales-page.tsx` | `useSales` | ✅ Migrado |
| UsersListPage | `src/app/(dashboard)/users-list/page.tsx` | `useUsers` | ✅ Migrado |
| RolesPage | `src/app/(dashboard)/roles/components/roles-page.tsx` | `useRoles` | ✅ Migrado |

## 📝 Guía de Migración

### Para Migrar un Componente

**Antes (usando HotelDataContext):**
```tsx
import { useHotelData } from '@/contexts/HotelDataContext';

function MyComponent() {
  const { rooms, reservations, invoices } = useHotelData();
  // ...
}
```

**Después (usando hooks individuales):**
```tsx
import { useRooms } from '@/hooks/useRooms';
import { useReservations } from '@/hooks/useReservations';
import { useInvoices } from '@/hooks/useInvoices';

function MyComponent() {
  const { rooms } = useRooms({ limit: 100 });
  const { reservations } = useReservations({ limit: 100 });
  const { invoices } = useInvoices({ limit: 100 });
  // ...
}
```

### Ventajas de la Migración

1. **Rendimiento:** Solo se re-renderiza cuando cambian los datos que realmente usa
2. **Claridad:** Es explícito qué datos necesita cada componente
3. **Flexibilidad:** Puedes pasar opciones específicas (limit, filters, etc.)
4. **Caché:** SWR maneja automáticamente el caché y revalidación

### Consideraciones

- ⚠️ **Transformación de datos:** Los datos de la API pueden tener estructura diferente al formato local
- ⚠️ **Estados de carga:** Cada hook tiene su propio `isLoading`, maneja múltiples estados
- ⚠️ **Operaciones CRUD:** Por ahora, las funciones como `addRoom`, `updateRoom` están deshabilitadas (mock)

## 🔮 Próximos Pasos

1. **Crear hooks faltantes:**
   - `useGuests`
   - `useProducts`
   - `useServices`
   - `useCorporateClients`

2. **Migrar componentes prioritarios:**
   - Dashboard principal
   - Módulo de reservas
   - Módulo de facturación

3. **Implementar operaciones CRUD:**
   - Conectar `addRoom`, `updateRoom` con APIs reales
   - Implementar optimistic updates
   - Manejar errores y rollback

4. **Eliminar HotelDataContext:**
   - Solo cuando todos los componentes estén migrados
   - Eliminar archivos: `HotelDataContext.tsx`, `dataLoaders.ts`, `actions.ts`

## 📚 Documentación Relacionada

- [Guía de Migración Detallada](./MIGRACION-HOOKS.md)
- [Patrón de Hooks](./HOOKS-PATTERN.md)
- [Uso de Hooks](./HOOKS-USAGE.md)

## ⚠️ Advertencias

- **NO eliminar** `HotelDataContext.tsx` hasta que todos los componentes estén migrados
- **NO modificar** la interfaz de `HotelDataContext` (romperá componentes existentes)
- **SÍ migrar** componentes uno por uno, probando cada migración
- **SÍ mantener** compatibilidad hacia atrás durante la transición
