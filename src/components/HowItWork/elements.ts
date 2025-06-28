import styled from "styled-components";

export const Wrapper = styled.section`
  display: flex;
  flex-direction: row;
  padding: 3rem 2rem;
  background-color: #ffffff;
  flex-wrap: wrap;
  gap: 5rem;
`;

export const LeftSection = styled.div`
  flex: 1;
  min-width: 250px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const Divider = styled.div`
  width: 1px;
  background-color: #ccc;
  min-height: 200px;
  align-self: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const RightSection = styled.div`
  flex: 2;
  min-width: 300px;
  font-size: 1rem;
  color: #1a1a1a;
`;

export const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
`;

export const Paragraph = styled.p`
  margin-bottom: 1rem;
  line-height: 1.6;
  max-width: 600px;
`;

export const Strong = styled.strong`
  font-weight: 700;
  display: block;
`;

export const Footnote = styled.p`
  font-size: 0.85rem;
  color: #666;
`;
