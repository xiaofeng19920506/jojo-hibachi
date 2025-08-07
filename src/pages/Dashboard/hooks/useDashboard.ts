import { useState, useMemo } from "react";
import { useAppSelector } from "../../../utils/hooks";
import {
  useUpdateReservationStatusMutation,
  useUpdateReservationMutation,
  useChangeUserRoleMutation,
  useGetAdminEmployeesQuery,
  useAssignChefToReservationMutation,
  useChangeEmployeeStatusMutation,
} from "../../../services/api";
import type { Employee } from "../types";
import type {
  SortableEntry,
  FoodEntry,
} from "../../../components/DataTable/types";
import { getAvailableActions } from "./dashboardUtils";
import { useCustomersData } from "./useCustomersData";
import { useEmployeesData } from "./useEmployeesData";
import { useReservationsData } from "./useReservationsData";
import { usePendingReservationsData } from "./usePendingReservationsData";
import { useFoodData } from "./useFoodData";
import { useDashboardDialog } from "./useDashboardDialog";
import { useDashboardTableNavigation } from "./useDashboardTableNavigation";
import { getGreeting } from "./dashboardUtils";
import { useDashboardFiltering } from "./useDashboardFiltering";
import { useDashboardActions } from "./useDashboardActions";

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

  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
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

  const {
    data: pendingReservationsData,
    pagination: pendingReservationsPagination,
    isLoading: pendingReservationsLoading,
    error: pendingReservationsError,
  } = usePendingReservationsData(
    activeTable,
    userRole,
    currentPage,
    itemsPerPage
  );

  const {
    foodData,
    isLoading: foodLoading,
    error: foodError,
    handleUpdateFood,
    handleDeleteFood,
    handleCreateFood,
    isUpdateLoading,
    isDeleteLoading,
    isCreateLoading,
  } = useFoodData();

  // All employees for assignment dropdowns (always available for admins)
  const { data: allEmployeesData } = useGetAdminEmployeesQuery(undefined, {
    skip: userRole !== "admin",
  });

  // Update mutation
  const [updateReservationStatus, { isLoading: updateStatusLoading }] =
    useUpdateReservationStatusMutation();
  const [changeUserRole, { isLoading: changeRoleLoading }] =
    useChangeUserRoleMutation();
  const [updateReservation] = useUpdateReservationMutation();
  const [assignChefToReservation] = useAssignChefToReservationMutation();
  const [changeEmployeeStatus] = useChangeEmployeeStatusMutation();

  // Get loading state
  const getLoadingState = (): boolean => {
    switch (activeTable) {
      case "reservations":
        return allReservationsLoading || updateStatusLoading;
      case "pending-reservations":
        return pendingReservationsLoading || updateStatusLoading;
      case "customers":
        return customersLoading || changeRoleLoading;
      case "employees":
        return employeesLoading;
      case "food":
        return (
          foodLoading || isUpdateLoading || isDeleteLoading || isCreateLoading
        );
      default:
        return false;
    }
  };

  const getErrorState = (): string | null => {
    switch (activeTable) {
      case "reservations":
        return allReservationsError ? "Failed to fetch reservations" : null;
      case "pending-reservations":
        return pendingReservationsError
          ? "Failed to fetch pending reservations"
          : null;
      case "customers":
        return customersError ? "Failed to fetch customers" : null;
      case "employees":
        return employeesError ? "Failed to fetch employees" : null;
      case "food":
        return foodError ? "Failed to fetch food items" : null;
      default:
        return null;
    }
  };

  const {
    handleActionClick,
    handleAssignEmployeeChange,
    handleStatusChange,
    handleDialogSave,
  } = useDashboardActions({
    activeTable,
    userRole,
    setDialogType: setDialogType as (
      type: import("./useDashboardActions").DialogType
    ) => void,
    setSelectedReservation,
    setEditFormData,
    setDialogOpen,
    setSelectedStatus,
    setSelectedEmployeeId,
    handleUpdateFood,
    handleDeleteFood,
    handleCreateFood: handleCreateFood as (
      data: Omit<FoodEntry, "id" | "createdAt" | "updatedAt" | "status">
    ) => Promise<void>,
    updateReservation,
    updateReservationStatus,
    assignChefToReservation,
    changeUserRole,
    changeEmployeeStatus,
    editFormData,
    selectedReservation,
    dialogType,
    selectedStatus,
    selectedEmployeeId,
    handleDialogClose,
  });

  // Utility functions
  const getAvailableTables = () => {
    switch (userRole) {
      case "user":
        return [{ value: "reservations", label: "My Reservations" }];
      case "employee":
        return [
          { value: "reservations", label: "My Reservations" },
          { value: "pending-reservations", label: "Pending Reservations" },
        ];
      case "admin":
        return [
          { value: "reservations", label: "All Reservations" },
          { value: "customers", label: "Customers" },
          { value: "employees", label: "Employees" },
          { value: "food", label: "Food Menu" },
        ];
      default:
        return [];
    }
  };

  // Utility function for employee display name
  const getEmployeeDisplayName = (employee: Employee) => {
    if (employee.name) return employee.name;
    if (employee.firstName && employee.lastName) {
      return `${employee.firstName} ${employee.lastName}`.trim();
    }
    if (employee.firstName) return employee.firstName;
    if (employee.lastName) return employee.lastName;
    return employee.email || "";
  };

  // Filtering, sorting, and pagination
  const { filteredSortedData, totalPages, paginatedData } =
    useDashboardFiltering({
      searchQuery,
      startDate,
      endDate,
      sortConfig,
      activeTable,
      statusFilter,
      allReservationsData: allReservationsData || [],
      pendingReservationsData: pendingReservationsData || [],
      pendingReservationsPagination: pendingReservationsPagination,
      customersData: customersData || [],
      employeesData: employeesData || [],
      foodData: foodData || [],
      itemsPerPage,
      currentPage,
    });

  // Memoize the getAvailableActions function to prevent unnecessary re-renders
  const memoizedGetAvailableActions = useMemo(() => {
    return (item: SortableEntry) =>
      getAvailableActions(
        item as unknown as Record<string, unknown>,
        userRole,
        activeTable
      );
  }, [userRole, activeTable]);

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
    setEditFormData,
    selectedEmployeeId,
    selectedStatus,
    loading: getLoadingState(),
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
    getAvailableActions: memoizedGetAvailableActions,
    getGreeting: () => getGreeting(user as unknown as Record<string, unknown>),
    // Add missing navigation/pagination
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    activeTable,
    setActiveTable,
    getEmployeeDisplayName,
    sortConfig,
  };
};
