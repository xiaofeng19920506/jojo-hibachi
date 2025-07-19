import { useState, useEffect, type FormEvent } from "react";
import {
  Box,
  TextField,
  Button as MuiButton,
  Typography,
  Paper,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "../../services/api";

const Profile: React.FC = () => {
  const theme = useTheme();
  const {
    data: profile,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetUserProfileQuery();
  const [updateUserProfile, { isLoading: isSaving }] =
    useUpdateUserProfileMutation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Handler for refresh profile button
  const handleRefreshProfile = async () => {
    try {
      setFormError(null);
      setSuccess(null);
      const result = await refetch();
      
      // Manually update form fields with fresh data
      const user = result.data?.data?.user;
      if (user) {
        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
        setPhone(user.phone || user.phoneNumber || "");
        setEmail(user.email || "");

        // Parse address: "street address, city, state, zipcode"
        if (user.address) {
          const parts = user.address.split(",");
          setAddress(parts[0]?.trim() || "");
          setCity(parts[1]?.trim() || "");
          setState(parts[2]?.trim() || "");
          setZipCode(parts[3]?.trim() || "");
        } else {
          setAddress("");
          setCity("");
          setState("");
          setZipCode("");
        }
      }
      
      setSuccess("Profile refreshed successfully.");
    } catch (err: any) {
      setFormError("Failed to refresh profile. Please try again.");
    }
  };

  // Prefill form when profile data arrives
  useEffect(() => {
    const user = profile?.data?.user;
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPhone(user.phone || user.phoneNumber || "");
      setEmail(user.email || "");

      // Parse address: "street address, city, state, zipcode"
      if (user.address) {
        const parts = user.address.split(",");
        setAddress(parts[0]?.trim() || "");
        setCity(parts[1]?.trim() || "");
        setState(parts[2]?.trim() || "");
        setZipCode(parts[3]?.trim() || "");
      } else {
        setAddress("");
        setCity("");
        setState("");
        setZipCode("");
      }
    }
  }, [profile]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setSuccess(null);
    try {
      // Capitalize first letter of each word in address and city, handle special cases
      const toSmartTitleCase = (str: string) => {
        const smallWords = [
          "van",
          "de",
          "of",
          "and",
          "the",
          "in",
          "on",
          "at",
          "by",
          "for",
          "with",
          "a",
          "an",
        ];
        return str
          .toLowerCase()
          .split(" ")
          .map((word, i) => {
            if (word.startsWith("mc") && word.length > 2) {
              return "Mc" + word.charAt(2).toUpperCase() + word.slice(3);
            }
            if (word.startsWith("mac") && word.length > 3) {
              return "Mac" + word.charAt(3).toUpperCase() + word.slice(4);
            }
            if (word.includes("'")) {
              return word
                .split("'")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join("'");
            }
            if (i !== 0 && smallWords.includes(word)) {
              return word;
            }
            return word.charAt(0).toUpperCase() + word.slice(1);
          })
          .join(" ");
      };
      const formattedAddress = toSmartTitleCase(address.trim());
      const formattedCity = toSmartTitleCase(city.trim());
      const formattedState = state.trim().slice(0, 2).toUpperCase();
      const formattedZip = zipCode.trim();
      const fullAddress =
        `${formattedAddress}, ${formattedCity}, ${formattedState}, ${formattedZip}`
          .replace(/\s+/g, " ")
          .trim();
      await updateUserProfile({
        firstName:
          firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase(),
        lastName:
          lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase(),
        phone,
        email,
        address: fullAddress,
        city: formattedCity,
        state: formattedState,
        zipCode: formattedZip,
      }).unwrap();
      setSuccess("Profile updated successfully.");
      refetch(); // Optionally refresh profile after update
    } catch (err: any) {
      setFormError(err.data?.message || err.message || "Update failed.");
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
          backgroundColor: theme.palette.mode === "dark" ? "#000" : "#f0f2f5",
          color: theme.palette.mode === "dark" ? "#fff" : "#000",
        }}
      >
        Loading...
      </Box>
    );
  }

  if (isError) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
          backgroundColor: theme.palette.mode === "dark" ? "#000" : "#f0f2f5",
          color: theme.palette.mode === "dark" ? "#fff" : "#000",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography color="error" sx={{ mb: 2 }}>
            Failed to load profile:{" "}
            {(error as any)?.data?.message ||
              (error as any)?.message ||
              "Unknown error"}
          </Typography>
          <MuiButton variant="contained" onClick={() => refetch()}>
            Retry
          </MuiButton>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: { xs: "flex-start", sm: "center" },
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: theme.palette.mode === "dark" ? "#000" : "#f0f2f5",
        color: theme.palette.mode === "dark" ? "#fff" : "#000",
        pt: { xs: 0, sm: 8 }, // Remove top padding on mobile, keep on desktop
        // Mobile specific styling
        "@media (max-width: 600px)": {
          padding: 0,
          margin: 0,
          alignItems: "flex-start",
          overflow: "auto",
        },
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={3}
        sx={{
          padding: { xs: 2, sm: 4 },
          borderRadius: { xs: 0, sm: 2 },
          backgroundColor: theme.palette.mode === "dark" ? "#1a1a1a" : "white",
          color: theme.palette.mode === "dark" ? "#fff" : "#000",
          width: { xs: "100%", sm: "50%" },
          maxWidth: { xs: "100%", sm: "30rem" },
          minHeight: { xs: "100vh", sm: "auto" },
          display: "flex",
          flexDirection: "column",
          gap: 2,
          // Mobile specific styling
          "@media (max-width: 600px)": {
            margin: 0,
            borderRadius: 0,
            width: "100%",
            minHeight: "100vh",
            justifyContent: "flex-start",
            overflow: "auto",
            paddingTop: "80px", // Add space for the app bar
          },
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            textAlign: "center", 
            mb: 2,
            color: theme.palette.mode === "dark" ? "#fff" : "#000",
            "@media (max-width: 600px)": {
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: 3,
            },
          }}
        >
          My Profile
        </Typography>
        {formError && (
          <Typography color="error" sx={{ textAlign: "center" }}>
            {formError}
          </Typography>
        )}
        {success && (
          <Typography color="success.main" sx={{ textAlign: "center" }}>
            {success}
          </Typography>
        )}
        <TextField
          label="First Name"
          value={firstName}
          required
          onChange={(e) => setFirstName(e.target.value)}
          sx={{ mb: 2 }}
          fullWidth
        />
        <TextField
          label="Last Name"
          value={lastName}
          required
          onChange={(e) => setLastName(e.target.value)}
          sx={{ mb: 2 }}
          fullWidth
        />
        <TextField
          label="Phone Number"
          value={phone}
          required
          onChange={(e) => setPhone(e.target.value)}
          sx={{ mb: 2 }}
          fullWidth
        />
        <TextField
          label="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
          fullWidth
        />
        <TextField
          label="Address"
          value={address}
          required
          onChange={(e) => setAddress(e.target.value)}
          sx={{ mb: 2 }}
          fullWidth
        />
        <TextField
          label="City"
          value={city}
          required
          onChange={(e) => setCity(e.target.value)}
          sx={{ mb: 2 }}
          fullWidth
        />
        <TextField
          label="State"
          value={state}
          required
          onChange={(e) => setState(e.target.value)}
          sx={{ mb: 2 }}
          fullWidth
        />
        <TextField
          label="Zip Code"
          value={zipCode}
          required
          onChange={(e) => setZipCode(e.target.value)}
          sx={{ mb: 2 }}
          fullWidth
        />
        <MuiButton
          type="submit"
          variant="contained"
          disabled={isSaving}
          sx={{ mb: 1 }}
          fullWidth
        >
          {isSaving ? "Saving..." : "Save"}
        </MuiButton>
        <MuiButton
          type="button"
          variant="contained"
          color="secondary"
          onClick={handleRefreshProfile}
          fullWidth
          sx={{
            color: "#fff",
            "&:hover": {
              color: "#fff",
            },
          }}
        >
          Refresh Profile
        </MuiButton>
      </Paper>
    </Box>
  );
};

export default Profile;
