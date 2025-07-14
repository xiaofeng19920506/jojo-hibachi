import { useState, useMemo, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { logout } from "../../../features/userSlice";
import { apiService, transformApiData } from "../apiService";
import type { ReservationEntry, Employee, ReservationStatus } from "../types";
import type {
  SortableEntry,
  OrderEntry,
} from "../../../components/DataTable/types";

export const useDashboard = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
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
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationEntry | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<ReservationEntry>>(
    {}
  );
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedStatus, setSelectedStatus] =
    useState<ReservationStatus>("pending");
  const [availableEmployees, setAvailableEmployees] = useState<Employee[]>([]);

  // API state
  const [data, setData] = useState<SortableEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data fetching
  const fetchTableData = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      dispatch(logout());
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let response;
      let transformedData: SortableEntry[] = [];

      if (activeTable === "reservations") {
        if (userRole === "admin") {
          response = await apiService.getAllData(token);
        } else {
          response = await apiService.getUserData(token);
        }

        if (response.status === "success") {
          const rawData = response.data.data || [];
          transformedData = transformApiData(rawData);
        } else {
          setError("Failed to fetch data");
          return;
        }
      } else if (activeTable === "customers") {
        // For now, we'll create mock customer data from reservations
        // In a real app, you'd fetch customer data from a different endpoint
        if (userRole === "admin") {
          response = await apiService.getAllData(token);
        } else {
          response = await apiService.getUserData(token);
        }

        if (response.status === "success") {
          const rawData = response.data.data || [];
          const reservationData = transformApiData(rawData);

          // Transform reservation data to customer data
          transformedData = reservationData.map((reservation) => ({
            id: reservation.customerId,
            name: reservation.customerName,
            date: reservation.date,
            address: reservation.address || "N/A",
            price: reservation.price,
          }));
        } else {
          setError("Failed to fetch data");
          return;
        }
      } else if (activeTable === "orders") {
        // For now, we'll create mock order data from reservations
        // In a real app, you'd fetch order data from a different endpoint
        if (userRole === "admin") {
          response = await apiService.getAllData(token);
        } else {
          response = await apiService.getUserData(token);
        }

        if (response.status === "success") {
          const rawData = response.data.data || [];
          const reservationData = transformApiData(rawData);

          // Transform reservation data to order data
          transformedData = reservationData.map((reservation) => ({
            id: reservation.id,
            customerName: reservation.customerName,
            service: reservation.service,
            date: reservation.date,
            status: reservation.status as any,
            assignedEmployee: reservation.employeeName || "Unassigned",
            price: reservation.price,
          }));
        } else {
          setError("Failed to fetch data");
          return;
        }
      } else if (activeTable === "employees") {
        // For now, we'll create mock employee data
        // In a real app, you'd fetch employee data from a different endpoint
        transformedData = [
          {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
            role: "employee" as const,
            joinDate: "2023-01-15",
            status: "active" as const,
            ordersAssigned: 5,
          },
          {
            id: "2",
            name: "Jane Smith",
            email: "jane@example.com",
            role: "admin" as const,
            joinDate: "2023-02-20",
            status: "active" as const,
            ordersAssigned: 3,
          },
        ];
      }

      setData(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const response = await apiService.getEmployees(token);
      if (response.status === "success") {
        setAvailableEmployees(response.data || []);
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
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
          fetchEmployees();
          setDialogType("assign");
          setDialogOpen(true);
          break;
        case "status":
          setSelectedStatus(reservation.status);
          setDialogType("status");
          setDialogOpen(true);
          break;
        default:
          console.log(`Action: ${action}`, item);
      }
    } else if (activeTable === "orders") {
      const order = item as OrderEntry;
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
          fetchEmployees();
          setDialogType("assign");
          setDialogOpen(true);
          break;
        case "status":
          setSelectedStatus(order.status as any);
          setDialogType("status");
          setDialogOpen(true);
          break;
        default:
          console.log(`Action: ${action}`, item);
      }
    } else {
      console.log(`Action: ${action}`, item);
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
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      setLoading(true);
      if (dialogType === "edit") {
        if (activeTable === "orders") {
          console.log("Order update not implemented yet");
        } else {
          await apiService.updateReservation(
            selectedReservation.id,
            editFormData,
            token
          );
        }
      } else if (dialogType === "assign") {
        if (activeTable === "orders") {
          console.log("Order assignment not implemented yet");
        } else {
          await apiService.updateReservation(
            selectedReservation.id,
            { employeeId: selectedEmployeeId },
            token
          );
        }
      } else if (dialogType === "status") {
        if (activeTable === "orders") {
          console.log("Order status update not implemented yet");
        } else {
          await apiService.updateReservation(
            selectedReservation.id,
            { status: selectedStatus },
            token
          );
        }
      }
      await fetchTableData();
      handleDialogClose();
    } catch (error) {
      setError(
        `Failed to update ${activeTable === "orders" ? "order" : "reservation"}`
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Utility functions
  const getCurrentData = (): SortableEntry[] => {
    return data;
  };

  const getAvailableTables = () => {
    switch (userRole) {
      case "user":
        return [{ value: "reservations", label: "My Reservations" }];
      case "employee":
        return [
          { value: "reservations", label: "My Reservations" },
          { value: "orders", label: "My Orders" },
        ];
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

  const getAvailableActions = (item: SortableEntry) => {
    if (activeTable !== "reservations" && activeTable !== "orders") {
      return [];
    }

    const actions = [];

    switch (userRole) {
      case "user":
        actions.push("edit");
        break;
      case "employee":
        actions.push("edit");
        break;
      case "admin":
        actions.push("edit");
        actions.push("assign");
        actions.push("status");
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
    const hour = new Date().getHours();
    if (hour < 12) return `Good morning, ${user.firstName}`;
    if (hour < 18) return `Good afternoon, ${user.firstName}`;
    return `Good evening, ${user.firstName}`;
  };

  // Computed data
  const filteredSortedData = useMemo(() => {
    let result = [...getCurrentData()];

    if (userRole !== "user" && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((entry) => {
        const searchableFields = Object.values(entry).map((val) =>
          String(val).toLowerCase()
        );
        return searchableFields.some((field) => field.includes(query));
      });
    }

    if (activeTable === "reservations" && statusFilter !== "all") {
      result = result.filter(
        (entry) => (entry as ReservationEntry).status === statusFilter
      );
    }

    if (startDate || endDate) {
      result = result.filter((entry) => {
        const entryDate = new Date((entry as ReservationEntry).date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        return (!start || entryDate >= start) && (!end || entryDate <= end);
      });
    }

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
    data,
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
    const availableTables = getAvailableTables();
    if (availableTables.length > 0) {
      setActiveTable(availableTables[0].value);
    }
  }, [userRole]);

  useEffect(() => {
    if (user && user.id) {
      fetchTableData();
    }
  }, [user, activeTable]);

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
    availableEmployees,
    data,
    loading,
    error,
    userRole,
    user,

    // Computed
    filteredSortedData,
    totalPages,
    paginatedData,
    getAvailableTables: getAvailableTables(),
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
    fetchTableData,
  };
};
