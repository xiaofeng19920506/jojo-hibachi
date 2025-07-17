import { useLocation, useNavigate } from "react-router-dom";
import { SignInWrapper, Title, Button } from "./elements";

const ResetPasswordResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const status = params.get("status");
  const message = params.get("message");

  return (
    <SignInWrapper>
      <Title style={{ fontSize: 22 }}>
        {status === "success"
          ? "Password Reset Successful"
          : "Password Reset Failed"}
      </Title>
      <div
        style={{
          marginBottom: 16,
          color: status === "success" ? "green" : "red",
        }}
      >
        {message ||
          (status === "success"
            ? "You can now sign in with your new password."
            : "Something went wrong. Please try again.")}
      </div>
      {status === "success" ? (
        <Button onClick={() => navigate("/signin")}>Go to Sign In</Button>
      ) : (
        <Button onClick={() => navigate("/reset-password")}>Try Again</Button>
      )}
    </SignInWrapper>
  );
};

export default ResetPasswordResult;
