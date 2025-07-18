import styled from "styled-components";
import { Box, Typography, FormControl } from "@mui/material";

export const CalendarRoot = styled(Box)`
  height: 100vh;
  width: 100vw;
  min-width: 100vw;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  @media (min-width: 600px) {
    height: calc(100vh - 64px);
    top: 64px;
  }
  @media (max-width: 600px) {
    height: calc(100vh - 56px);
    top: 56px;
  }
  @media (max-width: 600px) and (orientation: landscape) {
    height: calc(100vh - 48px);
    top: 48px;
  }
  @media (max-width: 600px) and (orientation: portrait) {
    height: calc(100vh - 56px);
    top: 56px;
  }
`;

export const CalendarAppBarWrapper = styled(Box)`
  flex: 0 0 auto;
  min-height: 0;

  @media (max-width: 600px) and (orientation: landscape) {
    flex: 0 0 auto;
  }

  @media (max-width: 600px) and (orientation: portrait) {
    flex: 0 0 auto;
  }
`;

export const CalendarContent = styled(Box)`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  overflow: hidden;
  height: 100%;

  @media (min-width: 600px) {
    margin-top: 0px;
    padding-top: 8px;
  }
  @media (max-width: 600px) {
    margin-top: 0px;
    height: 100%;
    overflow: auto;
  }
  @media (max-width: 600px) and (orientation: landscape) {
    margin-top: 0px;
    height: 100%;
    overflow: auto;
  }
  @media (max-width: 600px) and (orientation: portrait) {
    margin-top: 0px;
    height: 100%;
    overflow: auto;
  }
`;

export const CalendarTitleRow = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 8px;
  gap: 4px;
  flex-shrink: 0;

  @media (min-width: 600px) {
    flex-direction: row;
    gap: 16px;
    align-items: center;
    justify-content: space-between;
    padding: 8px 24px 0 24px;
    margin-bottom: 4px;
    min-height: 48px;
  }
  @media (max-width: 600px) {
    margin-bottom: 4px;
    gap: 2px;
  }
  @media (max-width: 600px) and (orientation: landscape) {
    margin-bottom: 2px;
    gap: 1px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  @media (max-width: 600px) and (orientation: portrait) {
    margin-bottom: 2px;
    gap: 1px;
    flex-direction: row;
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
    flex-shrink: 0;
  }
  @media (max-width: 600px) {
    gap: 2px;
  }
  @media (max-width: 600px) and (orientation: landscape) {
    gap: 1px;
  }
  @media (max-width: 600px) and (orientation: portrait) {
    gap: 1px;
  }
`;

export const CalendarTitle = styled(Typography)`
  text-align: center;
  width: 100%;
  padding: 4px;
  @media (min-width: 600px) {
    width: auto;
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
  }
  @media (max-width: 600px) {
    padding: 2px;
    font-size: 1.2rem;
  }
  @media (max-width: 600px) and (orientation: landscape) {
    padding: 1px;
    font-size: 1.1rem;
    width: auto;
  }
  @media (max-width: 600px) and (orientation: portrait) {
    padding: 1px;
    font-size: 1rem;
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
  @media (max-width: 600px) {
    min-width: 120px;
  }
  @media (max-width: 600px) and (orientation: landscape) {
    min-width: 100px;
  }
  @media (max-width: 600px) and (orientation: portrait) {
    min-width: 80px;
  }
`;

export const CalendarContainer = styled(Box)`
  width: 100%;
  height: 100%;
  min-width: 0;
  margin-left: auto;
  margin-right: auto;
  padding: 0px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex: 1;

  @media (min-width: 600px) {
    padding: 4px 24px 4px 24px;
  }
  @media (max-width: 600px) {
    padding: 0px;
    height: 100%;
    overflow: auto;
  }
  @media (max-width: 600px) and (orientation: landscape) {
    padding: 0px;
    height: 100%;
    overflow: auto;
  }
  @media (max-width: 600px) and (orientation: portrait) {
    padding: 0px;
    height: 100%;
    overflow: auto;
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
