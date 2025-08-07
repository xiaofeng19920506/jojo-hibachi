import { styled } from "@mui/material/styles";
import { Box, TextField, Typography } from "@mui/material";

export const SignInWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100vw",
  backgroundColor: theme.palette.mode === "dark" ? "#23272f" : "#fff",
  color: theme.palette.mode === "dark" ? "#fff" : "#000",
  paddingTop: theme.spacing(7),
  minHeight: "calc(100vh - 64px)",
}));

export const Form = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: "400px",
  padding: theme.spacing(3),
  gap: theme.spacing(2),
}));

export const Input = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: theme.palette.mode === "dark" ? "#2c3e50" : "#fff",
    color: theme.palette.mode === "dark" ? "#fff" : "#000",
    "& fieldset": {
      borderColor: theme.palette.mode === "dark" ? "#34495e" : "#bdc3c7",
    },
    "&:hover fieldset": {
      borderColor: theme.palette.mode === "dark" ? "#3498db" : "#3498db",
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
  "& .MuiInputLabel-root": {
    color: theme.palette.mode === "dark" ? "#bdc3c7" : "#7f8c8d",
  },
  "& .MuiInputBase-input": {
    color: theme.palette.mode === "dark" ? "#fff" : "#000",
  },
}));

export const Title = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(2),
  color: theme.palette.mode === "dark" ? "#fff" : "#000",
}));

export const ErrorMessage = styled(Typography)(({ theme }) => ({
  color: "#e74c3c",
  textAlign: "center",
  marginBottom: theme.spacing(1),
})); 