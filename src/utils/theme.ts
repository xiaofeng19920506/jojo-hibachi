import { createTheme } from "@mui/material/styles";

const shadowValue = "0px 2px 8px rgba(100, 108, 255, 0.08)";
const shadowsArray = ["none" as const, ...Array(24).fill(shadowValue)] as [
  "none",
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string
];

const lightTheme = createTheme({
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
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, fontSize: "2.5rem", color: "#213547" },
    h2: { fontWeight: 600, fontSize: "2rem", color: "#213547" },
    h3: { fontWeight: 600, fontSize: "1.5rem", color: "#213547" },
    h4: { fontWeight: 500, fontSize: "1.25rem", color: "#213547" },
    h5: { fontWeight: 500, fontSize: "1.1rem", color: "#213547" },
    h6: { fontWeight: 500, fontSize: "1rem", color: "#213547" },
    body1: { fontSize: "1rem", color: "#213547" },
    body2: { fontSize: "0.95rem", color: "#555555" },
    button: { fontWeight: 500, textTransform: "none" },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: shadowsArray,
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
          borderRadius: 12,
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
          borderRadius: 8,
          fontWeight: 500,
          borderColor: "#fff",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(100, 108, 255, 0.08)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(100, 108, 255, 0.08)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: "0 2px 8px rgba(100, 108, 255, 0.08)",
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: "#fff",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #e0e0e0",
        },
        head: {
          backgroundColor: "#f5f5f5",
          color: "#213547",
          fontWeight: 600,
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#646cff" },
    background: { default: "#121212", paper: "#23272f" },
    text: { primary: "#f1f1f1", secondary: "#b0b0b0" },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, fontSize: "2.5rem", color: "#f1f1f1" },
    h2: { fontWeight: 600, fontSize: "2rem", color: "#f1f1f1" },
    h3: { fontWeight: 600, fontSize: "1.5rem", color: "#f1f1f1" },
    h4: { fontWeight: 500, fontSize: "1.25rem", color: "#f1f1f1" },
    h5: { fontWeight: 500, fontSize: "1.1rem", color: "#f1f1f1" },
    h6: { fontWeight: 500, fontSize: "1rem", color: "#f1f1f1" },
    body1: { fontSize: "1rem", color: "#f1f1f1" },
    body2: { fontSize: "0.95rem", color: "#b0b0b0" },
    button: { fontWeight: 500, textTransform: "none" },
  },
  shape: { borderRadius: 12 },
  shadows: shadowsArray,
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
          color: "#f1f1f1",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: "#f1f1f1",
          borderRadius: 12,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#444",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#646cff",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#646cff",
          },
        },
        input: {
          color: "#f1f1f1",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          fontWeight: 500,
          borderColor: "#fff",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(100, 108, 255, 0.08)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(100, 108, 255, 0.08)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: "0 2px 8px rgba(100, 108, 255, 0.08)",
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: "#23272f",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #444",
        },
        head: {
          backgroundColor: "#444",
          color: "#f1f1f1",
          fontWeight: 600,
        },
      },
    },
  },
});

export { lightTheme, darkTheme };
