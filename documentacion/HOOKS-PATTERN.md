# Patrón de Hooks para Listas con SWR

## Estructura Basada en useProductList

He refactorizado los hooks para seguir el mismo patrón que `useProductList.ts`, que incluye:

### 📁 Archivos Creados

#### 1. **usePagination.ts** - Hook de Paginación Reutilizable
```typescript
import { useState, useMemo } from 'react';

interface UsePaginationProps {
  totalAllData: number;
  initialPage?: number;
  initialRowsPerPage?: number;
}

export default function usePagination({ 
  totalAllData, 
  initialPage = 1, 
  initialRowsPerPage = 10 
}: UsePaginationProps) {
  const [page, setPage] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const pages = useMemo(() => {
    return totalAllData > 0 ? Math.ceil(totalAllData / rowsPerPage) : 1;
  }, [totalAllData, rowsPerPage]);

  return {
    page,
    pages,
    rowsPerPage,
    setPageOnChange,
    setRowsPerPageOnChange,
  };
}
```

#### 2. **useRoomList.ts** - Hook Completo para Habitaciones

Características implementadas:

✅ **Autenticación con NextAuth**
```typescript
const { data: session, status } = useSession();
```

✅ **Paginación Completa**
```typescript
const { page, pages, setPageOnChange, rowsPerPage } = usePagination({ 
  totalAllData: totalData 
});
```

✅ **Filtros Múltiples**
- Filtro por estado (disponible, ocupada, limpieza, etc.)
- Filtro por piso
- Búsqueda por texto

✅ **Ordenamiento**
```typescript
const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
  column: "number",
  direction: "ascending",
});
```

✅ **Columnas Visibles**
```typescript
const [visibleColumns, setVisibleColumns] = useState<Selection>(
  new Set(INITIAL_VISIBLE_COLUMNS),
);
```

✅ **SWR con Key Dinámica**
```typescript
const key = useMemo(() => {
  if (status !== 'authenticated' || !session?.user?.accessToken) return null;
  
  return [
    `rooms-${page}-${rowsPerPage}-${searchValue}-${statusFilterValue}-${floorFilterValue}`,
    page,
    rowsPerPage,
    searchValue,
    statusFilterValue,
    floorFilterValue
  ];
}, [status, session, page, rowsPerPage, statusFilter, floorFilter, filterValue]);
```

✅ **Configuración Optimizada de SWR**
```typescript
{
  revalidateOnFocus: false,    // No revalidar al volver a la pestaña
  revalidateOnMount: true,     // Revalidar al montar
  dedupingInterval: 10000,     // Deduplicar peticiones en 10 segundos
  keepPreviousData: true,      // Mantener datos previos mientras carga
}
```

✅ **Funciones de Acción**
```typescript
const handleDeleteRoom = useCallback(async (roomId: number) => {
  setIsLoadingDelete(true);
  try {
    await habitacionesApi.eliminar(roomId);
    showSuccessToast('Habitación eliminada', 'La habitación ha sido eliminada exitosamente');
    mutate();
  } catch (error: unknown) {
    handleErrors(error);
  } finally {
    setIsLoadingDelete(false);
  }
}, [mutate]);
```

### 🎯 Valores Retornados

El hook retorna un objeto completo con todo lo necesario:

```typescript
return {
  // Datos
  rooms: data || [],
  loading: isLoading,
  error,
  
  // Paginación
  page,
  pages,
  setPageOnChange,
  rowsPerPage,
  totalData,
  
  // Revalidación
  refreshRooms: mutate,
  
  // Columnas
  visibleColumns,
  setVisibleColumns,
  headerColumns,
  columns,
  
  // Filtros
  statusOptions,
  floorOptions,
  onSearchChange,
  filteredItems,
  setFilterValue,
  statusFilter,
  setStatusFilter,
  floorFilter,
  setFloorFilter,
  
  // Ordenamiento
  sortDescriptor,
  setSortDescriptor,
  sortedItems,
  
  // UI
  classNames,
  filterValue,
  statusColorMap,
  
  // Acciones
  isLoadingDelete,
  isLoadingUpdate,
  handleDeleteRoom,
  handleUpdateRoomStatus,
};
```

### 📊 Ejemplo de Uso

```typescript
'use client';

import useRoomList from '@/hooks/useRoomList';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

export default function RoomsListPage() {
  const {
    rooms,
    loading,
    error,
    page,
    pages,
    setPageOnChange,
    headerColumns,
    sortedItems,
    sortDescriptor,
    setSortDescriptor,
    onSearchChange,
    filterValue,
    statusFilter,
    setStatusFilter,
    statusOptions,
    floorFilter,
    setFloorFilter,
    floorOptions,
    handleDeleteRoom,
    handleUpdateRoomStatus,
    isLoadingDelete,
    isLoadingUpdate,
  } = useRoomList();

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex gap-3">
        <Input
          placeholder="Buscar habitación..."
          value={filterValue}
          onValueChange={onSearchChange}
        />
        
        <Select
          label="Estado"
          selectedKeys={statusFilter}
          onSelectionChange={setStatusFilter}
        >
          {statusOptions.map((status) => (
            <SelectItem key={status.uid} value={status.uid}>
              {status.name}
            </SelectItem>
          ))}
        </Select>
        
        <Select
          label="Piso"
          selectedKeys={floorFilter}
          onSelectionChange={setFloorFilter}
        >
          {floorOptions.map((floor) => (
            <SelectItem key={floor.uid} value={floor.uid}>
              {floor.name}
            </SelectItem>
          ))}
        </Select>
      </div>

      {/* Tabla */}
      <Table
        aria-label="Tabla de habitaciones"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        bottomContent={
          <Pagination
            page={page}
            total={pages}
            onChange={setPageOnChange}
          />
        }
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(item, columnKey, {
                    onDelete: handleDeleteRoom,
                    onUpdateStatus: handleUpdateRoomStatus,
                    isLoadingDelete,
                    isLoadingUpdate,
                  })}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
```

