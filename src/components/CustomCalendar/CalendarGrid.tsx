import React from "react";
import styled from "styled-components";
import { useTheme } from "@mui/material/styles";
import type { CalendarView, CalendarEvent } from "./CustomCalendar";
import EventCard from "./EventCard";
import Tooltip from "@mui/material/Tooltip";

const hours = Array.from({ length: 24 }, (_, i) => i); // 0-23 (midnight to 11pm)
// Increase hour height for more dramatic scaling
const HOUR_HEIGHT = 100; // px (was 80)
const HOUR_HEIGHT_CSS = "6.25rem"; // 100px in rem

// Accept numDays and columnWidth as props
interface CalendarGridProps {
  currentDate: Date;
  view: CalendarView;
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  dayColumnWidthRem?: number;
  timeGutterWidth?: number;
  indicatorTop?: number;
  showIndicator?: boolean;
  slotRef?: React.RefObject<HTMLDivElement | null>;
  calendarContainerRef?: React.RefObject<HTMLDivElement | null>;
}

const CalendarGridContainer = styled.div<{ $isDarkMode?: boolean }>`
  display: grid;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  background: ${(props) => (props.$isDarkMode ? "#000" : "#fff")};
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 8px 8px 0 8px;
  flex: 1;
  &::-webkit-scrollbar {
    display: none; /* Chrome/Safari/Webkit */
  }
  @media (min-width: 600px) {
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    padding: 0px 0px 0 0px;
    height: calc(100vh - 120px); /* Account for header */
  }
  @media (max-width: 600px) {
    width: 100%;
    height: calc(100vh - 80px); /* Account for header */
    border-radius: 0;
    box-shadow: none;
    padding: 0px 0px 0 0px;
    overflow-x: auto;
    overflow-y: auto;
    position: relative;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
    flex: 1;
  }
  @media (max-width: 600px) and (orientation: landscape) {
    width: 100%;
    height: calc(100vh - 60px); /* Smaller header in landscape */
    border-radius: 0;
    box-shadow: none;
    padding: 0px 0px 0 0px;
    overflow-x: auto;
    overflow-y: auto;
    position: relative;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
    flex: 1;
  }
  @media (max-width: 600px) and (orientation: portrait) {
    width: 100%;
    height: calc(100vh - 80px);
    border-radius: 0;
    box-shadow: none;
    padding: 0px 0px 0 0px;
    overflow-x: auto;
    overflow-y: auto;
    position: relative;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
    flex: 1;
  }
`;

const HeaderCell = styled.div<{ $isToday?: boolean; $isDarkMode?: boolean }>`
  background: ${({ $isToday, $isDarkMode }) =>
    $isDarkMode
      ? $isToday
        ? "#333"
        : "#222"
      : $isToday
      ? "#f5f5f5"
      : "#f0f0f8"};
  color: ${({ $isToday, $isDarkMode }) =>
    $isDarkMode
      ? $isToday
        ? "#90caf9"
        : "#fff"
      : $isToday
      ? "#1976d2"
      : "inherit"};
  font-weight: 500;
  font-size: 1.1rem;
  text-align: center;
  border-right: 1px solid ${(props) => (props.$isDarkMode ? "#444" : "#eee")};
  border-bottom: 1px solid
    ${(props) => (props.$isDarkMode ? "#444" : "#e0e0e0")};
  padding: 8px 0;
  position: sticky;
  top: 0;
  z-index: 2;

  @media (max-width: 600px) {
    position: sticky;
    top: 0;
    z-index: 2;
  }

  @media (max-width: 600px) and (orientation: landscape) {
    font-size: 0.8rem;
    padding: 4px 0;
  }
`;

const GutterCell = styled.div<{ $isDarkMode?: boolean }>`
  background: ${(props) => (props.$isDarkMode ? "#000" : "#fafafa")};
  color: ${(props) => (props.$isDarkMode ? "#ccc" : "#888")};
  font-size: 1rem;
  text-align: right;
  border-right: 1px solid ${(props) => (props.$isDarkMode ? "#444" : "#eee")};
  border-bottom: 1px solid
    ${(props) => (props.$isDarkMode ? "#444" : "#e0e0e0")};
  padding-right: 8px;
  position: sticky;
  left: 0;
  z-index: 3;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.04);
  height: 100%;

  @media (max-width: 600px) {
    position: sticky;
    left: 0;
    z-index: 3;
    background: #fafafa;
  }

  @media (max-width: 600px) and (orientation: landscape) {
    font-size: 0.8rem;
    padding-right: 4px;
  }
`;

