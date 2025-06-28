import { useState, type FormEvent } from "react";
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

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Both email and password are required.");
      return;
    }

    setError(null);
    console.log("Attempting login:", { email, password });
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />
        <Button type="submit">Sign In</Button>

        <RegisterPrompt>
          Don’t have an account? <Link to="/signup">Register</Link>
        </RegisterPrompt>
      </Form>
    </SignInWrapper>
  );
};

export default SignIn;
