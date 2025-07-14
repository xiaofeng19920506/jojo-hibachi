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
import type { ReservationEntry, Employee, ReservationStatus } from "../types";

interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  dialogType: "edit" | "assign" | "status";
  activeTable: string;
  userRole: string;
  loading: boolean;
  editFormData: Partial<ReservationEntry>;
  onEditFormChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  selectedEmployeeId: string;
  onAssignEmployeeChange: (e: any) => void;
  selectedStatus: ReservationStatus;
  onStatusChange: (e: any) => void;
  availableEmployees: Employee[];
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
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {dialogType === "edit"
          ? `Edit ${activeTable === "orders" ? "Order" : "Reservation"}`
          : dialogType === "assign"
          ? `Assign ${activeTable === "orders" ? "Employee" : "Chef"}`
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
              InputLabelProps={{ shrink: true }}
              value={editFormData.date || ""}
              onChange={onEditFormChange}
            />
            {activeTable === "reservations" && (
              <TextField
                label="Time"
                name="time"
                type="time"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                value={editFormData.time || ""}
                onChange={onEditFormChange}
              />
            )}
            <TextField
              label="Price"
              name="price"
              type="number"
              fullWidth
              margin="normal"
              inputProps={{ min: 0, step: 0.01 }}
              value={editFormData.price || ""}
              onChange={onEditFormChange}
              disabled={userRole !== "admin"}
              helperText={
                userRole !== "admin" ? "Only admins can modify the price" : ""
              }
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
              />
            )}
          </Box>
        )}

        {dialogType === "assign" && (
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="assign-employee-label">
              {activeTable === "orders" ? "Employee" : "Chef"}
            </InputLabel>
            <Select
              labelId="assign-employee-label"
              value={selectedEmployeeId}
              label={activeTable === "orders" ? "Employee" : "Chef"}
              onChange={onAssignEmployeeChange}
            >
              {availableEmployees.map((emp) => (
                <MenuItem key={emp.id} value={emp.id}>
                  {getEmployeeDisplayName(emp)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {dialogType === "status" && (
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              value={selectedStatus}
              label="Status"
              onChange={onStatusChange}
            >
              {activeTable === "orders" ? (
                <>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="assigned">Assigned</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </>
              ) : (
                <>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </>
              )}
            </Select>
          </FormControl>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onSave} disabled={loading}>
          {loading ? <CircularProgress size={20} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
