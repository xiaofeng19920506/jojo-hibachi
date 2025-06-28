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
import { Link } from "react-router-dom";

const SignUp: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!firstName || !lastName || !phone || !email || !address) {
      setError("Please fill in all fields.");
      return;
    }

    setError(null);
    // Replace this with your backend API call
    console.log("Signing up with:", {
      firstName,
      lastName,
      phone,
      email,
      address,
    });
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
          value={phone}
          required
          onChange={(e) => setPhone(e.target.value)}
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
        <Button type="submit">Sign Up</Button>

        <RegisterPrompt>
          Already have an account? <Link to="/signin">Sign In</Link>
        </RegisterPrompt>
      </Form>
    </SignInWrapper>
  );
};

export default SignUp;
