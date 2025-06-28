import { Outlet } from "react-router-dom";
import Header from "../../components/Header/Header";
import { Container } from "./elements";
import Footer from "../../components/Footer/Footer";

const Layout: React.FC = () => {
  return (
    <Container>
      <Header />
      <Outlet />
      <Footer />
    </Container>
  );
};

export default Layout;
