import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import { setCustomerInfo } from "../../features/userSlice";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const DetailsAndPolicies: React.FC<Props> = ({ onNext, onBack }) => {
  const dispatch = useAppDispatch();
  const { customerInfo } = useAppSelector((state) => state.user);
  const { allergies, adult, kids, eventType, notes } = customerInfo;
  const [adultGuests, setAdultGuests] = useState<number | "">(adult || "");
  const [kidGuests, setKidGuests] = useState<number | "">(kids || "");
  const [inputAllergies, setInputAllergies] = useState(allergies || "");
  const [inputEventType, setInputEventType] = useState(eventType || "");
  const [inputNotes, setInputNotes] = useState(notes || "");
  const [errors, setErrors] = useState({
    guests: "",
    adult: "",
    kids: "",
  });

  const handleNext = () => {
    let formValid = true;
    const newErrors = { guests: "", adult: "", kids: "" };

    const adultCount = Number(adultGuests) || 0;
    const kidCount = Number(kidGuests) || 0;

    if (adultCount + kidCount === 0) {
      newErrors.guests = "Please enter at least one guest.";
      formValid = false;
    }

    if (adultCount < 0) {
      newErrors.adult = "Cannot be negative.";
      formValid = false;
    }

    if (kidCount < 0) {
      newErrors.kids = "Cannot be negative.";
      formValid = false;
    }

    setErrors(newErrors);

    if (!formValid) return;

    dispatch(
      setCustomerInfo({
        ...customerInfo,
        adult: adultCount,
        kids: kidCount,
        allergies: inputAllergies.trim(),
        eventType: inputEventType.trim(),
        notes: inputNotes.trim(),
      })
    );

    onNext();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h6">Pricing: $50 per adult, $25 per kid</Typography>

      <TextField
        label="Number of Adult Guests"
        type="number"
        value={adultGuests}
        onChange={(e) =>
          setAdultGuests(e.target.value === "" ? "" : Number(e.target.value))
        }
        required
        error={Boolean(errors.adult)}
        helperText={errors.adult}
      />

      <TextField
        label="Number of Kid Guests"
        type="number"
        value={kidGuests}
        onChange={(e) =>
          setKidGuests(e.target.value === "" ? "" : Number(e.target.value))
        }
        error={Boolean(errors.kids)}
        helperText={errors.kids}
      />

      {errors.guests && (
        <Typography color="error" variant="caption">
          {errors.guests}
        </Typography>
      )}

      <TextField
        label="Food Allergies"
        multiline
        rows={2}
        value={inputAllergies}
        onChange={(e) => setInputAllergies(e.target.value)}
      />

      <TextField
        label="Event Type"
        value={inputEventType}
        onChange={(e) => setInputEventType(e.target.value)}
      />

      <TextField
        label="Additional Notes"
        multiline
        rows={3}
        value={inputNotes}
        onChange={(e) => setInputNotes(e.target.value)}
      />

      <Typography variant="body2">
        * By continuing, you agree to our Terms & Conditions, Cancellation, and
        Weather Policy.
      </Typography>

      <Box display="flex" justifyContent="space-between">
        <Button onClick={onBack}>Back</Button>
        <Button variant="contained" onClick={handleNext}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default DetailsAndPolicies;
