import { useState } from "react";
import { Step, StepLabel, Stepper, Box, Container, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CustomerInfo from "./CustomerInfo";
import DateTime from "./DateTime";
import DetailsAndPolicies from "./DetailsAndPolicies";
import Confirmation from "./Confirmation";

const steps = [
  "Customer Info",
  "Date & Time",
  "Details & Policy",
  "Confirmation",
];

const ReservationStepper = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleReset = () => setActiveStep(0);

  return (
    <Box
      sx={{
        minHeight: { xs: "calc(100vh - 56px)", sm: "calc(100vh - 64px)" },
        width: "100vw",
        bgcolor: theme.palette.mode === "dark" ? "#000" : "grey.50",
        display: "flex",
        flexDirection: "column",
        pt: { xs: 0, sm: 8 }, // Remove top padding on mobile, keep on desktop
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          flex: 1,
          py: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            bgcolor: "background.paper",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          }}
        >
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              mb: 4,
              "& .MuiStepLabel-root .Mui-completed": {
                color: "success.main",
              },
              "& .MuiStepLabel-root .Mui-active": {
                color: "primary.main",
              },
              "& .MuiStepConnector-alternativeLabel": {
                top: 10,
                left: "calc(-50% + 16px)",
                right: "calc(50% + 16px)",
              },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel
                  sx={{
                    "& .MuiStepLabel-label": {
                      fontSize: "1rem",
                      fontWeight: 500,
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box
            sx={{
              mt: 4,
              minHeight: "400px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {activeStep === 0 && <CustomerInfo onNext={handleNext} />}
            {activeStep === 1 && (
              <DateTime onNext={handleNext} onBack={handleBack} />
            )}
            {activeStep === 2 && (
              <DetailsAndPolicies onNext={handleNext} onBack={handleBack} />
            )}
            {activeStep === 3 && (
              <Confirmation onReset={handleReset} onBack={handleBack} />
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ReservationStepper;
