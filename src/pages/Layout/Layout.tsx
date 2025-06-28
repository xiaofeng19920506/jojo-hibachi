import { Outlet } from "react-router-dom";
import Header from "../../components/Header/Header";
import { Container } from "./elements";

const Layout: React.FC = () => {
  return (
    <Container>
      <Header />
      <Outlet />
    </Container>
  );
};

export default Layout;
