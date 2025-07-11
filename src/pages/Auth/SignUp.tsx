import { useState, type FormEvent } from "react";
import {
  SignInWrapper,
  Form,
  Input,
  Button,
  Title,
  ErrorMessage,
  RegisterPrompt,
} from "./elements";
import { Link, useNavigate } from "react-router-dom";

const SignUp: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !email ||
      !address ||
      !password
    ) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: email,
            password,
            role: "user",
            firstName,
            lastName,
            phoneNumber,
            address,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      localStorage.setItem("authToken", data.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignInWrapper>
      <Form onSubmit={handleSubmit}>
        <Title>Sign Up</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Input
          type="text"
          placeholder="First Name"
          value={firstName}
          required
          onChange={(e) => setFirstName(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Last Name"
          value={lastName}
          required
          onChange={(e) => setLastName(e.target.value)}
        />
        <Input
          type="tel"
          placeholder="Phone Number"
          value={phoneNumber}
          required
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Address"
          value={address}
          required
          onChange={(e) => setAddress(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </Button>

        <RegisterPrompt>
          Already have an account? <Link to="/signin">Sign In</Link>
        </RegisterPrompt>
      </Form>
    </SignInWrapper>
  );
};

export default SignUp;
