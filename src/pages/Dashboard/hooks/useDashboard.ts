import { useState, useMemo } from "react";
import { useAppSelector } from "../../../utils/hooks";
import {
  useGetReservationsQuery,
  useGetCustomersQuery,
  useGetEmployeesQuery,
  useGetAllEmployeesQuery,
  useUpdateReservationAdminMutation,
  useUpdateReservationUserMutation,
  useUpdateReservationStatusMutation,
  useAssignEmployeeToReservationMutation,
  useUpdateEmployeeMutation,
  useGetAssignedReservationsQuery,
} from "../../../services/api";
import type { ReservationEntry, Employee, ReservationStatus } from "../types";
import type { SortableEntry } from "../../../components/DataTable/types";

export const useDashboard = () => {
  const { user, isInitialized } = useAppSelector((state) => state.user);
  const userRole = user?.role || "user";

  // Debug log for userRole
  console.log("[useDashboard] userRole:", userRole);

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

  // Debug log for activeTable
  console.log("[useDashboard] activeTable:", activeTable);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<
    "edit" | "assign" | "status" | "cancel"
  >("edit");
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

  // Always call both hooks
  const {
    data: allReservationsData,
    isLoading: allReservationsLoading,
    error: allReservationsError,
  } = useGetReservationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const {
    data: assignedReservationsData = [],
    isLoading: assignedReservationsLoading,
    error: assignedReservationsError,
  } = useGetAssignedReservationsQuery(undefined, {
    skip: userRole !== "employee" || activeTable !== "reservations",
  });

  // Select the correct data
  const reservationsData =
    userRole === "employee" && activeTable === "reservations"
      ? assignedReservationsData
      : allReservationsData;

  const reservationsLoading =
    userRole === "employee" && activeTable === "reservations"
      ? assignedReservationsLoading
      : allReservationsLoading;

  const reservationsError =
    userRole === "employee" && activeTable === "reservations"
      ? assignedReservationsError
      : allReservationsError;

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
  const { data: allEmployeesData } = useGetAllEmployeesQuery(undefined, {
    skip: userRole.toLowerCase() !== "admin",
  });

  // Update mutation
  const [updateReservationAdmin, { isLoading: updateReservationAdminLoading }] =
    useUpdateReservationAdminMutation();
  const [updateReservationUser, { isLoading: updateReservationUserLoading }] =
    useUpdateReservationUserMutation();
  const [updateReservationStatus, { isLoading: updateStatusLoading }] =
    useUpdateReservationStatusMutation();

  const [assignEmployeeToReservation, { isLoading: assignEmployeeLoading }] =
    useAssignEmployeeToReservationMutation();
  const [updateEmployee, { isLoading: updateEmployeeLoading }] =
    useUpdateEmployeeMutation();

  // Get current data based on active table
  const getCurrentData = (): SortableEntry[] => {
    switch (activeTable) {
      case "reservations":
        // For employees, reservationsData is already filtered by the API
        return reservationsData || [];
      case "customers":
        return customersData || [];
      case "employees":
        // If employee, attach assigned reservations to the employee entry
        if (userRole === "employee" && employeesData && user?.id) {
          return (employeesData as SortableEntry[]).map((emp) =>
            emp.id === user.id
              ? { ...emp, assignedReservations: assignedReservationsData }
              : emp
          );
        }
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
        case "assign":
        case "assignemployee":
          setSelectedEmployeeId(reservation.employeeId || "");
          setDialogType("assign");
          setDialogOpen(true);
          break;
        case "updatestatus":
        case "status":
          setSelectedStatus(reservation.status);
          setDialogType("status");
          setDialogOpen(true);
          break;
        case "cancel":
          setDialogType("cancel");
          setDialogOpen(true);
          break;
        default:
          break;
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
          break;
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
          break;
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
        }
      } else if (dialogType === "assign") {
        if (activeTable === "orders") {
        } else {
          // Assign employee to reservation (admin only)
          await assignEmployeeToReservation({
            id: selectedReservation.id,
            employeeId: selectedEmployeeId,
          }).unwrap();
        }
      } else if (dialogType === "status") {
        if (activeTable === "orders") {
        } else if (activeTable === "employees") {
          if (userRole !== "admin") {
            console.error("Only admins can change employee status");
            return;
          }
          await updateEmployee({
            id: selectedReservation.id,
            data: { status: selectedStatus },
          }).unwrap();
        } else {
          await updateReservationStatus({
            id: selectedReservation.id,
            status: selectedStatus,
          }).unwrap();
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
        if (activeTable === "reservations") {
          actions.push("edit");
        }
        break;
      case "admin":
        if (activeTable === "reservations") {
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
      updateReservationAdminLoading ||
      updateReservationUserLoading ||
      updateStatusLoading ||
      assignEmployeeLoading ||
      updateEmployeeLoading,
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
    getAvailableActions,
    getEmployeeDisplayName,
    getGreeting,
    // Add more as needed
  };
};
