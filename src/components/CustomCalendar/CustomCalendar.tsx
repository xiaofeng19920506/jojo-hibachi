import React, { useState } from "react";
import styled from "styled-components";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
// import "./CustomCalendar.css";

export type CalendarView = "week" | "day";

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  [key: string]: any;
}

interface CustomCalendarProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  currentDate?: Date;
  onDateChange?: (date: Date) => void;
  view?: CalendarView;
  onViewChange?: (view: CalendarView) => void;
}

const CalendarContainer = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: auto;

  @media (max-width: 600px) {
    width: 100%;
    max-width: none;
    border-radius: 0;
    margin: 0;
    box-shadow: none;
    padding: 0;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
`;

const TIME_GUTTER_WIDTH = 60; // px
const DAY_COLUMN_WIDTH_REM = 15;
const TIME_GUTTER_WIDTH_MOBILE = 40;
const DAY_COLUMN_WIDTH_REM_MOBILE = 8;

const isMobile = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(max-width: 600px)").matches;

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  events,
  onEventClick,
  currentDate: controlledDate,
  onDateChange,
  view: controlledView,
  onViewChange,
}) => {
  // If controlled, use props; otherwise, use internal state
  const [internalDate, setInternalDate] = useState(new Date());
  const [internalView, setInternalView] = useState<CalendarView>("week");
  const currentDate = controlledDate ?? internalDate;
  const view = controlledView ?? internalView;

  // Calculate number of columns (days)
  // Use mobile or desktop widths
  const mobile = isMobile();
  const dayColumnWidthRem = mobile
    ? DAY_COLUMN_WIDTH_REM_MOBILE
    : DAY_COLUMN_WIDTH_REM;
  const timeGutterWidth = mobile ? TIME_GUTTER_WIDTH_MOBILE : TIME_GUTTER_WIDTH;
  // Calculate max-width: time gutter + columns * column width

  // Navigation handlers (no longer used internally)
  const handlePrev = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - (view === "week" ? 7 : 1));
    if (onDateChange) onDateChange(newDate);
    else setInternalDate(newDate);
  };
  const handleNext = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (view === "week" ? 7 : 1));
    if (onDateChange) onDateChange(newDate);
    else setInternalDate(newDate);
  };
  const handleToday = () => {
    if (onDateChange) onDateChange(new Date());
    else setInternalDate(new Date());
  };
  const handleViewChange = (v: CalendarView) => {
    if (onViewChange) onViewChange(v);
    else setInternalView(v);
  };

  return (
    <CalendarContainer>
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onViewChange={handleViewChange}
      />
      <CalendarGrid
        currentDate={currentDate}
        view={view}
        events={events}
        onEventClick={onEventClick}
        dayColumnWidthRem={dayColumnWidthRem}
        timeGutterWidth={timeGutterWidth}
      />
    </CalendarContainer>
  );
};

export default CustomCalendar;
