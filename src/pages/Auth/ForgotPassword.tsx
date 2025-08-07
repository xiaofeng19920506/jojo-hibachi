import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { SignInWrapper, Form, Input, Title, ErrorMessage } from "./elements";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import { useForgotPasswordMutation } from "../../services/api";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await forgotPassword({ email }).unwrap();
      setSuccess(
        "If an account with that email exists, a password reset link has been sent."
      );
    } catch (err: any) {
      setError(
        err.data?.message || err.message || "Failed to send reset email."
      );
    }
  };

  return (
    <SignInWrapper>
      <Form onSubmit={handleSubmit}>
        <Title style={{ fontSize: 22 }}>Forgot Password</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && (
          <div style={{ color: "green", marginBottom: 8 }}>{success}</div>
        )}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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
          {isLoading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;
