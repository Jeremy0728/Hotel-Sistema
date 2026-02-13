# Arquitectura del Proyecto Hotel Management Frontend

## Tabla de Contenidos
1. [Información General](#información-general)
2. [Dependencias y Librerías](#dependencias-y-librerías)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Arquitectura de Autenticación](#arquitectura-de-autenticación)
5. [Capa de API](#capa-de-api)
6. [Arquitectura de Componentes](#arquitectura-de-componentes)
7. [Sistema de Datos Mock](#sistema-de-datos-mock)
8. [Sistema de Estilos](#sistema-de-estilos)
9. [Flujo de Datos](#flujo-de-datos)
10. [Configuración](#configuración)
11. [Ejemplos de Interacción](#ejemplos-de-interacción)

## Información General

**Hotel Management System** es una aplicación web moderna para la gestión integral de hoteles, desarrollada con Next.js 16 y React 19. Utiliza TypeScript para tipado estático y está diseñada con un enfoque modular y escalable para manejar reservas, huéspedes, habitaciones, inventario y más.

### Stack Tecnológico Principal
- **Framework**: Next.js 16.1.6 con App Router
- **Frontend**: React 19.2.3 con TypeScript 5
- **UI Library**: HeroUI 2.8.8 (basado en React Aria)
- **Styling**: Tailwind CSS 4 + SASS/SCSS + CSS Modules
- **Estado Global**: SWR 2.4.0 para data fetching y caching
- **Autenticación**: NextAuth 4.24.13 con JWT
- **HTTP Client**: Axios 1.13.4 con interceptores personalizados
- **Animaciones**: Framer Motion 12.33.0
- **Gráficos**: Lightweight Charts 5.1.0 + Chart.js 4.5.1
- **Exportación**: jsPDF 3.0.4 + jspdf-autotable 5.0.7 + xlsx 0.18.5

## Dependencias y Librerías

### Dependencias de Producción

```json
{
  "@heroicons/react": "^2.2.0",        // Iconos de Heroicons
  "@heroui/react": "^2.8.8",           // Componentes UI principales
  "@heroui/theme": "^2.5.3",           // Tema base de HeroUI
  "@iconify/react": "^6.0.2",          // Sistema de iconos extensible
  "axios": "^1.13.4",                  // Cliente HTTP con interceptores
  "chart.js": "^4.5.1",                // Gráficos canvas para reportes
  "clsx": "^2.1.1",                    // Utilidad para clases condicionales
  "framer-motion": "^12.33.0",         // Animaciones y transiciones
  "jspdf": "^3.0.4",                   // Generación de PDFs
  "jspdf-autotable": "^5.0.7",         // Tablas automáticas en PDF
  "lightweight-charts": "^5.1.0",      // Gráficos de series temporales
  "lucide-react": "^0.525.0",          // Iconos adicionales
  "next": "16.1.6",                    // Framework React full-stack
  "next-auth": "^4.24.13",             // Autenticación para Next.js
  "react": "^19.2.3",                  // Librería principal de UI
  "react-dom": "^19.2.3",              // Renderizado DOM
  "react-icons": "^5.5.0",             // Colección de iconos
  "sass": "^1.87.0",                   // Preprocesador CSS
  "swr": "^2.4.0",                     // Data fetching con cache
  "tailwind-merge": "^3.3.1",          // Merge inteligente de clases Tailwind
  "xlsx": "^0.18.5"                    // Exportación a Excel
}
```

### Dependencias de Desarrollo

```json
{
  "@eslint/eslintrc": "^3",            // Configuración ESLint
  "@types/node": "^20",                // Tipos TypeScript para Node.js
  "@types/react": "^19",               // Tipos TypeScript para React
  "@types/react-dom": "^19",           // Tipos TypeScript para ReactDOM
  "eslint": "^9",                      // Linter de código
  "eslint-config-next": "16.1.6",     // Configuración ESLint para Next.js
  "tailwindcss": "^4.0.0",            // Framework CSS utility-first
  "typescript": "^5"                   // Compilador TypeScript
}
```

## Estructura del Proyecto

```
hotel_front/
├── src/
│   ├── app/                      # App Router de Next.js
│   │   ├── api/                 # API Routes
│   │   │   └── auth/            # NextAuth endpoints
│   │   ├── auth/                # Páginas de autenticación
│   │   │   └── login/           # Página de login
│   │   ├── dashboard/           # Dashboard principal
│   │   ├── habitaciones/        # Módulo de habitaciones
│   │   ├── reservas/            # Módulo de reservas
│   │   ├── huespedes/           # Módulo de huéspedes
│   │   ├── productos/           # Módulo de productos/inventario
│   │   ├── reportes/            # Módulo de reportes
│   │   ├── usuarios/            # Módulo de usuarios
│   │   ├── prueba/              # Página de demostración de componentes
│   │   │   ├── page.tsx         # Página principal de demos
│   │   │   ├── ButtonsDemo.tsx  # Demo de botones HeroUI
│   │   │   ├── InputsDemo.tsx   # Demo de inputs
│   │   │   ├── TableDemo.tsx    # Demo de tablas
│   │   │   ├── TableMockDemo.tsx # Demo de tabla con datos mock
│   │   │   └── ...              # Otros componentes de demo
│   │   └── layout.tsx           # Layout principal
│   ├── components/              # Componentes reutilizables
│   │   ├── auth/               # Componentes de autenticación
│   │   │   ├── RoleGuard.tsx   # Protección por roles
│   │   │   └── ConditionalRender.tsx # Renderizado condicional
│   │   ├── charts/             # Componentes de gráficos
│   │   └── demo/               # Componentes de demostración
│   │       └── LightweightChartsDemo.tsx # Demo de gráficos
│   ├── data/                   # Datos y configuraciones
│   │   └── mock/               # Sistema de datos mock
│   │       ├── habitaciones.mock.ts  # Mock de habitaciones
│   │       ├── reservas.mock.ts      # Mock de reservas
│   │       ├── huespedes.mock.ts     # Mock de huéspedes
│   │       ├── usuarios.mock.ts      # Mock de usuarios
│   │       ├── productos.mock.ts     # Mock de productos
│   │       └── index.ts              # Exportaciones centralizadas
│   ├── hooks/                  # Custom Hooks
│   │   ├── useAuth.ts          # Hook de autenticación
│   │   ├── useRoles.ts         # Hook de roles
│   │   ├── useMockData.ts      # Hook para datos mock
│   │   └── useMockPagination.ts # Hook para paginación mock
│   ├── lib/                    # Utilidades y configuraciones
│   │   ├── auth/               # Configuración de autenticación
│   │   │   └── authOptions.ts  # Opciones de NextAuth
│   │   ├── axios/              # Configuración de Axios
│   │   │   └── interceptors.ts # Interceptores HTTP
│   │   └── utils/              # Funciones utilitarias
│   │       └── cn.ts           # Utilidad para merge de clases Tailwind
│   ├── styles/                 # Estilos globales y SASS
│   │   ├── globals.css         # Estilos globales
│   │   ├── variables.scss      # Variables SASS
│   │   ├── mixins.scss         # Mixins SASS reutilizables
│   │   └── components/         # Estilos de componentes
│   │       └── _example.scss   # Ejemplo de componente SASS
│   └── types/                  # Definiciones de tipos TypeScript
│       ├── auth.ts             # Tipos de autenticación
│       ├── next-auth.d.ts      # Extensión de tipos NextAuth
│       └── ...                 # Otros tipos del dominio
├── documentacion/              # Documentación del proyecto
│   ├── arquitectura.md         # Este archivo
│   ├── manualApis.md          # Documentación de APIs backend
│   ├── MOCK_DATA_GUIDE.md     # Guía de uso de datos mock
│   └── ESTILOS_GUIDE.md       # Guía de organización de estilos
└── public/                     # Archivos estáticos
    └── ...
```

## Arquitectura de Autenticación

### NextAuth Configuration

La autenticación se basa en **NextAuth 4.24.11** con JWT y un sistema de roles personalizado:

```typescript
// src/config/auth.config.ts
export const AUTH_ROUTES = {
  LOGIN: '/auth/login',
  DEFAULT_REDIRECT: '/dashboard',
  PROTECTED_ROUTES: ['/dashboard', '/security', '/productos', '/reportes'],
  PUBLIC_ROUTES: ['/auth/login', '/auth/register', '/']
};
```

### Sistema de Roles

El sistema implementa 5 roles principales para la gestión hotelera:

```typescript
// Roles del sistema hotelero
export const HOTEL_ROLES = {
  1: { name: 'admin', display_name: 'Administrador', level: 5, description: 'Acceso completo al sistema' },
  2: { name: 'receptionist', display_name: 'Recepcionista', level: 4, description: 'Gestión de reservas y check-in/out' },
  3: { name: 'housekeeper', display_name: 'Personal de Limpieza', level: 3, description: 'Estado de habitaciones' },
  4: { name: 'maintenance', display_name: 'Mantenimiento', level: 2, description: 'Reparaciones' },
  5: { name: 'manager', display_name: 'Gerente', level: 4, description: 'Reportes y supervisión' }
};
```

### Flujo de Autenticación

1. **Login**: Usuario ingresa credenciales → NextAuth valida contra API backend → JWT generado
2. **Sesión**: JWT almacenado en sesión de NextAuth con datos del usuario y roles
3. **Protección**: Componentes `RoleGuard` verifican permisos antes de renderizar
4. **Expiración**: Interceptores de Axios detectan JWT expirado → logout automático
5. **Multi-tenant**: Header `X-Hotel-Id` enviado en cada request para identificar el hotel

```typescript
// Ejemplo de protección por roles en módulo de habitaciones
<RoleGuard allowedRoles={['Administrador', 'Recepcionista']}>
  <RoomManagement />
</RoleGuard>

// Ejemplo de protección para reportes
<RoleGuard allowedRoles={['Administrador', 'Gerente']}>
  <ReportsModule />
</RoleGuard>
```

## Capa de API

### Configuración de Axios

```typescript
// src/lib/axios/interceptors.ts
export const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // Backend del sistema hotelero
  timeout: 10000,
});

// Interceptor de Request - Agregar JWT y Hotel ID automáticamente
apiClient.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.user?.accessToken) {
    config.headers.Authorization = `Bearer ${session.user.accessToken}`;
  }
  
  // Header multi-tenant para identificar el hotel
  const hotelId = session?.user?.hotelId || '1';
  config.headers['X-Hotel-Id'] = hotelId;
  
  return config;
});

// Interceptor de Response - Manejar JWT expirado
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await handleJWTExpiredLogout();
    }
    return Promise.reject(error);
  }
);
```

### API Wrappers

Sistema de wrappers tipados para todas las operaciones HTTP:

```typescript
// src/lib/api/apiWrapper.ts
export const apiGet = async <T>(url: string, options?: ApiCallOptions): Promise<T> => {
  try {
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    const errorResult = handleErrors(error, options);
    throw errorResult;
  }
};

// Uso en APIs específicas del sistema hotelero
export const roomApi = {
  getRooms: async (filters = {}): Promise<ResponseRooms> => {
    const url = buildUrl('/habitaciones', filters);
    return await apiGet<ResponseRooms>(url);
  },
  
  createRoom: async (roomData: CreateRoomDto): Promise<ResponseRoom> => {
    return await apiPost<ResponseRoom>('/habitaciones', roomData);
  },
  
  updateRoomStatus: async (id: number, status: RoomStatus): Promise<ResponseRoom> => {
    return await apiPatch<ResponseRoom>(`/habitaciones/${id}/status`, { status });
  }
};

export const reservationApi = {
  getReservations: async (filters = {}): Promise<ResponseReservations> => {
    const url = buildUrl('/reservas', filters);
    return await apiGet<ResponseReservations>(url);
  },
  
  createReservation: async (data: CreateReservationDto): Promise<ResponseReservation> => {
    return await apiPost<ResponseReservation>('/reservas', data);
  },
  
  checkIn: async (id: number): Promise<ResponseReservation> => {
    return await apiPost<ResponseReservation>(`/reservas/${id}/check-in`, {});
  },
  
  checkOut: async (id: number): Promise<ResponseReservation> => {
    return await apiPost<ResponseReservation>(`/reservas/${id}/check-out`, {});
  }
};

export const guestApi = {
  getGuests: async (filters = {}): Promise<ResponseGuests> => {
    const url = buildUrl('/huespedes', filters);
    return await apiGet<ResponseGuests>(url);
  },
  
  createGuest: async (guestData: CreateGuestDto): Promise<ResponseGuest> => {
    return await apiPost<ResponseGuest>('/huespedes', guestData);
  }
};
```

### Manejo de Errores

Sistema centralizado de manejo de errores con redirección automática:

```typescript
// src/lib/utils/errors.ts
export const handleErrors = (error: unknown, options: ErrorHandlingOptions = {}) => {
  if (isJWTExpiredError(error)) {
    handleJWTExpiredLogout({
      showToast: true,
      customMessage: 'Tu sesión ha expirado. Serás redirigido al login.'
    });
  }
  // Otros tipos de errores...
};
```

## Arquitectura de Componentes

### Sistema de Componentes HeroUI

La aplicación utiliza **HeroUI 2.8.8** como librería principal de componentes, que proporciona:

```typescript
// Componentes principales utilizados
import {
  Button, Card, Table, Modal, Input, Select, Chip, 
  Tabs, Dropdown, Avatar, Pagination, Switch, Checkbox,
  RadioGroup, Radio, Slider, Progress, Spinner, Tooltip,
  Accordion, AccordionItem, Breadcrumbs, BreadcrumbItem
} from "@heroui/react";

// Configuración del tema
// tailwind.config.ts
export default {
  plugins: [heroui()],
  darkMode: 'class'
};
```

### Página de Demostración de Componentes

El proyecto incluye una página completa de demostración en `/prueba` que muestra todos los componentes HeroUI y gráficos:

```typescript
// src/app/prueba/page.tsx
export default function PruebaPage() {
  return (
    <div className="container mx-auto p-6">
      <Tabs>
        <Tab key="heroui" title="Componentes HeroUI">
          <ButtonsDemo />
          <InputsDemo />
          <SelectDemo />
          <ControlsDemo />
          <TableDemo />
          <TableMockDemo /> {/* Tabla con datos mock reales */}
          <ModalDemo />
          <ChipsDemo />
          <AvatarsBadgesDemo />
          <ProgressSpinnerDemo />
          <SliderDemo />
          <TooltipsDemo />
          <DropdownDemo />
          <AccordionDemo />
          <BreadcrumbsDemo />
        </Tab>
        <Tab key="charts" title="Gráficos">
          <LightweightChartsDemo />
        </Tab>
      </Tabs>
    </div>
  );
}
```

Cada componente de demostración está en un archivo separado para mejor organización:
- `ButtonsDemo.tsx` - Variantes de botones
- `InputsDemo.tsx` - Inputs con validación
- `TableMockDemo.tsx` - Tabla con datos mock de reservas
- `LightweightChartsDemo.tsx` - Gráficos de series temporales

### Componentes de Autenticación

Sistema modular de componentes para manejo de roles y autenticación:

```typescript
// src/components/auth/RoleGuard.tsx
export function RoleGuard({ allowedRoles, children, fallback }: RoleGuardProps) {
  const { isLoading, isAuthenticated, checkRole } = useRoles();
  
  if (isLoading) return <LoadingAuth />;
  if (!isAuthenticated) return <UnauthorizedAccess />;
  
  const hasPermission = checkRole.hasAny(allowedRoles);
  if (!hasPermission) return fallback || <UnauthorizedAccess />;
  
  return <>{children}</>;
}

// src/components/auth/ConditionalRender.tsx
export function ConditionalRender({ 
  requiredRoles, 
  children, 
  fallback,
  requireAll = false 
}: ConditionalRenderProps) {
  const { checkRole } = useRoles();
  const hasPermission = requireAll 
    ? checkRole.hasAll(requiredRoles)
    : checkRole.hasAny(requiredRoles);
    
  return hasPermission ? <>{children}</> : (fallback || null);
}
```

### HOCs (Higher Order Components)

Sistema de HOCs para protección de páginas completas:

```typescript
// src/hocs/withRoleProtection.tsx
export const withAdminOnly = <P extends object>(Component: React.ComponentType<P>) => {
  return withRoleProtection(Component, ['Administrador']);
};

export const withReceptionAccess = <P extends object>(Component: React.ComponentType<P>) => {
  return withRoleProtection(Component, ['Administrador', 'Recepcionista']);
};

export const withManagerAccess = <P extends object>(Component: React.ComponentType<P>) => {
  return withRoleProtection(Component, ['Administrador', 'Gerente']);
};

export const withHousekeepingAccess = <P extends object>(Component: React.ComponentType<P>) => {
  return withRoleProtection(Component, ['Administrador', 'Personal de Limpieza', 'Recepcionista']);
};

// Uso en páginas del hotel
const ProtectedReservationsPage = withReceptionAccess(ReservationsPage);
const ProtectedReportsPage = withManagerAccess(ReportsPage);
const ProtectedRoomsPage = withHousekeepingAccess(RoomsPage);
```

### Componentes de Gráficos

Sistema de gráficos con **Lightweight Charts** y **Chart.js**:

```typescript
// src/components/charts/TimeSeriesChart.tsx
export default function TimeSeriesChart({
  data,
  type = 'area',
  height = 300,
  colors = {},
  lineWidth = 2
}: TimeSeriesChartProps) {
  useEffect(() => {
    const chart = createChart(container);
    
    const series = type === 'area' 
      ? chart.addSeries(AreaSeries, {
          lineColor: colors.lineColor || '#3b82f6',
          topColor: colors.topColor || 'rgba(59, 130, 246, 0.4)',
          bottomColor: colors.bottomColor || 'rgba(59, 130, 246, 0.0)'
        })
      : chart.addSeries(LineSeries, {
          color: colors.color || '#10b981',
          lineWidth: lineWidth
        });
    
    series.setData(formattedData);
    chart.timeScale().fitContent();
  }, [data, type, colors]);
}

// src/components/charts/DoughnutChart.tsx - Chart.js
export default function DoughnutChart({ data, options }: DoughnutChartProps) {
  const chartRef = useRef<ChartJS>(null);
  
  useEffect(() => {
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: chartData,
      options: chartOptions
    });
    
    return () => chart.destroy();
  }, [data]);
}
```

### Componentes Responsive

Sistema de componentes que se adaptan a diferentes tamaños de pantalla:

```typescript
// src/components/ResponsiveUserTable.tsx
export default function ResponsiveUserTable({ users, onEdit, onDelete }: Props) {
  return (
    <>
      {/* Vista Desktop - Tabla */}
      <div className="hidden md:block">
        <Table aria-label="Tabla de usuarios">
          {/* Contenido de tabla */}
        </Table>
      </div>
      
      {/* Vista Mobile - Cards */}
      <div className="md:hidden space-y-4">
        {users.map(user => (
          <Card key={user.id} className="p-4">
            {/* Contenido de card */}
          </Card>
        ))}
      </div>
    </>
  );
}
```

## Sistema de Datos Mock

El proyecto incluye un sistema completo de datos mock para desarrollo frontend sin dependencia del backend. Este sistema está diseñado para que diseñadores y maquetadores puedan trabajar con datos realistas.

### Estructura de Datos Mock

Todos los datos mock están ubicados en `src/data/mock/` y reflejan exactamente la estructura de la base de datos PostgreSQL:

```typescript
// src/data/mock/index.ts - Exportación centralizada
export * from './habitaciones.mock';
export * from './reservas.mock';
export * from './huespedes.mock';
export * from './usuarios.mock';
export * from './productos.mock';
```

### Módulos de Datos Mock

#### 1. **Habitaciones** (`habitaciones.mock.ts`)
```typescript
export const habitacionesMock = [
  {
    id: 5,
    number: "105",
    room_type_id: 3,
    floor: 1,
    status: "available",
    notes: null,
    is_active: true,
    tipo: {
      name: "Doble Twin",
      base_price: "120000.00", // Precios en COP
      max_occupancy: 2,
    }
  },
  // ... más habitaciones
];

export const tiposHabitacionMock = [
  {
    id: 1,
    name: "Individual",
    description: "Habitación individual con cama sencilla",
    base_price: "80000.00",
    max_occupancy: 1,
    amenities: ["WiFi", "TV", "Aire acondicionado", "Escritorio"],
    is_active: true,
  },
  // ... más tipos
];
```

#### 2. **Reservas** (`reservas.mock.ts`)
```typescript
export const reservasMock = [
  {
    id: 40,
    confirmation_code: "RES202601049322",
    guest_id: 5,
    room_id: 30,
    check_in_date: "2026-01-04",
    check_out_date: "2026-01-08",
    adults: 2,
    children: 1,
    total_amount: "800000.00",
    status: "checked_out",
    special_requests: "Cama extra",
    huesped: {
      nombres: "Luis",
      apellido_paterno: "Hernández",
      apellido_materno: "Castro",
      email: "luis.hernandez@email.com",
    },
    habitacion: {
      number: "310",
      tipo: "Familiar",
    }
  },
  // ... más reservas
];
```

#### 3. **Huéspedes** (`huespedes.mock.ts`)
```typescript
export const huespedesMock = [
  {
    id: 1,
    nombres: "Juan",
    apellido_paterno: "Pérez",
    apellido_materno: "Gómez",
    email: "juan.perez@email.com",
    phone: null,
    document_type_id: 1,
    document_number: "1234567890",
    date_of_birth: "1985-03-15",
    address: "Calle 45 #23-12",
    city: "Bogotá",
    country_id: 6, // Colombia
    preferences: {
      pillow_type: "firm",
      room_preference: "no_smoking",
      floor_preference: "high"
    },
  },
  // ... más huéspedes
];

export const clientesCorporativosMock = [
  {
    id: 1,
    company_name: "TechCorp Colombia S.A.S",
    contact_name: "Andrea Jiménez",
    contact_email: "andrea.jimenez@techcorp.com",
    tax_id: "900123456-1", // NIT colombiano
    discount_percentage: "15.00",
    payment_terms: 30,
  },
  // ... más clientes corporativos
];
```

#### 4. **Usuarios** (`usuarios.mock.ts`)
```typescript
export const usuariosMock = [
  {
    id: 1,
    nombres: "Carlos",
    apellido_paterno: "Administrador",
    apellido_materno: "Silva",
    email: "admin@hotelgrima.com",
    celular: "001234567",
    is_active: true,
    roles: [
      {
        id: 1,
        name: "admin",
        display_name: "Administrador",
      }
    ],
    preferences: {},
  },
  // ... más usuarios
];

export const rolesMock = [
  {
    id: 1,
    name: "admin",
    display_name: "Administrador",
    description: "Acceso completo a todas las funcionalidades del sistema",
    is_system_role: true,
  },
  // ... más roles
];
```

#### 5. **Productos e Inventario** (`productos.mock.ts`)
```typescript
export const productosMock = [
  {
    id: 1,
    name: "Agua Mineral 500ml",
    description: "Agua mineral natural",
    category_id: 1,
    price: "3000.00",
    cost: "1500.00",
    sku: "BEB-001",
    is_active: true,
    requires_inventory: true,
  },
  // ... más productos
];

export const inventarioMock = [
  {
    id: 7,
    product_id: 1,
    location_id: 2,
    current_stock: 204,
    min_stock: 50,
    max_stock: 500,
    producto: {
      name: "Agua Mineral 500ml",
      sku: "BEB-001",
    },
    ubicacion: {
      name: "Almacén General",
    }
  },
  // ... más inventario
];

export const ubicacionesInventarioMock = [
  {
    id: 1,
    name: "Recepción Principal",
    location_type: "reception",
  },
  {
    id: 7,
    name: "Minibar Habitación 103",
    location_type: "minibar",
  },
  // ... más ubicaciones
];
```

### Hooks para Datos Mock

#### `useMockData` - Simula llamadas API
```typescript
// src/hooks/useMockData.ts
export function useMockData<T>(
  mockData: T[],
  delay: number = 500
): {
  data: T[] | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [mockData, delay]);

  const refetch = () => {
    setLoading(true);
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, delay);
  };

  return { data, loading, error, refetch };
}
```

#### `useMockPagination` - Paginación de datos mock
```typescript
export function useMockPagination<T>(
  mockData: T[],
  initialPage: number = 1,
  initialRowsPerPage: number = 10
) {
  const [page, setPage] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return mockData.slice(start, end);
  }, [mockData, page, rowsPerPage]);

  const totalPages = Math.ceil(mockData.length / rowsPerPage);

  return {
    data: paginatedData,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    totalPages,
    totalItems: mockData.length,
  };
}
```

### Ejemplo de Uso en Componentes

```typescript
// src/app/prueba/TableMockDemo.tsx
import { reservasMock } from '@/data/mock';
import { useMockData, useMockPagination } from '@/hooks/useMockData';

export default function TableMockDemo() {
  const { data, loading } = useMockData(reservasMock);
  const {
    data: paginatedData,
    page,
    setPage,
    totalPages,
  } = useMockPagination(data || [], 1, 5);

  if (loading) return <Spinner />;

  return (
    <Table>
      <TableHeader>
        <TableColumn>Código</TableColumn>
        <TableColumn>Huésped</TableColumn>
        <TableColumn>Habitación</TableColumn>
        <TableColumn>Estado</TableColumn>
      </TableHeader>
      <TableBody>
        {paginatedData.map((reserva) => (
          <TableRow key={reserva.id}>
            <TableCell>{reserva.confirmation_code}</TableCell>
            <TableCell>{reserva.huesped.nombres}</TableCell>
            <TableCell>{reserva.habitacion.number}</TableCell>
            <TableCell>
              <Chip color={getStatusColor(reserva.status)}>
                {translateStatus(reserva.status)}
              </Chip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

### Características del Sistema Mock

✅ **Datos Reales de BD**: Todos los datos mock provienen directamente de la base de datos PostgreSQL  
✅ **Estructura Idéntica**: Los campos y tipos coinciden exactamente con las tablas de la BD  
✅ **Precios Reales**: Valores en pesos colombianos (COP) como en producción  
✅ **Relaciones Correctas**: IDs y referencias entre entidades son consistentes  
✅ **Fácil Transición**: Al integrar APIs, solo cambiar el hook sin modificar componentes  
✅ **Documentación**: Guía completa en `MOCK_DATA_GUIDE.md`

## Sistema de Estilos

El proyecto implementa una estrategia híbrida de estilos que combina **Tailwind CSS 4**, **SASS/SCSS** y **CSS Modules** según las necesidades de cada componente.

### Organización de Estilos

```
src/styles/
├── globals.css           # Estilos globales y reset
├── variables.scss        # Variables SASS globales
├── mixins.scss          # Mixins SASS reutilizables
└── components/          # Estilos de componentes específicos
    └── _example.scss    # Ejemplo de componente con SASS
```

### Variables SASS Globales

```scss
// src/styles/variables.scss

// Colores del sistema hotelero
$primary: #3b82f6;
$secondary: #8b5cf6;
$success: #10b981;
$warning: #f59e0b;
$danger: #ef4444;

// Espaciado
$spacing-xs: 0.25rem;
$spacing-sm: 0.5rem;
$spacing-md: 1rem;
$spacing-lg: 1.5rem;
$spacing-xl: 2rem;

// Tipografía
$font-family-base: 'Inter', -apple-system, sans-serif;
$font-size-xs: 0.75rem;
$font-size-sm: 0.875rem;
$font-size-base: 1rem;
$font-size-lg: 1.125rem;

// Breakpoints responsive
$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;

// Sombras
$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
$shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

// Z-index
$z-dropdown: 1000;
$z-modal: 1050;
$z-tooltip: 1100;
```

### Mixins SASS Reutilizables

```scss
// src/styles/mixins.scss

// Responsive breakpoints
@mixin respond-to($breakpoint) {
  @if $breakpoint == 'sm' {
    @media (min-width: $breakpoint-sm) { @content; }
  }
  @if $breakpoint == 'md' {
    @media (min-width: $breakpoint-md) { @content; }
  }
  // ... más breakpoints
}

// Flexbox utilities
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

// Card styles
@mixin card($padding: $spacing-md) {
  background: white;
  border-radius: 0.5rem;
  padding: $padding;
  box-shadow: $shadow-md;
}

// Glassmorphism effect
@mixin glassmorphism($opacity: 0.7) {
  background: rgba(255, 255, 255, $opacity);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

// Truncate text
@mixin truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

### Utilidad para Merge de Clases Tailwind

```typescript
// src/lib/utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina clases de Tailwind CSS de forma inteligente
 * Resuelve conflictos y elimina duplicados
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Uso en componentes
<div className={cn(
  'px-4 py-2',
  isActive && 'bg-blue-500',
  'hover:bg-blue-600' // Se combina correctamente
)} />
```

### Estrategia de Uso

#### **Tailwind CSS** - Para utilidades y layouts
```tsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-bold text-gray-800">Título</h2>
  <Button className="px-4 py-2 bg-blue-500 hover:bg-blue-600">
    Acción
  </Button>
</div>
```

#### **SASS/SCSS** - Para componentes complejos con lógica de estilos
```scss
// src/styles/components/_reservation-card.scss
@import '../variables';
@import '../mixins';

.reservation-card {
  @include card($spacing-lg);
  
  &__header {
    @include flex-between;
    margin-bottom: $spacing-md;
  }
  
  &__status {
    &--confirmed {
      color: $success;
    }
    &--pending {
      color: $warning;
    }
  }
  
  @include respond-to('md') {
    padding: $spacing-xl;
  }
}
```

#### **CSS Modules** - Para componentes aislados
```tsx
// Component.module.css
.container {
  composes: card from '../styles/components/_base.scss';
  padding: 1rem;
}

// Component.tsx
import styles from './Component.module.css';

export default function Component() {
  return <div className={styles.container}>...</div>;
}
```

### Documentación Completa

Para más detalles sobre la organización de estilos, consultar `ESTILOS_GUIDE.md` que incluye:
- Convenciones de nomenclatura
- Cuándo usar cada estrategia
- Ejemplos completos
- Best practices

## Flujo de Datos

### SWR para Data Fetching

**SWR 2.3.3** maneja todo el estado de datos con caching automático:

```typescript
// src/hooks/useUserList.ts
export default function useUserList() {
  const key = useMemo(() => {
    if (status !== 'authenticated') return null;
    return [
      `users-${page}-${rowsPerPage}-${searchValue}-${statusFilterValue}`,
      page, rowsPerPage, searchValue, statusFilterValue
    ];
  }, [status, page, rowsPerPage, statusFilter, filterValue]);

  const { data, error, isLoading, mutate } = useSWR(
    key,
    async ([, page, rowsPerPage, searchValue, statusFilterValue]) => {
      const data = await userApi.getUsersWithPagination(
        page, rowsPerPage,
        deleteAllNullValues({ is_active: statusFilterValue, nombre: searchValue })
      );
      setTotalData(data.count || 0);
      return data.data;
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      dedupingInterval: 500,
      keepPreviousData: true
    }
  );

  return {
    users: data || [],
    loading: isLoading,
    error,
    refreshUsers: mutate,
    // ... otros valores
  };
}
```

### Hooks Personalizados

Sistema de hooks para lógica de negocio reutilizable:

```typescript
// src/hooks/useAuth.ts
export function useAuth() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { data: session, status } = useSession();
  const roles = useRoles();

  const login = async (credentials: LoginCredentials) => {
    setIsLoggingIn(true);
    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });
      return result;
    } finally {
      setIsLoggingIn(false);
    }
  };

  return {
    isAuthenticated: roles.isAuthenticated,
    isLoading: status === 'loading' || isLoggingIn,
    user: roles.user,
    userRoles: roles.userRoles,
    primaryRole: roles.primaryRole,
    checkRole: roles.checkRole,
    login,
    logout: () => signOut({ redirect: false }),
    session
  };
}

// src/hooks/useRoles.ts
export function useRoles() {
  const { data: session, status } = useSession();
  
  const checkRole = useMemo(() => ({
    hasAny: (roles: RoleName[]): boolean => {
      return userRoles.some(userRole => 
        roles.some(requiredRole => 
          userRole.name === requiredRole || 
          ROLE_HIERARCHY[userRole.id]?.name === requiredRole
        )
      );
    },
    
    hasAll: (roles: RoleName[]): boolean => {
      return roles.every(requiredRole =>
        userRoles.some(userRole => 
          userRole.name === requiredRole || 
          ROLE_HIERARCHY[userRole.id]?.name === requiredRole
        )
      );
    }
  }), [userRoles]);

  return {
    isAuthenticated: !!session?.user,
    isLoading: status === 'loading',
    user: session?.user,
    userRoles,
    primaryRole,
    checkRole
  };
}
```

### Estado Global con Contextos

```typescript
// src/contexts/RoleContext.tsx
export const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [currentRole, setCurrentRole] = useState<Role | null>(null);

  const contextValue: RoleContextType = {
    currentRole,
    setCurrentRole,
    availableRoles: session?.user?.roles || [],
    isLoading: status === 'loading'
  };

  return (
    <RoleContext.Provider value={contextValue}>
      {children}
    </RoleContext.Provider>
  );
}
```

## Configuración

### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "strict": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Tailwind Configuration

```typescript
// tailwind.config.ts
import { heroui } from "@heroui/react"

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      }
    }
  },
  darkMode: 'class',
  plugins: [heroui()]
}
```

### Next.js Configuration

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuraciones específicas del proyecto
};

export default nextConfig;
```

## Ejemplos de Interacción

### Flujo Completo: Gestión de Reservas

1. **Componente Principal**:
```typescript
// src/app/reservas/page.tsx
export default function ReservationsPage() {
  return (
    <RoleGuard allowedRoles={['Administrador', 'Recepcionista']}>
      <ReservationList />
    </RoleGuard>
  );
}
```

2. **Hook de Datos con SWR**:
```typescript
// src/app/reservas/hooks/useReservationList.ts
const { data, error, isLoading, mutate } = useSWR(
  key,
  async ([, page, rowsPerPage, statusFilter, dateRange]) => {
    const data = await reservationApi.getReservations({
      page,
      limit: rowsPerPage,
      status: statusFilter,
      check_in_date: dateRange.start,
      check_out_date: dateRange.end
    });
    return data.data;
  },
  {
    revalidateOnFocus: false,
    keepPreviousData: true
  }
);
```

3. **API Call**:
```typescript
// src/apis/reservations.api.ts
getReservations: async (filters) => {
  const url = buildUrl('/reservas', filters);
  return await apiGet<ResponseReservations>(url);
},

checkIn: async (reservationId: number) => {
  return await apiPost<ResponseReservation>(
    `/reservas/${reservationId}/check-in`,
    {}
  );
}
```

4. **Interceptor de Axios con Multi-tenant**:
```typescript
// src/lib/axios/interceptors.ts
apiClient.interceptors.request.use(async (config) => {
  const session = await getSession();
  
  // JWT Token
  if (session?.user?.accessToken) {
    config.headers.Authorization = `Bearer ${session.user.accessToken}`;
  }
  
  // Hotel ID para multi-tenant
  const hotelId = session?.user?.hotelId || '1';
  config.headers['X-Hotel-Id'] = hotelId;
  
  return config;
});
```

### Flujo Completo: Uso de Datos Mock (Sin Backend)

1. **Componente con Datos Mock**:
```typescript
// src/app/prueba/TableMockDemo.tsx
import { reservasMock } from '@/data/mock';
import { useMockData, useMockPagination } from '@/hooks/useMockData';

export default function TableMockDemo() {
  // Simula carga de datos con delay
  const { data, loading, refetch } = useMockData(reservasMock, 500);
  
  // Paginación de datos mock
  const {
    data: paginatedData,
    page,
    setPage,
    totalPages,
  } = useMockPagination(data || [], 1, 5);

  if (loading) return <Spinner />;

  return (
    <Table>
      {/* Renderizado de tabla */}
    </Table>
  );
}
```

2. **Transición a API Real**:
```typescript
// Cambiar de mock a API real solo requiere cambiar el hook
// ANTES (con mock):
const { data, loading } = useMockData(reservasMock);

// DESPUÉS (con API):
const { data, loading } = useSWR('reservations', () => 
  reservationApi.getReservations()
);
// Los componentes no necesitan cambios
```

### Flujo de Autenticación

1. **Login Form** → 2. **NextAuth signIn** → 3. **JWT Storage** → 4. **Session Creation** → 5. **Role Verification** → 6. **Component Rendering**

### Flujo de Protección por Roles

1. **Page Load** → 2. **RoleGuard Check** → 3. **useRoles Hook** → 4. **Role Verification** → 5. **Conditional Rendering**

### Flujo de Manejo de Errores

1. **API Call** → 2. **Axios Interceptor** → 3. **Error Detection** → 4. **JWT Validation** → 5. **Automatic Logout** → 6. **Redirect to Login**

## Patrones de Diseño Implementados

### 1. **Repository Pattern**
- APIs organizadas por dominio (`userApi`, `productApi`, `reportApi`)
- Wrappers centralizados para operaciones HTTP

### 2. **Observer Pattern**
- SWR para observar cambios en datos
- Contextos React para estado global

### 3. **Strategy Pattern**
- Diferentes estrategias de renderizado (desktop/mobile)
- Múltiples tipos de gráficos (area/line)

### 4. **Decorator Pattern**
- HOCs para protección de componentes
- Interceptores de Axios para funcionalidad adicional

### 5. **Factory Pattern**
- Creación de instancias de gráficos
- Generación de componentes de formulario

## Características Técnicas Destacadas

### ✅ **Seguridad**
- JWT con expiración automática y renovación
- Protección por roles granular (5 roles del sistema hotelero)
- Multi-tenant con header `X-Hotel-Id`
- Sanitización de datos de entrada
- HTTPS en producción

### ✅ **Performance**
- SWR caching inteligente para reducir llamadas API
- Code splitting automático con Next.js App Router
- Lazy loading de componentes pesados
- Optimización de imágenes con Next.js Image
- Paginación eficiente en tablas

### ✅ **Escalabilidad**
- Arquitectura modular por dominio (habitaciones, reservas, huéspedes, etc.)
- Tipos TypeScript estrictos para todo el sistema
- Componentes reutilizables con HeroUI
- Hooks personalizados para lógica de negocio
- Sistema de datos mock para desarrollo desacoplado

### ✅ **UX/UI**
- Responsive design completo (desktop/tablet/mobile)
- Animaciones suaves con Framer Motion
- Componentes HeroUI modernos y accesibles
- Sistema de estilos híbrido (Tailwind + SASS + CSS Modules)
- Página de demostración de componentes en `/prueba`

### ✅ **Desarrollo**
- Sistema de datos mock con estructura real de BD
- Hooks `useMockData` y `useMockPagination` para desarrollo sin backend
- Guías de documentación (`MOCK_DATA_GUIDE.md`, `ESTILOS_GUIDE.md`)
- Transición fácil de mock a API real
- Datos mock basados en PostgreSQL real

### ✅ **Mantenibilidad**
- ESLint + TypeScript con reglas estrictas
- Estructura de carpetas clara y organizada
- Documentación completa de arquitectura y APIs
- Patrones consistentes en todo el código
- Separación clara de responsabilidades

### ✅ **Integraciones**
- Backend API REST con Node.js/Express
- Base de datos PostgreSQL
- Exportación a PDF (jsPDF) y Excel (xlsx)
- Gráficos con Lightweight Charts y Chart.js
- Sistema multi-tenant para múltiples hoteles

## Módulos del Sistema Hotelero

### 1. **Gestión de Habitaciones**
- CRUD de habitaciones y tipos de habitación
- Estados: disponible, ocupada, limpieza, mantenimiento
- Asignación de amenidades
- Gestión de precios por tipo

### 2. **Gestión de Reservas**
- Creación y modificación de reservas
- Check-in y check-out
- Códigos de confirmación únicos
- Gestión de huéspedes por reserva
- Solicitudes especiales

### 3. **Gestión de Huéspedes**
- Base de datos de huéspedes
- Clientes corporativos con descuentos
- Preferencias de habitación
- Historial de estancias

### 4. **Inventario y Productos**
- Gestión de productos (minibar, amenidades)
- Control de inventario por ubicación
- Stock mínimo y máximo
- Categorías de productos

### 5. **Usuarios y Roles**
- Sistema de roles jerárquico
- Permisos granulares por módulo
- Gestión de empleados del hotel

### 6. **Reportes y Análisis**
- Ocupación de habitaciones
- Ingresos por período
- Gráficos de tendencias
- Exportación a PDF/Excel

Esta arquitectura proporciona una base sólida y escalable para el desarrollo de un sistema de gestión hotelera completo, implementando las mejores prácticas de la industria y facilitando el trabajo colaborativo entre desarrolladores y diseñadores mediante el sistema de datos mock.