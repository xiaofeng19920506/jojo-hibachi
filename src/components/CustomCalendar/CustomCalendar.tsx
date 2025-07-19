import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useTheme } from "@mui/material/styles";
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

const CalendarContainer = styled.div<{ $isDarkMode?: boolean }>`
  border: 1px solid ${(props) => (props.$isDarkMode ? "#444" : "#ddd")};
  border-radius: 8px;
  background: ${(props) => (props.$isDarkMode ? "#000" : "#fff")};
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px); /* Fixed height minus header space */

  @media (min-width: 600px) {
    width: 100%;
    margin: 0;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    height: calc(100vh - 80px);
  }

  @media (max-width: 600px) {
    width: 100%;
    max-width: none;
    border-radius: 0;
    margin: 0;
    box-shadow: none;
    padding: 0;
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
    height: 100vh;
    min-height: 100vh;
    flex: 1;
  }

  @media (max-width: 600px) and (orientation: landscape) {
    width: 100%;
    max-width: none;
    border-radius: 0;
    margin: 0;
    box-shadow: none;
    padding: 0;
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
    height: 100vh;
    min-height: 100vh;
    flex: 1;
  }

  @media (max-width: 600px) and (orientation: portrait) {
    width: 100%;
    max-width: none;
    border-radius: 0;
    margin: 0;
    box-shadow: none;
    padding: 0;
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
    height: 100vh;
    min-height: 100vh;
    flex: 1;
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
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
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

  // Current time indicator logic
  const hours = Array.from({ length: 24 }, (_, i) => i); // 0-23 (midnight to 11pm)
  const calendarStartHour = 0;
  const calendarEndHour = 24;
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Ref and state for slot height
  const slotRef = useRef<HTMLDivElement>(null);
  const calendarContainerRef = useRef<HTMLDivElement>(null);
  const [slotHeight, setSlotHeight] = useState<number>(0);

  useEffect(() => {
    if (slotRef.current) {
      setSlotHeight(slotRef.current.offsetHeight);
    }
  }, [now, events, dayColumnWidthRem, timeGutterWidth]);

  const hour = now.getHours();
  const minute = now.getMinutes();
  const isWithinRange = hour >= calendarStartHour && hour < calendarEndHour;
  let indicatorTop = 0;
  if (isWithinRange && slotHeight > 0) {
    const hoursSinceStart = hour - calendarStartHour;
    // Use the actual measured hour height from the slot
    const actualHourHeight = slotHeight;
    // Calculate position based on current time, accounting for header height
    const headerHeight = 50; // Approximate header height
    indicatorTop = headerHeight + (hoursSinceStart + minute / 60) * actualHourHeight;
    // Ensure it's within bounds
    if (indicatorTop < headerHeight) indicatorTop = headerHeight;
    if (indicatorTop > headerHeight + actualHourHeight * hours.length)
      indicatorTop = headerHeight + actualHourHeight * hours.length;
  }

  // Auto-scroll to current time indicator
  const scrollToCurrentTime = () => {
    if (calendarContainerRef.current && isWithinRange && slotHeight > 0) {
      // Scroll to show current time with some context above
      const headerHeight = 50; // Approximate header height
      const scrollTop = indicatorTop - headerHeight - 150; // Show context above current time
      calendarContainerRef.current.scrollTo({
        top: Math.max(0, scrollTop),
        behavior: "smooth",
      });
    }
  };

  // Auto-scroll on mount and when view changes to week
  useEffect(() => {
    if (view === "week") {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(scrollToCurrentTime, 100);
      return () => clearTimeout(timer);
    }
  }, [view, slotHeight]);

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
    <CalendarContainer $isDarkMode={isDarkMode}>
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onViewChange={handleViewChange}
        onGoToNow={scrollToCurrentTime}
      />
      <CalendarGrid
        currentDate={currentDate}
        view={view}
        events={events}
        onEventClick={onEventClick}
        dayColumnWidthRem={dayColumnWidthRem}
        timeGutterWidth={timeGutterWidth}
        indicatorTop={indicatorTop}
        showIndicator={isWithinRange && slotHeight > 0}
        slotRef={slotRef}
        calendarContainerRef={calendarContainerRef}
      />
    </CalendarContainer>
  );
};

export default CustomCalendar;
