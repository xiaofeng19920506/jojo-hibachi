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
import type { SortableEntry, TableType } from "./types";
import dayjs from "dayjs";

interface DataTableProps {
  tableType: TableType;
  data: SortableEntry[];
  onSort: (key: string) => void;
  sortConfig: { key: string; direction: "asc" | "desc" };
  onActionClick: (action: string, item: SortableEntry) => void;
  availableActions?: (item: SortableEntry) => string[];
  userRole?: string;
}

const DataTable: React.FC<DataTableProps> = ({
  tableType,
  data = [], // Default to empty array
  onSort,
  sortConfig,
  onActionClick,
  availableActions,
  userRole,
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
    // Close menu immediately to prevent showing other actions
    handleMenuClose();

    // Then handle the action
    if (selectedItem) {
      onActionClick(action, selectedItem);
    }
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

  // Fix columnMap to include all TableType keys
  const columnMap: Record<TableType, string[]> = {
    customers: ["name", "email", "phone", "address", "actions"],
    employees: [
      "name",
      "email",
      "role",
      "joinDate",
      "status",
      "ordersAssigned",
      "actions",
    ],
    reservations:
      userRole === "employee"
        ? [
            "id",
            "customerName",
            "address",
            "date",
            "time",
            "status",
            "price",
            "notes",
            "actions",
          ]
        : [
            "id",
            "customerName",
            "date",
            "time",
            "status",
            "employeeName",
            "price",
            "notes",
            "actions",
          ],
    orders: [
      "customerName",
      "service",
      "date",
      "status",
      "assignedEmployee",
      "price",
    ],
  };

  // Add type guard for address fields in getCellValue
  const getCellValue = (item: SortableEntry, col: string): string => {
    if ("status" in item && col === "status") return item.status;
    if ("name" in item && col === "name") {
      const name = item.name;
      if (!name || name.trim() === "") {
        return "Unknown";
      }
      return name.trim();
    }
    if ("date" in item && col === "date") {
      // Try to format as human-readable date
      const dateValue = item.date;
      if (!dateValue) return "-";
      // Use dayjs if available, fallback to Date
      try {
        return dayjs(dateValue).isValid()
          ? dayjs(dateValue).format("YYYY-MM-DD")
          : new Date(dateValue).toLocaleDateString();
      } catch {
        return dateValue;
      }
    }
    if ("time" in item && col === "time") return item.time;
    if ("price" in item && col === "price") return `$${item.price}`;
    if ("email" in item && col === "email") return item.email || "";
    if ("phone" in item && col === "phone") return item.phone || "";
    if ("role" in item && col === "role") return item.role;
    if (col === "address") {
      // Just return the address string if present
      if ("address" in item && item.address) {
        return item.address;
      }
      return "-";
    }
    if ("customerName" in item && col === "customerName") {
      const customerName = item.customerName;
      if (!customerName || customerName.trim() === "") {
        return "Unknown Customer";
      }
      return customerName.trim();
    }
    if ("employeeName" in item && col === "employeeName") {
      const employeeName = item.employeeName;
      if (!employeeName || employeeName.trim() === "") {
        return "Unassigned";
      }
      return employeeName.trim();
    }
    if ("assignedEmployee" in item && col === "assignedEmployee") {
      const assignedEmployee = item.assignedEmployee;
      if (!assignedEmployee || assignedEmployee.trim() === "") {
        return "Unassigned";
      }
      return assignedEmployee.trim();
    }
    if ("ordersAssigned" in item && col === "ordersAssigned")
      return `${item.ordersAssigned}`;
    if ("notes" in item && col === "notes") return item.notes || "-";
    if (col === "id") return item.id;
    return "-";
  };

  const getMenuItems = () => {
    // Only return menu items if we have both availableActions and selectedItem
    if (availableActions && selectedItem) {
      const items = availableActions(selectedItem);
      return items;
    }
    // Only use fallback if no availableActions function is provided
    if (!availableActions) {
      switch (tableType) {
        case "customers":
          return ["View Details"];
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
    }
    return [];
  };

  return (
    <Box position="relative">
      <TableContainer
        component={Paper}
        sx={{ width: "100%", overflowX: "auto", maxHeight: "100%" }}
      >
        <Table stickyHeader sx={{ minWidth: "max-content" }}>
          <TableHead>
            <TableRow>
              {columnMap[tableType].map((col) => (
                <TableCell
                  key={col}
                  onClick={
                    col !== "actions" &&
                    col !== "notes" &&
                    !(col === "id" && tableType === "reservations") &&
                    col !== "price"
                      ? () => onSort(col)
                      : undefined
                  }
                  sx={{
                    cursor:
                      col !== "actions" &&
                      col !== "notes" &&
                      !(col === "id" && tableType === "reservations") &&
                      col !== "price"
                        ? "pointer"
                        : "default",
                    userSelect: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Box display="flex" alignItems="center" gap={0.5}>
                    {col === "id" && tableType === "reservations"
                      ? "Reservation Id"
                      : col.charAt(0).toUpperCase() + col.slice(1)}
                    {col !== "actions" &&
                      col !== "notes" &&
                      !(col === "id" && tableType === "reservations") &&
                      col !== "price" && (
                        <Box display="flex" flexDirection="column" ml={0.25}>
                          <ArrowDropUpIcon
                            fontSize="small"
                            sx={{ m: 0, lineHeight: 1 }}
                            color={
                              sortConfig.key === col &&
                              sortConfig.direction === "asc"
                                ? "primary"
                                : "disabled"
                            }
                          />
                          <ArrowDropDownIcon
                            fontSize="small"
                            sx={{ m: 0, lineHeight: 1, mt: -1 }}
                            color={
                              sortConfig.key === col &&
                              sortConfig.direction === "desc"
                                ? "primary"
                                : "disabled"
                            }
                          />
                        </Box>
                      )}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                {columnMap[tableType].map((col) => (
                  <TableCell key={col} sx={{ whiteSpace: "nowrap" }}>
                    {col === "actions" ? (
                      availableActions && availableActions(item).length > 0 ? (
                        <IconButton onClick={(e) => handleMenuClick(e, item)}>
                          <MoreVertIcon />
                        </IconButton>
                      ) : null
                    ) : col === "status" && "status" in item ? (
                      <Chip
                        label={item.status}
                        color={getStatusColor(item.status)}
                        size="small"
                      />
                    ) : (
                      getCellValue(item, col)
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={columnMap[tableType].length} align="center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Mobile horizontal scroll shadow */}
      {/* Removed the Box with the gradient background to fix the grey spot */}

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
    </Box>
  );
};

export default DataTable;
