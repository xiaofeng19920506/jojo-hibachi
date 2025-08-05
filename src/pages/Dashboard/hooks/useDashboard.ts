import { useState, useMemo } from "react";
import { useAppSelector } from "../../../utils/hooks";
import {
  useUpdateReservationStatusMutation,
  useChangeUserRoleMutation,
  useChangeEmployeeStatusMutation,
  useAssignChefToReservationMutation,
  useCancelReservationMutation,
  useUpdateReservationMutation,
  useGetAdminEmployeesQuery,
} from "../../../services/api";
import type { ReservationEntry, Employee, ReservationStatus } from "../types";
import type {
  SortableEntry,
  FoodEntry,
} from "../../../components/DataTable/types";
import { useCustomersData } from "./useCustomersData";
import { useEmployeesData } from "./useEmployeesData";
import { useReservationsData } from "./useReservationsData";
import { useFoodData } from "./useFoodData";
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

  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    ReservationStatus | "all" | string
  >("all");
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
  const [changeEmployeeStatus, { isLoading: changeEmployeeStatusLoading }] =
    useChangeEmployeeStatusMutation();
  const [assignChefToReservation, { isLoading: assignChefLoading }] =
    useAssignChefToReservationMutation();
  const [cancelReservation, { isLoading: cancelReservationLoading }] =
    useCancelReservationMutation();
  const [updateReservation, { isLoading: updateReservationLoading }] =
    useUpdateReservationMutation();

  // Get current data based on active table
  const getCurrentData = (): SortableEntry[] => {
    switch (activeTable) {
      case "reservations":
        return allReservationsData || [];
      case "customers":
        return customersData || [];
      case "employees":
        return (employeesData as SortableEntry[]) || [];
      case "food":
        return (foodData as SortableEntry[]) || [];
      default:
        return [];
    }
  };

  // Get loading state
  const getLoadingState = (): boolean => {
    switch (activeTable) {
      case "reservations":
        return (
          allReservationsLoading ||
          updateStatusLoading ||
          assignChefLoading ||
          cancelReservationLoading ||
          updateReservationLoading
        );
      case "customers":
        return customersLoading || changeRoleLoading;
      case "employees":
        return employeesLoading || changeEmployeeStatusLoading;
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

  const handleActionClick = (action: string, item: SortableEntry) => {
    switch (activeTable) {
      case "reservations":
        const reservation = item as ReservationEntry;
        switch (action.toLowerCase()) {
          case "edit":
            setDialogType("edit");
            setEditFormData({
              date: reservation.date,
              time: reservation.time,
              price: reservation.price,
              notes: reservation.notes || "",
            });
            setDialogOpen(true);
            break;
          case "cancel":
            setDialogType("cancel");
            setSelectedReservation(reservation);
            setDialogOpen(true);
            break;
          case "assign employee":
            setDialogType("assign");
            setSelectedReservation(reservation);
            setDialogOpen(true);
            break;
          case "update status":
            setDialogType("status");
            setSelectedReservation(reservation);
            setSelectedStatus(reservation.status || "pending");
            setDialogOpen(true);
            break;
          default:
            console.log(`Action ${action} not implemented for reservations`);
        }
        break;
      case "food":
        const food = item as FoodEntry;
        switch (action.toLowerCase()) {
          case "update":
            setDialogType("edit");
            setEditFormData({
              id: food.id,
              name: food.name,
              description: food.description,
              price: food.price,
              category: food.category,
              status: food.status,
              preparationTime: food.preparationTime,
              calories: food.calories,
            });
            setDialogOpen(true);
            break;
          case "delete":
            setDialogType("delete");
            setEditFormData({
              id: food.id,
              name: food.name,
              description: food.description,
              price: food.price,
              category: food.category,
              status: food.status,
            });
            setDialogOpen(true);
            break;
          default:
            console.log(`Action ${action} not implemented for food`);
        }
        break;
      default:
        console.log(
          `Action ${action} not implemented for table ${activeTable}`
        );
    }
  };

  const handleAssignEmployeeChange = (e: any) => {
    setSelectedEmployeeId(e.target.value);
  };

  const handleStatusChange = (e: any) => {
    setSelectedStatus(e.target.value);
  };

  const handleDialogSave = async () => {
    console.log("[handleDialogSave] Function called with:", {
      dialogType,
      activeTable,
      editFormData,
      selectedReservation,
    });

    // Allow add dialog and food edit/delete to proceed without selectedReservation
    if (
      !selectedReservation &&
      dialogType !== "add" &&
      !(dialogType === "edit" && activeTable === "food") &&
      !(dialogType === "delete" && activeTable === "food")
    )
      return;
    if (dialogType === "assign" && userRole !== "admin") {
      console.error("Only admins can assign employees");
      return;
    }
    if (
      dialogType === "status" &&
      activeTable === "reservations" &&
      userRole !== "admin" &&
      userRole !== "employee"
    ) {
      console.error("Only admins and employees can change reservation status");
      return;
    }

    try {
      if (dialogType === "edit") {
        if (activeTable === "orders") {
        } else if (activeTable === "reservations") {
          // Update reservation for users and employees
          if (!selectedReservation) {
            console.error("No reservation selected for update");
            return;
          }

          try {
            await updateReservation({
              id: selectedReservation.id,
              data: editFormData,
            }).unwrap();
            console.log("[handleDialogSave] Reservation update successful");
          } catch (error) {
            console.error(
              "[handleDialogSave] Reservation update failed:",
              error
            );
            throw error;
          }
        } else if (activeTable === "employees") {
          if (userRole !== "admin") {
            console.error("Only admins can edit employees");
            return;
          }
          // The original code had updateEmployee here, but updateEmployee is removed.
          // Assuming the intent was to update the employee status if it were still available.
          // Since updateEmployee is removed, this block will now only update the status
          // if the employee is the currently logged-in user.
          if (
            userRole === "admin" &&
            selectedReservation &&
            user?.id === selectedReservation.id
          ) {
            await updateReservationStatus({
              id: selectedReservation.id,
              status: selectedStatus,
            }).unwrap();
          }
        } else if (activeTable === "customers") {
        } else if (activeTable === "food") {
          // Update food item
          const foodId = (editFormData as any).id;
          if (!foodId) {
            console.error("No food item ID found for update");
            return;
          }

          try {
            console.log("[handleDialogSave] Updating food item:", {
              foodId: foodId,
              updates: editFormData,
            });

            await handleUpdateFood(foodId, editFormData as Partial<FoodEntry>);
            console.log("[handleDialogSave] Food item update successful");
          } catch (error) {
            console.error("[handleDialogSave] Food item update failed:", error);
            throw error;
          }
        } else {
          if (userRole === "admin" && selectedReservation) {
            await updateReservationStatus({
              id: selectedReservation.id,
              status: selectedStatus,
            }).unwrap();
          }
        }
      } else if (dialogType === "add" && activeTable === "food") {
        // Add new food item
        try {
          const foodData = editFormData as Partial<FoodEntry>;

          console.log("[handleDialogSave] Food data for validation:", foodData);

          // Validate required fields
          if (!foodData.name || foodData.name.trim() === "") {
            console.error("Name is required");
            throw new Error("Name is required");
          }
          if (!foodData.description || foodData.description.trim() === "") {
            console.error("Description is required");
            throw new Error("Description is required");
          }
          if (
            foodData.price === undefined ||
            foodData.price === null ||
            foodData.price < 0
          ) {
            console.error(
              "Price is required and must be greater than or equal to 0"
            );
            throw new Error(
              "Price is required and must be greater than or equal to 0"
            );
          }
          if (!foodData.category || foodData.category.trim() === "") {
            console.error("Category is required");
            throw new Error("Category is required");
          }

          const newFoodData = {
            name: foodData.name.trim(),
            description: foodData.description.trim(),
            price: Number(foodData.price),
            category: foodData.category,
          };

          console.log("[handleDialogSave] Sending food data:", newFoodData);
          await handleCreateFood(newFoodData);
          console.log("[handleDialogSave] Food item creation successful");
        } catch (error) {
          console.error("[handleDialogSave] Food item creation failed:", error);
          throw error;
        }
      } else if (dialogType === "delete" && activeTable === "food") {
        // Delete food item
        const foodId = (editFormData as any).id;
        if (!foodId) {
          console.error("No food item ID found for deletion");
          return;
        }

        try {
          console.log("[handleDialogSave] Deleting food item:", {
            foodId: foodId,
          });

          await handleDeleteFood(foodId);
          console.log("[handleDialogSave] Food item deletion successful");
        } catch (error) {
          console.error("[handleDialogSave] Food item deletion failed:", error);
          throw error;
        }
      } else if (
        dialogType === "role" &&
        (activeTable === "customers" || activeTable === "employees")
      ) {
        // Change user role (for customers or employees)
        if (!selectedReservation) {
          console.error("No user selected for role change");
          return;
        }
        await changeUserRole({
          userId: selectedReservation.id,
          role: (editFormData as { role: string }).role,
        }).unwrap();
      } else if (dialogType === "status" && activeTable === "employees") {
        if (userRole !== "admin") {
          console.error("Only admins can change employee status");
          return;
        }
        if (!selectedReservation) {
          console.error("No employee selected for status change");
          return;
        }
        // Use the correct mutation for employee status
        await changeEmployeeStatus({
          userId: selectedReservation.id,
          isActive: selectedStatus === "active",
        }).unwrap();
      } else if (dialogType === "status" && activeTable === "reservations") {
        if (userRole !== "admin" && userRole !== "employee") {
          console.error(
            "Only admins and employees can change reservation status"
          );
          return;
        }
        if (!selectedStatus) {
          console.error("No status selected for update");
          return;
        }
        if (!selectedReservation) {
          console.error("No reservation selected for status update");
          return;
        }

        try {
          await updateReservationStatus({
            id: selectedReservation.id,
            status: selectedStatus,
          }).unwrap();
        } catch (error) {
          console.error("[handleDialogSave] Status update failed:", error);
          throw error;
        }
      } else if (dialogType === "assign" && activeTable === "reservations") {
        if (userRole !== "admin") {
          console.error("Only admins can assign employees");
          return;
        }
        if (!selectedEmployeeId) {
          console.error("No employee selected for assignment");
          return;
        }
        if (!selectedReservation) {
          console.error("No reservation selected for assignment");
          return;
        }

        try {
          await assignChefToReservation({
            id: selectedReservation.id,
            chefId: selectedEmployeeId,
          }).unwrap();
        } catch (error) {
          console.error("[handleDialogSave] Assignment failed:", error);
          throw error;
        }
      } else if (dialogType === "cancel" && activeTable === "reservations") {
        if (!selectedReservation) {
          console.error("No reservation selected for cancellation");
          return;
        }

        try {
          await cancelReservation({
            id: selectedReservation.id,
          }).unwrap();
        } catch (error) {
          console.error("[handleDialogSave] Cancellation failed:", error);
          throw error;
        }
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
    return employee.email || "Unknown Employee";
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

  // Memoize the getAvailableActions function to prevent unnecessary re-renders
  const memoizedGetAvailableActions = useMemo(() => {
    return (item: SortableEntry) =>
      getAvailableActions(item, userRole, activeTable);
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
    loading:
      getLoadingState() ||
      updateStatusLoading ||
      changeRoleLoading ||
      changeEmployeeStatusLoading ||
      assignChefLoading ||
      cancelReservationLoading ||
      updateReservationLoading,
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
