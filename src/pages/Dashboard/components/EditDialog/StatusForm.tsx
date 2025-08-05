import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

interface StatusFormProps {
  selectedStatus: string;
  onStatusChange: (e: SelectChangeEvent<string>) => void;
  activeTable: string;
  userRole?: string;
}

const StatusForm: React.FC<StatusFormProps> = ({
  selectedStatus,
  onStatusChange,
  activeTable,
  userRole,
}) => {
  const getStatusOptions = () => {
    if (activeTable === "employees") {
      return [
        <MenuItem key="active" value="active">
          Active
        </MenuItem>,
        <MenuItem key="inactive" value="inactive">
          Inactive
        </MenuItem>,
      ];
    } else if (activeTable === "orders") {
      return [
        <MenuItem key="pending" value="pending">
          Pending
        </MenuItem>,
        <MenuItem key="assigned" value="assigned">
          Assigned
        </MenuItem>,
        <MenuItem key="in-progress" value="in-progress">
          In Progress
        </MenuItem>,
        <MenuItem key="completed" value="completed">
          Completed
        </MenuItem>,
        <MenuItem key="cancelled" value="cancelled">
          Cancelled
        </MenuItem>,
      ];
    } else {
      // For reservations table
      if (userRole === "employee") {
        // Employees can only update to confirmed or completed
        return [
          <MenuItem key="confirmed" value="confirmed">
            Confirmed
          </MenuItem>,
          <MenuItem key="completed" value="completed">
            Completed
          </MenuItem>,
        ];
      } else {
        // Admin and users can see all status options
        return [
          <MenuItem key="pending" value="pending">
            Pending
          </MenuItem>,
          <MenuItem key="confirmed" value="confirmed">
            Confirmed
          </MenuItem>,
          <MenuItem key="completed" value="completed">
            Completed
          </MenuItem>,
          <MenuItem key="cancelled" value="cancelled">
            Cancelled
          </MenuItem>,
        ];
      }
    }
  };

  return (
    <FormControl fullWidth sx={{ mt: 2, fontSize: { xs: 16, sm: 18 } }}>
      <InputLabel id="status-select-label">Status</InputLabel>
      <Select
        labelId="status-select-label"
        value={selectedStatus}
        label="Status"
        onChange={onStatusChange}
        sx={{ fontSize: { xs: 16, sm: 18 } }}
      >
        {getStatusOptions()}
      </Select>
    </FormControl>
  );
};

export default StatusForm;
