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
import { useRegisterMutation } from "../../services/api";

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
      const result = await register({
        email,
        password,
        role: "user",
        firstName,
        lastName,
        phone: phoneNumber,
        address: streetAddress,
        city,
        state,
        zipCode,
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
    <SignInWrapper>
      <Form onSubmit={handleSubmit}>
        <Title style={{ fontSize: 22 }}>Sign Up</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Input
          type="text"
          placeholder="First Name"
          value={firstName}
          required
          onChange={(e) => setFirstName(e.target.value)}
          style={{ fontSize: 16, minHeight: 44, marginBottom: 8 }}
        />
        <Input
          type="text"
          placeholder="Last Name"
          value={lastName}
          required
          onChange={(e) => setLastName(e.target.value)}
          style={{ fontSize: 16, minHeight: 44, marginBottom: 8 }}
        />
        <Input
          type="tel"
          placeholder="Phone Number"
          value={phoneNumber}
          required
          onChange={(e) => setPhoneNumber(e.target.value)}
          style={{ fontSize: 16, minHeight: 44, marginBottom: 8 }}
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          style={{ fontSize: 16, minHeight: 44, marginBottom: 8 }}
        />
        <Input
          type="text"
          placeholder="Street Address"
          value={streetAddress}
          required
          onChange={(e) => setStreetAddress(e.target.value)}
          style={{ fontSize: 16, minHeight: 44, marginBottom: 8 }}
        />
        <Input
          type="text"
          placeholder="City"
          value={city}
          required
          onChange={(e) => setCity(e.target.value)}
          style={{ fontSize: 16, minHeight: 44, marginBottom: 8 }}
        />
        <Input
          type="text"
          placeholder="State"
          value={state}
          required
          onChange={(e) => setState(e.target.value)}
          style={{ fontSize: 16, minHeight: 44, marginBottom: 8 }}
        />
        <Input
          type="text"
          placeholder="Zip Code"
          value={zipCode}
          required
          onChange={(e) => setZipCode(e.target.value)}
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
          disabled={loading}
          style={{ fontSize: 16, minHeight: 44, minWidth: 44 }}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </Button>

        <RegisterPrompt style={{ fontSize: "16px", marginTop: 8 }}>
          Already have an account? <Link to="/signin">Sign In</Link>
        </RegisterPrompt>
      </Form>
    </SignInWrapper>
  );
};

export default SignUp;
