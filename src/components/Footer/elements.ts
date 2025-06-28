import styled from "styled-components";

export const FooterContainer = styled.footer`
  background-color: #e5e5e5;
  padding: 2rem 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const TopSection = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`;

export const LogoContainer = styled.div`
  flex: 1 1 40%;
  img {
    width: 220px;
    height: auto;
  }

  @media (max-width: 768px) {
    flex: 1 1 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
  }
`;

export const LinksWrapper = styled.div`
  flex: 1 1 60%;
  display: flex;
  justify-content: center; /* center inside the area */
  gap: 8rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
`;


export const LinkSection = styled.div`
  display: flex;
  flex-direction: column;
`;

export const LinkTitle = styled.div`
  font-weight: bold;
  margin-bottom: 1rem;
`;

export const FooterLink = styled.a`
  color: #555;
  text-decoration: none;
  margin-bottom: 0.5rem;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
`;

export const BottomSection = styled.div`
  width: 100%;
  max-width: 1200px;
  border-top: 1px solid #ccc;
  padding-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;


export const SocialIcons = styled.div`
  display: flex;
  gap: 1rem;

  a span {
    font-size: 18px;
  }
`;
