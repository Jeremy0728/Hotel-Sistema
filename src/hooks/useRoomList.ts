import { useState, useMemo, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import type { Selection, SortDescriptor } from "@nextui-org/react";
import { habitacionesApi } from '@/apis/habitaciones.api';

type ChipProps = {
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
};
import usePagination from '@/hooks/usePagination';
import useSWR from 'swr';
import { deleteAllNullValues } from '@/lib/utils/functions';
import { showSuccessToast } from '@/components/toastUtils';
import { handleErrors } from '@/lib/utils/errors';

const INITIAL_VISIBLE_COLUMNS = ["number", "floor", "room_type", "status", "actions"];

const columns = [
  { name: "NÚMERO", uid: "number", sortable: true },
  { name: "PISO", uid: "floor", sortable: true },
  { name: "TIPO", uid: "room_type", sortable: true },
  { name: "ESTADO", uid: "status", sortable: true },
  { name: "NOTAS", uid: "notes", sortable: false },
  { name: "ACCIONES", uid: "actions" },
];

const statusOptions = [
  { name: "Disponible", uid: "available" },
  { name: "Ocupada", uid: "occupied" },
  { name: "Limpieza", uid: "cleaning" },
  { name: "Mantenimiento", uid: "maintenance" },
  { name: "Fuera de servicio", uid: "out_of_service" },
];

const statusColorMap: Record<string, ChipProps["color"]> = {
  available: "success",
  occupied: "primary",
  cleaning: "warning",
  maintenance: "secondary",
  out_of_service: "danger",
};

interface Room {
  id: number;
  number: string;
  room_type_id: number;
  floor: number;
  status: "available" | "occupied" | "maintenance" | "cleaning" | "out_of_service";
  notes?: string;
  is_active: boolean;
  roomType?: {
    id: number;
    name: string;
    description?: string;
    base_price: string;
    max_occupancy: number;
    amenities?: Record<string, any>;
  };
}

export default function useRoomList() {
  const { data: session, status } = useSession();
  const [totalData, setTotalData] = useState(0);
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [floorFilter, setFloorFilter] = useState<Selection>("all");
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "number",
    direction: "ascending",
  });
  
  const { page, pages, setPageOnChange, rowsPerPage } = usePagination({ 
    totalAllData: totalData 
  });

  // Helper function to transform status filter selection
  function transformStatusFilter(statusFilter: Selection): string | undefined {
    if (statusFilter === "all") return undefined;
    const statusArray = Array.from(statusFilter);
    if (statusArray.length === 0 || statusArray.length === statusOptions.length) return undefined;
    return statusArray[0] as string;
  }

  // Helper function to transform floor filter selection
  function transformFloorFilter(floorFilter: Selection): number | undefined {
    if (floorFilter === "all") return undefined;
    const floorArray = Array.from(floorFilter);
    if (floorArray.length === 0) return undefined;
    return parseInt(floorArray[0] as string);
  }

  // Create a unique key for this data request
  const key = useMemo(() => {
    if (status !== 'authenticated' || !session?.user?.accessToken) return null;
    
    const statusFilterValue = transformStatusFilter(statusFilter);
    const floorFilterValue = transformFloorFilter(floorFilter);
    const searchValue = filterValue.trim();
    
    return [
      `rooms-${page}-${rowsPerPage}-${searchValue}-${statusFilterValue}-${floorFilterValue}`,
      page,
      rowsPerPage,
      searchValue,
      statusFilterValue,
      floorFilterValue
    ];
  }, [status, session, page, rowsPerPage, statusFilter, floorFilter, filterValue]);

  // Use SWR for data fetching with caching
  const { data, error, isLoading, mutate } = useSWR(
    key,
    async ([, page, rowsPerPage, searchValue, statusFilterValue, floorFilterValue]: 
      [string, number, number, string, string | undefined, number | undefined]) => {
      const response = await habitacionesApi.traerTodos(
        page,
        rowsPerPage,
        statusFilterValue
      );
      setTotalData(response.total || 0);
      
      // Filter by search and floor on client side if needed
      let filteredData = response.habitaciones;
      if (searchValue) {
        filteredData = filteredData.filter(room => 
          room.number.toLowerCase().includes(searchValue.toLowerCase())
        );
      }
      if (floorFilterValue !== undefined) {
        filteredData = filteredData.filter(room => room.floor === floorFilterValue);
      }
      
      return filteredData;
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      dedupingInterval: 10000,
      keepPreviousData: true,
    }
  );

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    return [...data || []];
  }, [data]);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
    setPageOnChange(1);
  }, [setPageOnChange]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a: Room, b: Room) => {
      let first: string | number | boolean;
      let second: string | number | boolean;

      switch (sortDescriptor.column) {
        case "number":
          first = a.number || "";
          second = b.number || "";
          break;
        case "floor":
          first = a.floor || 0;
          second = b.floor || 0;
          break;
        case "room_type":
          first = a.roomType?.name || "";
          second = b.roomType?.name || "";
          break;
        case "status":
          first = a.status || "";
          second = b.status || "";
          break;
        default:
          first = a[sortDescriptor.column as keyof Room] as string | number | boolean;
          second = b[sortDescriptor.column as keyof Room] as string | number | boolean;
      }

      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const classNames = useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-full"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: [
        "group-data-[first=true]/tr:first:before:rounded-none",
        "group-data-[first=true]/tr:last:before:rounded-none",
        "group-data-[middle=true]/tr:before:rounded-none",
        "group-data-[last=true]/tr:first:before:rounded-none",
        "group-data-[last=true]/tr:last:before:rounded-none",
      ],
    }),
    [],
  );

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

  const handleUpdateRoomStatus = useCallback(async (roomId: number, newStatus: string) => {
    setIsLoadingUpdate(true);
    try {
      await habitacionesApi.cambiarEstado(roomId, newStatus);
      showSuccessToast('Estado actualizado', 'El estado de la habitación ha sido actualizado');
      mutate();
    } catch (error: unknown) {
      handleErrors(error);
    } finally {
      setIsLoadingUpdate(false);
    }
  }, [mutate]);

  // Get unique floors for filter
  const floorOptions = useMemo(() => {
    const floors = new Set<number>();
    data?.forEach(room => floors.add(room.floor));
    return Array.from(floors).sort((a, b) => a - b).map(floor => ({
      name: `Piso ${floor}`,
      uid: floor.toString()
    }));
  }, [data]);

  return {
    rooms: data || [],
    loading: isLoading,
    error,
    page,
    pages,
    setPageOnChange,
    rowsPerPage,
    totalData,
    refreshRooms: mutate,
    visibleColumns,
    setVisibleColumns,
    headerColumns,
    columns,
    statusOptions,
    floorOptions,
    onSearchChange,
    filteredItems,
    setFilterValue,
    statusFilter,
    setStatusFilter,
    floorFilter,
    setFloorFilter,
    sortDescriptor,
    setSortDescriptor,
    sortedItems,
    classNames,
    filterValue,
    statusColorMap,
    isLoadingDelete,
    isLoadingUpdate,
    handleDeleteRoom,
    handleUpdateRoomStatus,
  };
}
