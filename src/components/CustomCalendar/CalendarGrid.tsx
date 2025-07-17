import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import type { CalendarView, CalendarEvent } from "./CustomCalendar";
import EventCard from "./EventCard";
import CurrentTimeIndicator from "./CurrentTimeIndicator";
import Tooltip from "@mui/material/Tooltip";

const hours = Array.from({ length: 11 }, (_, i) => 12 + i); // 12pm-10pm
// Reduce slot height for a more compact grid
const HOUR_HEIGHT = 32; // px (was 40)
const HOUR_HEIGHT_CSS = "3.5rem"; // was 15rem

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
  slotRef?: React.RefObject<HTMLDivElement>;
}

const CalendarGridContainer = styled.div`
  display: grid;
  width: 100%;
  max-height: 80vh;
  overflow-y: scroll;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 8px;
  &::-webkit-scrollbar {
    display: none; /* Chrome/Safari/Webkit */
  }
  @media (max-width: 600px) {
    width: max-content;
    border-radius: 0;
    box-shadow: none;
    padding: 4px;
    overflow-x: auto;
    position: relative;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
  }
`;

const HeaderCell = styled.div<{ $isToday?: boolean }>`
  background: ${({ $isToday }) => ($isToday ? "#f5f5f5" : "#f0f0f8")};
  color: ${({ $isToday }) => ($isToday ? "#1976d2" : "inherit")};
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

const BodyCell = styled.div<{ $isToday?: boolean }>`
  background: ${({ $isToday }) => ($isToday ? "#e3f2fd" : "#fff")};
  border-right: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  min-height: ${HOUR_HEIGHT_CSS};
  position: relative;
  font-size: 1rem;
  height: 100%;
  padding: 0;
  margin: 0;

  @media (min-width: 601px) {
    min-width: 0;
  }
`;

const TodayColumnWrapper = styled.div`
  position: relative;
  height: 100%;
`;

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
}) => {
  const weekDates = getWeekDates(currentDate);
  const days = view === "week" ? weekDates : [currentDate];

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
        const isToday = isSameDay(d, new Date());
        return (
          <HeaderCell key={i} $isToday={isToday}>
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
          const isToday = isSameDay(day, new Date());
          // Find events that start at this day/hour
          const cellEvents = events.filter(
            (ev) => isSameDay(ev.start, day) && isSameHour(ev.start, hour)
          );
          // All events for this day
          const dayEvents = events.filter((ev) => isSameDay(ev.start, day));
          // Overlap meta for this day
          const overlapMeta = getOverlappingMeta(dayEvents);
          // Instead of rendering indicator in the first cell, render a wrapper for each column
          if (rowIdx === 0) {
            return (
              <TodayColumnWrapper
                key={`col-${colIdx}`}
                // no ref here
              >
                {hours.map((h, hIdx) => {
                  const cellEvents = events.filter(
                    (ev) => isSameDay(ev.start, day) && isSameHour(ev.start, h)
                  );
                  const dayEvents = events.filter((ev) =>
                    isSameDay(ev.start, day)
                  );
                  const overlapMeta = getOverlappingMeta(dayEvents);
                  return (
                    <BodyCell
                      key={`cell-${hIdx}-${colIdx}`}
                      $isToday={isToday}
                      ref={
                        hIdx === 0 && colIdx === 0 && slotRef
                          ? slotRef
                          : undefined
                      }
                    >
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
                            {ev.notes && (
                              <div style={{ marginTop: 4 }}>{ev.notes}</div>
                            )}
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
                })}
                {/* Render the time indicator absolutely in every column */}
                {showIndicator && <CurrentTimeIndicator top={indicatorTop} />}
              </TodayColumnWrapper>
            );
          }
          // For non-first rows, render as before
          return (
            <BodyCell key={`cell-${rowIdx}-${colIdx}`} $isToday={isToday}>
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
    </CalendarGridContainer>
  );
};

export default CalendarGrid;
