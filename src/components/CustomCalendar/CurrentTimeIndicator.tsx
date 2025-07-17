import React from "react";
import styled from "styled-components";

const Line = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: red;
  z-index: 10;
`;

const CurrentTimeIndicator: React.FC<{ top: number }> = ({ top }) => {
  return <Line style={{ top }} />;
};

export default CurrentTimeIndicator;
