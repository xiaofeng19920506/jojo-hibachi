import {
  Content,
  CTA,
  HeroSection,
  Overlay,
  Title,
  Location,
} from "./elements";

const Hero = () => {
  return (
    <HeroSection>
      <Overlay />
      <Content>
        <Title>
          Experience the Flavor and Fire of Hibachi at Your Doorstep!
        </Title>
        <Location>New York • New Jersey • Long Island</Location>
        <CTA>Book Now</CTA>
      </Content>
    </HeroSection>
  );
};

export default Hero;