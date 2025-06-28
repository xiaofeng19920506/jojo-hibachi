import styled from "styled-components";
import heroImage from "./hero.jpg";

export const HeroSection = styled.section`
  height: 60vh;
  width: 100%;
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
