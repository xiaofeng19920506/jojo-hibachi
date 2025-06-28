import React from "react";
import {
  Container,
  LocationSection,
  ImageContainer,
  InfoContainer,
  Phone,
  Title,
  Description,
  BookButton,
} from "./elements";
import PA from "../../asset/pennsylvania.jpg";
import NJ from "../../asset/new-jersey.jpg";
import DE from "../../asset/Delaware.jpg";
import NY from "../../asset/New York.jpg";
import MD from "../../asset/Maryland.jpg";

interface LocationData {
  phone: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  reverse?: boolean;
}

const locations: LocationData[] = [
  {
    phone: "(267) 810-7309",
    title: "Pennsylvania",
    subtitle: "( PA )",
    description:
      "The master’s performance time is 1 hour and 30 minutes. You only need to set up tables and chairs, provide plates and eating utensils. Our chefs will bring their own hibachi grill, prepare, cook, and serve the food while you sit back and enjoy the show.",
    imageUrl: PA,
  },
  {
    phone: "(267) 810-7309",
    title: "New Jersey",
    subtitle: "( NJ )",
    description:
      "The master’s performance time is 1 hour and 30 minutes. You only need to set up tables and chairs, provide plates and eating utensils. Our chefs will bring their own hibachi grill, prepare, cook, and serve the food while you sit back and enjoy the show.",
    imageUrl: NJ,
    reverse: true,
  },
  {
    phone: "(267) 810-7309",
    title: "New York",
    subtitle: "( NY )",
    description:
      "The master’s performance time is 1 hour and 30 minutes. You only need to set up tables and chairs, provide plates and eating utensils. Our chefs will bring their own hibachi grill, prepare, cook, and serve the food while you sit back and enjoy the show.",
    imageUrl: NY,
  },
  {
    phone: "(267) 810-7309",
    title: "Delaware",
    subtitle: "( DE )",
    description:
      "The master’s performance time is 1 hour and 30 minutes. You only need to set up tables and chairs, provide plates and eating utensils. Our chefs will bring their own hibachi grill, prepare, cook, and serve the food while you sit back and enjoy the show.",
    imageUrl: DE,
    reverse: true,
  },
  {
    phone: "(267) 810-7309",
    title: "Maryland",
    subtitle: "( MD )",
    description:
      "The master’s performance time is 1 hour and 30 minutes. You only need to set up tables and chairs, provide plates and eating utensils. Our chefs will bring their own hibachi grill, prepare, cook, and serve the food while you sit back and enjoy the show.",
    imageUrl: MD,
  },
];

const Locations: React.FC = () => {
  return (
    <Container>
      {locations.map((loc, index) => (
        <LocationSection key={index} reverse={loc.reverse}>
          <ImageContainer>
            <img src={loc.imageUrl} alt={loc.title} />
          </ImageContainer>
          <InfoContainer alignRight={!loc.reverse}>
            <Phone>{loc.phone}</Phone>
            <Title>
              {loc.title} <span>{loc.subtitle}</span>
            </Title>
            <Description>{loc.description}</Description>
            <BookButton>BOOK NOW</BookButton>
          </InfoContainer>
        </LocationSection>
      ))}
    </Container>
  );
};

export default Locations;
