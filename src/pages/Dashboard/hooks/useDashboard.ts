import { useState, useEffect, useMemo } from "react";
import { useAppSelector } from "../../../utils/hooks";
import {
  useGetReservationsQuery,
  useGetUserReservationsQuery,
  useGetCustomersQuery,
  useGetEmployeesQuery,
  useGetAllEmployeesQuery,
  useUpdateReservationMutation,
  useUpdateReservationAdminMutation,
  useUpdateReservationUserMutation,
  useAssignEmployeeToReservationMutation,
  useUpdateEmployeeMutation,
  useUpdateCustomerMutation,
} from "../../../services/api";
import type { ReservationEntry, Employee, ReservationStatus } from "../types";
import type { SortableEntry } from "../../../components/DataTable/types";

export const useDashboard = () => {
  const { user, isInitialized } = useAppSelector((state) => state.user);
  const userRole = user?.role || "user";

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({
    key: "date",
    direction: "desc",
  });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [activeTable, setActiveTable] = useState<string>("reservations");
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | "all">(
    "all"
  );

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"edit" | "assign" | "status">(
    "edit"
  );
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedStatus, setSelectedStatus] =
    useState<ReservationStatus>("pending");

  // RTK Query hooks
  const shouldFetchEmployees =
    userRole.toLowerCase() === "admin" &&
    (activeTable === "employees" ||
      (dialogOpen &&
        dialogType === "assign" &&
        activeTable === "reservations"));

  const {
    data: reservationsData,
    isLoading: reservationsLoading,
    error: reservationsError,
  } = userRole === "admin"
    ? useGetReservationsQuery()
    : useGetUserReservationsQuery();

  const {
    data: customersData,
    isLoading: customersLoading,
    error: customersError,
  } = useGetCustomersQuery(undefined, {
    skip: activeTable !== "customers" || userRole.toLowerCase() !== "admin",
  });

  const {
    data: employeesData,
    isLoading: employeesLoading,
    error: employeesError,
  } = useGetEmployeesQuery(undefined, {
    skip: !shouldFetchEmployees,
  });

  // All employees for assignment dropdowns (always available for admins)
  const {
    data: allEmployeesData,
    isLoading: allEmployeesLoading,
    error: allEmployeesError,
  } = useGetAllEmployeesQuery(undefined, {
    skip: userRole.toLowerCase() !== "admin",
  });

  // Update mutation
  const [updateReservation, { isLoading: updateLoading }] =
    useUpdateReservationMutation();
  const [updateReservationAdmin, { isLoading: updateReservationAdminLoading }] =
    useUpdateReservationAdminMutation();
  const [updateReservationUser, { isLoading: updateReservationUserLoading }] =
    useUpdateReservationUserMutation();

  const [assignEmployeeToReservation, { isLoading: assignEmployeeLoading }] =
    useAssignEmployeeToReservationMutation();
  const [updateEmployee, { isLoading: updateEmployeeLoading }] =
    useUpdateEmployeeMutation();
  const [updateCustomer, { isLoading: updateCustomerLoading }] =
    useUpdateCustomerMutation();

  // Get current data based on active table
  const getCurrentData = (): SortableEntry[] => {
    switch (activeTable) {
      case "reservations":
        let reservationData = reservationsData || [];
        if (userRole === "employee" && reservationsData && user?.id) {
          reservationData = reservationsData.filter(
            (r) => r.employeeId === user.id || r.assignedChef === user.id
          );
        }
        return reservationData;
      case "customers":
        return customersData || [];
      case "orders":
        return reservationsData || [];
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
        return reservationsLoading;
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
        return reservationsError ? "Failed to fetch reservations" : null;
      case "customers":
        return customersError ? "Failed to fetch customers" : null;
      case "employees":
        return employeesError ? "Failed to fetch employees" : null;
      default:
        return null;
    }
  };

  // Event handlers
  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleActionClick = (action: string, item: SortableEntry) => {
    if (activeTable === "reservations") {
      const reservation = item as ReservationEntry;
      setSelectedReservation(reservation);

      switch (action) {
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
        case "assign":
          setSelectedEmployeeId(reservation.employeeId || "");
          setDialogType("assign");
          setDialogOpen(true);
          break;
        case "status":
          console.log("Status action clicked for:", reservation.status);
          setSelectedStatus(reservation.status);
          setDialogType("status");
          setDialogOpen(true);
          break;
        default:
        // No-op
      }
    } else if (activeTable === "orders") {
      const order = item as any;
      setSelectedReservation(order as any);

      switch (action) {
        case "edit":
          setEditFormData({
            date: order.date,
            price: order.price,
          });
          setDialogType("edit");
          setDialogOpen(true);
          break;
        case "assign":
          setSelectedEmployeeId(order.assignedEmployee || "");
          setDialogType("assign");
          setDialogOpen(true);
          break;
        case "status":
          setSelectedStatus(order.status as any);
          setDialogType("status");
          setDialogOpen(true);
          break;
        default:
        // No-op
      }
    } else if (activeTable === "employees") {
      const employee = item as any;
      setSelectedReservation(employee as any);

      switch (action) {
        case "edit":
          setEditFormData({
            status: employee.status,
            role: employee.role,
          });
          setDialogType("edit");
          setDialogOpen(true);
          break;
        case "status":
          setSelectedStatus(employee.status as any);
          setDialogType("status");
          setDialogOpen(true);
          break;
        default:
        // No-op
      }
    } else if (activeTable === "customers") {
      const customer = item as any;
      setSelectedReservation(customer as any);

      switch (action) {
        case "view":
          setEditFormData({
            address: customer.address,
            email: customer.email,
            phone: customer.phone,
          });
          setDialogType("edit");
          setDialogOpen(true);
          break;
        default:
        // No-op
      }
    } else {
      // No-op
    }
  };

  const handleEditFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    });
  };

  const handleAssignEmployeeChange = (e: any) => {
    setSelectedEmployeeId(e.target.value);
  };

  const handleStatusChange = (e: any) => {
    console.log("Status change triggered:", e.target.value);
    setSelectedStatus(e.target.value);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedReservation(null);
    setEditFormData({});
    setSelectedEmployeeId("");
    setSelectedStatus("pending");
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
      let successMessage = "";

      if (dialogType === "edit") {
        if (activeTable === "orders") {
          // Order update not implemented yet
          console.log("Order updates not implemented yet");
        } else if (activeTable === "employees") {
          if (userRole !== "admin") {
            console.error("Only admins can edit employees");
            return;
          }
          await updateEmployee({
            id: selectedReservation.id,
            data: editFormData,
          }).unwrap();
          successMessage = "Employee updated successfully";
        } else if (activeTable === "customers") {
          // Customer view only - no updates allowed
          console.log("Customer updates not allowed");
        } else {
          // Reservations - use role-appropriate mutation
          if (userRole === "admin") {
            await updateReservationAdmin({
              id: selectedReservation.id,
              data: editFormData,
            }).unwrap();
          } else {
            // For non-admin users, filter out restricted fields
            const restrictedData = { ...editFormData };
            delete restrictedData.price;
            delete restrictedData.status;
            delete restrictedData.employeeId;

            await updateReservationUser({
              id: selectedReservation.id,
              data: restrictedData,
            }).unwrap();
          }
          successMessage = "Reservation updated successfully";
        }
      } else if (dialogType === "assign") {
        if (activeTable === "orders") {
          // Order assignment not implemented yet
          console.log("Order assignment not implemented yet");
        } else {
          // Assign employee to reservation (admin only)
          await assignEmployeeToReservation({
            id: selectedReservation.id,
            employeeId: selectedEmployeeId,
          }).unwrap();
          successMessage = "Employee assigned successfully";
        }
      } else if (dialogType === "status") {
        if (activeTable === "orders") {
          // Order status update not implemented yet
          console.log("Order status updates not implemented yet");
        } else if (activeTable === "employees") {
          if (userRole !== "admin") {
            console.error("Only admins can change employee status");
            return;
          }
          await updateEmployee({
            id: selectedReservation.id,
            data: { status: selectedStatus },
          }).unwrap();
          successMessage = "Employee status updated successfully";
        } else {
          // Update reservation status (admin only)
          console.log("Updating reservation status to:", selectedStatus);
          await updateReservationAdmin({
            id: selectedReservation.id,
            data: { status: selectedStatus },
          }).unwrap();
          successMessage = "Reservation status updated successfully";
        }
      }

      console.log(successMessage);
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
          { value: "orders", label: "Orders" },
          { value: "employees", label: "Employees" },
        ];
      default:
        return [];
    }
  };

  const getAvailableActions = () => {
    const actions = [];

    switch (userRole) {
      case "user":
        if (activeTable === "reservations") {
          actions.push("edit");
        }
        break;
      case "employee":
        if (activeTable === "reservations" || activeTable === "orders") {
          actions.push("edit");
        }
        break;
      case "admin":
        if (activeTable === "reservations" || activeTable === "orders") {
          actions.push("edit");
          actions.push("assign");
          actions.push("status");
        } else if (activeTable === "employees") {
          actions.push("edit");
          actions.push("status");
        } else if (activeTable === "customers") {
          actions.push("view");
        }
        break;
    }

    return actions;
  };

  const getEmployeeDisplayName = (employee: Employee) => {
    if (employee.name) return employee.name;
    if (employee.firstName && employee.lastName) {
      return `${employee.firstName} ${employee.lastName}`;
    }
    return employee.email;
  };

  const getGreeting = () => {
    if (!user) return "Welcome";
    const name = user.firstName || user.lastName || user.email || "User";
    const hour = new Date().getHours();
    if (hour < 12) return `Good morning, ${name}`;
    if (hour < 18) return `Good afternoon, ${name}`;
    return `Good evening, ${name}`;
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
    if (
      (activeTable === "reservations" || activeTable === "orders") &&
      statusFilter !== "all"
    ) {
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

  // Effects
  useEffect(() => {
    if (!user || !isInitialized) return;
    const availableTables = getAvailableTables();
    if (!availableTables.some((t) => t.value === activeTable)) {
      setActiveTable(availableTables[0].value);
    }
  }, [userRole, user, isInitialized]);

  return {
    // State
    searchQuery,
    setSearchQuery,
    sortConfig,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    activeTable,
    setActiveTable,
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
      updateLoading ||
      updateReservationAdminLoading ||
      updateReservationUserLoading ||
      assignEmployeeLoading ||
      updateEmployeeLoading ||
      updateCustomerLoading,
    error: getErrorState(),
    userRole,
    user,
    isInitialized,
    employeesData, // Export employeesData
    allEmployeesData, // Export allEmployeesData for assignment dropdowns
    // Computed
    filteredSortedData,
    totalPages,
    paginatedData,
    getAvailableTables, // Return the function, not getAvailableTables()
    getGreeting: getGreeting(),
    // Handlers
    handleSort,
    handleActionClick,
    handleEditFormChange,
    handleAssignEmployeeChange,
    handleStatusChange,
    handleDialogClose,
    handleDialogSave,
    getAvailableActions,
    getEmployeeDisplayName,
  };
};
