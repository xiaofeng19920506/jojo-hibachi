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
  const { data: profile, isLoading } = useGetUserProfileQuery();
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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setPhone(profile.phone || profile.phoneNumber || "");
      setEmail(profile.email || "");
      setAddress(profile.address || "");
      setCity(profile.city || "");
      setState(profile.state || "");
      setZipCode(profile.zipCode || "");
    }
  }, [profile]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await updateUserProfile({
        firstName,
        lastName,
        phone,
        email,
        address,
        city,
        state,
        zipCode,
      }).unwrap();
      setSuccess("Profile updated successfully.");
    } catch (err: any) {
      setError(err.data?.message || err.message || "Update failed.");
    }
  };

  if (isLoading) {
    return <SignInWrapper>Loading...</SignInWrapper>;
  }

  return (
    <>
      <GlobalAppBar />
      <SignInWrapper>
        <Form onSubmit={handleSubmit}>
          <Title style={{ fontSize: 22 }}>My Profile</Title>
          {error && <ErrorMessage>{error}</ErrorMessage>}
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
        </Form>
      </SignInWrapper>
    </>
  );
};

export default Profile;
