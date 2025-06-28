import { Outlet } from "react-router-dom";
import Header from "../../components/Header/Header";
import Hero from "../../components/Hero/Hero";
import { Container } from "./elements";

const Layout: React.FC = () => {
  return (
    <Container>
      <Header />
      <Hero />
      <main>
        <Outlet />
      </main>
    </Container>
  );
};

export default Layout;
