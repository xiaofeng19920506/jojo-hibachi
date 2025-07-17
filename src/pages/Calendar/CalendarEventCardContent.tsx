import React from "react";
import {
  CalendarEventCard,
  CalendarEventCardTitle,
  CalendarEventCardInfo,
  CalendarEventCardNotes,
} from "./elements";

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  reservationId: string;
  notes?: string;
}

interface CalendarEventCardContentProps {
  event: CalendarEvent;
  weekReservations: any[];
}

const CalendarEventCardContent: React.FC<CalendarEventCardContentProps> = ({
  event,
  weekReservations,
}) => {
  const reservation = weekReservations.find(
    (r) => r.id === event.reservationId
  );
  return (
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
      {event.notes && (
        <CalendarEventCardNotes>{event.notes}</CalendarEventCardNotes>
      )}
    </CalendarEventCard>
  );
};

export default CalendarEventCardContent;
