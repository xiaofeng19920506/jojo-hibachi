import { Button, Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import { setCustomerInfo } from "../../features/userSlice";
import { getDatePlusDays } from "../../utils/utils";

const DateTime: React.FC<{ onNext: () => void; onBack: () => void }> = ({
  onNext,
  onBack,
}) => {
  const dispatch = useAppDispatch();
  const { customerInfo } = useAppSelector((state) => state.user);

  const [date, setDate] = useState(customerInfo.date || "");
  const [time, setTime] = useState(customerInfo.time || "");

  const [dateError, setDateError] = useState("");
  const [timeError, setTimeError] = useState("");

  const minDate = getDatePlusDays();

  useEffect(() => {
    setDate(customerInfo.date || "");
    setTime(customerInfo.time || "");
  }, [customerInfo]);

  const validateDate = (selectedDate: string) => {
    if (!selectedDate) {
      setDateError("Date is required.");
      return false;
    }

    const selected = new Date(selectedDate);
    const min = new Date(minDate);

    if (selected < min) {
      setDateError("Date must be at least 3 days from today.");
      return false;
    }

    setDateError("");
    return true;
  };

  const validateTime = (selectedDate: string, selectedTime: string) => {
    if (!selectedTime) {
      setTimeError("Time is required.");
      return false;
    }

    const now = new Date();
    const selected = new Date(`${selectedDate}T${selectedTime}`);

    const selectedDateObj = new Date(selectedDate);
    if (
      selectedDateObj.toDateString() === now.toDateString() &&
      selected < now
    ) {
      setTimeError("Time cannot be in the past.");
      return false;
    }

    setTimeError("");
    return true;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setDate(newDate);
    const isValid = validateDate(newDate);
    if (isValid) {
      dispatch(setCustomerInfo({ ...customerInfo, date: newDate }));
      if (time) validateTime(newDate, time);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);
    if (validateTime(date, newTime)) {
      dispatch(setCustomerInfo({ ...customerInfo, time: newTime }));
    }
  };

  const isFormValid = date && time && !dateError && !timeError;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        type="date"
        label="Date"
        value={date}
        onChange={handleDateChange}
        InputLabelProps={{ shrink: true }}
        inputProps={{ min: minDate }}
        error={!!dateError}
        helperText={dateError}
      />
      <TextField
        type="time"
        label="Time"
        value={time}
        onChange={handleTimeChange}
        InputLabelProps={{ shrink: true }}
        error={!!timeError}
        helperText={timeError}
      />
      <Box display="flex" justifyContent="space-between">
        <Button onClick={onBack}>Back</Button>
        <Button variant="contained" onClick={onNext} disabled={!isFormValid}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default DateTime;
