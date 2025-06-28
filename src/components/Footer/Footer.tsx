import React from "react";
import {
  FooterContainer,
  TopSection,
  LogoContainer,
  LinksWrapper,
  LinkSection,
  LinkTitle,
  FooterLink,
  BottomSection,
  SocialIcons,
} from "./elements";
import Logo from "../../asset/logo.png";

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <TopSection>
        <LogoContainer>
          <img src={Logo} alt="Fancy Hibachi" />
        </LogoContainer>
        <LinksWrapper>
          <LinkSection>
            <LinkTitle>Quick link</LinkTitle>
            <FooterLink href="#">HOME</FooterLink>
            <FooterLink href="#">Menu</FooterLink>
            <FooterLink href="#">GALLERY</FooterLink>
            <FooterLink href="#">FAQ</FooterLink>
            <FooterLink href="#">CONTACT</FooterLink>
          </LinkSection>
          <LinkSection>
            <LinkTitle>Policy</LinkTitle>
            <FooterLink href="#">Privacy Policy</FooterLink>
            <FooterLink href="#">Refund Policy</FooterLink>
            <FooterLink href="#">Terms of Service</FooterLink>
          </LinkSection>
        </LinksWrapper>
      </TopSection>
      <BottomSection>
        <div>© FANCY HIBACHI 2024</div>
        <SocialIcons>
          <a href="#">
            <span>📘</span>
          </a>
          <a href="#">
            <span>📸</span>
          </a>
          <a href="#">
            <span>🎵</span>
          </a>
        </SocialIcons>
      </BottomSection>
    </FooterContainer>
  );
};

export default Footer;
