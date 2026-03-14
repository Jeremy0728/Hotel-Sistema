import { useState, useMemo } from 'react';
import type { RoomStatus } from '@/types/hotel';
import { habitacionesApi } from '@/apis/habitaciones.api';
import toast from 'react-hot-toast';

interface Room {
  id: number;
  number: string;
  floor: number;
  status: string;
  notes?: string;
  roomType?: {
    id: number;
    name: string;
  };
}

interface RoomType {
  id: number;
  name: string;
}

interface UseRoomConfigOperationsProps {
  rooms: Room[];
  roomTypes: RoomType[];
  statusParam?: string | null;
  viewParam?: string | null;
  refreshRooms: () => void;
}

const validStatuses = new Set<RoomStatus>([
  'available',
  'occupied',
  'cleaning',
  'maintenance',
  'out_of_service',
]);

export function useRoomConfigOperations({
  rooms,
  roomTypes,
  statusParam,
  viewParam,
  refreshRooms,
}: UseRoomConfigOperationsProps) {
  const hasParamFilter = statusParam && validStatuses.has(statusParam as RoomStatus);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<RoomStatus | 'all'>(
    hasParamFilter ? (statusParam as RoomStatus) : viewParam === 'housekeeping' ? 'cleaning' : 'all'
  );
  const [typeFilter, setTypeFilter] = useState('all');
  const [floorFilter, setFloorFilter] = useState<number | 'all'>('all');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  // Opciones de tipos de habitación
  const roomTypeOptions = useMemo(() => {
    const types = [
      ...roomTypes.map((type) => type.name),
      ...rooms.map((room) => room.roomType?.name || '').filter(Boolean),
    ];
    return Array.from(new Set(types));
  }, [roomTypes, rooms]);

  // Pisos disponibles
  const floors = useMemo(
    () => Array.from(new Set(rooms.map((room) => room.floor))).sort((a, b) => a - b),
    [rooms]
  );

  // Filtrar habitaciones
  const filteredRooms = useMemo(
    () =>
      rooms.filter((room) => {
        const query = search.trim().toLowerCase();
        const matchesSearch =
          room.number.toLowerCase().includes(query) ||
          (room.roomType?.name || '').toLowerCase().includes(query);
        const matchesStatus = statusFilter === 'all' ? true : room.status === statusFilter;
        const matchesType =
          typeFilter === 'all' ? true : (room.roomType?.name || '') === typeFilter;
        const matchesFloor = floorFilter === 'all' ? true : room.floor === floorFilter;
        return matchesSearch && matchesStatus && matchesType && matchesFloor;
      }),
    [rooms, search, statusFilter, typeFilter, floorFilter]
  );

  const handleOpenCreate = () => {
    setEditingRoom(null);
    setFormOpen(true);
  };

  const handleOpenEdit = () => {
    if (!selectedRoom) return;
    setEditingRoom(selectedRoom);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingRoom(null);
  };

  const handleAddRoom = async (roomData: any) => {
    try {
      await habitacionesApi.crear({
        number: roomData.number,
        room_type_id: parseInt(roomData.type, 10),
        floor: roomData.floor,
        status: roomData.status,
        notes: roomData.notes || undefined,
        is_active: true,
      });
      toast.success('Habitación creada exitosamente');
      refreshRooms();
    } catch (error) {
      console.error('Error al crear habitación:', error);
      toast.error('Error al crear habitación');
      throw error;
    }
  };

  const handleUpdateRoom = async (id: number, roomData: any) => {
    try {
      await habitacionesApi.actualizar(id, {
        number: roomData.number,
        room_type_id: parseInt(roomData.type, 10),
        floor: roomData.floor,
        status: roomData.status,
        notes: roomData.notes || undefined,
      });
      toast.success('Habitación actualizada exitosamente');
      refreshRooms();
    } catch (error) {
      console.error('Error al actualizar habitación:', error);
      toast.error('Error al actualizar habitación');
      throw error;
    }
  };

  const handleSubmit = async (values: any) => {
    if (editingRoom) {
      await handleUpdateRoom(editingRoom.id, values);
    } else {
      await handleAddRoom(values);
    }
    handleCloseForm();
  };

  const handleSelectRoom = (room: Room) => {
    setSelectedRoom(room);
  };

  const handleCloseDetail = () => {
    setSelectedRoom(null);
  };

  return {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    floorFilter,
    setFloorFilter,
    selectedRoom,
    formOpen,
    editingRoom,
    roomTypeOptions,
    floors,
    filteredRooms,
    hasParamFilter,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseForm,
    handleSubmit,
    handleSelectRoom,
    handleCloseDetail,
  };
}
