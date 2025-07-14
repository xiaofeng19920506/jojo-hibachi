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

  const columnMap: Record<TableType, string[]> = {
    customers: ["name", "date", "address", "id", "price"],
    orders: [
      "id",
      "customerName",
      "service",
      "date",
      "status",
      "assignedEmployee",
      "price",
      "actions",
    ],
    employees: [
      "name",
      "email",
      "role",
      "joinDate",
      "status",
      "ordersAssigned",
      "actions",
    ],
    reservations: [
      "id",
      "customerName",
      "date",
      "time",
      "status",
      "employeeName",
      "actions",
    ],
  };

  const getCellValue = (item: SortableEntry, col: string): string => {
    if ("status" in item && col === "status") return item.status;
    if ("name" in item && col === "name") return item.name;
    if ("date" in item && col === "date") return item.date;
    if ("time" in item && col === "time") return item.time;
    if ("price" in item && col === "price") return `$${item.price}`;
    if ("email" in item && col === "email") return item.email;
    if ("role" in item && col === "role") return item.role;
    if ("address" in item && col === "address") return item.address;
    if ("customerName" in item && col === "customerName")
      return item.customerName;
    if ("employeeName" in item && col === "employeeName")
      return item.employeeName || "Unassigned";
    if ("assignedEmployee" in item && col === "assignedEmployee")
      return item.assignedEmployee;
    if ("ordersAssigned" in item && col === "ordersAssigned")
      return `${item.ordersAssigned}`;
    if (col === "id") return item.id;
    return "-";
  };

  const getMenuItems = () => {
    if (availableActions && selectedItem) {
      return availableActions(selectedItem);
    }
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

  return (
    <>
      <TableContainer component={Paper} sx={{ maxHeight: "100%" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columnMap[tableType].map((col) => (
                <TableCell
                  key={col}
                  onClick={col !== "actions" ? () => onSort(col) : undefined}
                  sx={{
                    cursor: col !== "actions" ? "pointer" : "default",
                    userSelect: "none",
                  }}
                >
                  <Box display="flex" alignItems="center" gap={0.5}>
                    {col.charAt(0).toUpperCase() + col.slice(1)}
                    {col !== "actions" && (
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
                  <TableCell key={col}>
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
