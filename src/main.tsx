import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { store } from "./store";
import App from "./App";
import "./index.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { lightTheme, darkTheme } from "./utils/theme";
import { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";

function MainApp() {
  const [mode, setMode] = useState(
    () => localStorage.getItem("themeMode") || "light"
  );
  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);
  const theme = mode === "dark" ? darkTheme : lightTheme;
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Router>
            <App themeMode={mode} setThemeMode={setMode} />
          </Router>
        </LocalizationProvider>
      </Provider>
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MainApp />
  </StrictMode>
);