const TopLeftCell = styled(GutterCell)`
  top: 0;
  z-index: 4;
`;

const BodyCell = styled.div<{ $isToday?: boolean; $isDarkMode?: boolean }>`
  background: ${({ $isToday, $isDarkMode }) =>
    $isDarkMode
      ? $isToday
        ? "#1a1a1a"
        : "#000"
      : $isToday
      ? "#e3f2fd"
      : "#fff"};
  border-right: 1px solid ${(props) => (props.$isDarkMode ? "#333" : "#f0f0f0")};
  border-bottom: 1px solid
    ${(props) => (props.$isDarkMode ? "#333" : "#f0f0f0")};
  min-height: ${HOUR_HEIGHT_CSS};
  position: relative;
  font-size: 1rem;
  height: 100%;
  padding: 0;
  margin: 0;

  @media (min-width: 601px) {
    min-width: 0;
  }

  @media (max-width: 600px) {
    min-height: 3.5rem;
  }

  @media (max-width: 600px) and (orientation: landscape) {
    min-height: 2.5rem;
  }

  @media (max-width: 600px) and (orientation: portrait) {
    min-height: 3.5rem;
  }
`;

// Removed TodayColumnWrapper since we're no longer using it

const EventWrapper = styled.div<{
  $top: number;
  $height: number;
  $left: number;
  $width: number;
}>`
  position: absolute;
  top: ${({ $top }) => $top}px;
  left: ${({ $left }) => $left}%;
  width: ${({ $width }) => $width}%;
  height: ${({ $height }) => $height}px;
  z-index: 5;
  right: 4px;
`;

// Fix isSameDay to use local time
function isSameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function isSameHour(d1: Date, hour: number) {
  return d1.getHours() === hour;
}

function getEventSpan(event: CalendarEvent) {
  const startHour = event.start.getHours();
  const endHour = event.end.getHours();
  const startMin = event.start.getMinutes();
  const endMin = event.end.getMinutes();
  let span = endHour - startHour + (endMin - startMin) / 60;
  if (span < 0.25) span = 0.25; // minimum height for very short events
  return span;
}

// Overlap logic: assign column and total columns for each event
function getOverlappingMeta(events: CalendarEvent[]) {
  // Sort by start time
  const sorted = [...events].sort(
    (a, b) => a.start.getTime() - b.start.getTime()
  );
  const meta: { [id: string]: { col: number; total: number } } = {};
  let groups: CalendarEvent[][] = [];
  let group: CalendarEvent[] = [];
  let lastEnd = null;
  // Group overlapping events
  for (let i = 0; i < sorted.length; i++) {
    const ev = sorted[i];
    if (!lastEnd || ev.start < lastEnd) {
      group.push(ev);
      lastEnd = lastEnd
        ? new Date(Math.max(lastEnd.getTime(), ev.end.getTime()))
        : ev.end;
    } else {
      groups.push(group);
      group = [ev];
      lastEnd = ev.end;
    }
  }
  if (group.length) groups.push(group);
  // Assign columns
  for (const g of groups) {
    g.forEach((ev, idx) => {
      meta[ev.id] = { col: idx, total: g.length };
    });
  }
  return meta;
}

