import React, { useState } from "react";
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
  Box,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import dayjs from "dayjs";
import type { ReservationEntry, Employee } from "../types";
import type { FoodEntry } from "../../../components/DataTable/types";

interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  dialogType:
    | "edit"
    | "assign"
    | "status"
    | "cancel"
    | "role"
    | "delete"
    | "add";
  activeTable: string;
  userRole: string;
  loading: boolean;
  editFormData: Partial<ReservationEntry> | Partial<FoodEntry>;
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

  // Type guards for form data
  const isReservationData = (data: any): data is Partial<ReservationEntry> => {
    return "date" in data || "time" in data || "notes" in data;
  };

  const isFoodData = (data: any): data is Partial<FoodEntry> => {
    return (
      "description" in data || "category" in data || "preparationTime" in data
    );
  };

  // Date validation logic
  const minDate = dayjs().add(3, "day");
  const [dateError, setDateError] = useState("");
  const [timeError, setTimeError] = useState("");

  const validateDate = (input: string) => {
    const parsedInput = dayjs(input);
    if (!parsedInput.isValid()) {
      setDateError("Invalid date format.");
      return false;
    }
    if (parsedInput.isBefore(minDate, "day")) {
      setDateError("Date must be at least 3 days from today.");
      return false;
    }
    setDateError("");
    return true;
  };

  const validateTime = (selectedTime: string, selectedDate: string) => {
    if (!selectedTime) {
      setTimeError("Time is required.");
      return false;
    }

    const now = new Date();
    const selected = new Date(`${selectedDate}T${selectedTime}`);
    if (selected < now) {
      setTimeError("Time cannot be in the past.");
      return false;
    }

    setTimeError("");
    return true;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "date") {
      validateDate(value);
    }
    onEditFormChange(e);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "time") {
      const reservationData = isReservationData(editFormData)
        ? editFormData
        : {};
      validateTime(value, reservationData.date || "");
    }
    onEditFormChange(e);
  };
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
          ? `Edit ${
              activeTable === "orders"
                ? "Order"
                : activeTable === "food"
                ? "Food Item"
                : "Reservation"
            }`
          : dialogType === "add"
          ? `Add New ${
              activeTable === "orders"
                ? "Order"
                : activeTable === "food"
                ? "Food Item"
                : "Reservation"
            }`
          : dialogType === "assign"
          ? `Assign ${activeTable === "orders" ? "Employee" : "Chef"}`
          : dialogType === "role" && activeTable === "customers"
          ? "Change User Role"
          : dialogType === "delete"
          ? "Delete Food Item"
          : "Update Status"}
      </DialogTitle>
      <DialogContent>
        {(dialogType === "edit" || dialogType === "add") && (
          <Box sx={{ pt: 1 }}>
            {activeTable === "food" ? (
              // Food item edit form
              <>
                <TextField
                  label="Name"
                  name="name"
                  fullWidth
                  margin="normal"
                  value={(editFormData as any).name || ""}
                  onChange={onEditFormChange}
                  sx={{ fontSize: { xs: 16, sm: 18 } }}
                  InputLabelProps={{ style: { fontSize: 16 } }}
                  inputProps={{ style: { fontSize: 16 } }}
                />
                <TextField
                  label="Description"
                  name="description"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                  value={(editFormData as any).description || ""}
                  onChange={onEditFormChange}
                  sx={{ fontSize: { xs: 16, sm: 18 } }}
                  InputLabelProps={{ style: { fontSize: 16 } }}
                  inputProps={{ style: { fontSize: 16 } }}
                />
                <TextField
                  label="Price"
                  name="price"
                  type="number"
                  fullWidth
                  margin="normal"
                  inputProps={{ min: 0, step: 0.01, style: { fontSize: 16 } }}
                  value={editFormData.price || 0}
                  onChange={onEditFormChange}
                  sx={{ fontSize: { xs: 16, sm: 18 } }}
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={(editFormData as any).category || ""}
                    onChange={onEditFormChange as any}
                    label="Category"
                  >
                    <MenuItem value="appetizer">Appetizer</MenuItem>
                    <MenuItem value="protein">Protein</MenuItem>
                    <MenuItem value="combo">Combo</MenuItem>
                  </Select>
                </FormControl>
              </>
            ) : (
              // Reservation edit form
              <>
                <TextField
                  label="Date"
                  name="date"
                  type="date"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true, style: { fontSize: 16 } }}
                  value={
                    isReservationData(editFormData)
                      ? editFormData.date || ""
                      : ""
                  }
                  onChange={handleDateChange}
                  error={!!dateError}
                  helperText={dateError}
                  inputProps={{
                    min: minDate.format("YYYY-MM-DD"),
                    style: { fontSize: 16 },
                  }}
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
                    value={
                      isReservationData(editFormData)
                        ? editFormData.time || ""
                        : ""
                    }
                    onChange={handleTimeChange}
                    error={!!timeError}
                    helperText={timeError}
                    sx={{ fontSize: { xs: 16, sm: 18 } }}
                  />
                )}
                {activeTable === "reservations" && (
                  <TextField
                    label="Number of Adults"
                    name="adult"
                    type="number"
                    fullWidth
                    margin="normal"
                    inputProps={{ min: 0, style: { fontSize: 16 } }}
                    value={
                      isReservationData(editFormData)
                        ? editFormData.adult || 0
                        : 0
                    }
                    onChange={onEditFormChange}
                    sx={{ fontSize: { xs: 16, sm: 18 } }}
                  />
                )}
                {activeTable === "reservations" && (
                  <TextField
                    label="Number of Kids"
                    name="kids"
                    type="number"
                    fullWidth
                    margin="normal"
                    inputProps={{ min: 0, style: { fontSize: 16 } }}
                    value={
                      isReservationData(editFormData)
                        ? editFormData.kids || 0
                        : 0
                    }
                    onChange={onEditFormChange}
                    sx={{ fontSize: { xs: 16, sm: 18 } }}
                  />
                )}
                {activeTable === "reservations" && (
                  <TextField
                    label="Event Type"
                    name="eventType"
                    fullWidth
                    margin="normal"
                    value={
                      isReservationData(editFormData)
                        ? editFormData.eventType || ""
                        : ""
                    }
                    onChange={onEditFormChange}
                    sx={{ fontSize: { xs: 16, sm: 18 } }}
                    InputLabelProps={{ style: { fontSize: 16 } }}
                    inputProps={{ style: { fontSize: 16 } }}
                  />
                )}
                {activeTable === "reservations" && (
                  <TextField
                    label="Allergies"
                    name="allergies"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={2}
                    value={
                      isReservationData(editFormData)
                        ? editFormData.allergies || ""
                        : ""
                    }
                    onChange={onEditFormChange}
                    sx={{ fontSize: { xs: 16, sm: 18 } }}
                    InputLabelProps={{ style: { fontSize: 16 } }}
                    inputProps={{ style: { fontSize: 16 } }}
                    placeholder="Any food allergies or dietary restrictions"
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
                    userRole !== "admin"
                      ? "Only admins can modify the price"
                      : ""
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
                    value={
                      isReservationData(editFormData)
                        ? editFormData.notes || ""
                        : ""
                    }
                    onChange={onEditFormChange}
                    sx={{ fontSize: { xs: 16, sm: 18 } }}
                    InputLabelProps={{ style: { fontSize: 16 } }}
                    inputProps={{ style: { fontSize: 16 } }}
                    placeholder="Any special requests or additional notes"
                  />
                )}
              </>
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
                onChange={onEditFormChange as any}
                sx={{ fontSize: { xs: 16, sm: 18 } }}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="employee">Employee</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          )}

        {dialogType === "delete" && activeTable === "food" && (
          <Box sx={{ pt: 1 }}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Are you sure you want to delete this food item? This action cannot
              be undone.
            </Alert>
            <Typography variant="body1">
              <strong>Name:</strong>{" "}
              {isFoodData(editFormData) ? editFormData.name : ""}
            </Typography>
            <Typography variant="body1">
              <strong>Category:</strong>{" "}
              {isFoodData(editFormData) ? editFormData.category : ""}
            </Typography>
            <Typography variant="body1">
              <strong>Price:</strong> ${editFormData.price}
            </Typography>
          </Box>
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
          <Button
            variant="contained"
            onClick={onSave}
            disabled={
              loading ||
              (dialogType === "edit" &&
                activeTable === "reservations" &&
                (!!dateError || !!timeError))
            }
          >
            {loading ? <CircularProgress size={20} /> : "Save"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
