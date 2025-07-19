import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  TextField,
  Button as MuiButton,
  Typography,
  Paper,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useAppDispatch } from "../../utils/hooks";
import { login } from "../../features/userSlice";
import { useRegisterMutation } from "../../services/api";

const SignUp: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const [registerMutation, { isLoading }] = useRegisterMutation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateField, setStateField] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [role] = useState("user"); // role is always 'user', no setter needed

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
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
          sx={{ mb: 2 }}
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
          fullWidth
        />
        <TextField
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          required
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={{ mb: 2 }}
          fullWidth
        />
        <TextField
          label="First Name"
          value={firstName}
          required
          onChange={(e) => setFirstName(e.target.value)}
          sx={{ mb: 2 }}
          fullWidth
        />
        <TextField
          label="Last Name"
          value={lastName}
          required
          onChange={(e) => setLastName(e.target.value)}
          sx={{ mb: 2 }}
          fullWidth
        />
        <TextField
          label="Phone"
          value={phone}
          required
          onChange={(e) => setPhone(e.target.value)}
          sx={{ mb: 2 }}
          fullWidth
        />
        <TextField
          label="Address"
          value={address}
          required
          onChange={(e) => setAddress(e.target.value)}
          sx={{ mb: 2 }}
          fullWidth
        />
        <TextField
          label="City"
          value={city}
          required
          onChange={(e) => setCity(e.target.value)}
          sx={{ mb: 2 }}
          fullWidth
        />
        <TextField
          label="State"
          value={stateField}
          required
          onChange={(e) => setStateField(e.target.value)}
          sx={{ mb: 2 }}
          fullWidth
        />
        <TextField
          label="Zip Code"
          value={zipCode}
          required
          onChange={(e) => setZipCode(e.target.value)}
          sx={{ mb: 2 }}
          fullWidth
        />
        <MuiButton
          type="submit"
          variant="contained"
          disabled={isLoading}
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
