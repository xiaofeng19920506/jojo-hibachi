import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  SignInWrapper,
  Form,
  Input,
  Button,
  Title,
  ErrorMessage,
} from "./elements";
import { useForgotPasswordMutation } from "../../services/api";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const navigate = useNavigate();

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
          onChange={(e) => setEmail(e.target.value)}
          style={{ fontSize: 16, minHeight: 44, marginBottom: 8 }}
        />
        <Button
          type="submit"
          disabled={isLoading}
          style={{ fontSize: 16, minHeight: 44, minWidth: 44 }}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </Button>
        <Button
          type="button"
          variant="outlined"
          style={{ fontSize: 16, minHeight: 44, minWidth: 44, marginTop: 8 }}
          onClick={() => navigate("/signin")}
        >
          Back to Sign In
        </Button>
      </Form>
    </SignInWrapper>
  );
};

export default ForgotPassword;
