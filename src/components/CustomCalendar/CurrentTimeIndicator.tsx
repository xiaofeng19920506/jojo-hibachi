import React from "react";
import styled from "styled-components";

const Line = styled.div<{ $top: number }>`
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: red;
  z-index: 20;
  pointer-events: none;
  box-shadow: 0 0 6px 2px rgba(255, 0, 0, 0.15);
  transition: top 0.2s linear;
  top: ${({ $top }) => $top}px;
  /* Ensure it spans across the grid content area */
  margin-left: 0;
  margin-right: 0;
`;

const CurrentTimeIndicator: React.FC<{ top: number }> = ({ top }) => {
  return <Line $top={top} />;
};

export default CurrentTimeIndicator;
