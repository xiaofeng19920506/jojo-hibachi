import styled from "styled-components";

export const HeaderWrapper = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: white;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const LogoGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const Logo = styled.img`
  width: 50px;
  height: auto;
`;

export const BrandName = styled.h1`
  font-size: 1.2rem;
  font-weight: bold;
  color: #d23f3f;
`;

export const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;

  @media (max-width: 768px) {
    display: none; /* Add burger menu later if needed */
  }
`;

export const NavLink = styled.a`
  text-decoration: none;
  color: #333;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    color: #d23f3f;
  }
`;

export const BookNow = styled.button`
  background-color: #ff4b4b;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #e63939;
  }
`;
