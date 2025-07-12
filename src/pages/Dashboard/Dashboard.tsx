import {
  Box,
  TextField,
  Pagination,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useState, useMemo, useEffect } from "react";
import { login, logout } from "../../features/userSlice";
import { useAppDispatch } from "../../utils/hooks";
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

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleActionClick = (action: string, item: SortableEntry) => {
    console.log(`Action: ${action}`, item);
    // Handle different actions based on table type and action
  };

  const handleBookNow = () => {
    console.log("Navigate to book now");
  };

  const getCurrentData = () => {
    switch (activeTable) {
      case "customers":
        return mockCustomers;
      case "orders":
        return mockOrders;
      case "employees":
        return mockEmployees;
      default:
        return [];
    }
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

    if (startDate || endDate) {
      result = result.filter((entry) => {
        let dateField = "";
        if (activeTable === "customers") {
          dateField = (entry as CustomerEntry).date;
        } else if (activeTable === "orders") {
          dateField = (entry as OrderEntry).date;
        } else if (activeTable === "employees") {
          dateField = (entry as EmployeeEntry).joinDate;
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
  }, [searchQuery, startDate, endDate, sortConfig, activeTable]);

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

  const totalPages = Math.ceil(filteredSortedData.length / itemsPerPage);
  const paginatedData = filteredSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Define action buttons for the AppBar
  const actionButtons = [
    {
      label: "Book Now",
      variant: "contained" as const,
      color: "primary" as const,
      onClick: handleBookNow,
    },
  ];

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
        title="Dashboard"
        subtitle={`${getGreeting()}! Welcome back to your dashboard.`}
        actionButtons={actionButtons}
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
              <MenuItem value="customers">Customers</MenuItem>
              <MenuItem value="orders">Orders</MenuItem>
              <MenuItem value="employees">Employees</MenuItem>
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
    </Box>
  );
};

export default Dashboard;
