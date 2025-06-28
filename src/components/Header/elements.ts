import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ffffff; /* White background */
  color: #000000; /* Black text */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const LogoGroup = styled.div`
  display: flex;
  align-items: center;
`;

export const Logo = styled.img`
  width: 40px;
  height: 40px;
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
`;

export const StyledNavLink = styled(NavLink)`
  color: #000000; /* Black text */
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

export const BookNow = styled(NavLink)`
  ${sharedButtonStyles}
  background-color: #000000;
  color: #ffffff;
  border: 2px solid #000000;

  &:hover {
    background-color: #333333;
  }
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
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 5px;
  border: 2px solid #000000;
  background-color: transparent;
  color: #000000;
  cursor: pointer;
  min-width: 100px;

  &:hover {
    background-color: #000000;
    color: #ffffff;
  }
`;