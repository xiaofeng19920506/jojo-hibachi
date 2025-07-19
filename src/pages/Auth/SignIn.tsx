import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
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
import { useLoginMutation } from "../../services/api";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useTheme();

  // RTK Query login mutation
  const [loginMutation, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Both email and password are required.");
      return;
    }
    setError(null);

    try {
      const result = await loginMutation({
        email,
        password,
      }).unwrap();
      const { token, user } = result as { token: string; user: any };

      if (!token) {
        throw new Error("No token received from server");
      }

      if (!user) {
        throw new Error("No user data received from server");
      }

      // Normalize user object to always have an id field
      const normalizedUser = { ...user, id: user.id || user._id };
      console.log("LOGIN USER OBJECT:", normalizedUser);
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      dispatch(login(normalizedUser));
      navigate("/");
    } catch (err: any) {
      setError(err.data?.message || err.message || "Login failed");
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
        }}
      >
        <Typography variant="h4" sx={{ textAlign: "center", mb: 2 }}>
          Sign In
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
        <MuiButton
          type="submit"
          variant="contained"
          disabled={isLoading}
          sx={{ mb: 2 }}
          fullWidth
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </MuiButton>
        <Box sx={{ textAlign: "center", mt: 1 }}>
          <Link
            to="/forgot-password"
            style={{ 
              fontSize: 16, 
              color: theme.palette.mode === "dark" ? "#90caf9" : "#0077cc", 
              textDecoration: "none" 
            }}
          >
            Forgot Password?
          </Link>
        </Box>
        <Typography sx={{ textAlign: "center", mt: 1, fontSize: "16px" }}>
          Don't have an account?{" "}
          <Link
            to="/signup"
            style={{ 
              color: theme.palette.mode === "dark" ? "#90caf9" : "#0077cc", 
              textDecoration: "none" 
            }}
          >
            Register
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default SignIn;
