import { useState, type FormEvent } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  SignInWrapper,
  Form,
  Input,
  Button,
  Title,
  ErrorMessage,
} from "./elements";
import { useResetPasswordMutation } from "../../services/api";

const ResetPassword: React.FC = () => {
  const { token: tokenFromPath } = useParams<{ token?: string }>();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tokenFromQuery = params.get("token");
  const token = tokenFromPath || tokenFromQuery;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const navigate = useNavigate();

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
      await resetPassword({ token, password }).unwrap();
      setSuccess("Password reset successful. You can now sign in.");
    } catch (err: any) {
      setError(err.data?.message || err.message || "Failed to reset password.");
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
          disabled={isLoading}
          style={{ fontSize: 16, minHeight: 44, minWidth: 44 }}
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </Button>
        <Button
          type="button"
          style={{ fontSize: 16, minHeight: 44, minWidth: 44, marginTop: 8 }}
          onClick={() => navigate("/signin")}
        >
          Back to Sign In
        </Button>
      </Form>
    </SignInWrapper>
  );
};

export default ResetPassword;
