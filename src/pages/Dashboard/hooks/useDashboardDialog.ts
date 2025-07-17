import { useState } from 'react';
import type { ReservationEntry, ReservationStatus } from '../types';

export function useDashboardDialog() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'edit' | 'assign' | 'status' | 'role'>('edit');
  const [selectedReservation, setSelectedReservation] = useState<ReservationEntry | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<ReservationEntry>>({});
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ReservationStatus>('pending');

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedReservation(null);
    setEditFormData({});
    setSelectedEmployeeId('');
    setSelectedStatus('pending');
  };

  const handleEditFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  return {
    dialogOpen,
    setDialogOpen,
    dialogType,
    setDialogType,
    selectedReservation,
    setSelectedReservation,
    editFormData,
    setEditFormData,
    selectedEmployeeId,
    setSelectedEmployeeId,
    selectedStatus,
    setSelectedStatus,
    handleDialogClose,
    handleEditFormChange,
  };
} 