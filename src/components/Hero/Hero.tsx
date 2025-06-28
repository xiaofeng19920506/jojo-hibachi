import {
  Content,
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
        <Location>
          Pennsylvania • New Jersey • New York • Delaware • Maryland
        </Location>
      </Content>
    </HeroSection>
  );
};

export default Hero;
