import styled from "styled-components";

export const Section = styled.section`
  width: 100%;
  background-color: #a52a2a;
  padding: 4rem 2rem;
  text-align: center;
`;

export const MenuWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 2rem;
`;

export const MenuColumn = styled.div`
  min-width: 300px;
`;

export const Title = styled.h3`
  color: white;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

export const Item = styled.p`
  color: white;
  font-size: 1rem;
  margin: 0.3rem 0;
`;

export const Footnote = styled.p`
  color: white;
  font-size: 0.95rem;

  strong {
    font-weight: bold;
  }
`;
