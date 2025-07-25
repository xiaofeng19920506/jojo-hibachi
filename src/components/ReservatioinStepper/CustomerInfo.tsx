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
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
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
    const updatedForm = {
      ...form,
      [name as string]: value,
    };
    setForm(updatedForm);
    dispatch(setCustomerInfo(updatedForm));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const updatedForm = {
      ...form,
      state: e.target.value,
    };
    setForm(updatedForm);
    dispatch(setCustomerInfo(updatedForm));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const zipRegex = /^\d{5}$/;

    if (!form.firstName?.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName?.trim()) newErrors.lastName = "Last name is required";
    if (!form.email?.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(form.email)) newErrors.email = "Invalid email";
    if (!form.phoneNumber?.trim())
      newErrors.phoneNumber = "Phone number is required";
    if (!form.address?.trim()) newErrors.address = "Address is required";
    if (!form.city?.trim()) newErrors.city = "City is required";
    if (!form.state) newErrors.state = "State is required";
    if (!form.zipCode?.trim()) newErrors.zipCode = "Zip code is required";
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
        label="First Name"
        name="firstName"
        value={form.firstName}
        onChange={handleChange}
        error={!!errors.firstName}
        helperText={errors.firstName}
        required
      />

      <TextField
        label="Last Name"
        name="lastName"
        value={form.lastName}
        onChange={handleChange}
        error={!!errors.lastName}
        helperText={errors.lastName}
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
        name="phoneNumber"
        value={form.phoneNumber}
        onChange={handleChange}
        error={!!errors.phoneNumber}
        helperText={errors.phoneNumber}
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

      <TextField
        label="City"
        name="city"
        value={form.city}
        onChange={handleChange}
        error={!!errors.city}
        helperText={errors.city}
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
