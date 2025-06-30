import { useState } from "react";
import {
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
  Typography,
} from "@mui/material";
import { states } from "../../utils/constant";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { type customerInfos } from "../../features/types";
import { setCustomerInfo } from "../../features/userSlice";

interface Props {
  onNext: () => void;
}

const CustomerInfo: React.FC<Props> = ({ onNext }) => {
  const dispatch = useAppDispatch();
  const { customerInfo } = useAppSelector((state) => state.user);
  const [form, setForm] = useState<customerInfos>(customerInfo);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name as string]: value,
    }));
    dispatch(setCustomerInfo({ ...form, [name as string]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setForm((prev) => ({
      ...prev,
      state: e.target.value,
    }));
    dispatch(setCustomerInfo({ ...form, state: e.target.value }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const zipRegex = /^\d{5}$/;

    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(form.email)) newErrors.email = "Invalid email";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.state) newErrors.state = "State is required";
    if (!form.zipCode.trim()) newErrors.zipCode = "Zip code is required";
    else if (!zipRegex.test(form.zipCode))
      newErrors.zipCode = "Zip code must be 5 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      dispatch(setCustomerInfo(form));
      onNext();
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <TextField
        label="Full Name"
        name="fullName"
        value={form.fullName}
        onChange={handleChange}
        error={!!errors.fullName}
        helperText={errors.fullName}
        required
      />

      <TextField
        label="Email"
        name="email"
        value={form.email}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email}
        required
      />

      <TextField
        label="Phone Number"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        error={!!errors.phone}
        helperText={errors.phone}
        required
      />

      <TextField
        label="Address"
        name="address"
        value={form.address}
        onChange={handleChange}
        error={!!errors.address}
        helperText={errors.address}
        required
      />

      <FormControl required fullWidth error={!!errors.state}>
        <InputLabel id="state-label">State</InputLabel>
        <Select
          labelId="state-label"
          name="state"
          value={form.state}
          onChange={handleSelectChange}
          label="State"
        >
          {states.map((abbr) => (
            <MenuItem key={abbr} value={abbr}>
              {abbr}
            </MenuItem>
          ))}
        </Select>
        {errors.state && (
          <Typography variant="caption" color="error">
            {errors.state}
          </Typography>
        )}
      </FormControl>

      <TextField
        label="Zip Code"
        name="zipCode"
        value={form.zipCode}
        onChange={handleChange}
        error={!!errors.zipCode}
        helperText={errors.zipCode}
        required
      />

      <Button type="submit" variant="contained">
        Next
      </Button>
    </Box>
  );
};

export default CustomerInfo;
