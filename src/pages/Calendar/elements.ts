import styled from "styled-components";
import { Box, Typography, FormControl } from "@mui/material";

export const CalendarRoot = styled(Box)`
  height: 100vh;
  width: 100%;
  min-width: 100vw;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const CalendarAppBarWrapper = styled(Box)`
  flex: 0 0 10vh;
  min-height: 0;
`;

export const CalendarContent = styled(Box)`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 16px;
  overflow: hidden;
  height: 100%;
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
  gap: 8px;

  @media (min-width: 600px) {
    flex-direction: row;
    gap: 16px;
    align-items: center;
    justify-content: center;
  }
`;

// New: Controls row for arrows and date input
export const CalendarControlsRow = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  @media (min-width: 600px) {
    width: auto;
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
  width: 100%;
  height: 100%;
  min-width: 0;
  margin-left: auto;
  margin-right: auto;
  padding: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  @media (min-width: 600px) {
    padding: 24px;
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

export const CalendarEventCard = styled.div`
  background: #9c27b0;
  color: #fff;
  border: 1px solid #9c27b0;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  padding: 8px 12px;
  font-weight: 500;
  font-size: 15px;
  min-width: 120px;
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-word;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0 auto;
`;

export const CalendarEventCardTitle = styled.div`
  font-weight: 700;
  font-size: 1.1em;
`;

export const CalendarEventCardInfo = styled.div`
  font-size: 14px;
`;

export const CalendarEventCardNotes = styled.div`
  font-size: 13px;
`;

export const CurrentTimeIndicator = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: #ff1744;
  z-index: 10;
  pointer-events: none;
`;
