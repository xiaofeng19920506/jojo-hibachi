import React, { useState } from "react";
import { TextField, Box } from "@mui/material";
import dayjs from "dayjs";
import type { ReservationEntry } from "../../types";

interface ReservationEditFormProps {
  editFormData: Partial<ReservationEntry>;
  onEditFormChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  userRole: string;
}

const ReservationEditForm: React.FC<ReservationEditFormProps> = ({
  editFormData,
  onEditFormChange,
  userRole,
}) => {
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
      validateTime(value, editFormData.date || "");
    }
    onEditFormChange(e);
  };

  return (
    <Box sx={{ pt: 1 }}>
      <TextField
        label="Date"
        name="date"
        type="date"
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true, style: { fontSize: 16 } }}
        value={editFormData.date || ""}
        onChange={handleDateChange}
        error={!!dateError}
        helperText={dateError}
        inputProps={{
          min: minDate.format("YYYY-MM-DD"),
          style: { fontSize: 16 },
        }}
        sx={{ fontSize: { xs: 16, sm: 18 } }}
      />
      <TextField
        label="Time"
        name="time"
        type="time"
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true, style: { fontSize: 16 } }}
        value={editFormData.time || ""}
        onChange={handleTimeChange}
        error={!!timeError}
        helperText={timeError}
        sx={{ fontSize: { xs: 16, sm: 18 } }}
      />
      <TextField
        label="Number of Adults"
        name="adult"
        type="number"
        fullWidth
        margin="normal"
        inputProps={{ min: 0, style: { fontSize: 16 } }}
        value={editFormData.adult || 0}
        onChange={onEditFormChange}
        sx={{ fontSize: { xs: 16, sm: 18 } }}
      />
      <TextField
        label="Number of Kids"
        name="kids"
        type="number"
        fullWidth
        margin="normal"
        inputProps={{ min: 0, style: { fontSize: 16 } }}
        value={editFormData.kids || 0}
        onChange={onEditFormChange}
        sx={{ fontSize: { xs: 16, sm: 18 } }}
      />
      <TextField
        label="Event Type"
        name="eventType"
        fullWidth
        margin="normal"
        value={editFormData.eventType || ""}
        onChange={onEditFormChange}
        sx={{ fontSize: { xs: 16, sm: 18 } }}
        InputLabelProps={{ style: { fontSize: 16 } }}
        inputProps={{ style: { fontSize: 16 } }}
      />
      <TextField
        label="Allergies"
        name="allergies"
        fullWidth
        margin="normal"
        multiline
        rows={2}
        value={editFormData.allergies || ""}
        onChange={onEditFormChange}
        sx={{ fontSize: { xs: 16, sm: 18 } }}
        InputLabelProps={{ style: { fontSize: 16 } }}
        inputProps={{ style: { fontSize: 16 } }}
        placeholder="Any food allergies or dietary restrictions"
      />
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
        placeholder="Any special requests or additional notes"
      />
    </Box>
  );
};

export default ReservationEditForm;
