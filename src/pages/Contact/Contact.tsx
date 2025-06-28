import React, { useState } from "react";
import {
  Container,
  FormWrapper,
  Header,
  Title,
  Subtitle,
  Form,
  InputGroup,
  Input,
  TextArea,
  SubmitButton,
  ContactInfo,
  ContactItem,
  ContactLabel,
} from "./elements";

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission logic here
    alert("Message sent successfully!");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <Container>
      <FormWrapper>
        <Header>
          <Title>Contact Us</Title>
          <Subtitle>
            Have a question for Fancy Hibachi?
            <br />
            {"Let us know!"}
          </Subtitle>
        </Header>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </InputGroup>

          <InputGroup>
            <TextArea
              name="message"
              placeholder="Type your message here..."
              value={formData.message}
              onChange={handleInputChange}
              required
            />
          </InputGroup>

          <SubmitButton type="submit">Send Message</SubmitButton>
        </Form>

        <ContactInfo>
          <ContactItem>
            <ContactLabel>Text/Call:</ContactLabel> 267-810-7309
          </ContactItem>
          <ContactItem>
            <ContactLabel>Email:</ContactLabel> umamihibachi@gmail.com
          </ContactItem>
          <ContactItem>
            <ContactLabel>Instagram:</ContactLabel> @hibachiumami
          </ContactItem>
        </ContactInfo>
      </FormWrapper>

      {/* <FloatingButton>💬</FloatingButton> */}
    </Container>
  );
};

export default Contact;
