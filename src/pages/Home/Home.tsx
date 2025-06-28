import Hero from "../../components/Hero/Hero";
import HowItWorks from "../../components/HowItWork/HowItWork";
import Locations from "../../components/Locations/Locations";
import MenuOptions from "../../components/MenuOptions/MenuOptions";
import Reviews from "../../components/Reviews/Reviews";
import { HomeContainer } from "./elements";
const Home = () => {
  return (
    <HomeContainer>
      <Hero />
      <HowItWorks />
      <MenuOptions />
      <Locations />
      <Reviews />
    </HomeContainer>
  );
};

export default Home;
