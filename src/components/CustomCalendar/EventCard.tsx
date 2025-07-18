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
  return <Card onClick={onClick}>{event.title}</Card>;
};

export default EventCard;
