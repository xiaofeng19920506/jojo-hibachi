import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Props {
  onReset: () => void;
}

const Confirmation: React.FC<Props> = ({ onReset }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: "center", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        🎉 Reservation Confirmed!
      </Typography>
      <Typography variant="body1" gutterBottom>
        Thank you for choosing us. We look forward to serving you.
      </Typography>
      <Box sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "center" }}>
        <Button variant="outlined" onClick={onReset}>Make Another Reservation</Button>
        <Button variant="contained" onClick={() => navigate("/")}>Go to Home</Button>
      </Box>
    </Box>
  );
};

export default Confirmation;
