import { useState } from "react";
import { Step, StepLabel, Stepper, Box } from "@mui/material";
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
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleReset = () => setActiveStep(0);

  return (
    <Box
      sx={{ width: "100%", minWidth: "100vw", px: "2rem", mx: "auto", mt: 4 }}
    >
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 4 }}>
        {activeStep === 0 && <CustomerInfo onNext={handleNext} />}
        {activeStep === 1 && (
          <DateTime onNext={handleNext} onBack={handleBack} />
        )}
        {activeStep === 2 && (
          <DetailsAndPolicies onNext={handleNext} onBack={handleBack} />
        )}
        {activeStep === 3 && <Confirmation onReset={handleReset} />}
      </Box>
    </Box>
  );
};

export default ReservationStepper;
