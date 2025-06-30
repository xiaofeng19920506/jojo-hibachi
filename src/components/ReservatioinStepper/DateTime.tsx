import { Button, Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import { setCustomerInfo } from "../../features/userSlice";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import dayjs from "dayjs";

const DateTime: React.FC<{ onNext: () => void; onBack: () => void }> = ({
  onNext,
  onBack,
}) => {
  const dispatch = useAppDispatch();
  const { customerInfo } = useAppSelector((state) => state.user);

  const minDate = dayjs().add(3, "day");

  const [date, setDate] = useState(() => {
    const parsedDate = dayjs(customerInfo.date);
    if (!parsedDate.isValid() || parsedDate.isBefore(minDate, "day")) {
      return minDate; // Default to 3 days ahead
    }
    return parsedDate; // Use the provided valid customerInfo.date
  });

  const [inputDate, setInputDate] = useState(date.format("YYYY-MM-DD"));
  const [dateError, setDateError] = useState("");
  const [time, setTime] = useState(customerInfo.time || "");
  const [timeError, setTimeError] = useState("");

  useEffect(() => {
    setDate(
      dayjs(customerInfo.date).isValid() ? dayjs(customerInfo.date) : minDate
    );
  }, [customerInfo]);

  // Validate the input date
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

  // Handle the date input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputDate(e.target.value);
  };

  // Handle date blur (validation and formatting on blur)
  const handleDateBlur = () => {
    const formattedInput = dayjs(inputDate).format("YYYY-MM-DD");

    if (validateDate(formattedInput)) {
      setDate(dayjs(formattedInput));
      setInputDate(formattedInput); // Update input with formatted date
      dispatch(
        setCustomerInfo({
          ...customerInfo,
          date: dayjs(formattedInput).toISOString(),
        })
      );
    } else {
      setInputDate(date.format("YYYY-MM-DD")); // Revert to calendar selected date if invalid
    }
  };

  // Handle the date picker change
  const handleDateChange = (newDate: dayjs.Dayjs | string | null) => {
    if (newDate !== null) {
      const parsedDate = typeof newDate === "string" ? dayjs(newDate) : newDate;
      if (parsedDate.isValid()) {
        setDate(parsedDate);
        setInputDate(parsedDate.format("YYYY-MM-DD"));
        dispatch(
          setCustomerInfo({ ...customerInfo, date: parsedDate.toISOString() })
        );
      }
    }
  };

  // Time validation (cannot be in the past)
  const validateTime = (selectedTime: string) => {
    if (!selectedTime) {
      setTimeError("Time is required.");
      return false;
    }

    const now = new Date();
    const selected = new Date(`${date.format("YYYY-MM-DD")}T${selectedTime}`);

    if (selected < now) {
      setTimeError("Time cannot be in the past.");
      return false;
    }

    setTimeError("");
    return true;
  };

  // Handle time selection (using buttons)
  const handleTimeButtonClick = (selectedTime: string) => {
    setTime(selectedTime);
    if (validateTime(selectedTime)) {
      dispatch(setCustomerInfo({ ...customerInfo, time: selectedTime }));
    }
  };

  const generateTimeOptions = () => {
    const options = [];
    const startHour = 12;
    const endHour = 21;
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minutes = 0; minutes < 60; minutes += 30) {
        const h = hour.toString().padStart(2, "0");
        const m = minutes.toString().padStart(2, "0");
        options.push(`${h}:${m}`);
      }
    }
    return options;
  };

  const isFormValid = date && time && !dateError && !timeError;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
        <Box sx={{ flex: 1 }}>
          <StaticDatePicker
            displayStaticWrapperAs="desktop"
            openTo="day"
            value={date}
            onChange={handleDateChange}
            minDate={minDate}
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <TextField
            label="Selected Date"
            value={inputDate}
            onChange={handleInputChange}
            onBlur={handleDateBlur}
            InputLabelProps={{ shrink: true }}
            error={!!dateError}
            helperText={dateError}
            fullWidth
            sx={{ marginBottom: 2, marginTop: 5 }}
          />

          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 2,
              }}
            >
              {generateTimeOptions().map((option) => (
                <Button
                  key={option}
                  variant={option === time ? "contained" : "outlined"}
                  onClick={() => handleTimeButtonClick(option)}
                  sx={{
                    width: "100%",
                    textAlign: "center",
                    height: 40,
                  }}
                >
                  {option}
                </Button>
              ))}
            </Box>
            {timeError && <Box color="error.main">{timeError}</Box>}
          </Box>
        </Box>
      </Box>

      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button onClick={onBack}>Back</Button>
        <Button variant="contained" onClick={onNext} disabled={!isFormValid}>
          Next
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default DateTime;
