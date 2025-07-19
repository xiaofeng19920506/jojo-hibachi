import { useLocation, useNavigate } from "react-router-dom";
import { SignInWrapper, Title } from "./elements";
import Button from "@mui/material/Button";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";

const ResetPasswordResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const params = new URLSearchParams(location.search);
  const status = params.get("status");
  const message = params.get("message");
  const [countdown, setCountdown] = useState(5);

  // Auto-redirect after 5 seconds for success
  useEffect(() => {
    if (status === "success") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            navigate("/signin");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [status, navigate]);

  return (
    <SignInWrapper>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={3}
        sx={{ width: "100%", maxWidth: "400px" }}
      >
        <Title style={{ fontSize: 22 }}>
          {status === "success"
            ? "Password Reset Successful"
            : "Password Reset Failed"}
        </Title>

        <Typography
          variant="body1"
          sx={{
            color: status === "success" ? "success.main" : "error.main",
            textAlign: "center",
            fontSize: "16px",
            lineHeight: 1.5,
          }}
        >
          {message ||
            (status === "success"
              ? `You can now sign in with your new password. Redirecting to sign in page in ${countdown} seconds...`
              : "Something went wrong. Please try again.")}
        </Typography>

        {status === "success" ? (
          <Button
            variant="contained"
            onClick={() => navigate("/signin")}
            sx={{
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "#000"
                  : theme.palette.primary.main,
              color: "#fff",
              fontSize: "18px",
              fontWeight: 600,
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "#333"
                    : theme.palette.primary.dark,
              },
            }}
          >
            Go to Sign In Now ({countdown}s)
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={() => navigate("/reset-password")}
            sx={{
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "#000"
                  : theme.palette.primary.main,
              color: "#fff",
              fontSize: "18px",
              fontWeight: 600,
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "#333"
                    : theme.palette.primary.dark,
              },
            }}
          >
            Try Again
          </Button>
        )}
      </Box>
    </SignInWrapper>
  );
};

export default ResetPasswordResult;
