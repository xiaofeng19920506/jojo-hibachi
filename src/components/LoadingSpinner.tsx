import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingSpinner: React.FC = () => (
  <Box
    sx={{
      width: "100vw",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      bgcolor: "background.default",
      zIndex: 9999,
    }}
  >
    <CircularProgress size={56} thickness={4} color="primary" />
    <Typography variant="h6" mt={2} color="text.secondary">
      Loading...
    </Typography>
  </Box>
);

export default LoadingSpinner;
