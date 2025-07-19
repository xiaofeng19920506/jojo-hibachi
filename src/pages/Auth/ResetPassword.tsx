import { useState, type FormEvent } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { SignInWrapper, Form, Input, Title, ErrorMessage } from "./elements";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import { useResetPasswordMutation } from "../../services/api";

const ResetPassword: React.FC = () => {
  const { token: tokenFromPath } = useParams<{ token?: string }>();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tokenFromQuery = params.get("token");
  const emailParam = params.get("email");
  const token = tokenFromPath || tokenFromQuery;
  // Decode email (convert %40 to @ and other encoded chars)
  const email = emailParam ? decodeURIComponent(emailParam) : undefined;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!token) {
      setError("Invalid or missing token.");
      return;
    }
    if (!password || !confirmPassword) {
      setError("Please enter and confirm your new password.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await resetPassword({ token, password, email }).unwrap();
      navigate("/reset-password-result?status=success");
    } catch (err: any) {
      const msg = encodeURIComponent(
        err.data?.message || err.message || "Failed to reset password."
      );
      navigate(`/reset-password-result?status=fail&message=${msg}`);
    }
  };

  return (
    <SignInWrapper>
      <Form onSubmit={handleSubmit}>
        <Title style={{ fontSize: 22 }}>Reset Password</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && (
          <div style={{ color: "green", marginBottom: 8 }}>{success}</div>
        )}
        <Input
          type="password"
          placeholder="New Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          style={{ fontSize: 16, minHeight: 44, marginBottom: 8 }}
        />
        <Input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          required
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{ fontSize: 16, minHeight: 44, marginBottom: 8 }}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          sx={{
            marginTop: 2,
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.primary.main
                : theme.palette.primary.main,
            color: theme.palette.mode === "dark" ? "#000" : "#fff",
            fontSize: "18px",
            fontWeight: 600,
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.primary.dark
                  : theme.palette.primary.dark,
              color: theme.palette.mode === "dark" ? "#000" : "#fff",
            },
          }}
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </Button>
        <Button
          type="button"
          variant="contained"
          onClick={() => navigate("/signin")}
          sx={{
            marginTop: 2,
            backgroundColor:
              theme.palette.mode === "dark"
                ? "#000"
                : theme.palette.secondary.main,
            color: theme.palette.mode === "dark" ? "#fff" : "#fff",
            fontSize: "18px",
            fontWeight: 600,
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "#333"
                  : theme.palette.secondary.dark,
              color: theme.palette.mode === "dark" ? "#fff" : "#fff",
            },
          }}
        >
          Back to Sign In
        </Button>
      </Form>
    </SignInWrapper>
  );
};

export default ResetPassword;
