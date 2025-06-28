// HowItWorks.tsx
import React from "react";
import {
  Wrapper,
  LeftSection,
  RightSection,
  Divider,
  Title,
  Paragraph,
  Strong,
  Footnote,
} from "./elements";

const HowItWorks: React.FC = () => {
  return (
    <Wrapper>
      <LeftSection>
        <Title>How it works?</Title>
      </LeftSection>

      <Divider />

      <RightSection>
        <Paragraph>
          The host only has to set up tables and chairs, and provide plates and
          utensils. We bring our own hibachi grill and experienced chef. Each
          guest can choose their own customized meal. It starts with a side
          salad and comes with hibachi vegetables, fried rice, and 2 choices of
          protein.
        </Paragraph>

        <Paragraph>
          <Strong>Hibachi Pricing</Strong>
        </Paragraph>
        <Paragraph>
          <Strong>$50 PER PERSON</Strong>
        </Paragraph>
        <Paragraph>
          <Strong>$25 PER CHILD UNDER 13</Strong>
        </Paragraph>
        <Paragraph>
          <Strong>$500 MINIMUM FOR ALL PARTIES *</Strong>
        </Paragraph>
        <Footnote>*Price may vary based on event location</Footnote>
      </RightSection>
    </Wrapper>
  );
};

export default HowItWorks;
