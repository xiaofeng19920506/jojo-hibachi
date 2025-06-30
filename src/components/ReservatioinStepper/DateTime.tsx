import { Button, Box, TextField } from "@mui/material";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const DateTime: React.FC<Props> = ({ onNext, onBack }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField type="date" label="Date" InputLabelProps={{ shrink: true }} />
      <TextField type="time" label="Time" InputLabelProps={{ shrink: true }} />
      <Box display="flex" justifyContent="space-between">
        <Button onClick={onBack}>Back</Button>
        <Button variant="contained" onClick={onNext}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default DateTime;
