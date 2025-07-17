import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Box,
} from "@mui/material";
import type { ReservationEntry, Employee } from "../types";

interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  dialogType: "edit" | "assign" | "status" | "cancel" | "role";
  activeTable: string;
  userRole: string;
  loading: boolean;
  editFormData: Partial<ReservationEntry>;
  onEditFormChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  selectedEmployeeId: string;
  onAssignEmployeeChange: (e: any) => void;
  selectedStatus: string;
  onStatusChange: (e: any) => void;
  availableEmployees?: Employee[];
  getEmployeeDisplayName: (employee: Employee) => string;
}

const EditDialog: React.FC<EditDialogProps> = ({
  open,
  onClose,
  onSave,
  dialogType,
  activeTable,
  userRole,
  loading,
  editFormData,
  onEditFormChange,
  selectedEmployeeId,
  onAssignEmployeeChange,
  selectedStatus,
  onStatusChange,
  availableEmployees,
  getEmployeeDisplayName,
}) => {
  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width:600px)").matches;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle>
        {dialogType === "edit"
          ? `Edit ${activeTable === "orders" ? "Order" : "Reservation"}`
          : dialogType === "assign"
          ? `Assign ${activeTable === "orders" ? "Employee" : "Chef"}`
          : dialogType === "role" && activeTable === "customers"
          ? "Change User Role"
          : "Update Status"}
      </DialogTitle>
      <DialogContent>
        {dialogType === "edit" && (
          <Box sx={{ pt: 1 }}>
            <TextField
              label="Date"
              name="date"
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true, style: { fontSize: 16 } }}
              value={editFormData.date || ""}
              onChange={onEditFormChange}
              sx={{ fontSize: { xs: 16, sm: 18 } }}
            />
            {activeTable === "reservations" && (
              <TextField
                label="Time"
                name="time"
                type="time"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true, style: { fontSize: 16 } }}
                value={editFormData.time || ""}
                onChange={onEditFormChange}
                sx={{ fontSize: { xs: 16, sm: 18 } }}
              />
            )}
            <TextField
              label="Price"
              name="price"
              type="number"
              fullWidth
              margin="normal"
              inputProps={{ min: 0, step: 0.01, style: { fontSize: 16 } }}
              value={editFormData.price || ""}
              onChange={onEditFormChange}
              disabled={userRole !== "admin"}
              helperText={
                userRole !== "admin" ? "Only admins can modify the price" : ""
              }
              sx={{ fontSize: { xs: 16, sm: 18 } }}
            />
            {activeTable === "reservations" && (
              <TextField
                label="Notes"
                name="notes"
                fullWidth
                margin="normal"
                multiline
                rows={3}
                value={editFormData.notes || ""}
                onChange={onEditFormChange}
                sx={{ fontSize: { xs: 16, sm: 18 } }}
                InputLabelProps={{ style: { fontSize: 16 } }}
                inputProps={{ style: { fontSize: 16 } }}
              />
            )}
          </Box>
        )}

        {dialogType === "assign" && (
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
        )}

        {dialogType === "status" && (
          <FormControl fullWidth sx={{ mt: 2, fontSize: { xs: 16, sm: 18 } }}>
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              value={selectedStatus}
              label="Status"
              onChange={onStatusChange}
              sx={{ fontSize: { xs: 16, sm: 18 } }}
            >
              {activeTable === "employees"
                ? [
                    <MenuItem key="active" value="active">
                      Active
                    </MenuItem>,
                    <MenuItem key="inactive" value="inactive">
                      Inactive
                    </MenuItem>,
                  ]
                : activeTable === "orders"
                ? [
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
                  ]
                : [
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
                  ]}
            </Select>
          </FormControl>
        )}

        {dialogType === "role" &&
          (activeTable === "customers" || activeTable === "employees") && (
            <FormControl fullWidth sx={{ mt: 2, fontSize: { xs: 16, sm: 18 } }}>
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                value={(editFormData as any).role || "user"}
                label="Role"
                name="role"
                onChange={onEditFormChange}
                sx={{ fontSize: { xs: 16, sm: 18 } }}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="employee">Employee</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          )}

        {dialogType === "cancel" && (
          <Box sx={{ pt: 2 }}>
            <p>Are you sure you want to cancel this reservation?</p>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="secondary"
          disabled={loading}
          sx={{ fontSize: { xs: 16, sm: 18 }, minHeight: 44, minWidth: 44 }}
        >
          Cancel
        </Button>
        {dialogType === "cancel" ? (
          <Button
            variant="contained"
            color="error"
            onClick={onSave}
            disabled={loading}
          >
            Confirm Cancel
          </Button>
        ) : (
          <Button variant="contained" onClick={onSave} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : "Save"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