### 🛠️ Utilidades Creadas

#### 1. **functions.ts** - Funciones Utilitarias
```typescript
// Elimina valores null/undefined
export function deleteAllNullValues<T>(obj: T): Partial<T>

// Formatea moneda
export function formatCurrency(amount: number, currency?: string): string

// Formatea fecha
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string

// Capitaliza texto
export function capitalize(str: string): string

// Genera código aleatorio
export function generateCode(prefix?: string, length?: number): string
```

#### 2. **toastUtils.ts** - Notificaciones Toast
```typescript
export function showSuccessToast(title: string, message?: string)
export function showErrorToast(title: string, message?: string)
export function showWarningToast(title: string, message?: string)
export function showInfoToast(title: string, message?: string)
export function showLoadingToast(title: string, message?: string)
export function dismissToast(toastId: string | number)
```

#### 3. **handleErrors** - Manejo de Errores
Agregado como alias en `errors.ts`:
```typescript
export function handleErrors(error: unknown, options?: ErrorHandlingOptions): ApiError
```

### 🔄 Comparación: Antes vs Después

#### Antes (useRooms simple)
```typescript
export function useRooms(options = {}) {
  const { page = 1, limit = 100, status } = options;
  
  const { data, error, isLoading, mutate } = useSWR(
    `rooms-${page}-${limit}-${status}`,
    () => habitacionesApi.traerTodos(page, limit, status)
  );

  return {
    rooms: data?.habitaciones || [],
    isLoading,
    error,
    mutate,
  };
}
```

#### Después (useRoomList completo)
```typescript
export default function useRoomList() {
  // ✅ Autenticación
  const { data: session, status } = useSession();
  
  // ✅ Estados locales
  const [totalData, setTotalData] = useState(0);
  const [visibleColumns, setVisibleColumns] = useState<Selection>(...);
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [floorFilter, setFloorFilter] = useState<Selection>("all");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>(...);
  
  // ✅ Paginación
  const { page, pages, setPageOnChange, rowsPerPage } = usePagination({ totalAllData: totalData });
  
  // ✅ Key dinámica con dependencias
  const key = useMemo(() => [...], [dependencies]);
  
  // ✅ SWR optimizado
  const { data, error, isLoading, mutate } = useSWR(key, fetcher, config);
  
  // ✅ Datos procesados
  const headerColumns = useMemo(() => [...], [visibleColumns]);
  const filteredItems = useMemo(() => [...], [data]);
  const sortedItems = useMemo(() => [...], [sortDescriptor, filteredItems]);
  
  // ✅ Callbacks optimizados
  const onSearchChange = useCallback((value) => {...}, []);
  const handleDeleteRoom = useCallback(async (id) => {...}, [mutate]);
  
  // ✅ Retorno completo
  return { /* 30+ propiedades y funciones */ };
}
```

### 📝 Ventajas del Nuevo Patrón

1. **Consistencia**: Todos los hooks de lista siguen la misma estructura
2. **Completo**: Incluye paginación, filtros, ordenamiento, columnas visibles
3. **Optimizado**: SWR con configuración adecuada y memoización
4. **Autenticado**: Integración con NextAuth automática
5. **Reutilizable**: Componentes pueden usar el hook directamente
6. **Type-safe**: TypeScript completo con tipos inferidos
7. **Manejo de errores**: Integrado con toasts y manejo centralizado
8. **Estados de carga**: Para cada acción (delete, update, etc.)

### 🎨 Configuración de Columnas

```typescript
const INITIAL_VISIBLE_COLUMNS = ["number", "floor", "room_type", "status", "actions"];

const columns = [
  { name: "NÚMERO", uid: "number", sortable: true },
  { name: "PISO", uid: "floor", sortable: true },
  { name: "TIPO", uid: "room_type", sortable: true },
  { name: "ESTADO", uid: "status", sortable: true },
  { name: "NOTAS", uid: "notes", sortable: false },
  { name: "ACCIONES", uid: "actions" },
];
```

### 🎨 Mapeo de Colores

```typescript
const statusColorMap: Record<string, ChipProps["color"]> = {
  available: "success",
  occupied: "primary",
  cleaning: "warning",
  maintenance: "secondary",
  out_of_service: "danger",
};
```

### 📦 Dependencias Necesarias

Para usar este patrón necesitas:

```bash
npm install swr next-auth sonner @nextui-org/react
```

### 🚀 Próximos Pasos

1. Aplicar el mismo patrón a otros hooks (useReservationList, useGuestList, etc.)
2. Crear componentes de tabla reutilizables que usen estos hooks
3. Documentar patrones de renderizado de celdas
4. Crear ejemplos de uso con NextUI Table

### 📚 Referencias

- Hook original: `src/hooks/useProductList.ts`
- Hook refactorizado: `src/hooks/useRoomList.ts`
- Utilidades: `src/lib/utils/functions.ts`
- Toasts: `src/components/toastUtils.ts`
- Paginación: `src/hooks/usePagination.ts`
