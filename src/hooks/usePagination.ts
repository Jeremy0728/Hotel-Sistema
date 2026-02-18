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

  const setPageOnChange = (newPage: number) => {
    setPage(newPage);
  };

  const setRowsPerPageOnChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(1); // Reset to first page when changing rows per page
  };

  return {
    page,
    pages,
    rowsPerPage,
    setPageOnChange,
    setRowsPerPageOnChange,
  };
}
