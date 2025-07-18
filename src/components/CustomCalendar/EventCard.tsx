import React from "react";
import styled from "styled-components";
import type { CalendarEvent } from "./CustomCalendar";

const Card = styled.div`
  background: #9c27b0;
  color: #fff;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 0.95rem;
  font-weight: 500;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  margin: 2px 0;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: box-shadow 0.15s;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 2px;
  &:hover {
    box-shadow: 0 2px 8px rgba(156, 39, 176, 0.18);
    opacity: 0.95;
  }

  @media (max-width: 600px) {
    padding: 4px 6px;
    font-size: 0.8rem;
    border-radius: 4px;
    margin: 1px 0;
  }

  @media (max-width: 600px) and (orientation: landscape) {
    padding: 2px 4px;
    font-size: 0.7rem;
    border-radius: 3px;
    margin: 1px 0;
  }
`;

const EventCard: React.FC<{ event: CalendarEvent; onClick?: () => void }> = ({
  event,
  onClick,
}) => {
  const startStr = event.start
    ? event.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";
  const endStr = event.end
    ? event.end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";
  return (
    <Card onClick={onClick}>
      <div style={{ fontSize: "0.9em", opacity: 0.85 }}>
        {startStr} - {endStr}
      </div>
      <div style={{ fontWeight: 600, fontSize: "1em" }}>{event.title}</div>
      {event.notes && (
        <div
          style={{
            fontSize: "0.85em",
            fontStyle: "italic",
            opacity: 0.8,
            whiteSpace: "pre-line",
          }}
        >
          {event.notes}
        </div>
      )}
    </Card>
  );
};

export default EventCard;
