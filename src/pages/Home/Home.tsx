import Hero from "../../components/Hero/Hero";
import HowItWorks from "../../components/HowItWork/HowItWork";
import MenuOptions from "../../components/MenuOptions/MenuOptions";
import { HomeContainer } from "./elements";
const Home = () => {
  return (
    <HomeContainer>
      <Hero />
      <HowItWorks />
      <MenuOptions />
    </HomeContainer>
  );
};

export default Home;
