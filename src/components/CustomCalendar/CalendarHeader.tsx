import React from "react";
import styled from "styled-components";
import { useTheme } from "@mui/material/styles";
import type { CalendarView } from "./CustomCalendar";

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarView;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (v: CalendarView) => void;
}

const HeaderBar = styled.div<{ $isDarkMode?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: ${(props) => (props.$isDarkMode ? "#000" : "#f5f5f5")};
  border-bottom: 1px solid ${(props) => (props.$isDarkMode ? "#444" : "#eee")};

  @media (max-width: 600px) {
    padding: 8px 12px;
    flex-direction: column;
    gap: 8px;
  }

  @media (max-width: 600px) and (orientation: landscape) {
    padding: 4px 8px;
    flex-direction: row;
    gap: 4px;
  }
`;
const Nav = styled.div`
  @media (max-width: 600px) {
    width: 100%;
    text-align: center;
  }

  @media (max-width: 600px) and (orientation: landscape) {
    width: auto;
    text-align: left;
  }
`;
const ViewToggle = styled.div`
  @media (max-width: 600px) {
    display: flex;
    gap: 4px;
  }

  @media (max-width: 600px) and (orientation: landscape) {
    display: flex;
    gap: 2px;
  }
`;
const HeaderDate = styled.span`
  font-weight: bold;
  margin-left: 16px;

  @media (max-width: 600px) {
    margin-left: 0;
    font-size: 0.9rem;
  }

  @media (max-width: 600px) and (orientation: landscape) {
    margin-left: 8px;
    font-size: 0.8rem;
  }
`;
const ToggleButton = styled.button<{ $active?: boolean; $isDarkMode?: boolean }>`
  margin-right: 8px;
  padding: 4px 12px;
  border: none;
  background: ${({ $active, $isDarkMode }) =>
    $active ? "#9c27b0" : $isDarkMode ? "#333" : "#e0e0e0"};
  color: ${({ $active, $isDarkMode }) =>
    $active ? "#fff" : $isDarkMode ? "#fff" : "inherit"};
  border-radius: 4px;
  cursor: pointer;

  @media (max-width: 600px) {
    margin-right: 0;
    padding: 6px 12px;
    font-size: 0.9rem;
  }

  @media (max-width: 600px) and (orientation: landscape) {
    margin-right: 2px;
    padding: 4px 8px;
    font-size: 0.8rem;
  }
`;

const formatDate = (date: Date, view: CalendarView) => {
  if (view === "week") {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  }
  return date.toLocaleDateString();
};

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  view,
  onViewChange,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <HeaderBar $isDarkMode={isDarkMode}>
      <Nav>
        <HeaderDate>{formatDate(currentDate, view)}</HeaderDate>
      </Nav>
      <ViewToggle>
        <ToggleButton
          $active={view === "week"}
          $isDarkMode={isDarkMode}
          onClick={() => onViewChange("week")}
        >
          Week
        </ToggleButton>
        <ToggleButton
          $active={view === "day"}
          $isDarkMode={isDarkMode}
          onClick={() => onViewChange("day")}
        >
          Day
        </ToggleButton>
      </ViewToggle>
    </HeaderBar>
  );
};

export default CalendarHeader;
