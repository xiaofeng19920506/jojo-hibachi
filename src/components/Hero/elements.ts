import styled from "styled-components";
import heroImage from "./hero.jpg";

export const HeroSection = styled.section`
  height: 100vh;
  background-image: url(${heroImage});
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
`;

export const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
`;

export const Content = styled.div`
  position: relative;
  z-index: 1;
  max-width: 90%;
`;

export const Title = styled.h1`
  font-size: 2rem;

  @media (min-width: 768px) {
    font-size: 3rem;
  }
`;

export const Location = styled.p`
  margin-top: 1rem;
  font-weight: 500;
`;

export const CTA = styled.button`
  margin-top: 2rem;
  background: #ff4b4b;
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 20px;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #e63939;
  }
`;
