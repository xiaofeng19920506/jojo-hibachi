import React, { useEffect, useState } from "react";
import styled from "styled-components";
import type { CalendarView, CalendarEvent } from "./CustomCalendar";
import EventCard from "./EventCard";
import CurrentTimeIndicator from "./CurrentTimeIndicator";
import Tooltip from "@mui/material/Tooltip";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// Change hours to 12pm (12) to 10pm (22)
const hours = Array.from({ length: 11 }, (_, i) => 12 + i); // 12pm-10pm
const HOUR_HEIGHT = 40; // for calculations, in px
const HOUR_HEIGHT_CSS = "15rem"; // for styled-components
const HOUR_HEIGHT_CSS_MOBILE = "6rem";
const DAY_COLUMN_WIDTH_REM = 15;
const DAY_COLUMN_WIDTH_REM_MOBILE = 8;
const TIME_GUTTER_WIDTH = 60;
const TIME_GUTTER_WIDTH_MOBILE = 40;

// Accept numDays and columnWidth as props
interface CalendarGridProps {
  currentDate: Date;
  view: CalendarView;
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  numDays?: number;
  dayColumnWidthRem?: number;
  timeGutterWidth?: number;
}

const CalendarGridContainer = styled.div`
  display: grid;
  width: 100%;
  height: 80vh;
  overflow: auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 8px;
  scrollbar-width: thin;
  scrollbar-color: #e0e0e0 #fafafa;
  &::-webkit-scrollbar {
    height: 8px;
    background: #fafafa;
  }
  &::-webkit-scrollbar-thumb {
    background: #e0e0e0;
    border-radius: 4px;
  }

  @media (max-width: 600px) {
    width: max-content;
    border-radius: 0;
    box-shadow: none;
    padding: 4px;
    overflow-x: auto;
    overflow-y: auto;
    position: relative;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
  }
`;

const HeaderCell = styled.div<{ isToday?: boolean }>`
  background: ${({ isToday }) => (isToday ? "#f5f5f5" : "#f0f0f8")};
  color: ${({ isToday }) => (isToday ? "#1976d2" : "inherit")};
  font-weight: 500;
  font-size: 1.1rem;
  text-align: center;
  border-right: 1px solid #eee;
  border-bottom: 1px solid #e0e0e0;
  padding: 8px 0;
  position: sticky;
  top: 0;
  z-index: 2;

  @media (max-width: 600px) {
    position: sticky;
    top: 0;
    z-index: 2;
  }
`;

const GutterCell = styled.div`
  background: #fafafa;
  color: #888;
  font-size: 1rem;
  text-align: right;
  border-right: 1px solid #eee;
  border-bottom: 1px solid #e0e0e0;
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
`;

const TopLeftCell = styled(GutterCell)`
  top: 0;
  z-index: 4;
`;

const BodyCell = styled.div<{ isToday?: boolean }>`
  background: ${({ isToday }) => (isToday ? "#e3f2fd" : "#fff")};
  border-right: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  min-height: ${HOUR_HEIGHT_CSS};
  position: relative;
  font-size: 1rem;

  @media (min-width: 601px) {
    min-width: 0;
  }
`;

const EventWrapper = styled.div<{
  top: number;
  height: number;
  left: number;
  width: number;
}>`
  position: absolute;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}%;
  width: ${({ width }) => width}%;
  z-index: 5;
  right: 4px;
`;

const getWeekDates = (date: Date) => {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
};

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
  if (span < 0.5) span = 0.5; // minimum height for very short events
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

const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  view,
  events,
  onEventClick,
  numDays = view === "week" ? 7 : 1,
  dayColumnWidthRem = 15,
  timeGutterWidth = 60,
}) => {
  const weekDates = getWeekDates(currentDate);
  const days = view === "week" ? weekDates : [currentDate];

  // Current time indicator logic
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Find today column index
  const todayIdx = days.findIndex((d) => isSameDay(d, now));
  const showIndicator = todayIdx !== -1;

  // Calculate top offset for the indicator (in px)
  let indicatorTop = 0;
  if (showIndicator) {
    const hour = now.getHours();
    const minute = now.getMinutes();
    if (hour >= hours[0] && hour <= hours[hours.length - 1]) {
      indicatorTop = (hour - hours[0] + minute / 60) * HOUR_HEIGHT;
    } else {
      indicatorTop = hour < hours[0] ? 0 : HOUR_HEIGHT * hours.length;
    }
  }

  // Grid template - use flexible widths for desktop, fixed for mobile
  const isMobileView = window.innerWidth <= 600;
  const gridTemplateColumns = isMobileView
    ? `minmax(${timeGutterWidth}px, ${timeGutterWidth}px) repeat(${days.length}, minmax(${dayColumnWidthRem}rem, ${dayColumnWidthRem}rem))`
    : `minmax(${timeGutterWidth}px, ${timeGutterWidth}px) repeat(${days.length}, minmax(0, 1fr))`;
  const gridTemplateRows = `minmax(2.5rem, auto) repeat(${hours.length}, minmax(${HOUR_HEIGHT_CSS}, 1fr))`;

  return (
    <CalendarGridContainer
      style={{
        gridTemplateColumns,
        gridTemplateRows,
      }}
    >
      {/* Top-left cell */}
      <TopLeftCell />
      {/* Date headers */}
      {days.map((d, i) => {
        const isToday = isSameDay(d, now);
        return (
          <HeaderCell key={i} isToday={isToday}>
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
        <GutterCell key={`gutter-${hour}`}>{hour}:00</GutterCell>,
        ...days.map((day, colIdx) => {
          const isToday = isSameDay(day, now);
          // Find events that start at this day/hour
          const cellEvents = events.filter(
            (ev) => isSameDay(ev.start, day) && isSameHour(ev.start, hour)
          );
          // All events for this day
          const dayEvents = events.filter((ev) => isSameDay(ev.start, day));
          // Overlap meta for this day
          const overlapMeta = getOverlappingMeta(dayEvents);
          // Render indicator in the first cell of today column
          const renderIndicator =
            showIndicator && colIdx === todayIdx && hour === hours[0];
          return (
            <BodyCell key={`cell-${rowIdx}-${colIdx}`} isToday={isToday}>
              {cellEvents.map((ev) => {
                const span = getEventSpan(ev);
                const top = (ev.start.getMinutes() / 60) * HOUR_HEIGHT;
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
                    top={top}
                    height={height}
                    left={left}
                    width={width}
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
              {renderIndicator && <CurrentTimeIndicator top={indicatorTop} />}
            </BodyCell>
          );
        }),
      ])}
    </CalendarGridContainer>
  );
};

export default CalendarGrid;
