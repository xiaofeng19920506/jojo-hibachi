// types.ts
export interface BaseEntry {
  id: string;
}

export interface CustomerEntry extends BaseEntry {
  name: string;
  email?: string;
  phone?: string;
  date: string;
  address: string;
  price: number;
}

export interface OrderEntry extends BaseEntry {
  customerName: string;
  service: string;
  date: string;
  status: "pending" | "assigned" | "in-progress" | "completed" | "cancelled";
  assignedEmployee: string;
  price: number;
}

export interface EmployeeEntry extends BaseEntry {
  name: string;
  email: string;
  role: "employee" | "admin";
  joinDate: string;
  status: "active" | "inactive";
  ordersAssigned: number;
}

export interface ReservationEntry extends BaseEntry {
  customerId: string;
  customerName: string;
  employeeId?: string;
  employeeName?: string;
  service: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
}

export interface FoodEntry extends BaseEntry {
  name: string;
  description: string;
  price: number;
  category: string;
  status: "active" | "inactive";
  image?: string;
  allergens?: string[];
  preparationTime?: number;
  calories?: number;
  createdAt: string;
  updatedAt: string;
}

export type TableType =
  | "customers"
  | "orders"
  | "employees"
  | "reservations"
  | "food";

export type SortableEntry =
  | CustomerEntry
  | OrderEntry
  | EmployeeEntry
  | ReservationEntry
  | FoodEntry;
