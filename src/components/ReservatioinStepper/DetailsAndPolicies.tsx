import { Box, TextField, Button, Typography } from "@mui/material";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const DetailsAndPolicies: React.FC<Props> = ({ onNext, onBack }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h6">Pricing: $XX per guest</Typography>
      <TextField label="Number of Guests" type="number" required />
      <TextField label="Food Allergies" multiline rows={2} />
      <TextField label="Event Type" />
      <TextField label="Additional Notes" multiline rows={3} />
      <Typography variant="body2">
        * By continuing, you agree to our Terms & Conditions, Cancellation, and
        Weather Policy.
      </Typography>
      <Box display="flex" justifyContent="space-between">
        <Button onClick={onBack}>Back</Button>
        <Button variant="contained" onClick={onNext}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default DetailsAndPolicies;
