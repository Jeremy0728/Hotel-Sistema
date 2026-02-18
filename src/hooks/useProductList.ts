import { useState, useMemo, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import type {
  ChipProps,
  Selection, SortDescriptor
} from "@heroui/react";
import { productApi } from '@/apis/product.api';
import usePagination from '@/hooks/usePagination';
import { Product } from '@/types/product';
import useSWR from 'swr';
import { deleteAllNullValues } from '@/lib/utils/functions';
import { showSuccessToast } from '@/components/toastUtils';
import { handleErrors } from '@/lib/utils/errors';

const INITIAL_VISIBLE_COLUMNS = ["code", "name", "description", "sale_price", "current_stock", "status", "actions"];
const columns = [
  { name: "CÓDIGO", uid: "code", sortable: true },
  { name: "NOMBRE", uid: "name", sortable: true },
  { name: "DESCRIPCIÓN", uid: "description", sortable: true },
  { name: "PRECIO", uid: "sale_price", sortable: true },
  { name: "STOCK", uid: "current_stock", sortable: true },
  { name: "ESTADO", uid: "status", sortable: true },
  { name: "ACCIONES", uid: "actions" },
];

const statusOptions = [
  { name: "Activo", uid: "active" },
  { name: "Inactivo", uid: "inactive" },
];

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  inactive: "danger",
};

export default function useProductList() {
  const { data: session, status } = useSession();
  const [totalData, setTotalData] = useState(0);
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [isLoadingDelete, setIsLoadingDelete] = useState(false)
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });
  const { page, pages, setPageOnChange, rowsPerPage } = usePagination({ totalAllData: totalData });

  // Create a unique key for this data request that includes filter values
  const key = useMemo(() => {
    if (status !== 'authenticated' || !session?.user?.accessToken) return null;
    
    // Include all dependencies in the key to trigger revalidation when any of them change
    const statusFilterValue = transformStatusFilter(statusFilter);
    const searchValue = filterValue.trim();
    
    return [
      `products-${page}-${rowsPerPage}-${searchValue}-${statusFilterValue}`,
      page,
      rowsPerPage,
      searchValue,
      statusFilterValue
    ];
  }, [status, session, page, rowsPerPage, statusFilter, filterValue]);

  // Helper function to transform status filter selection to boolean value
  function transformStatusFilter(statusFilter: Selection): boolean | undefined {
    if (statusFilter === "all") return undefined;
    const statusArray = Array.from(statusFilter);
    if (statusArray.length === 0 || statusArray.length === statusOptions.length) return undefined;
    return statusArray.includes("active");
  }

  // Use SWR for data fetching with caching
  const { data, error, isLoading, mutate } = useSWR(
    key,
    async ([, page, rowsPerPage, searchValue, statusFilterValue]: [string, number, number, string, boolean | undefined]) => {
      const data = await productApi.getProductsByPagination(
        page,
        rowsPerPage,
        deleteAllNullValues({ is_active: statusFilterValue, name: searchValue })
      );
      setTotalData(data.count || 0);
      return data.data;
    },
    {
      revalidateOnFocus: false, // Prevents refetch when tab gains focus
      revalidateOnMount: true,   // Fetch when component mounts
      dedupingInterval: 10000,   // Deduplicate requests within 10 seconds
      keepPreviousData: true,    // Keep previous data while fetching new data
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
    return [...filteredItems].sort((a: Product, b: Product) => {
      let first: string | number | boolean, second: string | number | boolean;

      switch (sortDescriptor.column) {
        case "code":
          first = a.code || "";
          second = b.code || "";
          break;
        case "name":
          first = a.name || "";
          second = b.name || "";
          break;
        case "description":
          first = a.description || "";
          second = b.description || "";
          break;
        case "sale_price":
          first = a.sale_price || 0;
          second = b.sale_price || 0;
          break;
        case "current_stock":
          first = a.current_stock || 0;
          second = b.current_stock || 0;
          break;
        case "status":
          first = a.is_active ? "active" : "inactive";
          second = b.is_active ? "active" : "inactive";
          break;
        default:
          first = a[sortDescriptor.column as keyof Product] as string | number | boolean;
          second = b[sortDescriptor.column as keyof Product] as string | number | boolean;
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

  const handleDeleteProduct = useCallback(async (productId: number) => {
    setIsLoadingDelete(true);
    try {
      const response = await productApi.deleteProduct(productId);
      showSuccessToast('Producto eliminado', response.message);
      mutate();
    } catch (error: unknown) {
      handleErrors(error);
    } finally {
      setIsLoadingDelete(false);
    }
  }, [mutate]);

  return {
    products: data || [],
    loading: isLoading,
    error,
    page,
    pages,
    setPageOnChange,
    rowsPerPage,
    totalData,
    refreshProducts: mutate,
    visibleColumns,
    setVisibleColumns,
    headerColumns,
    columns,
    statusOptions,
    onSearchChange,
    filteredItems,
    setFilterValue,
    statusFilter,
    setStatusFilter,
    sortDescriptor,
    setSortDescriptor,
    sortedItems,
    classNames,
    filterValue,
    statusColorMap,
    isLoadingDelete,
    handleDeleteProduct
  };
}
