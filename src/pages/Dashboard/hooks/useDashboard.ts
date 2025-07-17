import { useState, useMemo } from "react";
import { useAppSelector } from "../../../utils/hooks";
import {
  useUpdateReservationStatusMutation,
  useChangeUserRoleMutation,
  useChangeEmployeeStatusMutation,
} from "../../../services/api";
import type { ReservationEntry, Employee, ReservationStatus } from "../types";
import type { SortableEntry } from "../../../components/DataTable/types";
import { useCustomersData } from "./useCustomersData";
import { useEmployeesData } from "./useEmployeesData";
import { useReservationsData } from "./useReservationsData";
import { useDashboardDialog } from "./useDashboardDialog";
import { useDashboardTableNavigation } from "./useDashboardTableNavigation";
import { getAvailableActions, getGreeting } from "./dashboardUtils";

export const useDashboard = () => {
  // Table navigation, pagination, and sorting
  const {
    activeTable,
    setActiveTable,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    sortConfig,
    handleSort,
  } = useDashboardTableNavigation();

  const { user, isInitialized } = useAppSelector((state) => state.user);
  const userRole = user?.role || "user";

  // Debug log for userRole
  console.log("[useDashboard] userRole:", userRole);

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    ReservationStatus | "all" | string
  >("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // Debug log for activeTable
  console.log("[useDashboard] activeTable:", activeTable);

  // Dialog state and handlers
  const {
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
    handleDialogClose,
    handleEditFormChange,
  } = useDashboardDialog();

  // Fetch only the relevant data for the active table
  const {
    data: customersData,
    isLoading: customersLoading,
    error: customersError,
  } = useCustomersData(activeTable, userRole);

  const {
    data: employeesData,
    isLoading: employeesLoading,
    error: employeesError,
  } = useEmployeesData(activeTable, userRole);

  const {
    data: allReservationsData,
    isLoading: allReservationsLoading,
    error: allReservationsError,
  } = useReservationsData(activeTable, userRole);

  // All employees for assignment dropdowns (always available for admins)
  const { data: allEmployeesData } = useGetAdminEmployeesQuery(undefined, {
    skip: userRole !== "admin",
  });

  // Update mutation
  const [updateReservationStatus, { isLoading: updateStatusLoading }] =
    useUpdateReservationStatusMutation();
  const [changeUserRole, { isLoading: changeRoleLoading }] =
    useChangeUserRoleMutation();
  const [changeEmployeeStatus, { isLoading: changeEmployeeStatusLoading }] =
    useChangeEmployeeStatusMutation();

  // Get current data based on active table
  const getCurrentData = (): SortableEntry[] => {
    switch (activeTable) {
      case "reservations":
        return allReservationsData || [];
      case "customers":
        return customersData || [];
      case "employees":
        return (employeesData as SortableEntry[]) || [];
      default:
        return [];
    }
  };

  // Get loading state
  const getLoadingState = (): boolean => {
    switch (activeTable) {
      case "reservations":
        return allReservationsLoading;
      case "customers":
        return customersLoading;
      case "employees":
        return employeesLoading;
      default:
        return false;
    }
  };

  // Get error state
  const getErrorState = (): string | null => {
    switch (activeTable) {
      case "reservations":
        return allReservationsError ? "Failed to fetch reservations" : null;
      case "customers":
        return customersError ? "Failed to fetch customers" : null;
      case "employees":
        return employeesError ? "Failed to fetch employees" : null;
      default:
        return null;
    }
  };

  // Event handlers
  const handleActionClick = (action: string, item: SortableEntry) => {
    console.log("[handleActionClick] raw action:", action);
    const normalizedAction = action.toLowerCase().replace(/\s/g, "");
    console.log("[handleActionClick] normalizedAction:", normalizedAction);
    if (activeTable === "reservations") {
      const reservation = item as ReservationEntry;
      setSelectedReservation(reservation);

      switch (normalizedAction) {
        case "edit":
          setEditFormData({
            date: reservation.date,
            time: reservation.time,
            price: reservation.price,
            notes: reservation.notes || "",
          });
          setDialogType("edit");
          setDialogOpen(true);
          break;
        case "assignchef":
        case "assignemployee":
          setSelectedEmployeeId(reservation.employeeId || "");
          setDialogType("assign");
          setDialogOpen(true);
          break;
        case "changestatus":
        case "updatestatus":
        case "status":
          setSelectedStatus(reservation.status);
          setDialogType("status");
          setDialogOpen(true);
          break;
        default:
          break;
      }
    } else if (activeTable === "employees") {
      const employee = item as any;
      setSelectedReservation(employee as any);

      switch (action) {
        case "Change Status":
          setSelectedStatus(employee.status as any);
          setDialogType("status");
          setDialogOpen(true);
          break;
        case "Change Role":
          setEditFormData({
            role: employee.role as string,
          } as Partial<ReservationEntry> & { role: string });
          setDialogType("role");
          setDialogOpen(true);
          break;
        default:
          break;
      }
    } else if (activeTable === "customers") {
      const customer = item as any;
      setSelectedReservation(customer as any);

      switch (normalizedAction) {
        case "changerole":
          setEditFormData({
            role: customer.role as string,
          } as Partial<ReservationEntry> & { role: string });
          setDialogType("role");
          setDialogOpen(true);
          break;
        default:
          break;
      }
    } else {
      // No-op
    }
  };

  const handleAssignEmployeeChange = (e: any) => {
    setSelectedEmployeeId(e.target.value);
  };

  const handleStatusChange = (e: any) => {
    setSelectedStatus(e.target.value);
  };

  const handleDialogSave = async () => {
    if (!selectedReservation) return;

    // Role-based validation
    if (dialogType === "assign" && userRole !== "admin") {
      console.error("Only admins can assign employees");
      return;
    }

    if (
      dialogType === "status" &&
      activeTable === "reservations" &&
      userRole !== "admin"
    ) {
      console.error("Only admins can change reservation status");
      return;
    }

    try {
      if (dialogType === "edit") {
        if (activeTable === "orders") {
          // Order update not implemented yet
          console.log("Order updates not implemented yet");
        } else if (activeTable === "employees") {
          if (userRole !== "admin") {
            console.error("Only admins can edit employees");
            return;
          }
          // The original code had updateEmployee here, but updateEmployee is removed.
          // Assuming the intent was to update the employee status if it were still available.
          // Since updateEmployee is removed, this block will now only update the status
          // if the employee is the currently logged-in user.
          if (userRole === "admin" && user?.id === selectedReservation.id) {
            await updateReservationStatus({
              id: selectedReservation.id,
              status: selectedStatus,
            }).unwrap();
          }
        } else if (activeTable === "customers") {
          // Customer view only - no updates allowed
          console.log("Customer updates not allowed");
        } else {
          // Reservations - use role-appropriate mutation
          if (userRole === "admin") {
            await updateReservationStatus({
              id: selectedReservation.id,
              status: selectedStatus,
            }).unwrap();
          }
        }
      } else if (
        dialogType === "role" &&
        (activeTable === "customers" || activeTable === "employees")
      ) {
        // Change user role (for customers or employees)
        await changeUserRole({
          userId: selectedReservation.id,
          role: (editFormData as { role: string }).role,
        }).unwrap();
      } else if (dialogType === "status" && activeTable === "employees") {
        if (userRole !== "admin") {
          console.error("Only admins can change employee status");
          return;
        }
        // Use the correct mutation for employee status
        await changeEmployeeStatus({
          userId: selectedReservation.id,
          isActive: selectedStatus === "active",
        }).unwrap();
      }

      handleDialogClose();
    } catch (error: any) {
      const tableType =
        activeTable === "orders"
          ? "order"
          : activeTable === "employees"
          ? "employee"
          : activeTable === "customers"
          ? "customer"
          : "reservation";
      console.error(`Failed to update ${tableType}:`, error);
      // You could add a toast notification here for user feedback
    }
  };

  // Utility functions
  const getAvailableTables = () => {
    switch (userRole) {
      case "user":
        return [{ value: "reservations", label: "My Reservations" }];
      case "employee":
        return [{ value: "reservations", label: "My Reservations" }];
      case "admin":
        return [
          { value: "reservations", label: "All Reservations" },
          { value: "customers", label: "Customers" },
          { value: "employees", label: "Employees" },
        ];
      default:
        return [];
    }
  };

  // Utility function for employee display name
  const getEmployeeDisplayName = (employee: Employee) => {
    if (employee.name) return employee.name;
    if (employee.firstName && employee.lastName) {
      return `${employee.firstName} ${employee.lastName}`;
    }
    return employee.email;
  };

  // Computed data
  const filteredSortedData = useMemo(() => {
    let result = [...getCurrentData()];

    // Search filtering for all table types
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((entry) => {
        const searchableFields = Object.values(entry).map((val) =>
          String(val).toLowerCase()
        );
        return searchableFields.some((field) => field.includes(query));
      });
    }

    // Status filtering for reservations and orders
    if (activeTable === "reservations" && statusFilter !== "all") {
      result = result.filter(
        (entry) => (entry as ReservationEntry | any).status === statusFilter
      );
    }

    // Date filtering for all table types that have date fields
    if (startDate || endDate) {
      result = result.filter((entry) => {
        const dateField = (entry as any).date || (entry as any).joinDate;
        if (!dateField) return true; // Skip filtering if no date field

        const entryDate = new Date(dateField);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        return (!start || entryDate >= start) && (!end || entryDate <= end);
      });
    }

    // Sorting
    result.sort((a, b) => {
      const aVal = (a as any)[sortConfig.key];
      const bVal = (b as any)[sortConfig.key];

      if (sortConfig.key === "date" || sortConfig.key === "joinDate") {
        const dateA = new Date(aVal).getTime();
        const dateB = new Date(bVal).getTime();
        return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      return sortConfig.direction === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

    return result;
  }, [
    getCurrentData,
    searchQuery,
    startDate,
    endDate,
    sortConfig,
    activeTable,
    statusFilter,
    userRole,
  ]);

  const totalPages = Math.ceil(filteredSortedData.length / itemsPerPage);
  const paginatedData = filteredSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    // State
    searchQuery,
    setSearchQuery,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    statusFilter,
    setStatusFilter,
    dialogOpen,
    setDialogOpen,
    dialogType,
    setDialogType,
    selectedReservation,
    editFormData,
    selectedEmployeeId,
    selectedStatus,
    loading:
      getLoadingState() ||
      updateStatusLoading ||
      changeRoleLoading ||
      changeEmployeeStatusLoading,
    error: getErrorState(),
    userRole,
    user,
    isInitialized,
    employeesData, // Export employeesData
    allEmployeesData, // Export allEmployeesData for assignment dropdowns
    filteredSortedData,
    totalPages,
    paginatedData,
    // Handlers
    handleSort,
    handleActionClick,
    handleEditFormChange,
    handleAssignEmployeeChange,
    handleStatusChange,
    handleDialogClose,
    handleDialogSave,
    getAvailableTables,
    getAvailableActions: () => getAvailableActions(userRole, activeTable),
    getGreeting: () => getGreeting(user),
    // Add missing navigation/pagination
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    activeTable,
    setActiveTable,
    getEmployeeDisplayName,
  };
};
