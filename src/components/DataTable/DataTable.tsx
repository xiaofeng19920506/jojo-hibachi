import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
} from "@mui/material";
import { useState } from "react";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// Base interface that all entry types extend
interface BaseEntry {
  id: string;
}

// Types
export interface CustomerEntry extends BaseEntry {
  name: string;
  date: string;
  address: string;
  price: number;
}

export interface OrderEntry extends BaseEntry {
  customerName: string;
  service: string;
  date: string;
  status: "pending" | "assigned" | "in-progress" | "completed" | "cancelled";
  assignedEmployee: string;
  price: number;
}

export interface EmployeeEntry extends BaseEntry {
  name: string;
  email: string;
  role: "employee" | "admin";
  joinDate: string;
  status: "active" | "inactive";
  ordersAssigned: number;
}

// Add reservation entry type
export interface ReservationEntry extends BaseEntry {
  customerId: string;
  customerName: string;
  employeeId?: string;
  employeeName?: string;
  service: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
}

export type TableType = "customers" | "orders" | "employees" | "reservations";
export type SortableEntry =
  | CustomerEntry
  | OrderEntry
  | EmployeeEntry
  | ReservationEntry;

// Mock Data
export const mockCustomers: CustomerEntry[] = [
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

export const mockOrders: OrderEntry[] = [
  {
    id: "ORD-001",
    customerName: "Alice Johnson",
    service: "House Cleaning",
    date: "2025-07-15",
    status: "pending",
    assignedEmployee: "Unassigned",
    price: 150,
  },
  {
    id: "ORD-002",
    customerName: "Bob Smith",
    service: "Carpet Cleaning",
    date: "2025-07-14",
    status: "in-progress",
    assignedEmployee: "John Doe",
    price: 200,
  },
  {
    id: "ORD-003",
    customerName: "Charlie Brown",
    service: "Window Cleaning",
    date: "2025-07-13",
    status: "completed",
    assignedEmployee: "Jane Smith",
    price: 100,
  },
];

export const mockEmployees: EmployeeEntry[] = [
  {
    id: "EMP-001",
    name: "John Doe",
    email: "john@example.com",
    role: "employee",
    joinDate: "2025-01-15",
    status: "active",
    ordersAssigned: 5,
  },
  {
    id: "EMP-002",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "employee",
    joinDate: "2025-02-01",
    status: "active",
    ordersAssigned: 3,
  },
  {
    id: "EMP-003",
    name: "Mike Wilson",
    email: "mike@example.com",
    role: "admin",
    joinDate: "2024-12-01",
    status: "active",
    ordersAssigned: 0,
  },
];

// Add mock reservations
export const mockReservations: ReservationEntry[] = [
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

// Table Component
interface DataTableProps {
  tableType: TableType;
  data: SortableEntry[];
  onSort: (key: string) => void;
  sortConfig: { key: string; direction: "asc" | "desc" };
  onActionClick: (action: string, item: SortableEntry) => void;
  availableActions?: (item: SortableEntry) => string[];
}

const DataTable: React.FC<DataTableProps> = ({
  tableType,
  data,
  onSort,
  sortConfig,
  onActionClick,
  availableActions,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<SortableEntry | null>(null);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    item: SortableEntry
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleAction = (action: string) => {
    if (selectedItem) {
      onActionClick(action, selectedItem);
    }
    handleMenuClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "assigned":
        return "info";
      case "in-progress":
        return "primary";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      case "confirmed":
        return "success";
      case "active":
        return "success";
      case "inactive":
        return "error";
      default:
        return "default";
    }
  };

  const renderTableHeaders = () => {
    switch (tableType) {
      case "customers":
        return ["name", "date", "address", "id", "price"].map((key) => (
          <TableCell
            key={key}
            onClick={() => onSort(key)}
            sx={{ cursor: "pointer", userSelect: "none" }}
          >
            <Box display="flex" alignItems="center" gap={0.5}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
              <Box display="flex" flexDirection="column" ml={0.25}>
                <ArrowDropUpIcon
                  fontSize="small"
                  sx={{ m: 0, lineHeight: 1 }}
                  color={
                    sortConfig.key === key && sortConfig.direction === "asc"
                      ? "primary"
                      : "disabled"
                  }
                />
                <ArrowDropDownIcon
                  fontSize="small"
                  sx={{ m: 0, lineHeight: 1, mt: -1 }}
                  color={
                    sortConfig.key === key && sortConfig.direction === "desc"
                      ? "primary"
                      : "disabled"
                  }
                />
              </Box>
            </Box>
          </TableCell>
        ));
      case "orders":
        return [
          "id",
          "customerName",
          "service",
          "date",
          "status",
          "assignedEmployee",
          "price",
          "actions",
        ].map((key) => (
          <TableCell
            key={key}
            onClick={key !== "actions" ? () => onSort(key) : undefined}
            sx={{
              cursor: key !== "actions" ? "pointer" : "default",
              userSelect: "none",
            }}
          >
            <Box display="flex" alignItems="center" gap={0.5}>
              {key === "customerName"
                ? "Customer"
                : key === "assignedEmployee"
                ? "Employee"
                : key.charAt(0).toUpperCase() + key.slice(1)}
              {key !== "actions" && (
                <Box display="flex" flexDirection="column" ml={0.25}>
                  <ArrowDropUpIcon
                    fontSize="small"
                    sx={{ m: 0, lineHeight: 1 }}
                    color={
                      sortConfig.key === key && sortConfig.direction === "asc"
                        ? "primary"
                        : "disabled"
                    }
                  />
                  <ArrowDropDownIcon
                    fontSize="small"
                    sx={{ m: 0, lineHeight: 1, mt: -1 }}
                    color={
                      sortConfig.key === key && sortConfig.direction === "desc"
                        ? "primary"
                        : "disabled"
                    }
                  />
                </Box>
              )}
            </Box>
          </TableCell>
        ));
      case "employees":
        return [
          "name",
          "email",
          "role",
          "joinDate",
          "status",
          "ordersAssigned",
          "actions",
        ].map((key) => (
          <TableCell
            key={key}
            onClick={key !== "actions" ? () => onSort(key) : undefined}
            sx={{
              cursor: key !== "actions" ? "pointer" : "default",
              userSelect: "none",
            }}
          >
            <Box display="flex" alignItems="center" gap={0.5}>
              {key === "joinDate"
                ? "Join Date"
                : key === "ordersAssigned"
                ? "Orders"
                : key.charAt(0).toUpperCase() + key.slice(1)}
              {key !== "actions" && (
                <Box display="flex" flexDirection="column" ml={0.25}>
                  <ArrowDropUpIcon
                    fontSize="small"
                    sx={{ m: 0, lineHeight: 1 }}
                    color={
                      sortConfig.key === key && sortConfig.direction === "asc"
                        ? "primary"
                        : "disabled"
                    }
                  />
                  <ArrowDropDownIcon
                    fontSize="small"
                    sx={{ m: 0, lineHeight: 1, mt: -1 }}
                    color={
                      sortConfig.key === key && sortConfig.direction === "desc"
                        ? "primary"
                        : "disabled"
                    }
                  />
                </Box>
              )}
            </Box>
          </TableCell>
        ));
      case "reservations":
        return [
          "id",
          "customerName",
          "service",
          "date",
          "time",
          "status",
          "employeeName",
          "actions",
        ].map((key) => (
          <TableCell
            key={key}
            onClick={key !== "actions" ? () => onSort(key) : undefined}
            sx={{
              cursor: key !== "actions" ? "pointer" : "default",
              userSelect: "none",
            }}
          >
            <Box display="flex" alignItems="center" gap={0.5}>
              {key === "customerName"
                ? "Customer"
                : key === "employeeName"
                ? "Employee"
                : key.charAt(0).toUpperCase() + key.slice(1)}
              {key !== "actions" && (
                <Box display="flex" flexDirection="column" ml={0.25}>
                  <ArrowDropUpIcon
                    fontSize="small"
                    sx={{ m: 0, lineHeight: 1 }}
                    color={
                      sortConfig.key === key && sortConfig.direction === "asc"
                        ? "primary"
                        : "disabled"
                    }
                  />
                  <ArrowDropDownIcon
                    fontSize="small"
                    sx={{ m: 0, lineHeight: 1, mt: -1 }}
                    color={
                      sortConfig.key === key && sortConfig.direction === "desc"
                        ? "primary"
                        : "disabled"
                    }
                  />
                </Box>
              )}
            </Box>
          </TableCell>
        ));
      default:
        return null;
    }
  };

  const renderTableRows = () => {
    return data.map((item) => (
      <TableRow key={item.id}>
        {tableType === "customers" && (
          <>
            <TableCell>{(item as CustomerEntry).name}</TableCell>
            <TableCell>
              {new Date((item as CustomerEntry).date).toLocaleDateString()}
            </TableCell>
            <TableCell>{(item as CustomerEntry).address}</TableCell>
            <TableCell>{item.id}</TableCell>
            <TableCell>${(item as CustomerEntry).price}</TableCell>
          </>
        )}
        {tableType === "orders" && (
          <>
            <TableCell>{item.id}</TableCell>
            <TableCell>{(item as OrderEntry).customerName}</TableCell>
            <TableCell>{(item as OrderEntry).service}</TableCell>
            <TableCell>
              {new Date((item as OrderEntry).date).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <Chip
                label={(item as OrderEntry).status}
                color={getStatusColor((item as OrderEntry).status)}
                size="small"
              />
            </TableCell>
            <TableCell>{(item as OrderEntry).assignedEmployee}</TableCell>
            <TableCell>${(item as OrderEntry).price}</TableCell>
            <TableCell>
              <IconButton onClick={(e) => handleMenuClick(e, item)}>
                <MoreVertIcon />
              </IconButton>
            </TableCell>
          </>
        )}
        {tableType === "employees" && (
          <>
            <TableCell>{(item as EmployeeEntry).name}</TableCell>
            <TableCell>{(item as EmployeeEntry).email}</TableCell>
            <TableCell>
              <Chip
                label={(item as EmployeeEntry).role}
                color={
                  (item as EmployeeEntry).role === "admin"
                    ? "primary"
                    : "default"
                }
                size="small"
              />
            </TableCell>
            <TableCell>
              {new Date((item as EmployeeEntry).joinDate).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <Chip
                label={(item as EmployeeEntry).status}
                color={getStatusColor((item as EmployeeEntry).status)}
                size="small"
              />
            </TableCell>
            <TableCell>{(item as EmployeeEntry).ordersAssigned}</TableCell>
            <TableCell>
              <IconButton onClick={(e) => handleMenuClick(e, item)}>
                <MoreVertIcon />
              </IconButton>
            </TableCell>
          </>
        )}
        {tableType === "reservations" && (
          <>
            <TableCell>{item.id}</TableCell>
            <TableCell>{(item as ReservationEntry).customerName}</TableCell>
            <TableCell>{(item as ReservationEntry).service}</TableCell>
            <TableCell>
              {new Date((item as ReservationEntry).date).toLocaleDateString()}
            </TableCell>
            <TableCell>{(item as ReservationEntry).time}</TableCell>
            <TableCell>
              <Chip
                label={(item as ReservationEntry).status}
                color={getStatusColor((item as ReservationEntry).status)}
                size="small"
              />
            </TableCell>
            <TableCell>
              {(item as ReservationEntry).employeeName || "Unassigned"}
            </TableCell>
            <TableCell>
              {availableActions && availableActions(item).length > 0 && (
                <IconButton onClick={(e) => handleMenuClick(e, item)}>
                  <MoreVertIcon />
                </IconButton>
              )}
            </TableCell>
          </>
        )}
      </TableRow>
    ));
  };

  const getMenuItems = () => {
    if (availableActions && selectedItem) {
      return availableActions(selectedItem);
    }

    // Fallback to default menu items
    switch (tableType) {
      case "orders":
        return [
          "Assign Employee",
          "Update Status",
          "View Details",
          "Edit Order",
          "Cancel Order",
        ];
      case "employees":
        return [
          "Change Role",
          "Update Status",
          "View Profile",
          "Edit Employee",
          "Reset Password",
        ];
      case "reservations":
        return ["Edit", "Cancel", "Assign Employee", "Update Status"];
      default:
        return [];
    }
  };

  const getColumnSpan = () => {
    switch (tableType) {
      case "customers":
        return 5;
      case "orders":
        return 8;
      case "employees":
        return 7;
      case "reservations":
        return 8;
      default:
        return 5;
    }
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ maxHeight: "100%" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>{renderTableHeaders()}</TableRow>
          </TableHead>
          <TableBody>
            {renderTableRows()}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={getColumnSpan()} align="center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {getMenuItems().map((action) => (
          <MenuItem key={action} onClick={() => handleAction(action)}>
            <ListItemText primary={action} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default DataTable;
