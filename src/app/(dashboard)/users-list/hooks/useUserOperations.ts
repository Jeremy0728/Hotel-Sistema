import { useState, useMemo } from 'react';
import { User } from '@/types/auth';

interface UseUserOperationsProps {
  users: User[];
}

export function useUserOperations({ users }: UseUserOperationsProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [pageSize, setPageSize] = useState(10);

  // Filtrar usuarios
  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase();
    return users.filter((user) => {
      const matchesSearch =
        (user.name || '').toLowerCase().includes(query) ||
        (user.email || '').toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'active'
          ? user.is_active
          : !user.is_active;
      return matchesSearch && matchesStatus;
    });
  }, [users, search, statusFilter]);

  // Paginación local
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredUsers.slice(start, end);
  }, [filteredUsers, currentPage, pageSize]);

  return {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    totalPages,
    filteredUsers,
    paginatedUsers,
  };
}
