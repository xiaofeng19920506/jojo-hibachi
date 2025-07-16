import styled from "styled-components";
import { Box, Typography, FormControl } from "@mui/material";

export const CalendarRoot = styled(Box)`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
`;

export const CalendarAppBarWrapper = styled(Box)`
  flex: 0 0 10vh;
  min-height: 0;
`;

export const CalendarContent = styled(Box)`
  flex: 1 1 90vh;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 16px;
  @media (min-width: 600px) {
    margin-top: 32px;
  }
`;

export const CalendarTitleRow = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 24px;
  gap: 16px;
  @media (min-width: 600px) {
    flex-direction: row;
    gap: 16px;
  }
`;

export const CalendarTitle = styled(Typography)`
  text-align: center;
  width: 100%;
  padding: 8px;
  @media (min-width: 600px) {
    width: auto;
  }
`;

export const CalendarEmployeeSelect = styled(FormControl)`
  min-width: 240px;
  margin-left: 0;
  margin-right: 0;
  @media (min-width: 600px) {
    margin-left: 24px;
    margin-right: 24px;
  }
`;

export const CalendarContainer = styled(Box)`
  flex: 1;
  width: 100%;
  max-width: 900px;
  min-height: 0;
  min-width: 0;
  margin-left: auto;
  margin-right: auto;
  padding-left: 8px;
  padding-right: 8px;
  overflow: auto;
  height: 100%;
  max-height: 100%;
  @media (min-width: 600px) {
    padding-left: 16px;
    padding-right: 16px;
  }
`;

export const CalendarHiddenDateInput = styled.input`
  visibility: hidden;
  position: absolute;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
  border: none;
`;
