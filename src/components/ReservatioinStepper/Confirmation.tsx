import { useEffect, useState } from "react";
import { Box, Button, Typography, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../utils/hooks";
import { resetReservation } from "../../features/userSlice";

interface Props {
  onReset: () => void;
  onBack: () => void;
}

const Confirmation: React.FC<Props> = ({ onReset, onBack }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { customerInfo } = useAppSelector((state) => state.user);

  const { adult, kids, allergies, eventType, notes } = customerInfo;

  const totalGuests = (adult || 0) + (kids || 0);
  const totalPrice = (adult || 0) * 50 + (kids || 0) * 25;

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const sendReservation = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/reservation",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...customerInfo, timeStamp: new Date() }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to send reservation.");
        }

        setSuccess(true);
      } catch (err: any) {
        setError(err.message || "Error sending reservation.");
      } finally {
        setLoading(false);
      }
    };

    sendReservation();
  }, [customerInfo]);

  const goToHome = () => {
    if (!success) return;

    dispatch(resetReservation());
    onReset();
    navigate("/");
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 600, margin: "0 auto", textAlign: "center", mt: 4 }}>
        <Typography variant="h6">Sending your reservation...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 600, margin: "0 auto", textAlign: "center", mt: 4 }}>
        <Typography variant="h4" color="error" gutterBottom>
          ❌ Reservation Failed
        </Typography>
        <Typography variant="body1" color="error" gutterBottom>
          {error}
        </Typography>

        <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "center" }}>
          <Button variant="contained" onClick={onBack}>
            Back
          </Button>
        </Box>
      </Box>
    );
  }

  // Success UI
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
        Reservation Summary
      </Typography>

      <Box sx={{ textAlign: "left", mt: 2 }}>
        <Typography>
          <strong>Adults:</strong> {adult}
        </Typography>
        <Typography>
          <strong>Kids:</strong> {kids}
        </Typography>
        <Typography>
          <strong>Total Guests:</strong> {totalGuests}
        </Typography>
        <Typography>
          <strong>Total Price:</strong> ${totalPrice}
        </Typography>
        {eventType && (
          <Typography>
            <strong>Event Type:</strong> {eventType}
          </Typography>
        )}
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
