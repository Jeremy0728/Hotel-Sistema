# Guía de Uso de Custom Hooks para APIs

## Hooks Implementados

### 1. useRooms - Gestión de Habitaciones

Hook personalizado para obtener y gestionar habitaciones usando SWR.

#### Uso Básico

```typescript
import { useRooms } from '@/hooks/useRooms';

function HabitacionesComponent() {
  const { 
    rooms,           // Array de habitaciones
    isLoading,       // Estado de carga
    isError,         // Si hay error
    error,           // Datos del error
    updateRoomStatus, // Función para actualizar estado
    refreshRooms     // Función para refrescar datos
  } = useRooms({ limit: 100 });

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div>Error: {error?.msg}</div>;

  return (
    <div>
      {rooms.map(room => (
        <div key={room.id}>
          Habitación {room.number} - {room.status}
        </div>
      ))}
    </div>
  );
}
```

#### Opciones Disponibles

```typescript
interface UseRoomsOptions {
  page?: number;           // Página actual (default: 1)
  limit?: number;          // Elementos por página (default: 100)
  status?: string;         // Filtrar por estado
  floor?: number;          // Filtrar por piso
  refreshInterval?: number; // Intervalo de actualización automática (ms)
}
```

#### Funciones Retornadas

- **`updateRoomStatus(id, status)`**: Actualiza el estado de una habitación
- **`refreshRooms()`**: Refresca manualmente los datos

#### Ejemplo con Filtros

```typescript
const { rooms } = useRooms({ 
  status: 'available',
  floor: 2,
  limit: 50
});
```

#### Ejemplo con Actualización Automática

```typescript
const { rooms } = useRooms({ 
  refreshInterval: 30000 // Actualizar cada 30 segundos
});
```

### 2. useAvailableRooms - Habitaciones Disponibles

Hook específico para obtener solo habitaciones disponibles.

```typescript
import { useAvailableRooms } from '@/hooks/useRooms';

function DisponiblesComponent() {
  const { rooms, isLoading, error } = useAvailableRooms();
  
  return (
    <div>
      {rooms.map(room => (
        <div key={room.id}>Habitación {room.number}</div>
      ))}
    </div>
  );
}
```

### 3. useRoomsByFloor - Habitaciones por Piso

Hook para obtener habitaciones de un piso específico.

```typescript
import { useRoomsByFloor } from '@/hooks/useRooms';

function PisoComponent({ floor }: { floor: number }) {
  const { rooms, isLoading } = useRoomsByFloor(floor);
  
  return (
    <div>
      <h2>Piso {floor}</h2>
      {rooms.map(room => (
        <div key={room.id}>{room.number}</div>
      ))}
    </div>
  );
}
```

### 4. useRoom - Habitación Individual

Hook para obtener una habitación específica por ID.

```typescript
import { useRoom } from '@/hooks/useRooms';

function DetalleHabitacion({ roomId }: { roomId: number }) {
  const { room, isLoading, error } = useRoom(roomId);
  
  if (!room) return <div>Habitación no encontrada</div>;
  
  return (
    <div>
      <h2>Habitación {room.number}</h2>
      <p>Estado: {room.status}</p>
      <p>Piso: {room.floor}</p>
    </div>
  );
}
```

### 5. useReservations - Gestión de Reservas

Hook personalizado para obtener y gestionar reservas.

```typescript
import { useReservations } from '@/hooks/useReservations';

function ReservasComponent() {
  const { 
    reservations,
    total,
    page,
    totalPages,
    isLoading,
    isError,
    error,
    refreshReservations
  } = useReservations({ 
    page: 1, 
    limit: 20,
    status: 'confirmed'
  });

  if (isLoading) return <div>Cargando reservas...</div>;
  if (isError) return <div>Error: {error?.msg}</div>;

  return (
    <div>
      <h2>Reservas ({total})</h2>
      {reservations.map(reserva => (
        <div key={reserva.id}>
          {reserva.confirmation_code}
        </div>
      ))}
      <p>Página {page} de {totalPages}</p>
    </div>
  );
}
```

### 6. useActiveReservations - Reservas Activas

Hook para obtener reservas con check-in realizado.

```typescript
import { useActiveReservations } from '@/hooks/useReservations';

function ReservasActivasComponent() {
  const { reservations, isLoading } = useActiveReservations();
  
  return (
    <div>
      <h2>Huéspedes Alojados ({reservations.length})</h2>
      {reservations.map(reserva => (
        <div key={reserva.id}>
          {reserva.huesped?.nombres} - Hab. {reserva.habitacion?.number}
        </div>
      ))}
    </div>
  );
}
```

### 7. useTodayReservations - Reservas de Hoy

Hook para obtener reservas con check-in programado para hoy.

