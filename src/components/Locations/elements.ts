import styled from "styled-components";

export const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

interface SectionProps {
  reverse?: boolean;
}

export const LocationSection = styled.div<SectionProps>`
  display: flex;
  flex-direction: ${({ reverse }) => (reverse ? "row-reverse" : "row")};
  align-items: center;
  gap: 2rem;
  margin: 3rem 0;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const ImageContainer = styled.div`
  flex: 1;

  img {
    width: 100%;
    border-radius: 8px;
  }
`;

interface InfoContainerProps {
  alignRight?: boolean;
}

export const InfoContainer = styled.div<InfoContainerProps>`
  flex: 1;
  text-align: ${({ alignRight }) => (alignRight ? "right" : "left")};

  @media (max-width: 768px) {
    text-align: center;
  }
`;

export const Phone = styled.div`
  font-size: 14px;
  margin-bottom: 0.5rem;
`;

export const Title = styled.div`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 1rem;

  span {
    font-weight: 400;
  }
`;

export const Description = styled.div`
  font-size: 14px;
  margin-bottom: 1.5rem;
`;

export const BookButton = styled.button`
  padding: 0.6rem 1.2rem;
  background-color: #e53935;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;
