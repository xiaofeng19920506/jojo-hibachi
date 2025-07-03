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
    return parsedDate.isValid() && !parsedDate.isBefore(minDate, "day")
      ? parsedDate
      : minDate;
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

  useEffect(() => {
    if (customerInfo.date === "" || customerInfo.date === undefined) {
      handleDateBlur();
    }
  }, []);

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

  const updateDateInRedux = (parsedDate: dayjs.Dayjs) => {
    const updatedInfo = {
      ...customerInfo,
      date: parsedDate.toISOString(),
      reservationDay: String(parsedDate.date()),
      reservationMonth: String(parsedDate.month() + 1), // 0-based month
      reservationYear: String(parsedDate.year()),
    };
    dispatch(setCustomerInfo(updatedInfo));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputDate(e.target.value);
  };

  const handleDateBlur = () => {
    const formattedInput = dayjs(inputDate).format("YYYY-MM-DD");
    if (validateDate(formattedInput)) {
      const parsed = dayjs(formattedInput);
      setDate(parsed);
      setInputDate(formattedInput);
      updateDateInRedux(parsed);
    } else {
      setInputDate(date.format("YYYY-MM-DD"));
    }
  };

  const handleDateChange = (newDate: dayjs.Dayjs | string | null) => {
    if (newDate !== null) {
      const parsedDate = typeof newDate === "string" ? dayjs(newDate) : newDate;
      if (parsedDate.isValid()) {
        setDate(parsedDate);
        setInputDate(parsedDate.format("YYYY-MM-DD"));
        updateDateInRedux(parsedDate);
      }
    }
  };

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

  const handleTimeButtonClick = (selectedTime: string) => {
    setTime(selectedTime);
    if (validateTime(selectedTime)) {
      dispatch(setCustomerInfo({ ...customerInfo, time: selectedTime }));
    }
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 12; hour <= 21; hour++) {
      for (let minutes = 0; minutes < 60; minutes += 30) {
        options.push(
          `${hour.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}`
        );
      }
    }
    return options;
  };

  const isFormValid = date && time && !dateError && !timeError;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          p: { xs: 2, md: 4 },
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <StaticDatePicker
              displayStaticWrapperAs="desktop"
              openTo="day"
              value={date < minDate ? minDate : date}
              onChange={handleDateChange}
              minDate={minDate}
            />
          </Box>

          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
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
              sx={{
                marginBottom: 2,
                marginTop: { xs: 2, md: 5 },
              }}
            />

            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(2, 1fr)",
                    sm: "repeat(3, 1fr)",
                    md: "repeat(5, 1fr)",
                  },
                  gap: 2,
                }}
              >
                {generateTimeOptions().map((option) => (
                  <Button
                    key={option}
                    variant={option === time ? "contained" : "outlined"}
                    onClick={() => handleTimeButtonClick(option)}
                    sx={{ width: "100%", height: 40 }}
                  >
                    {option}
                  </Button>
                ))}
              </Box>
              {timeError && (
                <Box color="error.main" mt={1}>
                  {timeError}
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button onClick={onBack}>Back</Button>
          <Button variant="contained" onClick={onNext} disabled={!isFormValid}>
            Next
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default DateTime;
