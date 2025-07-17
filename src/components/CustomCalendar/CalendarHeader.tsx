import React from "react";
import styled from "styled-components";
import { CalendarView } from "./CustomCalendar";

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarView;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (v: CalendarView) => void;
}

const HeaderBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f5f5f5;
  border-bottom: 1px solid #eee;
`;
const Nav = styled.div``;
const ViewToggle = styled.div``;
const HeaderDate = styled.span`
  font-weight: bold;
  margin-left: 16px;
`;
const ToggleButton = styled.button<{ active?: boolean }>`
  margin-right: 8px;
  padding: 4px 12px;
  border: none;
  background: ${({ active }) => (active ? "#9c27b0" : "#e0e0e0")};
  color: ${({ active }) => (active ? "#fff" : "inherit")};
  border-radius: 4px;
  cursor: pointer;
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
}) => (
  <HeaderBar>
    <Nav>
      <HeaderDate>{formatDate(currentDate, view)}</HeaderDate>
    </Nav>
    <ViewToggle>
      <ToggleButton
        active={view === "week"}
        onClick={() => onViewChange("week")}
      >
        Week
      </ToggleButton>
      <ToggleButton active={view === "day"} onClick={() => onViewChange("day")}>
        Day
      </ToggleButton>
    </ViewToggle>
  </HeaderBar>
);

export default CalendarHeader;
