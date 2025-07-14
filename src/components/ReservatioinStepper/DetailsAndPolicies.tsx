import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import { setCustomerInfo } from "../../features/userSlice";
import { useCreateReservationMutation } from "../../services/api";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const DetailsAndPolicies: React.FC<Props> = ({ onNext, onBack }) => {
  const dispatch = useAppDispatch();
  const { customerInfo } = useAppSelector((state) => state.user);
  const { allergies, adult, kids, eventType, notes } = customerInfo;

  const [adultGuests, setAdultGuests] = useState<number | "">(adult || "");
  const [kidGuests, setKidGuests] = useState<number | "">(kids ?? 0);
  const [inputAllergies, setInputAllergies] = useState(allergies || "");
  const [inputEventType, setInputEventType] = useState(eventType || "");
  const [inputNotes, setInputNotes] = useState(notes || "");

  const [errors, setErrors] = useState({
    adult: "",
    kids: "",
    guests: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [createReservation] = useCreateReservationMutation();

  const validateAdultGuests = () => {
    let error = "";
    if (
      adultGuests === "" ||
      isNaN(Number(adultGuests)) ||
      !Number.isInteger(Number(adultGuests)) ||
      Number(adultGuests) < 0
    ) {
      error = "Enter a valid non-negative integer.";
    }
    setErrors((prev) => ({ ...prev, adult: error }));
    return error === "";
  };

  const validateKidGuests = () => {
    let error = "";
    if (
      kidGuests === "" ||
      isNaN(Number(kidGuests)) ||
      !Number.isInteger(Number(kidGuests)) ||
      Number(kidGuests) < 0
    ) {
      error = "Enter a valid non-negative integer.";
    }
    setErrors((prev) => ({ ...prev, kids: error }));
    return error === "";
  };

  const validateTotalGuests = () => {
    const total = (Number(adultGuests) || 0) + (Number(kidGuests) || 0);
    const error = total === 0 ? "Please enter at least one guest." : "";
    setErrors((prev) => ({ ...prev, guests: error }));
    return error === "";
  };

  const handleNext = async () => {
    const isAdultValid = validateAdultGuests();
    const isKidValid = validateKidGuests();
    const isGuestTotalValid = validateTotalGuests();
    if (!isAdultValid || !isKidValid || !isGuestTotalValid) return;

    const updatedInfo = {
      ...customerInfo,
      adult: Number(adultGuests),
      kids: Number(kidGuests),
      allergies: inputAllergies.trim() || "",
      eventType: inputEventType.trim() || "",
      notes: inputNotes.trim() || "",
    };

    // Defensive check for required name fields
    if (!updatedInfo.firstName || !updatedInfo.lastName) {
      setSubmitError(
        "First name and last name are required. Please fill out your information."
      );
      setLoading(false);
      return;
    }

    // Transform date fields for backend
    const { reservationYear, reservationMonth, reservationDay, id, ...rest } =
      updatedInfo;
    if (!reservationYear || !reservationMonth || !reservationDay) {
      setSubmitError("Reservation date is missing. Please select a date.");
      setLoading(false);
      return;
    }
    const payload = {
      ...rest,
      reservationDate: {
        year: String(reservationYear),
        month: String(reservationMonth),
        day: String(reservationDay),
      },
      timeStamp: new Date(),
    };

    try {
      setLoading(true);
      setSubmitError(null);
      const result = await createReservation(payload).unwrap();
      const reservationObj = result.data || {};
      dispatch(setCustomerInfo(reservationObj));
      onNext();
    } catch (err: any) {
      setSubmitError(
        err.data?.message || err.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h6">Pricing: $50 per adult, $25 per kid</Typography>

      <TextField
        label="Number of Adult Guests"
        type="number"
        value={adultGuests}
        onChange={(e) => {
          const value = e.target.value;
          setAdultGuests(value === "" ? "" : Number(value));
        }}
        onBlur={validateAdultGuests}
        required
        error={Boolean(errors.adult)}
        helperText={errors.adult}
      />

      <TextField
        label="Number of Kid Guests"
        type="number"
        value={kidGuests}
        onChange={(e) => {
          const value = e.target.value;
          setKidGuests(value === "" ? "" : Number(value));
        }}
        onBlur={validateKidGuests}
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

      {submitError && (
        <Typography color="error" variant="body2">
          {submitError}
        </Typography>
      )}

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Button onClick={onBack}>Back</Button>
        <Button variant="contained" onClick={handleNext} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Next"}
        </Button>
      </Box>
    </Box>
  );
};

export default DetailsAndPolicies;
