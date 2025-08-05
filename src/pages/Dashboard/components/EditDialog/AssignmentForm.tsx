import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import type { Employee } from "../../types";

interface AssignmentFormProps {
  selectedEmployeeId: string;
  onAssignEmployeeChange: (e: SelectChangeEvent<string>) => void;
  availableEmployees?: Employee[];
  getEmployeeDisplayName: (employee: Employee) => string;
  activeTable: string;
}

const AssignmentForm: React.FC<AssignmentFormProps> = ({
  selectedEmployeeId,
  onAssignEmployeeChange,
  availableEmployees,
  getEmployeeDisplayName,
  activeTable,
}) => {
  return (
    <FormControl fullWidth sx={{ mt: 2, fontSize: { xs: 16, sm: 18 } }}>
      <InputLabel id="assign-employee-label">
        {activeTable === "orders" ? "Employee" : "Chef"}
      </InputLabel>
      <Select
        labelId="assign-employee-label"
        value={selectedEmployeeId}
        label={activeTable === "orders" ? "Employee" : "Chef"}
        onChange={onAssignEmployeeChange}
        sx={{ fontSize: { xs: 16, sm: 18 } }}
      >
        {availableEmployees?.map((emp) => (
          <MenuItem key={emp.id} value={emp.id}>
            {getEmployeeDisplayName(emp)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default AssignmentForm;