```typescript
import { useTodayReservations } from '@/hooks/useReservations';

function LlegadasHoyComponent() {
  const { reservations, isLoading } = useTodayReservations();
  
  return (
    <div>
      <h2>Llegadas de Hoy ({reservations.length})</h2>
      {reservations.map(reserva => (
        <div key={reserva.id}>
          {reserva.huesped?.nombres} - {reserva.confirmation_code}
        </div>
      ))}
    </div>
  );
}
```

## Manejo de Errores

Todos los hooks retornan información de error que puedes usar:

```typescript
const { rooms, isError, error } = useRooms();

if (isError) {
  console.error('Código de error:', error?.statusCode);
  console.error('Mensaje:', error?.msg);
  console.error('Errores de validación:', error?.errors);
}
```

## Revalidación Manual

Puedes forzar la actualización de datos en cualquier momento:

```typescript
const { rooms, mutate, refreshRooms } = useRooms();

// Opción 1: Usar mutate (de SWR)
await mutate();

// Opción 2: Usar la función helper
refreshRooms();
```

## Actualización Optimista

Para actualizar la UI antes de que la API responda:

```typescript
const { rooms, mutate, updateRoomStatus } = useRooms();

const handleStatusChange = async (roomId: number, newStatus: string) => {
  // Actualización optimista
  mutate(
    rooms.map(r => r.id === roomId ? { ...r, status: newStatus } : r),
    false // No revalidar inmediatamente
  );
  
  try {
    // Llamada a la API
    await updateRoomStatus(roomId, newStatus);
  } catch (error) {
    // Revertir en caso de error
    mutate();
  }
};
```

## Combinación de Múltiples Hooks

Puedes usar múltiples hooks en un mismo componente:

```typescript
function DashboardComponent() {
  const { rooms, isLoading: roomsLoading } = useRooms();
  const { reservations, isLoading: reservasLoading } = useActiveReservations();
  const { reservations: llegadas } = useTodayReservations();
  
  if (roomsLoading || reservasLoading) {
    return <div>Cargando...</div>;
  }
  
  return (
    <div>
      <h2>Habitaciones: {rooms.length}</h2>
      <h2>Huéspedes: {reservations.length}</h2>
      <h2>Llegadas Hoy: {llegadas.length}</h2>
    </div>
  );
}
```

## Características de SWR

Los hooks aprovechan las características de SWR:

- ✅ **Caching**: Los datos se cachean automáticamente
- ✅ **Revalidación**: Se actualizan al volver a la pestaña
- ✅ **Deduplicación**: Múltiples llamadas al mismo endpoint se deduplicam
- ✅ **Polling**: Actualización automática con `refreshInterval`
- ✅ **Optimistic Updates**: Actualización optimista de la UI
- ✅ **Error Retry**: Reintentos automáticos en caso de error (deshabilitado por defecto)

## Ejemplo Completo: Página de Habitaciones

```typescript
'use client';

import { useState } from 'react';
import { useRooms } from '@/hooks/useRooms';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function RoomsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  const { 
    rooms, 
    isLoading, 
    isError, 
    error,
    updateRoomStatus,
    refreshRooms 
  } = useRooms({ 
    status: statusFilter,
    limit: 100 
  });

  // Estado de carga
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p>Cargando habitaciones...</p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (isError) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-3">
          <h3 className="text-lg font-semibold">Error al cargar habitaciones</h3>
          <p className="text-sm text-neutral-500">
            {error?.msg || 'No se pudieron cargar las habitaciones'}
          </p>
          <Button onClick={refreshRooms} variant="outline">
            Reintentar
          </Button>
        </div>
      </Card>
    );
  }

  // Renderizado normal
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button 
          variant={statusFilter === '' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('')}
        >
          Todas ({rooms.length})
        </Button>
        <Button 
          variant={statusFilter === 'available' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('available')}
        >
          Disponibles
        </Button>
        <Button 
          variant={statusFilter === 'occupied' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('occupied')}
        >
          Ocupadas
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map(room => (
          <Card key={room.id} className="p-4">
            <h3 className="font-semibold">Habitación {room.number}</h3>
            <p className="text-sm">Piso: {room.floor}</p>
            <p className="text-sm">Estado: {room.status}</p>
            
            <div className="mt-3 flex gap-2">
              {room.status === 'cleaning' && (
                <Button 
                  size="sm"
                  onClick={() => updateRoomStatus(room.id, 'available')}
                >
                  Marcar Lista
                </Button>
              )}
              {room.status === 'available' && (
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => updateRoomStatus(room.id, 'maintenance')}
                >
                  Mantenimiento
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

## Notas Importantes

1. **Siempre maneja los estados de carga y error** para una mejor UX
2. **Usa `refreshInterval` con moderación** para no sobrecargar el servidor
3. **Los hooks son client-side only** - usa `'use client'` en tus componentes
4. **SWR cachea los datos** - múltiples componentes pueden usar el mismo hook sin duplicar peticiones
5. **Los errores 401 cierran sesión automáticamente** gracias a los interceptores de Axios
