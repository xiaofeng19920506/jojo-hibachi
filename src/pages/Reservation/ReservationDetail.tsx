import React from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Divider,
} from "@mui/material";
import { useGetReservationByIdQuery } from "../../services/api";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GlobalAppBar from "../../components/GloabalAppBar/GlobalAppBar";

// Utility to check if device is mobile
const isMobile =
  typeof navigator !== "undefined" &&
  /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
    navigator.userAgent
  );

const ReservationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: reservation,
    isLoading,
    error,
  } = useGetReservationByIdQuery(id || "");

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Failed to load reservation.</Typography>;
  }

  if (!reservation) {
    return (
      <Typography color="text.secondary">Reservation not found.</Typography>
    );
  }

  return (
    <>
      <GlobalAppBar title="Fancy Hibachi" subtitle="" />
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          pt: "64px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          boxSizing: "border-box",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100vw",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            bgcolor: "#e3f2fd",
            p: { xs: "8px 12px", sm: "12px 32px", md: "16px 48px" },
            borderRadius: { xs: 0, sm: 2 },
            boxSizing: "border-box",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            overflow: "auto",
          }}
        >
          <Box sx={{ marginLeft: "25%", width: "75%" }}>
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 0.2 }}>
              Reservation Details
            </Typography>
          </Box>
          <Divider sx={{ my: 0.5 }} />
          <Box sx={{ marginLeft: "25%", width: "75%" }}>
            <Typography variant="h6" sx={{ mt: 0 }}>
              Customer
            </Typography>
            <Typography>Name: {reservation.customerName || "N/A"}</Typography>
            <Typography>Email: {reservation.email || "N/A"}</Typography>
            <Typography>
              Phone:{" "}
              {reservation.phoneNumber ? (
                isMobile ? (
                  <a
                    href={`tel:${reservation.phoneNumber}`}
                    style={{ color: "#1976d2", textDecoration: "underline" }}
                  >
                    {reservation.phoneNumber}
                  </a>
                ) : (
                  reservation.phoneNumber
                )
              ) : (
                "N/A"
              )}
            </Typography>
            <Typography>
              Address:{" "}
              {reservation.address ? (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${reservation.address}, ${reservation.city}, ${reservation.state} ${reservation.zipCode}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#1976d2",
                    textDecoration: "underline",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  <LocationOnIcon sx={{ fontSize: 20, mr: 0.5 }} />
                  {reservation.address}, {reservation.city}, {reservation.state}{" "}
                  {reservation.zipCode}
                </a>
              ) : (
                "N/A"
              )}
            </Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ marginLeft: "25%", width: "75%" }}>
            <Typography variant="h6">Reservation Info</Typography>
            <Typography>Date: {reservation.date || "N/A"}</Typography>
            <Typography>Time: {reservation.time || "N/A"}</Typography>
            <Typography>Status: {reservation.status || "N/A"}</Typography>
            <Typography>
              Price:{" "}
              {reservation.price !== undefined
                ? `$${reservation.price}`
                : "N/A"}
            </Typography>
            <Typography>
              Adults:{" "}
              {reservation.adult !== undefined ? reservation.adult : "N/A"}
            </Typography>
            <Typography>
              Kids: {reservation.kids !== undefined ? reservation.kids : "N/A"}
            </Typography>
            <Typography>Allergies: {reservation.allergies || "N/A"}</Typography>
            <Typography>
              Event Type: {reservation.eventType || "N/A"}
            </Typography>
            <Typography>Notes: {reservation.notes || "N/A"}</Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
        </Paper>
      </Box>
    </>
  );
};

export default ReservationDetail;
