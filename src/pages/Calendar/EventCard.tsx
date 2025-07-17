import React from "react";
import {
  CalendarEventCard,
  CalendarEventCardTitle,
  CalendarEventCardInfo,
  CalendarEventCardNotes,
} from "./elements";

interface EventCardProps {
  event: {
    title: string;
    start: Date;
  };
  reservation?: {
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phoneNumber?: string;
    adult?: number;
    kids?: number;
  };
  notes?: string;
}

const EventCard: React.FC<EventCardProps> = ({ event, reservation, notes }) => (
  <CalendarEventCard>
    <CalendarEventCardTitle>{event.title}</CalendarEventCardTitle>
    <CalendarEventCardInfo>
      <strong>Time:</strong>{" "}
      {event.start
        ? event.start.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : ""}
    </CalendarEventCardInfo>
    {reservation && (
      <>
        <CalendarEventCardInfo>
          <strong>Address:</strong> {reservation.address}, {reservation.city},{" "}
          {reservation.state} {reservation.zipCode}
        </CalendarEventCardInfo>
        <CalendarEventCardInfo>
          <strong>Phone:</strong> {reservation.phoneNumber}
        </CalendarEventCardInfo>
        <CalendarEventCardInfo>
          <strong>Adults:</strong> {reservation.adult} &nbsp;{" "}
          <strong>Kids:</strong> {reservation.kids}
        </CalendarEventCardInfo>
      </>
    )}
    {notes && <CalendarEventCardNotes>{notes}</CalendarEventCardNotes>}
  </CalendarEventCard>
);

export default EventCard;
