import { Box, Button, Typography, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useAppSelector, useAppDispatch } from "../../utils/hooks";
import { resetReservation } from "../../features/userSlice";

interface Props {
  onReset: () => void;
  onBack: () => void;
}

const Confirmation: React.FC<Props> = ({ onReset, onBack }) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { customerInfo } = useAppSelector((state) => state.user);

  const {
    id,
    firstName,
    lastName,
    email,
    phoneNumber,
    address,
    city,
    state,
    zipCode,
    time,
    allergies,
    adult,
    kids,
    eventType,
    notes,
    reservationDay,
    reservationMonth,
    reservationYear,
    transportationFee,
    price,
  } = customerInfo;

  const totalGuests = (adult || 0) + (kids || 0);
  const basePrice = (adult || 0) * 50 + (kids || 0) * 25;

  const goToHome = () => {
    dispatch(resetReservation());
    onReset();
    window.location.href = "https://www.fancyhibachi.com";
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", textAlign: "center", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        🎉 Reservation Confirmed!
      </Typography>
      <Typography variant="body1" gutterBottom>
        Thank you for choosing us. We look forward to serving you.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Receipt
      </Typography>

      <Box
        sx={{
          textAlign: "left",
          mt: 2,
          m: "auto",
          bgcolor:
            theme.palette.mode === "dark" ? "background.paper" : "#fafafa",
          p: 3,
          borderRadius: 2,
          boxShadow: 1,
          border:
            theme.palette.mode === "dark"
              ? `1px solid ${theme.palette.divider}`
              : "none",
        }}
      >
        <Typography sx={{ fontWeight: 600, mb: 1 }}>
          Reservation Details
        </Typography>
        <Typography>
          <strong>Reservation ID:</strong> {id || "N/A"}
        </Typography>
        <Typography>
          <strong>Name:</strong> {firstName} {lastName}
        </Typography>
        <Typography>
          <strong>Email:</strong> {email}
        </Typography>
        <Typography>
          <strong>Phone Number:</strong> {phoneNumber}
        </Typography>
        <Typography>
          <strong>Address:</strong> {address}, {city}, {state} {zipCode}
        </Typography>
        <Typography>
          <strong>Date:</strong>{" "}
          {`${reservationMonth}/${reservationDay}/${reservationYear}`}
        </Typography>
        <Typography>
          <strong>Time:</strong> {time}
        </Typography>
        <Typography>
          <strong>Event Type:</strong> {eventType}
        </Typography>
        <Typography>
          <strong>Adults:</strong> {adult}
        </Typography>
        <Typography>
          <strong>Kids:</strong> {kids}
        </Typography>
        <Typography>
          <strong>Total Guests:</strong> {totalGuests}
        </Typography>
        {allergies && (
          <Typography>
            <strong>Allergies:</strong> {allergies}
          </Typography>
        )}
        {notes && (
          <Typography>
            <strong>Additional Notes:</strong> {notes}
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />
        <Typography sx={{ fontWeight: 600, mb: 1 }}>Charges</Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <span>Base Price:</span>
          <span>${basePrice.toFixed(2)}</span>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <span>Transportation Fee:</span>
          <span>${transportationFee.toFixed(2)}</span>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          <span>Estimated Total:</span>
          <span>${price.toFixed(2)}</span>
        </Box>
      </Box>

      <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "center" }}>
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>
        <Button variant="contained" onClick={goToHome}>
          Done
        </Button>
      </Box>
    </Box>
  );
};

export default Confirmation;
