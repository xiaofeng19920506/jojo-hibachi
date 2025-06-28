import {
  HeaderWrapper,
  LogoGroup,
  Logo,
  BrandName,
  Nav,
  StyledNavLink,
  LoginButton,
  LogoutButton,
} from "./elements";
import LogoImage from "../../asset/logo.png";
import { logout } from "../../features/userSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";

const Header: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };
  
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
        {isAuthenticated ? (
          <LogoutButton as="button" onClick={handleLogout}>
            Logout
          </LogoutButton>
        ) : (
          <LoginButton to="/signin">Login</LoginButton>
        )}
      </Nav>
    </HeaderWrapper>
  );
};

export default Header;
