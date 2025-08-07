import { styled } from "@mui/material/styles";
import { Box, Typography, FormControl } from "@mui/material";

// Calendar Event Card Components
export const CalendarEventCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  margin: theme.spacing(0.5),
  backgroundColor: theme.palette.mode === "dark" ? "#2c3e50" : "#ecf0f1",
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.mode === "dark" ? "#34495e" : "#bdc3c7"}`,
  fontSize: "0.8rem",
  overflow: "hidden",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.mode === "dark" ? "#34495e" : "#d5dbdb",
  },
}));

export const CalendarEventCardTitle = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  fontSize: "0.9rem",
  marginBottom: theme.spacing(0.5),
  color: theme.palette.mode === "dark" ? "#fff" : "#2c3e50",
}));

export const CalendarEventCardInfo = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  marginBottom: theme.spacing(0.25),
  color: theme.palette.mode === "dark" ? "#bdc3c7" : "#34495e",
}));

export const CalendarEventCardNotes = styled(Typography)(({ theme }) => ({
  fontSize: "0.7rem",
  fontStyle: "italic",
  marginTop: theme.spacing(0.5),
  color: theme.palette.mode === "dark" ? "#95a5a6" : "#7f8c8d",
}));

// Calendar Container Components
export const CalendarContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.mode === "dark" ? "#23272f" : "#fff",
  color: theme.palette.mode === "dark" ? "#fff" : "#000",
  minHeight: "calc(100vh - 64px)",
}));

export const CalendarRoot = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  backgroundColor: theme.palette.mode === "dark" ? "#23272f" : "#fff",
  color: theme.palette.mode === "dark" ? "#fff" : "#000",
}));

export const CalendarAppBarWrapper = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  backgroundColor: theme.palette.mode === "dark" ? "#2c3e50" : "#34495e",
  color: theme.palette.mode === "dark" ? "#fff" : "#fff",
}));

export const CalendarTitleRow = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  flexWrap: "wrap",
  gap: theme.spacing(1),
}));

export const CalendarTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.5rem",
  fontWeight: "bold",
  color: theme.palette.mode === "dark" ? "#fff" : "#2c3e50",
}));

export const CalendarControlsRow = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  flexWrap: "wrap",
  gap: theme.spacing(1),
}));

export const CalendarEmployeeSelect = styled(FormControl)(({ theme }) => ({
  minWidth: 200,
  "& .MuiInputLabel-root": {
    color: theme.palette.mode === "dark" ? "#bdc3c7" : "#7f8c8d",
  },
  "& .MuiSelect-select": {
    color: theme.palette.mode === "dark" ? "#fff" : "#000",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.mode === "dark" ? "#34495e" : "#bdc3c7",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.mode === "dark" ? "#3498db" : "#3498db",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
  },
}));

export const CalendarContent = styled(Box)(() => ({
  flex: 1,
  overflow: "auto",
})); 