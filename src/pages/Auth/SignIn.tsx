import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  SignInWrapper,
  Form,
  Input,
  Button,
  Title,
  ErrorMessage,
  RegisterPrompt,
} from "./elements";
import { useAppDispatch } from "../../utils/hooks";
import { login, logout } from "../../features/userSlice";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Token verification is now handled by AuthInitializer component

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Both email and password are required.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: email,
            password,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Login API only returns token, we need to verify it to get user info
      const token =
        data.token || data.jwtToken || data.accessToken || data.access_token;

      if (!token) {
        throw new Error("No token received from server");
      }

      console.log("Login response:", data); // Debug log
      console.log("Token:", token); // Debug log

      // Store the token
      localStorage.setItem("authToken", token);

      // Now verify the token to get user information
      try {
        const verifyResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/auth/verifyToken`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const verifyData = await verifyResponse.json();
        console.log("Verify token response:", verifyData); // Debug log

        if (
          verifyResponse.ok &&
          (verifyData.status === "success" ||
            verifyData.valid === true ||
            verifyData.isValid === true)
        ) {
          const user = verifyData.user || verifyData.data || verifyData;
          dispatch(login(user));
          navigate("/");
        } else {
          throw new Error("Token verification failed");
        }
      } catch (verifyError) {
        console.error("Error verifying token:", verifyError);
        localStorage.removeItem("authToken");
        throw new Error("Failed to verify authentication");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignInWrapper>
      <Form onSubmit={handleSubmit}>
        <Title>Sign In</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </Button>

        <RegisterPrompt>
          Don’t have an account? <Link to="/signup">Register</Link>
        </RegisterPrompt>
      </Form>
    </SignInWrapper>
  );
};

export default SignIn;
