import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

interface RoleFormProps {
  editFormData: { role?: string };
  onEditFormChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => void;
  activeTable: string;
}

const RoleForm: React.FC<RoleFormProps> = ({
  editFormData,
  onEditFormChange,
  activeTable,
}) => {
  if (activeTable !== "customers" && activeTable !== "employees") {
    return null;
  }

  return (
    <FormControl fullWidth sx={{ mt: 2, fontSize: { xs: 16, sm: 18 } }}>
      <InputLabel id="role-select-label">Role</InputLabel>
      <Select
        labelId="role-select-label"
        value={editFormData.role || "user"}
        label="Role"
        name="role"
        onChange={(e) => onEditFormChange(e as SelectChangeEvent<string>)}
        sx={{ fontSize: { xs: 16, sm: 18 } }}
      >
        <MenuItem value="user">User</MenuItem>
        <MenuItem value="employee">Employee</MenuItem>
        <MenuItem value="admin">Admin</MenuItem>
      </Select>
    </FormControl>
  );
};

export default RoleForm;
