import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  TextField,
  Button as MuiButton,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useAppDispatch } from "../../utils/hooks";
import { login } from "../../features/userSlice";
import { useRegisterMutation, api } from "../../services/api";

const SignUp: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useTheme();

  // Consistent input styling for both light and dark modes
  const inputStyles = {
    mb: 2,
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor:
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.23)"
            : "rgba(0, 0, 0, 0.23)",
      },
      "&:hover fieldset": {
        borderColor:
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.4)"
            : "rgba(0, 0, 0, 0.4)",
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
      },
    },
    "& .MuiInputLabel-root": {
      color:
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.7)"
          : "rgba(0, 0, 0, 0.6)",
      "&.Mui-focused": {
        color: theme.palette.primary.main,
      },
    },
    "& .MuiInputBase-input": {
      color: theme.palette.mode === "dark" ? "#fff" : "#000",
    },
    "& .MuiFormHelperText-root": {
      color:
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.7)"
          : "rgba(0, 0, 0, 0.6)",
    },
  };

  // Consistent select styling
  const selectStyles = {
    mb: 2,
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor:
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.23)"
            : "rgba(0, 0, 0, 0.23)",
      },
      "&:hover fieldset": {
        borderColor:
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.4)"
            : "rgba(0, 0, 0, 0.4)",
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
      },
    },
    "& .MuiInputLabel-root": {
      color:
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.7)"
          : "rgba(0, 0, 0, 0.6)",
      "&.Mui-focused": {
        color: theme.palette.primary.main,
      },
    },
    "& .MuiSelect-select": {
      color: theme.palette.mode === "dark" ? "#fff" : "#000",
    },
  };

  const [registerMutation, { isLoading }] = useRegisterMutation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateField, setStateField] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [role] = useState("user"); // role is always 'user', no setter needed

  // Password validation functions
  const validatePassword = (password: string) => {
    const validations = {
      length: password.length >= 6 && password.length <= 20,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
    };
    return validations;
  };

  const passwordValidations = validatePassword(password);
  const isPasswordValid = Object.values(passwordValidations).every(Boolean);
  const doPasswordsMatch = password === confirmPassword && password.length > 0;

  // Name validation functions
  const validateName = (name: string) => {
    const validations = {
      length: name.length >= 2 && name.length <= 20,
      noSpecialChars: /^[a-zA-Z\s]+$/.test(name),
      noNumbers: !/\d/.test(name),
    };
    return validations;
  };

  const firstNameValidations = validateName(firstName);
  const lastNameValidations = validateName(lastName);
  const isFirstNameValid = Object.values(firstNameValidations).every(Boolean);
  const isLastNameValid = Object.values(lastNameValidations).every(Boolean);

  // Address and city validation functions
  const validateAddress = (address: string) => {
    const validations = {
      notOnlyNumbers: !/^\d+$/.test(address.trim()),
      hasLetters: /[a-zA-Z]/.test(address),
      hasNumbers: /\d/.test(address),
    };
    return validations;
  };

  const validateCity = (city: string) => {
    const validations = {
      length: city.length >= 2 && city.length <= 50,
      lettersOnly: /^[a-zA-Z\s]+$/.test(city),
      noNumbers: !/\d/.test(city),
    };
    return validations;
  };

  const addressValidations = validateAddress(address);
  const cityValidations = validateCity(city);
  const isAddressValid = Object.values(addressValidations).every(Boolean);
  const isCityValid = Object.values(cityValidations).every(Boolean);

  // Phone validation functions
  const validatePhone = (phone: string) => {
    // Remove all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, "");

    const validations = {
      length: digitsOnly.length === 10,
      hasDigits: /\d/.test(phone),
      noLetters: !/[a-zA-Z]/.test(phone),
    };
    return validations;
  };

  const phoneValidations = validatePhone(phone);
  const isPhoneValid = Object.values(phoneValidations).every(Boolean);

  // Zip code validation functions
  const validateZipCode = (zipCode: string) => {
    const validations = {
      length: zipCode.length === 5,
      digitsOnly: /^\d{5}$/.test(zipCode),
    };
    return validations;
  };

  const zipCodeValidations = validateZipCode(zipCode);
  const isZipCodeValid = Object.values(zipCodeValidations).every(Boolean);

  // US States data
  const usStates = [
    { code: "AL", name: "Alabama" },
    { code: "AK", name: "Alaska" },
    { code: "AZ", name: "Arizona" },
    { code: "AR", name: "Arkansas" },
    { code: "CA", name: "California" },
    { code: "CO", name: "Colorado" },
    { code: "CT", name: "Connecticut" },
    { code: "DE", name: "Delaware" },
    { code: "FL", name: "Florida" },
    { code: "GA", name: "Georgia" },
    { code: "HI", name: "Hawaii" },
    { code: "ID", name: "Idaho" },
    { code: "IL", name: "Illinois" },
    { code: "IN", name: "Indiana" },
    { code: "IA", name: "Iowa" },
    { code: "KS", name: "Kansas" },
    { code: "KY", name: "Kentucky" },
    { code: "LA", name: "Louisiana" },
    { code: "ME", name: "Maine" },
    { code: "MD", name: "Maryland" },
    { code: "MA", name: "Massachusetts" },
    { code: "MI", name: "Michigan" },
    { code: "MN", name: "Minnesota" },
    { code: "MS", name: "Mississippi" },
    { code: "MO", name: "Missouri" },
    { code: "MT", name: "Montana" },
    { code: "NE", name: "Nebraska" },
    { code: "NV", name: "Nevada" },
    { code: "NH", name: "New Hampshire" },
    { code: "NJ", name: "New Jersey" },
    { code: "NM", name: "New Mexico" },
    { code: "NY", name: "New York" },
    { code: "NC", name: "North Carolina" },
    { code: "ND", name: "North Dakota" },
    { code: "OH", name: "Ohio" },
    { code: "OK", name: "Oklahoma" },
    { code: "OR", name: "Oregon" },
    { code: "PA", name: "Pennsylvania" },
    { code: "RI", name: "Rhode Island" },
    { code: "SC", name: "South Carolina" },
    { code: "SD", name: "South Dakota" },
    { code: "TN", name: "Tennessee" },
    { code: "TX", name: "Texas" },
    { code: "UT", name: "Utah" },
    { code: "VT", name: "Vermont" },
    { code: "VA", name: "Virginia" },
    { code: "WA", name: "Washington" },
    { code: "WV", name: "West Virginia" },
    { code: "WI", name: "Wisconsin" },
    { code: "WY", name: "Wyoming" },
  ];

  // Helper function to check if a field has been touched
  const isFieldTouched = (fieldName: string) => touchedFields.has(fieldName);

  // Helper function to mark a field as touched
  const markFieldAsTouched = (fieldName: string) => {
    setTouchedFields((prev) => new Set(prev).add(fieldName));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (!isPasswordValid) {
      setError("Password does not meet the requirements.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!isFirstNameValid) {
      setError("First name does not meet the requirements.");
      return;
    }
    if (!isLastNameValid) {
      setError("Last name does not meet the requirements.");
      return;
    }
    if (!isAddressValid) {
      setError("Address must contain both letters and numbers.");
      return;
    }
    if (!isCityValid) {
      setError("City must contain only letters.");
      return;
    }
    if (!isPhoneValid) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }
    if (!isZipCodeValid) {
      setError("Zip code must be exactly 5 digits.");
      return;
    }
    if (!stateField) {
      setError("Please select a state.");
      return;
    }
    setError(null);
    try {
      const result = await registerMutation({
        email,
        password,
        role,
        firstName,
        lastName,
        phone,
        address,
        city,
        state: stateField,
        zipCode,
      }).unwrap();
      const { token, user } = result as { token: string; user: any };
      if (!token) throw new Error("No token received from server");
      if (!user) throw new Error("No user data received from server");
      const normalizedUser = { ...user, id: user.id || user._id };
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      dispatch(login(normalizedUser));
      // Invalidate API cache to ensure new token is used for subsequent requests
      dispatch(api.util.resetApiState());
      navigate("/");
    } catch (err: any) {
      setError(err.data?.message || err.message || "Registration failed");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100vw",
        backgroundColor: theme.palette.mode === "dark" ? "#23272f" : "#fff",
        color: theme.palette.mode === "dark" ? "#fff" : "#000",
        pt: { xs: "56px", sm: "64px" },
        minHeight: { xs: "calc(100vh - 56px)", sm: "calc(100vh - 64px)" },
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={0}
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "flex-start",
          pt: { xs: 0, sm: 4 },
          pb: { xs: 2, sm: 4 },
          px: { xs: 2, sm: 4 },
          borderRadius: { xs: 0, sm: 2 },
          backgroundColor: theme.palette.mode === "dark" ? "#23272f" : "#fff",
          color: theme.palette.mode === "dark" ? "#fff" : "#000",
          width: { xs: "100vw", sm: "50%" },
          maxWidth: { xs: "100vw", sm: "30rem" },
          gap: 2,
          alignSelf: "center",
          boxShadow: "none",
          border: "none",
          height: "100%",
        }}
      >
        <Typography variant="h4" sx={{ textAlign: "center", mb: 2 }}>
          Sign Up
        </Typography>
        {error && (
          <Typography color="error" sx={{ textAlign: "center" }}>
            {error}
          </Typography>
        )}
        <TextField
          label="Email"
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          sx={inputStyles}
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setShowPasswordValidation(true)}
          onBlur={() => {
            setShowPasswordValidation(false);
            markFieldAsTouched("password");
          }}
          error={isFieldTouched("password") && !isPasswordValid}
          helperText={
            isFieldTouched("password") && !isPasswordValid
              ? "Password does not meet requirements"
              : ""
          }
          sx={inputStyles}
          fullWidth
        />

        {/* Password Validation List */}
        {showPasswordValidation && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 1, display: "block" }}
            >
              Password Requirements:
            </Typography>
            <List dense sx={{ py: 0 }}>
              <ListItem sx={{ py: 0, px: 0 }}>
                <ListItemIcon sx={{ minWidth: 24 }}>
                  {passwordValidations.length ? (
                    <CheckCircleIcon color="success" fontSize="small" />
                  ) : (
                    <CancelIcon color="error" fontSize="small" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary="6-20 characters"
                  primaryTypographyProps={{ variant: "caption" }}
                />
              </ListItem>
              <ListItem sx={{ py: 0, px: 0 }}>
                <ListItemIcon sx={{ minWidth: 24 }}>
                  {passwordValidations.uppercase ? (
                    <CheckCircleIcon color="success" fontSize="small" />
                  ) : (
                    <CancelIcon color="error" fontSize="small" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary="At least one uppercase letter (A-Z)"
                  primaryTypographyProps={{ variant: "caption" }}
                />
              </ListItem>
              <ListItem sx={{ py: 0, px: 0 }}>
                <ListItemIcon sx={{ minWidth: 24 }}>
                  {passwordValidations.lowercase ? (
                    <CheckCircleIcon color="success" fontSize="small" />
                  ) : (
                    <CancelIcon color="error" fontSize="small" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary="At least one lowercase letter (a-z)"
                  primaryTypographyProps={{ variant: "caption" }}
                />
              </ListItem>
              <ListItem sx={{ py: 0, px: 0 }}>
                <ListItemIcon sx={{ minWidth: 24 }}>
                  {passwordValidations.number ? (
                    <CheckCircleIcon color="success" fontSize="small" />
                  ) : (
                    <CancelIcon color="error" fontSize="small" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary="At least one number (0-9)"
                  primaryTypographyProps={{ variant: "caption" }}
                />
              </ListItem>
            </List>
          </Box>
        )}

        <TextField
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          required
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={() => markFieldAsTouched("confirmPassword")}
          error={isFieldTouched("confirmPassword") && !doPasswordsMatch}
          helperText={
            isFieldTouched("confirmPassword") && !doPasswordsMatch
              ? "Passwords do not match"
              : ""
          }
          sx={inputStyles}
          fullWidth
        />
        <TextField
          label="First Name"
          value={firstName}
          required
          onChange={(e) => setFirstName(e.target.value)}
          onBlur={() => markFieldAsTouched("firstName")}
          error={isFieldTouched("firstName") && !isFirstNameValid}
          helperText={
            isFieldTouched("firstName") && !isFirstNameValid
              ? "First name must be 2-20 characters, letters only"
              : ""
          }
          sx={inputStyles}
          fullWidth
        />
        <TextField
          label="Last Name"
          value={lastName}
          required
          onChange={(e) => setLastName(e.target.value)}
          onBlur={() => markFieldAsTouched("lastName")}
          error={isFieldTouched("lastName") && !isLastNameValid}
          helperText={
            isFieldTouched("lastName") && !isLastNameValid
              ? "Last name must be 2-20 characters, letters only"
              : ""
          }
          sx={inputStyles}
          fullWidth
        />
        <TextField
          label="Phone"
          value={phone}
          required
          onChange={(e) => setPhone(e.target.value)}
          onBlur={() => markFieldAsTouched("phone")}
          error={isFieldTouched("phone") && !isPhoneValid}
          helperText={
            isFieldTouched("phone") && !isPhoneValid
              ? "Phone number must be exactly 10 digits"
              : ""
          }
          sx={inputStyles}
          fullWidth
        />
        <TextField
          label="Address"
          value={address}
          required
          onChange={(e) => setAddress(e.target.value)}
          onBlur={() => markFieldAsTouched("address")}
          error={isFieldTouched("address") && !isAddressValid}
          helperText={
            isFieldTouched("address") && !isAddressValid
              ? "Address must contain both letters and numbers"
              : ""
          }
          sx={inputStyles}
          fullWidth
        />
        <TextField
          label="City"
          value={city}
          required
          onChange={(e) => setCity(e.target.value)}
          onBlur={() => markFieldAsTouched("city")}
          error={isFieldTouched("city") && !isCityValid}
          helperText={
            isFieldTouched("city") && !isCityValid
              ? "City must contain only letters"
              : ""
          }
          sx={inputStyles}
          fullWidth
        />
        <FormControl fullWidth sx={selectStyles}>
          <InputLabel id="state-select-label">State</InputLabel>
          <Select
            labelId="state-select-label"
            value={stateField}
            label="State"
            onChange={(e) => setStateField(e.target.value)}
            onBlur={() => markFieldAsTouched("state")}
            error={isFieldTouched("state") && !stateField}
          >
            {usStates.map((state) => (
              <MenuItem key={state.code} value={state.code}>
                {state.code} - {state.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Zip Code"
          value={zipCode}
          required
          onChange={(e) => setZipCode(e.target.value)}
          onBlur={() => markFieldAsTouched("zipCode")}
          error={isFieldTouched("zipCode") && !isZipCodeValid}
          helperText={
            isFieldTouched("zipCode") && !isZipCodeValid
              ? "Zip code must be exactly 5 digits"
              : ""
          }
          sx={inputStyles}
          fullWidth
        />
        <MuiButton
          type="submit"
          variant="contained"
          disabled={
            isLoading ||
            !isPasswordValid ||
            !doPasswordsMatch ||
            !isFirstNameValid ||
            !isLastNameValid ||
            !isAddressValid ||
            !isCityValid ||
            !isPhoneValid ||
            !isZipCodeValid ||
            !stateField
          }
          sx={{ mb: 2 }}
          fullWidth
        >
          {isLoading ? "Registering..." : "Sign Up"}
        </MuiButton>
        <Typography sx={{ textAlign: "center", mt: 1, fontSize: "16px" }}>
          Already have an account?{" "}
          <Link
            to="/signin"
            style={{
              color: theme.palette.mode === "dark" ? "#90caf9" : "#0077cc",
              textDecoration: "none",
            }}
          >
            Sign In
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default SignUp;
