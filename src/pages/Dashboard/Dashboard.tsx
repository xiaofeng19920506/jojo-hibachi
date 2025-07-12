import {
  Box,
  TextField,
  Pagination,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";
import { useState, useMemo, useEffect } from "react";
import { login, logout } from "../../features/userSlice";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import DataTable, {
  type TableType,
  type SortableEntry,
  type CustomerEntry,
  type OrderEntry,
  type EmployeeEntry,
  mockCustomers,
  mockOrders,
  mockEmployees,
} from "../../components/DataTable/DataTable";
import GlobalAppBar from "../../components/GloabalAppBar/GlobalAppBar";

// Define reservation status types
type ReservationStatus = "pending" | "confirmed" | "completed" | "cancelled";

// Base interface that all entry types should extend
interface BaseEntry {
  id: string;
}

interface ReservationEntry extends BaseEntry {
  customerId: string;
  customerName: string;
  employeeId?: string;
  employeeName?: string;
  service: string;
  date: string;
  time: string;
  status: ReservationStatus;
  notes?: string;
}
const mockReservations: ReservationEntry[] = [
  {
    id: "res001",
    customerId: "cust001",
    customerName: "John Doe",
    employeeId: "emp001",
    employeeName: "Sarah Johnson",
    service: "Hair Cut",
    date: "2024-02-15",
    time: "10:00 AM",
    status: "confirmed",
    notes: "Regular customer, prefers shorter cut",
  },
  {
    id: "res002",
    customerId: "cust002",
    customerName: "Jane Smith",
    service: "Manicure",
    date: "2024-02-16",
    time: "2:00 PM",
    status: "pending",
    notes: "First time customer",
  },
  {
    id: "res003",
    customerId: "cust001",
    customerName: "John Doe",
    employeeId: "emp002",
    employeeName: "Mike Wilson",
    service: "Beard Trim",
    date: "2024-02-17",
    time: "3:30 PM",
    status: "completed",
  },
  {
    id: "res004",
    customerId: "cust003",
    customerName: "Alice Brown",
    employeeId: "emp001",
    employeeName: "Sarah Johnson",
    service: "Hair Color",
    date: "2024-02-18",
    time: "11:00 AM",
    status: "confirmed",
    notes: "Wants blonde highlights",
  },
  {
    id: "res005",
    customerId: "cust004",
    customerName: "Bob Johnson",
    service: "Shampoo & Style",
    date: "2024-02-19",
    time: "1:00 PM",
    status: "pending",
  },
];

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
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
  const [activeTable, setActiveTable] = useState<TableType>("customers");
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | "all">(
    "all"
  );
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationEntry | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"edit" | "assign" | "status">(
    "edit"
  );

  const { user } = useAppSelector((state) => state.user);

  // Get user role - assuming it's stored in user object
  const userRole = user?.role || "user"; // "user", "employee", "admin"

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleActionClick = (action: string, item: SortableEntry) => {
    const reservation = item as ReservationEntry;
    setSelectedReservation(reservation);

    switch (action) {
      case "edit":
        setDialogType("edit");
        setDialogOpen(true);
        break;
      case "cancel":
        handleCancelReservation(reservation);
        break;
      case "assign":
        setDialogType("assign");
        setDialogOpen(true);
        break;
      case "status":
        setDialogType("status");
        setDialogOpen(true);
        break;
      default:
        console.log(`Action: ${action}`, item);
    }
  };

  const handleCancelReservation = async (reservation: ReservationEntry) => {
    try {
      // API call to cancel reservation
      console.log("Cancelling reservation:", reservation.id);
      // Update local state or refresh data
    } catch (error) {
      console.error("Error cancelling reservation:", error);
    }
  };

  const handleBookNow = () => {
    console.log("Navigate to book now");
  };

  const getReservationData = () => {
    switch (userRole) {
      case "user":
        // User can only see their own reservations
        return mockReservations.filter((res) => res.customerId === user.id);
      case "employee":
        // Employee can see reservations assigned to them
        return mockReservations.filter((res) => res.employeeId === user.id);
      case "admin":
        // Admin can see all reservations
        return mockReservations;
      default:
        return [];
    }
  };

  const getCurrentData = () => {
    if (activeTable === "reservations") {
      return getReservationData();
    }

    switch (activeTable) {
      case "customers":
        return userRole === "admin" ? mockCustomers : [];
      case "orders":
        return userRole === "admin" ? mockOrders : [];
      case "employees":
        return userRole === "admin" ? mockEmployees : [];
      default:
        return [];
    }
  };

  const getAvailableTables = () => {
    switch (userRole) {
      case "user":
        return [{ value: "reservations", label: "My Reservations" }];
      case "employee":
        return [{ value: "reservations", label: "My Assignments" }];
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
    if (activeTable !== "reservations") {
      return []; // No actions for non-reservation tables for now
    }

    const reservation = item as ReservationEntry;
    const actions = [];

    switch (userRole) {
      case "user":
        // Users can edit and cancel their pending reservations
        if (reservation.status === "pending") {
          actions.push("edit", "cancel");
        }
        break;
      case "employee":
        // Employees can update status of their assigned reservations
        if (reservation.employeeId === user.id) {
          actions.push("status");
        }
        break;
      case "admin":
        // Admin can do everything
        actions.push("edit");
        if (reservation.status === "pending") {
          actions.push("cancel");
        }
        if (!reservation.employeeId) {
          actions.push("assign");
        }
        actions.push("status");
        break;
    }

    return actions;
  };

  const filteredSortedData = useMemo(() => {
    let result = [...getCurrentData()];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((entry) => {
        const searchableFields = Object.values(entry).map((val) =>
          String(val).toLowerCase()
        );
        return searchableFields.some((field) => field.includes(query));
      });
    }

    // Status filter for reservations
    if (activeTable === "reservations" && statusFilter !== "all") {
      result = result.filter(
        (entry) => (entry as ReservationEntry).status === statusFilter
      );
    }

    if (startDate || endDate) {
      result = result.filter((entry) => {
        let dateField = "";
        if (activeTable === "customers") {
          dateField = (entry as CustomerEntry).date;
        } else if (activeTable === "orders") {
          dateField = (entry as OrderEntry).date;
        } else if (activeTable === "employees") {
          dateField = (entry as EmployeeEntry).joinDate;
        } else if (activeTable === "reservations") {
          dateField = (entry as ReservationEntry).date;
        }

        const entryDate = new Date(dateField);
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
    searchQuery,
    startDate,
    endDate,
    sortConfig,
    activeTable,
    statusFilter,
    userRole,
  ]);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        dispatch(logout());
        return;
      }
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/auth/verifyToken`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok && data.status === "success") {
          dispatch(login(data.user));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        dispatch(logout());
      }
    };

    verifyToken();
  }, []);

  useEffect(() => {
    // Set default table based on user role
    const availableTables = getAvailableTables();
    if (availableTables.length > 0) {
      setActiveTable(availableTables[0].value as TableType);
    }
  }, [userRole]);

  const totalPages = Math.ceil(filteredSortedData.length / itemsPerPage);
  const paginatedData = filteredSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    const timeGreeting =
      hour < 12
        ? "Good morning"
        : hour < 17
        ? "Good afternoon"
        : "Good evening";
    return `${timeGreeting}, ${user.firstName}`;
  };

  const getRoleDisplayName = () => {
    switch (userRole) {
      case "admin":
        return "Administrator";
      case "employee":
        return "Employee";
      case "user":
        return "Customer";
      default:
        return "User";
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedReservation(null);
  };

  const handleDialogSave = () => {
    // Handle save based on dialog type
    console.log(`Saving ${dialogType} for reservation:`, selectedReservation);
    handleDialogClose();
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        bgcolor: "background.default",
      }}
    >
      <GlobalAppBar
        title={`${getRoleDisplayName()} Dashboard`}
        subtitle={`${getGreeting()}! Welcome back to your dashboard.`}
        showLogout={true}
      />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          p: 3,
        }}
      >
        <Box display="flex" gap={2} flexWrap="wrap" mb={3} alignItems="center">
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Table View</InputLabel>
            <Select
              value={activeTable}
              label="Table View"
              onChange={(e) => {
                setActiveTable(e.target.value as TableType);
                setCurrentPage(1);
              }}
            >
              {getAvailableTables().map((table) => (
                <MenuItem key={table.value} value={table.value}>
                  {table.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            sx={{ minWidth: 200 }}
          />

          {activeTable === "reservations" && (
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => {
                  setStatusFilter(e.target.value as ReservationStatus | "all");
                  setCurrentPage(1);
                }}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          )}

          <TextField
            type="date"
            label="Start Date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setCurrentPage(1);
            }}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            type="date"
            label="End Date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setCurrentPage(1);
            }}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              min: startDate || undefined,
            }}
          />

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Items per page</InputLabel>
            <Select
              value={itemsPerPage}
              label="Items per page"
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[5, 10, 20, 50].map((num) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {userRole === "admin" && activeTable === "reservations" && (
            <Button variant="contained" onClick={handleBookNow}>
              Create Reservation
            </Button>
          )}
        </Box>

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            minHeight: 0,
          }}
        >
          <DataTable
            tableType={activeTable}
            data={paginatedData}
            onSort={handleSort}
            sortConfig={sortConfig}
            onActionClick={handleActionClick}
            availableActions={getAvailableActions}
          />

          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={Math.max(totalPages, 1)}
              page={currentPage}
              onChange={(_, page) => setCurrentPage(page)}
              showFirstButton
              showLastButton
              siblingCount={1}
              boundaryCount={1}
            />
          </Box>
        </Box>
      </Box>

      {/* Dialog for editing/assigning/status updates */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogType === "edit" && "Edit Reservation"}
          {dialogType === "assign" && "Assign Employee"}
          {dialogType === "status" && "Update Status"}
        </DialogTitle>
        <DialogContent>
          {selectedReservation && (
            <Box sx={{ pt: 2 }}>
              <Box sx={{ mb: 2 }}>
                <strong>Reservation ID:</strong> {selectedReservation.id}
              </Box>
              <Box sx={{ mb: 2 }}>
                <strong>Customer:</strong> {selectedReservation.customerName}
              </Box>
              <Box sx={{ mb: 2 }}>
                <strong>Service:</strong> {selectedReservation.service}
              </Box>
              <Box sx={{ mb: 2 }}>
                <strong>Date & Time:</strong> {selectedReservation.date} at{" "}
                {selectedReservation.time}
              </Box>
              <Box sx={{ mb: 2 }}>
                <strong>Status:</strong>
                <Chip
                  label={selectedReservation.status}
                  color={
                    selectedReservation.status === "confirmed"
                      ? "success"
                      : selectedReservation.status === "pending"
                      ? "warning"
                      : "default"
                  }
                  sx={{ ml: 1 }}
                />
              </Box>
              {selectedReservation.employeeName && (
                <Box sx={{ mb: 2 }}>
                  <strong>Assigned Employee:</strong>{" "}
                  {selectedReservation.employeeName}
                </Box>
              )}

              {/* Add form fields based on dialog type */}
              {dialogType === "edit" && (
                <Box>
                  <TextField
                    fullWidth
                    label="Notes"
                    multiline
                    rows={3}
                    defaultValue={selectedReservation.notes || ""}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    type="date"
                    label="Date"
                    defaultValue={selectedReservation.date}
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Time"
                    defaultValue={selectedReservation.time}
                    sx={{ mb: 2 }}
                  />
                </Box>
              )}

              {dialogType === "assign" && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Select Employee</InputLabel>
                  <Select label="Select Employee">
                    {mockEmployees.map((emp) => (
                      <MenuItem key={emp.id} value={emp.id}>
                        {emp.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {dialogType === "status" && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    label="Status"
                    defaultValue={selectedReservation.status}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="confirmed">Confirmed</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleDialogSave} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
