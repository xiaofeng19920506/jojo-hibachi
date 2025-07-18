import { useState, useEffect, type FormEvent } from "react";
import {
  SignInWrapper,
  Form,
  Input,
  Button,
  Title,
  ErrorMessage,
} from "./elements";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "../../services/api";
import GlobalAppBar from "../../components/GloabalAppBar/GlobalAppBar";

const Profile: React.FC = () => {
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
      <>
        <GlobalAppBar />
        <SignInWrapper>Loading...</SignInWrapper>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <GlobalAppBar />
        <SignInWrapper>
          <ErrorMessage>
            Failed to load profile:{" "}
            {(error as any)?.data?.message ||
              (error as any)?.message ||
              "Unknown error"}
          </ErrorMessage>
          <Button onClick={() => refetch()}>Retry</Button>
        </SignInWrapper>
      </>
    );
  }

  return (
    <>
      <GlobalAppBar />
      <SignInWrapper>
        <Form onSubmit={handleSubmit}>
          <Title style={{ fontSize: 22 }}>My Profile</Title>
          {formError && <ErrorMessage>{formError}</ErrorMessage>}
          {success && (
            <div style={{ color: "green", marginBottom: 8 }}>{success}</div>
          )}
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
            value={phone}
            required
            onChange={(e) => setPhone(e.target.value)}
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
            placeholder="Address"
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
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
          <Button
            type="submit"
            disabled={isSaving}
            style={{ fontSize: 16, minHeight: 44, minWidth: 44 }}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button
            type="button"
            onClick={() => refetch()}
            style={{ fontSize: 14, minHeight: 36, minWidth: 44, marginTop: 8 }}
          >
            Refresh Profile
          </Button>
        </Form>
      </SignInWrapper>
    </>
  );
};

export default Profile;
