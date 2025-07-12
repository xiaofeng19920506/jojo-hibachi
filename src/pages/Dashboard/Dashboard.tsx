import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Pagination,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TableContainer,
  Paper,
  Button,
  AppBar,
  Toolbar,
} from "@mui/material";
import { useState, useMemo, useEffect } from "react";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { login, logout } from "../../features/userSlice";
import { useAppDispatch } from "../../utils/hooks";

interface CustomerEntry {
  id: string;
  name: string;
  date: string;
  address: string;
  price: number;
}

const mockData: CustomerEntry[] = [
  {
    id: "1",
    name: "Alice Johnson",
    date: "2025-07-10",
    address: "123 Maple St",
    price: 300,
  },
  {
    id: "2",
    name: "Bob Smith",
    date: "2025-06-15",
    address: "456 Oak St",
    price: 200,
  },
  {
    id: "3",
    name: "Charlie Brown",
    date: "2025-06-20",
    address: "789 Pine St",
    price: 400,
  },
];

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof CustomerEntry;
    direction: "asc" | "desc";
  }>({
    key: "date",
    direction: "desc",
  });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const handleSort = (key: keyof CustomerEntry) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleBookNow = () => {
    // Navigate to book now page
    console.log("Navigate to book now");
  };

  const handleProfile = () => {
    // Navigate to profile page
    console.log("Navigate to profile");
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("authToken");
  };

  const filteredSortedData = useMemo(() => {
    let result = [...mockData];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((entry) =>
        [entry.name, entry.address, entry.id].some((val) =>
          val.toLowerCase().includes(query)
        )
      );
    }

    if (startDate) {
      result = result.filter(
        (entry) => new Date(entry.date) >= new Date(startDate)
      );
    }
    if (endDate) {
      result = result.filter(
        (entry) => new Date(entry.date) <= new Date(endDate)
      );
    }

    result.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (sortConfig.key === "date") {
        const dateA = new Date(aVal as string).getTime();
        const dateB = new Date(bVal as string).getTime();
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
  }, [searchQuery, startDate, endDate, sortConfig]);

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

  // Get current time for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
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
      {/* Header */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          {/* Left side - Title and Greeting */}
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: "bold", mb: 0.5 }}
            >
              Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {getGreeting()}! Welcome back to your dashboard.
            </Typography>
          </Box>

          {/* Right side - Navigation */}
          <Box display="flex" gap={2} alignItems="center">
            <Button
              variant="contained"
              color="primary"
              onClick={handleBookNow}
              sx={{ textTransform: "none" }}
            >
              Book Now
            </Button>
            <Button
              variant="outlined"
              onClick={handleProfile}
              sx={{ textTransform: "none" }}
            >
              Profile
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
              sx={{ textTransform: "none" }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          p: 3,
        }}
      >
        {/* Filters */}
        <Box display="flex" gap={2} flexWrap="wrap" mb={3} alignItems="center">
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

        {/* Table Container */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            minHeight: 0,
          }}
        >
          <TableContainer component={Paper} sx={{ maxHeight: "100%" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {["name", "date", "address", "id", "price"].map((key) => (
                    <TableCell
                      key={key}
                      onClick={() => handleSort(key as keyof CustomerEntry)}
                      sx={{ cursor: "pointer", userSelect: "none" }}
                    >
                      <Box display="flex" alignItems="center" gap={0.5}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                        <Box display="flex" flexDirection="column" ml={0.25}>
                          <ArrowDropUpIcon
                            fontSize="small"
                            sx={{ m: 0, lineHeight: 1 }}
                            color={
                              sortConfig.key === key &&
                              sortConfig.direction === "asc"
                                ? "primary"
                                : "disabled"
                            }
                          />
                          <ArrowDropDownIcon
                            fontSize="small"
                            sx={{ m: 0, lineHeight: 1, mt: -1 }}
                            color={
                              sortConfig.key === key &&
                              sortConfig.direction === "desc"
                                ? "primary"
                                : "disabled"
                            }
                          />
                        </Box>
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.name}</TableCell>
                    <TableCell>
                      {new Date(entry.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{entry.address}</TableCell>
                    <TableCell>{entry.id}</TableCell>
                    <TableCell>${entry.price}</TableCell>
                  </TableRow>
                ))}
                {paginatedData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

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
