import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";

const Layout: React.FC = () => {
  return (
    <>
      <Header />
      <Hero />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
