# Guía de Uso de APIs - Frontend

## Tabla de Contenidos
1. [Introducción](#introducción)
2. [Configuración Inicial](#configuración-inicial)
3. [Estructura de la Capa de API](#estructura-de-la-capa-de-api)
4. [Uso de APIs](#uso-de-apis)
5. [Hooks Personalizados](#hooks-personalizados)
6. [Manejo de Errores](#manejo-de-errores)
7. [Ejemplos Prácticos](#ejemplos-prácticos)

## Introducción

Este proyecto implementa una capa completa de integración con APIs backend utilizando:
- **Axios** para las peticiones HTTP
- **SWR** para caching y revalidación automática
- **NextAuth** para autenticación JWT
- **TypeScript** para tipado estático

## Configuración Inicial

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-clave-secreta-aqui
```

### 2. Instalación de Dependencias

Las dependencias necesarias ya están instaladas:
- `axios`: Cliente HTTP
- `swr`: Data fetching con cache
- `next-auth`: Autenticación

## Estructura de la Capa de API

```
src/
├── lib/
│   ├── axios/
│   │   └── interceptors.ts       # Cliente Axios con interceptores
│   ├── api/
│   │   └── apiWrapper.ts         # Wrappers genéricos (GET, POST, PUT, etc.)
│   └── utils/
│       └── errors.ts              # Manejo centralizado de errores
├── apis/
│   ├── auth.api.ts                # APIs de autenticación
│   ├── habitaciones.api.ts        # APIs de habitaciones
│   ├── reservas.api.ts            # APIs de reservas
│   ├── huespedes.api.ts           # APIs de huéspedes
│   └── ...                        # Otros módulos
├── hooks/
│   └── useApi.ts                  # Hook personalizado para SWR
└── types/
    ├── api.ts                     # Tipos genéricos de API
    └── next-auth.d.ts             # Extensión de tipos NextAuth
```

## Uso de APIs

### 1. Usando los Wrappers Directamente

```typescript
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/apiWrapper';

// GET request
const habitaciones = await apiGet('/habitaciones/traer-todos');

// POST request
const nuevaHabitacion = await apiPost('/habitaciones/crear', {
  number: "101",
  room_type_id: 1,
  floor: 1,
  status: "available"
});

// PUT request
const actualizada = await apiPut('/habitaciones/actualizar/1', {
  status: "occupied"
});

// DELETE request
await apiDelete('/habitaciones/eliminar/1');
```

### 2. Usando las APIs Específicas

Cada módulo tiene su propio archivo de API en `src/apis/`:

```typescript
import { habitacionesApi } from '@/apis/habitaciones.api';
import { reservasApi } from '@/apis/reservas.api';
import { huespedesApi } from '@/apis/huespedes.api';

// Obtener todas las habitaciones
const response = await habitacionesApi.traerTodos(1, 10, 'available');

// Crear una reserva
const reserva = await reservasApi.crear({
  guest_id: 1,
  room_id: 5,
  check_in_date: "2024-12-20",
  check_out_date: "2024-12-25",
  adults: 2,
  children: 0
});

// Obtener huéspedes
const huespedes = await huespedesApi.traerTodos(1, 20);
```

## Hooks Personalizados

### 1. useApi - Hook Básico con SWR

```typescript
import { useApi } from '@/hooks/useApi';

function HabitacionesList() {
  const { data, error, isLoading, mutate } = useApi('/habitaciones/traer-todos');

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.msg}</div>;

  return (
    <div>
      {data.habitaciones.map(hab => (
        <div key={hab.id}>{hab.number}</div>
      ))}
      <button onClick={() => mutate()}>Recargar</button>
    </div>
  );
}
```

### 2. usePaginatedApi - Hook con Paginación

```typescript
import { usePaginatedApi } from '@/hooks/useApi';
import { useState } from 'react';

function ReservasList() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ status: 'confirmed' });

  const { data, error, isLoading } = usePaginatedApi(
    '/reservas/traer-todos',
    page,
    10,
    filters
  );

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.msg}</div>;

  return (
    <div>
      {data.data.map(reserva => (
        <div key={reserva.id}>{reserva.confirmation_code}</div>
      ))}
      <Pagination 
        current={data.page}
        total={data.totalPages}
        onChange={setPage}
      />
    </div>
  );
}
```

### 3. useApiWithPolling - Hook con Actualización Automática

```typescript
import { useApiWithPolling } from '@/hooks/useApi';

function DashboardStats() {
  // Se actualiza cada 5 segundos
  const { data, error, isLoading } = useApiWithPolling(
    '/dashboard/estadisticas',
    5000
  );

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.msg}</div>;

  return (
    <div>
      <h2>Habitaciones Disponibles: {data.disponibles}</h2>
      <h2>Ocupación: {data.ocupacion}%</h2>
    </div>
  );
}
```

## Manejo de Errores

### 1. Errores Automáticos

El sistema maneja automáticamente:
- **401 (No autorizado)**: Cierra sesión y redirige al login
- **403 (Sin permisos)**: Muestra mensaje de error
- **404 (No encontrado)**: Muestra mensaje de error
- **500 (Error del servidor)**: Muestra mensaje de error

### 2. Manejo Manual de Errores

```typescript
import { handleApiError, getErrorMessage } from '@/lib/utils/errors';

async function crearHabitacion(data) {
  try {
    const response = await habitacionesApi.crear(data);
    console.log('Habitación creada:', response);
  } catch (error) {
    const apiError = handleApiError(error, {
      showToast: true,
      customMessage: 'Error al crear la habitación'
    });
    
    console.error('Error:', apiError.msg);
    console.error('Errores de validación:', apiError.errors);
  }
}
```

### 3. Verificación de Tipos de Error

```typescript
import { 
  isJWTExpiredError, 
  isForbiddenError, 
  isNotFoundError 
} from '@/lib/utils/errors';

async function obtenerHabitacion(id: number) {
  try {
    return await habitacionesApi.traerPorId(id);
  } catch (error) {
    if (isJWTExpiredError(error)) {
      console.log('Sesión expirada');
    } else if (isForbiddenError(error)) {
      console.log('Sin permisos');
    } else if (isNotFoundError(error)) {
      console.log('Habitación no encontrada');
    }
    throw error;
  }
}
```

## Ejemplos Prácticos

### Ejemplo 1: Componente de Lista con Filtros

```typescript
'use client';

import { useState } from 'react';
import { usePaginatedApi } from '@/hooks/useApi';
import { habitacionesApi } from '@/apis/habitaciones.api';

export default function HabitacionesPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>('');

  const { data, error, isLoading, mutate } = usePaginatedApi(
    '/habitaciones/traer-todos',
    page,
    10,
    status ? { status } : {}
  );

  const handleCambiarEstado = async (id: number, nuevoEstado: string) => {
    try {
      await habitacionesApi.cambiarEstado(id, nuevoEstado);
      mutate(); // Recargar datos
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  if (isLoading) return <div>Cargando habitaciones...</div>;
  if (error) return <div>Error: {error.msg}</div>;

  return (
    <div>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">Todas</option>
        <option value="available">Disponibles</option>
        <option value="occupied">Ocupadas</option>
        <option value="maintenance">Mantenimiento</option>
      </select>

      <table>
        <thead>
          <tr>
            <th>Número</th>
            <th>Piso</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((habitacion) => (
            <tr key={habitacion.id}>
              <td>{habitacion.number}</td>
              <td>{habitacion.floor}</td>
              <td>{habitacion.status}</td>
              <td>
                <button onClick={() => handleCambiarEstado(habitacion.id, 'maintenance')}>
                  Mantenimiento
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        Página {data.page} de {data.totalPages}
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Anterior
        </button>
        <button disabled={page === data.totalPages} onClick={() => setPage(page + 1)}>
          Siguiente
        </button>
      </div>
    </div>
  );
}
```

### Ejemplo 2: Formulario de Creación

```typescript
'use client';

import { useState } from 'react';
import { habitacionesApi } from '@/apis/habitaciones.api';
import { getErrorMessage, getValidationErrors } from '@/lib/utils/errors';

export default function CrearHabitacionForm() {
  const [formData, setFormData] = useState({
    number: '',
    room_type_id: 1,
    floor: 1,
    status: 'available'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setValidationErrors([]);

    try {
      const response = await habitacionesApi.crear(formData);
      console.log('Habitación creada:', response.habitacion);
      // Redirigir o mostrar mensaje de éxito
    } catch (err) {
      setError(getErrorMessage(err));
      setValidationErrors(getValidationErrors(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {validationErrors.length > 0 && (
        <ul className="validation-errors">
          {validationErrors.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      )}

      <input
        type="text"
        placeholder="Número de habitación"
        value={formData.number}
        onChange={(e) => setFormData({ ...formData, number: e.target.value })}
      />

      <input
        type="number"
        placeholder="Piso"
        value={formData.floor}
        onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) })}
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Creando...' : 'Crear Habitación'}
      </button>
    </form>
  );
}
```

### Ejemplo 3: Dashboard con Múltiples APIs

```typescript
'use client';

import { useApi } from '@/hooks/useApi';

export default function Dashboard() {
  const { data: stats, error: statsError } = useApi('/dashboard/estadisticas');
  const { data: reservas, error: reservasError } = useApi('/reservas/proximas');
  const { data: habitaciones, error: habitacionesError } = useApi('/habitaciones/disponibles');

  if (statsError || reservasError || habitacionesError) {
    return <div>Error al cargar datos del dashboard</div>;
  }

  if (!stats || !reservas || !habitaciones) {
    return <div>Cargando dashboard...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      
      <div className="stats">
        <div>Habitaciones Disponibles: {stats.disponibles}</div>
        <div>Ocupación: {stats.ocupacion}%</div>
        <div>Reservas Hoy: {stats.reservasHoy}</div>
      </div>

      <div className="reservas-proximas">
        <h2>Próximas Reservas</h2>
        {reservas.data.map(reserva => (
          <div key={reserva.id}>
            {reserva.confirmation_code} - {reserva.guest_name}
          </div>
        ))}
      </div>

      <div className="habitaciones-disponibles">
        <h2>Habitaciones Disponibles</h2>
        {habitaciones.data.map(hab => (
          <div key={hab.id}>
            Habitación {hab.number} - Piso {hab.floor}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Características Importantes

### 1. Autenticación Automática
- El token JWT se agrega automáticamente a todas las peticiones
- El Hotel ID se agrega automáticamente para multi-tenant
- Cierre de sesión automático cuando el token expira

### 2. Caching Inteligente con SWR
- Los datos se cachean automáticamente
- Revalidación automática al volver a la pestaña
- Revalidación al reconectar a internet
- Polling opcional para datos en tiempo real

### 3. TypeScript
- Todos los endpoints están tipados
- Autocompletado en el IDE
- Detección de errores en tiempo de desarrollo

### 4. Manejo de Errores Robusto
- Errores centralizados y consistentes
- Mensajes de error descriptivos
- Errores de validación separados

## Mejores Prácticas

1. **Usa SWR para lecturas**: Aprovecha el caching automático
2. **Usa mutate() después de escrituras**: Para actualizar el cache
3. **Maneja errores apropiadamente**: Muestra mensajes al usuario
4. **Usa TypeScript**: Aprovecha el tipado estático
5. **Separa lógica de negocio**: Mantén componentes limpios

## Solución de Problemas

### Error: "Cannot find module 'axios'"
```bash
npm install axios
```

### Error: "Cannot find module 'swr'"
```bash
npm install swr
```

### Error: Token expirado
El sistema cierra sesión automáticamente. Asegúrate de que NextAuth esté configurado correctamente.

### Error: CORS
Verifica que el backend tenga CORS habilitado para `http://localhost:3000`.
