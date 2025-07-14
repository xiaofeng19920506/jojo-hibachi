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
  CircularProgress,
  Alert,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import { useState, useMemo, useEffect } from "react";
import { login, logout } from "../../features/userSlice";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import DataTable from "../../components/DataTable/DataTable";
import type {
  TableType,
  SortableEntry,
  CustomerEntry,
  OrderEntry,
  EmployeeEntry,
} from "../../components/DataTable/types";
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
  price: number; // Added price field
  notes?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  adult?: number;
  kids?: number;
  allergies?: string;
  eventType?: string;
  assignedChef?: string;
  timeStamp?: string;
}

// API response interface
interface ApiReservationData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  reservationDay: string;
  reservationMonth: string;
  reservationYear: string;
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
  price?: number; // Added price field
  assignedChef: string | null;
  timeStamp: string;
}

// Employee interface
interface Employee {
  id: string;
  name?: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

// API service functions
const apiService = {
  async fetchData(endpoint: string, token: string) {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}${endpoint}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    return response.json();
  },

  async getAllData(token: string) {
    return this.fetchData("/reservation", token);
  },

  async getUserData(token: string) {
    return this.fetchData("/reservation", token);
  },

  async updateReservation(id: string, data: any, token: string) {
    // Transform the data to match your API format
    const transformedData: any = {};

    if (data.service) transformedData.eventType = data.service;
    if (data.date) {
      const dateObj = new Date(data.date);
      transformedData.reservationDay = dateObj.getDate().toString();
      transformedData.reservationMonth = (dateObj.getMonth() + 1).toString();
      transformedData.reservationYear = dateObj.getFullYear().toString();
    }
    if (data.time) transformedData.time = data.time;
    if (data.status) transformedData.status = data.status;
    if (data.notes) transformedData.notes = data.notes;
    if (data.price !== undefined) transformedData.price = data.price; // Added price handling
    if (data.employeeId) transformedData.assignedChef = data.employeeId;

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/reservations/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transformedData),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update reservation: ${response.statusText}`);
    }

    return response.json();
  },

  async deleteReservation(id: string, token: string) {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/reservations/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete reservation: ${response.statusText}`);
    }

    return response.json();
  },

  async getEmployees(token: string) {
    return this.fetchData("/api/v1/employees", token);
  },
};

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
  //const [itemsPerPage, setItemsPerPage] = useState(5);
  const [itemsPerPage] = useState(5);
  const [activeTable, setActiveTable] = useState<TableType>("reservations");
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | "all">(
    "all"
  );
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationEntry | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"edit" | "assign" | "status">(
    "edit"
  );

  // Dialog form states
  const [editFormData, setEditFormData] = useState<Partial<ReservationEntry>>(
    {}
  );
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedStatus, setSelectedStatus] =
    useState<ReservationStatus>("pending");
  const [availableEmployees, setAvailableEmployees] = useState<Employee[]>([]);

  // API state
  const [data, setData] = useState<ReservationEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAppSelector((state) => state.user);
  const userRole = user?.role || "user";

  const transformApiData = (
    apiData: ApiReservationData[]
  ): ReservationEntry[] => {
    return apiData.map((item) => ({
      id: item._id,
      customerId: item._id,
      customerName: `${item.firstName} ${item.lastName}`,
      employeeId: item.assignedChef ?? undefined,
      employeeName: item.assignedChef ?? undefined,
      service: item.eventType || "Dining",
      date: `${item.reservationYear}-${item.reservationMonth.padStart(
        2,
        "0"
      )}-${item.reservationDay.padStart(2, "0")}`,
      time: item.time,
      status: item.status,
      price: item.price || 0, // Added price with default value
      notes: item.notes,
      phoneNumber: item.phoneNumber,
      address: item.address,
      city: item.city,
      state: item.state,
      zipCode: item.zipCode,
      adult: item.adult,
      kids: item.kids,
      allergies: item.allergies,
      eventType: item.eventType,
      assignedChef: item.assignedChef ?? "unAssigned",
      timeStamp: item.timeStamp,
    }));
  };

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

      if (userRole === "admin") {
        // Admin can see all data
        response = await apiService.getAllData(token);
      } else {
        // Regular users and employees see filtered data
        response = await apiService.getUserData(token);
      }

      if (response.status === "success") {
        const rawData = response.data.data || [];
        const transformedData = transformApiData(rawData);
        setData(transformedData);
      } else {
        setError("Failed to fetch data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch employees for assignment dialog
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
        setEditFormData({
          service: reservation.service,
          date: reservation.date,
          time: reservation.time,
          price: reservation.price, // Added price to edit form
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
  };

  // const handleBookNow = () => {
  //   console.log("Navigate to book now");
  //   // Add navigation logic here
  // };

  const getCurrentData = (): ReservationEntry[] => {
    // For now, we're only handling reservations
    // You can extend this to handle other table types
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
    if (activeTable !== "reservations") {
      console.log(item);
      return [];
    }

    //const reservation = item as ReservationEntry;
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
        let dateField = "";
        if (activeTable === "customers") {
          dateField = (entry as unknown as CustomerEntry).date;
        } else if (activeTable === "orders") {
          dateField = (entry as unknown as OrderEntry).date;
        } else if (activeTable === "employees") {
          dateField = (entry as unknown as EmployeeEntry).joinDate;
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
    data,
    searchQuery,
    startDate,
    endDate,
    sortConfig,
    activeTable,
    statusFilter,
    userRole,
  ]);

  // Verify token and fetch initial data
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
  }, [dispatch]);

  // Set default table based on user role
  useEffect(() => {
    const availableTables = getAvailableTables();
    if (availableTables.length > 0) {
      setActiveTable(availableTables[0].value as TableType);
    }
  }, [userRole]);

  // Fetch data when component mounts or when relevant dependencies change
  useEffect(() => {
    if (user && user.id) {
      fetchTableData();
    }
  }, [user, activeTable]);

  const totalPages = Math.ceil(filteredSortedData.length / itemsPerPage);
  const paginatedData = filteredSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getGreeting = () => {
    if (!user) return "Welcome";
    const hour = new Date().getHours();
    if (hour < 12) return `Good morning, ${user.firstName}`;
    if (hour < 18) return `Good afternoon, ${user.firstName}`;
    return `Good evening, ${user.firstName}`;
  };

  // Dialog form handlers
  const handleEditFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    });
  };

  const handleAssignEmployeeChange = (e: SelectChangeEvent<string>) => {
    setSelectedEmployeeId(e.target.value);
  };

  const handleStatusChange = (e: SelectChangeEvent<ReservationStatus>) => {
    setSelectedStatus(e.target.value);
  };

  const handleTableChange = (e: SelectChangeEvent<string>) => {
    setActiveTable(e.target.value as TableType);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e: SelectChangeEvent<string>) => {
    setStatusFilter(e.target.value as ReservationStatus | "all");
    setCurrentPage(1);
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
        await apiService.updateReservation(
          selectedReservation.id,
          editFormData,
          token
        );
      } else if (dialogType === "assign") {
        await apiService.updateReservation(
          selectedReservation.id,
          { employeeId: selectedEmployeeId },
          token
        );
      } else if (dialogType === "status") {
        await apiService.updateReservation(
          selectedReservation.id,
          { status: selectedStatus },
          token
        );
      }
      await fetchTableData();
      handleDialogClose();
    } catch (error) {
      setError("Failed to update reservation");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeDisplayName = (employee: Employee) => {
    if (employee.name) return employee.name;
    if (employee.firstName && employee.lastName) {
      return `${employee.firstName} ${employee.lastName}`;
    }
    return employee.email;
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <GlobalAppBar />
      <Box sx={{ flex: 1, p: 3, overflow: "auto" }}>
        <Typography variant="h4" mb={3}>
          {getGreeting()}
        </Typography>

        <Box mb={2} display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel id="table-select-label">Table</InputLabel>
            <Select
              labelId="table-select-label"
              value={activeTable}
              label="Table"
              onChange={handleTableChange}
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

          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
          />

          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
          />

          {activeTable === "reservations" && (
            <FormControl sx={{ minWidth: 140 }}>
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                label="Status"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          )}
        </Box>

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ flex: 1 }}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        ) : (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <Box sx={{ flex: 1, overflow: "auto" }}>
              <DataTable
                tableType={activeTable}
                data={paginatedData}
                onSort={handleSort}
                sortConfig={sortConfig}
                onActionClick={handleActionClick}
                availableActions={getAvailableActions}
              />
            </Box>
          </Box>
        )}

        <Box
          mt={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body2" color="text.secondary">
            Showing {paginatedData.length} of {filteredSortedData.length}{" "}
            entries
          </Typography>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, value) => setCurrentPage(value)}
            color="primary"
            shape="rounded"
            siblingCount={1}
            boundaryCount={1}
          />
        </Box>
      </Box>

      {/* Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {dialogType === "edit"
            ? "Edit Reservation"
            : dialogType === "assign"
            ? "Assign Chef"
            : "Update Status"}
        </DialogTitle>
        <DialogContent>
          {dialogType === "edit" && (
            <Box sx={{ pt: 1 }}>
              <TextField
                label="Service"
                name="service"
                fullWidth
                margin="normal"
                value={editFormData.service || ""}
                onChange={handleEditFormChange}
              />
              <TextField
                label="Date"
                name="date"
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                value={editFormData.date || ""}
                onChange={handleEditFormChange}
              />
              <TextField
                label="Time"
                name="time"
                type="time"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                value={editFormData.time || ""}
                onChange={handleEditFormChange}
              />
              <TextField
                label="Price"
                name="price"
                type="number"
                fullWidth
                margin="normal"
                inputProps={{ min: 0, step: 0.01 }}
                value={editFormData.price || ""}
                onChange={handleEditFormChange}
                disabled={userRole !== "admin"}
                helperText={
                  userRole !== "admin" ? "Only admins can modify the price" : ""
                }
              />
              <TextField
                label="Notes"
                name="notes"
                fullWidth
                margin="normal"
                multiline
                rows={3}
                value={editFormData.notes || ""}
                onChange={handleEditFormChange}
              />
            </Box>
          )}

          {dialogType === "assign" && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="assign-employee-label">Chef</InputLabel>
              <Select
                labelId="assign-employee-label"
                value={selectedEmployeeId}
                label="Chef"
                onChange={handleAssignEmployeeChange}
              >
                {availableEmployees.map((emp) => (
                  <MenuItem key={emp.id} value={emp.id}>
                    {getEmployeeDisplayName(emp)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {dialogType === "status" && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="status-select-label">Status</InputLabel>
              <Select
                labelId="status-select-label"
                value={selectedStatus}
                label="Status"
                onChange={handleStatusChange}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDialogSave}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
