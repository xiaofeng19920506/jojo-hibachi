import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light", // 浅色模式
    primary: {
      main: "#646cff",
    },
    background: {
      default: "#ffffff",
      paper: "#f5f5f5",
    },
    text: {
      primary: "#213547", // 深色文字
      secondary: "#555555",
    },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        color: "primary",
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#213547",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: "#213547",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ccc",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#646cff",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#646cff",
          },
        },
        input: {
          color: "#213547",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});

export default theme;
