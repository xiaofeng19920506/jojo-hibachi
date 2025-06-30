import { Button, TextField, Box } from "@mui/material";

interface Props {
  onNext: () => void;
}

const CustomerInfo: React.FC<Props> = ({ onNext }) => {
  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <TextField label="Full Name" required />
      <TextField label="Email" type="email" required />
      <TextField label="Phone Number" required />
      <TextField label="Address" required />
      <Button variant="contained" onClick={onNext}>
        Next
      </Button>
    </Box>
  );
};

export default CustomerInfo;
