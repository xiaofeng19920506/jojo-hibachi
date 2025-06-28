import React from "react";
import {
  Section,
  MenuWrapper,
  MenuColumn,
  Title,
  Item,
  Footnote,
} from "./elements";

const MenuOptions: React.FC = () => {
  return (
    <Section>
      <MenuWrapper>
        <MenuColumn>
          <Title>Protein Choices</Title>
          <Item>CHICKEN</Item>
          <Item>STEAK</Item>
          <Item>SHRIMP</Item>
          <Item>SCALLOPS (+$5)</Item>
          <Item>SALMON</Item>
          <Item>VEGETABLE (+TOFU)</Item>
          <Item>FILET MIGNON (+$5)</Item>
          <Item>LOBSTER TAIL (+$10)</Item>
        </MenuColumn>

        <MenuColumn>
          <Title>Appetizers</Title>
          <Item>GYOZA (6PCS)</Item>
          <Item>EDAMAME $5</Item>
        </MenuColumn>

        <MenuColumn>
          <Title>Side Orders</Title>
          <Item>CHICKEN (+$10)</Item>
          <Item>STEAK (+$10)</Item>
          <Item>SHRIMP (+$10)</Item>
          <Item>SCALLOPS (+$15)</Item>
          <Item>SALMON (+$10)</Item>
          <Item>VEGETABLE (+TOFU) (+$10)</Item>
          <Item>NOODLES (+$4)</Item>
          <Item>FILET MIGNON (+$15)</Item>
          <Item>LOBSTER TAIL (+$15)</Item>
        </MenuColumn>
      </MenuWrapper>

      <Footnote>
        For groups of <strong>50 or more</strong>, we provide a fantastic
        buffet-style catering option.
      </Footnote>
    </Section>
  );
};

export default MenuOptions;