// Fix getWeekDates to use local time
const getWeekDates = (date: Date) => {
  const start = new Date(date);
  // Set to local start of week (Sunday)
  start.setHours(0, 0, 0, 0);
  start.setDate(date.getDate() - date.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
};

const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  view,
  events,
  onEventClick,
  dayColumnWidthRem = 15,
  timeGutterWidth = 60,
  indicatorTop = 0,
  showIndicator = false,
  slotRef,
  calendarContainerRef,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const weekDates = getWeekDates(currentDate);
  const days = view === "week" ? weekDates : [currentDate];

  // Grid template - use flexible widths for desktop, fixed for mobile
  const isMobileView = window.innerWidth <= 600;
  const gridTemplateColumns = isMobileView
    ? `minmax(${timeGutterWidth}px, ${timeGutterWidth}px) repeat(${days.length}, minmax(${dayColumnWidthRem}rem, ${dayColumnWidthRem}rem))`
    : `minmax(${timeGutterWidth}px, ${timeGutterWidth}px) repeat(${days.length}, minmax(0, 1fr))`;

  // Use responsive height for grid rows
  const hourHeightCSS = isMobileView
    ? window.matchMedia("(orientation: landscape)").matches
      ? "2.5rem"
      : "3.5rem"
    : HOUR_HEIGHT_CSS;
  const gridTemplateRows = `minmax(2.5rem, auto) repeat(${hours.length}, ${hourHeightCSS})`;

  return (
    <CalendarGridContainer
      ref={calendarContainerRef}
      $isDarkMode={isDarkMode}
      style={{
        gridTemplateColumns,
        gridTemplateRows,
      }}
    >
      {/* Top-left cell */}
      <TopLeftCell $isDarkMode={isDarkMode} />
      {/* Date headers */}
      {days.map((d, i) => {
        const isToday = isSameDay(d, new Date());
        return (
          <HeaderCell key={i} $isToday={isToday} $isDarkMode={isDarkMode}>
            {d.toLocaleDateString(undefined, {
              weekday: "short",
              month: "numeric",
              day: "numeric",
            })}
          </HeaderCell>
        );
      })}
      {/* Time gutter and body cells */}
      {hours.map((hour, rowIdx) => [
        <GutterCell key={`gutter-${hour}`} $isDarkMode={isDarkMode}>
          {hour}:00
        </GutterCell>,
        ...days.map((day, colIdx) => {
          const isToday = isSameDay(day, new Date());
          // Find events that start at this day/hour
          const cellEvents = events.filter(
            (ev) => isSameDay(ev.start, day) && isSameHour(ev.start, hour)
          );
          // All events for this day
          const dayEvents = events.filter((ev) => isSameDay(ev.start, day));
          // Overlap meta for this day
          const overlapMeta = getOverlappingMeta(dayEvents);

          return (
            <BodyCell
              key={`cell-${rowIdx}-${colIdx}`}
              $isToday={isToday}
              $isDarkMode={isDarkMode}
              ref={
                rowIdx === 0 && colIdx === 0 && slotRef ? slotRef : undefined
              }
            >
              {cellEvents.map((ev) => {
                const span = getEventSpan(ev);
                const top = 0;
                const height = span * HOUR_HEIGHT;
                const meta = overlapMeta[ev.id] || { col: 0, total: 1 };
                const width = 100 / meta.total;
                const left = meta.col * width;
                const startStr = ev.start.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const endStr = ev.end.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const tooltip = (
                  <div>
                    <div>
                      <strong>{ev.title}</strong>
                    </div>
                    <div>
                      {startStr} - {endStr}
                    </div>
                    {ev.notes && <div style={{ marginTop: 4 }}>{ev.notes}</div>}
                  </div>
                );
                return (
                  <EventWrapper
                    key={ev.id}
                    $top={top}
                    $height={height}
                    $left={left}
                    $width={width}
                  >
                    <Tooltip title={tooltip} arrow placement="top">
                      <span>
                        <EventCard
                          event={ev}
                          onClick={() => onEventClick?.(ev)}
                        />
                      </span>
                    </Tooltip>
                  </EventWrapper>
                );
              })}
            </BodyCell>
          );
        }),
      ])}
      {/* Render the time indicator positioned within the grid content */}
      {showIndicator && (
        <div
          style={{
            position: "absolute",
            top: `${indicatorTop}px`,
            left: `${timeGutterWidth}px`,
            right: 0,
            height: "2px",
            background: "red",
            zIndex: 20,
            pointerEvents: "none",
            boxShadow: "0 0 6px 2px rgba(255, 0, 0, 0.15)",
            transition: "top 0.2s linear",
          }}
        />
      )}
    </CalendarGridContainer>
  );
};

export default CalendarGrid;
