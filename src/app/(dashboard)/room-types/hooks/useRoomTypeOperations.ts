import { useState, useMemo } from 'react';

interface RoomType {
  id: number;
  name: string;
  description?: string;
  base_price: string;
  max_occupancy: number;
  amenities?: Record<string, unknown>;
  is_active: boolean;
}

interface UseRoomTypeOperationsProps {
  roomTypes: RoomType[];
  onAddRoomType?: (roomType: any) => Promise<void>;
  onUpdateRoomType?: (id: number, updates: any) => Promise<void>;
  onRemoveRoomType?: (id: number) => Promise<void>;
}

export function useRoomTypeOperations({
  roomTypes,
  onAddRoomType,
  onUpdateRoomType,
  onRemoveRoomType,
}: UseRoomTypeOperationsProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<RoomType | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RoomType | null>(null);

  const filteredRoomTypes = useMemo(() => {
    const query = search.toLowerCase();
    return roomTypes.filter((type) => {
      const matchesSearch =
        type.name.toLowerCase().includes(query) ||
        (type.description ?? '').toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'active'
          ? type.is_active
          : !type.is_active;
      return matchesSearch && matchesStatus;
    });
  }, [roomTypes, search, statusFilter]);

  const handleOpenCreate = () => {
    setEditingType(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (roomType: RoomType) => {
    setEditingType(roomType);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingType(null);
  };

  const handleSubmit = async (values: any) => {
    const amenities = values.amenities
      ? values.amenities
          .split(',')
          .map((item: string) => item.trim())
          .filter(Boolean)
      : [];

    if (editingType && onUpdateRoomType) {
      await onUpdateRoomType(editingType.id, { ...values, amenities });
    } else if (onAddRoomType) {
      await onAddRoomType({
        ...values,
        amenities,
      });
    }

    handleCloseDialog();
  };

  const handleOpenDelete = (roomType: RoomType) => {
    setDeleteTarget(roomType);
  };

  const handleCloseDelete = () => {
    setDeleteTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget && onRemoveRoomType) {
      await onRemoveRoomType(deleteTarget.id);
    }
    handleCloseDelete();
  };

  return {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    dialogOpen,
    editingType,
    deleteTarget,
    filteredRoomTypes,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseDialog,
    handleSubmit,
    handleOpenDelete,
    handleCloseDelete,
    handleConfirmDelete,
  };
}
