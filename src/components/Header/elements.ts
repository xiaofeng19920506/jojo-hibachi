import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ffffff;
  color: #000000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
`;

export const LogoGroup = styled.div`
  display: flex;
  align-items: center;
`;

export const Logo = styled.img`
  width: 5rem;
  height: 5rem;
  margin-right: 0.5rem;
`;

export const BrandName = styled.h1`
  font-size: 1.5rem;
  color: #000000;
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const Hamburger = styled.button`
  font-size: 2rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #000000;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

export const MobileMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #ffffff;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 2rem;
  z-index: 1000;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);

  a {
    font-size: 1.2rem;
  }
`;

export const StyledNavLink = styled(NavLink)`
  color: #000000;
  text-decoration: none;
  font-weight: 500;

  &.active {
    font-weight: bold;
    border-bottom: 2px solid #000000;
  }

  &:hover {
    opacity: 0.7;
  }
`;

const sharedButtonStyles = `
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 5px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 100px;
`;

export const LoginButton = styled(NavLink)`
  ${sharedButtonStyles}
  background-color: transparent;
  color: #000000;
  border: 2px solid #000000;

  &:hover {
    background-color: #000000;
    color: #ffffff;
  }
`;

export const LogoutButton = styled.button`
  ${sharedButtonStyles}
  background-color: transparent;
  color: #000000;
  border: 2px solid #000000;
  cursor: pointer;

  &:hover {
    background-color: #000000;
    color: #ffffff;
  }
`;
