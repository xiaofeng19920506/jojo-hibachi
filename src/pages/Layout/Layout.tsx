import { Outlet } from "react-router-dom";
import { Container } from "./elements";

const Layout: React.FC = () => {
  return (
    <Container>
      <Outlet />
    </Container>
  );
};

export default Layout;
