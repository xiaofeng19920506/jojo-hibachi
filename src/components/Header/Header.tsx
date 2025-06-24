import {
  HeaderWrapper,
  LogoGroup,
  Logo,
  BrandName,
  Nav,
  NavLink,
  BookNow,
} from "./elements";

const Header = () => {
  return (
    <HeaderWrapper>
      <LogoGroup>
        <Logo src="/logo.png" alt="Logo" />
        <BrandName>JoJo hibachi</BrandName>
      </LogoGroup>
      <Nav>
        <NavLink>Home</NavLink>
        <NavLink>Menu</NavLink>
        <NavLink>Gallery</NavLink>
        <NavLink>FAQ</NavLink>
        <NavLink>Contact</NavLink>
        <BookNow>Book Now</BookNow>
      </Nav>
    </HeaderWrapper>
  );
};

export default Header;
