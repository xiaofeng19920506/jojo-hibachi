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
import { login } from "../../features/userSlice";
import { useLoginMutation } from "../../services/api";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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
        username: email,
        password,
      }).unwrap();

      const { token, user } = result;

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
    <SignInWrapper>
      <Form onSubmit={handleSubmit}>
        <Title style={{ fontSize: 22 }}>Sign In</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          style={{ fontSize: 16, minHeight: 44, marginBottom: 8 }}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          style={{ fontSize: 16, minHeight: 44, marginBottom: 8 }}
        />
        <Button
          type="submit"
          disabled={isLoading}
          style={{ fontSize: 16, minHeight: 44, minWidth: 44 }}
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>

        <RegisterPrompt style={{ fontSize: "16px", marginTop: 8 }}>
          Don't have an account? <Link to="/signup">Register</Link>
        </RegisterPrompt>
      </Form>
    </SignInWrapper>
  );
};

export default SignIn;
