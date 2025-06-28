import {
  HeaderWrapper,
  LogoGroup,
  Logo,
  BrandName,
  Nav,
  StyledNavLink,
  BookNow,
} from "./elements";
import LogoImage from "../../asset/logo.png";

const Header: React.FC = () => {
  return (
    <HeaderWrapper>
      <LogoGroup>
        <Logo src={LogoImage} alt="Logo" />
        <BrandName>Fancy Hibachi</BrandName>
      </LogoGroup>
      <Nav>
        <StyledNavLink to="/">Home</StyledNavLink>
        <StyledNavLink to="/menu">Menu</StyledNavLink>
        <StyledNavLink to="/gallery">Gallery</StyledNavLink>
        <StyledNavLink to="/faq">FAQ</StyledNavLink>
        <StyledNavLink to="/contact">Contact</StyledNavLink>
        <BookNow to="/booknow">Book Now</BookNow>
      </Nav>
    </HeaderWrapper>
  );
};

export default Header;
