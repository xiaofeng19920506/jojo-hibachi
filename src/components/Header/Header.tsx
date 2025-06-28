import { useState } from "react";
import {
  HeaderWrapper,
  LogoGroup,
  Logo,
  BrandName,
  Nav,
  StyledNavLink,
  LoginButton,
  LogoutButton,
  Hamburger,
  MobileMenu,
} from "./elements";
import LogoImage from "../../asset/logo.png";
import { logout } from "../../features/userSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";

const Header: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
  };

  return (
    <HeaderWrapper>
      <LogoGroup>
        <Logo src={LogoImage} alt="Logo" />
        <BrandName>Fancy Hibachi</BrandName>
      </LogoGroup>

      <Hamburger onClick={() => setIsMenuOpen(!isMenuOpen)}>☰</Hamburger>

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

      {isMenuOpen && (
        <MobileMenu>
          <StyledNavLink to="/" onClick={() => setIsMenuOpen(false)}>
            Home
          </StyledNavLink>
          <StyledNavLink to="/menu" onClick={() => setIsMenuOpen(false)}>
            Menu
          </StyledNavLink>
          <StyledNavLink to="/gallery" onClick={() => setIsMenuOpen(false)}>
            Gallery
          </StyledNavLink>
          <StyledNavLink to="/faq" onClick={() => setIsMenuOpen(false)}>
            FAQ
          </StyledNavLink>
          <StyledNavLink to="/contact" onClick={() => setIsMenuOpen(false)}>
            Contact
          </StyledNavLink>
          {isAuthenticated ? (
            <LogoutButton as="button" onClick={handleLogout}>
              Logout
            </LogoutButton>
          ) : (
            <LoginButton to="/signin" onClick={() => setIsMenuOpen(false)}>
              Login
            </LoginButton>
          )}
        </MobileMenu>
      )}
    </HeaderWrapper>
  );
};

export default Header;
