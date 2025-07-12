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
          dispatch(login());
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

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        p: 3,
      }}
    >
      <Typography variant="h5" mb={2}>
        Dashboard
      </Typography>

      <Box display="flex" gap={2} flexWrap="wrap" mb={2} alignItems="center">
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
        <TableContainer component={Paper}>
          <Table>
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

        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, page) => setCurrentPage(page)}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
