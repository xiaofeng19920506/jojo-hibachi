import { useState, type FormEvent } from "react";
import {
  Box,
  TextField,
  Button as MuiButton,
  Typography,
  Paper,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../services/api";
import { useTheme } from "@mui/material/styles";

const SignUp: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [register] = useRegisterMutation();
  const theme = useTheme();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !email ||
      !streetAddress ||
      !city ||
      !state ||
      !zipCode ||
      !password
    ) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Format address fields with smart title case
      const toSmartTitleCase = (str: string) => {
        const smallWords = [
          "van",
          "de",
          "of",
          "and",
          "the",
          "in",
          "on",
          "at",
          "by",
          "for",
          "with",
          "a",
          "an",
        ];
        return str
          .toLowerCase()
          .split(" ")
          .map((word, i) => {
            if (word.startsWith("mc") && word.length > 2) {
              return "Mc" + word.charAt(2).toUpperCase() + word.slice(3);
            }
            if (word.startsWith("mac") && word.length > 3) {
              return "Mac" + word.charAt(3).toUpperCase() + word.slice(4);
            }
            if (word.includes("'")) {
              return word
                .split("'")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join("'");
            }
            if (i !== 0 && smallWords.includes(word)) {
              return word;
            }
            return word.charAt(0).toUpperCase() + word.slice(1);
          })
          .join(" ");
      };

      const formattedAddress = toSmartTitleCase(streetAddress.trim());
      const formattedCity = toSmartTitleCase(city.trim());
      const formattedState = state.trim().slice(0, 2).toUpperCase();
      const formattedZip = zipCode.trim();
      const fullAddress =
        `${formattedAddress}, ${formattedCity}, ${formattedState}, ${formattedZip}`
          .replace(/\s+/g, " ")
          .trim();

      const result = await register({
        email,
        password,
        role: "user",
        firstName:
          firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase(),
        lastName:
          lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase(),
        phone: phoneNumber,
        address: fullAddress,
        city: formattedCity,
        state: formattedState,
        zipCode: formattedZip,
      }).unwrap();
      localStorage.setItem("authToken", (result as { token: string }).token);
      // Note: The user will be automatically logged in by AuthInitializer
      // when they navigate to the dashboard
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.data?.message || err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: theme.palette.mode === "dark" ? "#000" : "#f0f2f5",
        color: theme.palette.mode === "dark" ? "#fff" : "#000",
        pt: 8, // Add top padding to account for the App-level GlobalAppBar
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={3}
        sx={{
          padding: 4,
          borderRadius: 2,
          backgroundColor: theme.palette.mode === "dark" ? "#1a1a1a" : "white",
          color: theme.palette.mode === "dark" ? "#fff" : "#000",
          width: "50%",
          maxWidth: "30rem",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxHeight: "90vh",
          overflow: "auto",
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
          label="Phone Number"
          value={phoneNumber}
          required
          onChange={(e) => setPhoneNumber(e.target.value)}
          sx={{ mb: 2 }}
          fullWidth
        />
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
          label="Street Address"
          value={streetAddress}
          required
          onChange={(e) => setStreetAddress(e.target.value)}
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
          value={state}
          required
          onChange={(e) => setState(e.target.value)}
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
        <TextField
          label="Password"
          type="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
          fullWidth
        />
        <MuiButton
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{ mb: 2 }}
          fullWidth
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </MuiButton>
        <Typography sx={{ textAlign: "center", mt: 1, fontSize: "16px" }}>
          Already have an account?{" "}
          <Link
            to="/signin"
            style={{ 
              color: theme.palette.mode === "dark" ? "#90caf9" : "#0077cc", 
              textDecoration: "none" 
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
