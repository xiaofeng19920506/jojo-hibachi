// Define reservation status types
export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

// Base interface that all entry types should extend
export interface BaseEntry {
  id: string;
}

export interface ReservationEntry extends BaseEntry {
  customerId: string;
  customerName: string;
  employeeId?: string;
  employeeName?: string;
  service: string;
  date: string;
  time: string;
  status: ReservationStatus;
  price: number;
  notes?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  email?: string;
  adult?: number;
  kids?: number;
  allergies?: string;
  eventType?: string;
  assignedChef?: string;
  timeStamp?: string;
}

// Employee object structure from API
export interface ApiEmployeeData {
  _id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
}

// API response interface
export interface ApiReservationData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  reservationDate: {
    day: string;
    month: string;
    year: string;
  };
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  adult: number;
  kids: number;
  allergies: string;
  notes: string;
  eventType: string;
  time: string;
  status: ReservationStatus;
  price?: number;
  assignedChef: ApiEmployeeData | string | null;
  timeStamp: string;
}

// Employee interface
export interface Employee {
  id: string;
  name?: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface DialogState {
  open: boolean;
  type: "edit" | "assign" | "status";
  selectedReservation: ReservationEntry | null;
  editFormData: Partial<ReservationEntry>;
  selectedEmployeeId: string;
  selectedStatus: ReservationStatus;
}

export interface FilterState {
  searchQuery: string;
  startDate: string;
  endDate: string;
  statusFilter: ReservationStatus | "all";
  currentPage: number;
  itemsPerPage: number;
  activeTable: string;
}
