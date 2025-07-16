import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addDays } from "date-fns";
import { enUS } from "date-fns/locale";
import { useAppSelector } from "../../utils/hooks";
import {
  useGetAdminEmployeesQuery,
  useGetEmployeeAssignedByDateQuery,
} from "../../services/api";
import { MenuItem, Select, InputLabel } from "@mui/material";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./employee-calendar-custom.css";
import { skipToken } from "@reduxjs/toolkit/query";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRef } from "react";
import GlobalAppBar from "../../components/GloabalAppBar/GlobalAppBar";
import {
  CalendarRoot,
  CalendarAppBarWrapper,
  CalendarContent,
  CalendarTitleRow,
  CalendarTitle,
  CalendarEmployeeSelect,
  CalendarContainer,
  CalendarControlsRow,
} from "./elements";
import DatePicker from "../../components/DatePicker/DatePicker";
import type { DatePickerRef } from "../../components/DatePicker/DatePicker";

const locales = {
  "en-US": enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  reservationId: string;
  notes?: string;
}

const EmployeeCalendar: React.FC = () => {
  const { user } = useAppSelector((state) => state.user);
  const userRole = user?.role || "user";
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const navigate = useNavigate();
  const [calendarDate, setCalendarDate] = useState<Date>(() => {
    return new Date();
  });

  const { data: allEmployees = [] } = useGetAdminEmployeesQuery(undefined, {
    skip: userRole !== "admin",
  });

  const weekStart = startOfWeek(calendarDate, { weekStartsOn: 0 });
  const weekEnd = addDays(weekStart, 6);
  const weekStartStr = format(weekStart, "yyyy-MM-dd");
  const weekEndStr = format(weekEnd, "yyyy-MM-dd");

  const hasAuthToken = !!localStorage.getItem("authToken");
  const shouldFetch = hasAuthToken && !!weekStartStr && !!weekEndStr;

  if (!hasAuthToken) {
    return <div>Loading user info...</div>;
  }

  const { data: weekReservations = [] } = useGetEmployeeAssignedByDateQuery(
    shouldFetch ? { startDate: weekStartStr, endDate: weekEndStr } : skipToken
  );

  const events: CalendarEvent[] = weekReservations.map((r: any) => {
    const start = new Date(r.date + "T" + (r.time || "00:00"));
    const end = new Date(start.getTime() + 90 * 60000); // 90 minutes in ms
    return {
      id: r.id,
      title: r.customerName || "Reservation",
      start,
      end,
      reservationId: r.id,
      notes: r.notes,
    };
  });

  // Auto-select the first employee for admin if none is selected
  useEffect(() => {
    if (
      userRole === "admin" &&
      allEmployees.length > 0 &&
      !selectedEmployeeId
    ) {
      setSelectedEmployeeId(allEmployees[0].id);
    }
  }, [userRole, allEmployees, selectedEmployeeId]);

  // Force all day columns to have blue background using JS override
  useEffect(() => {
    const setBg = () => {
      document.querySelectorAll(".rbc-day-bg").forEach((el) => {
        (el as HTMLElement).style.background = "#e3f2fd";
        (el as HTMLElement).style.backgroundColor = "#e3f2fd";
        (el as HTMLElement).style.opacity = "1";
      });
    };
    setBg();
    // Re-apply after navigation or updates
    const calendar = document.querySelector(".rbc-time-view");
    if (calendar) {
      const observer = new MutationObserver(setBg);
      observer.observe(calendar, { childList: true, subtree: true });
      return () => observer.disconnect();
    }
  }, []);

  const datePickerRef = useRef<DatePickerRef>(null);

  return (
    <CalendarRoot>
      <CalendarAppBarWrapper>
        <GlobalAppBar />
      </CalendarAppBarWrapper>
      <CalendarContent>
        {/* Title and Select Employee on the same row for admin, directly under AppBar */}
        <CalendarTitleRow>
          <CalendarTitle variant="h4">Weekly Calendar</CalendarTitle>
          {userRole === "admin" && (
            <>
              <CalendarEmployeeSelect>
                <InputLabel id="employee-select-label">
                  Select Employee
                </InputLabel>
                <Select
                  labelId="employee-select-label"
                  value={selectedEmployeeId}
                  label="Select Employee"
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                >
                  <MenuItem value="">-- Select --</MenuItem>
                  {allEmployees.map((emp: any) => (
                    <MenuItem key={emp.id} value={emp.id}>
                      {emp.name || emp.email}
                    </MenuItem>
                  ))}
                </Select>
              </CalendarEmployeeSelect>
              <CalendarControlsRow>
                <ArrowBackIosNewIcon
                  style={{ cursor: "pointer", flex: "0 0 auto" }}
                  onClick={() => datePickerRef.current?.goToPrevWeek()}
                />
                <DatePicker
                  ref={datePickerRef}
                  value={calendarDate}
                  onChange={(date) => {
                    setCalendarDate(date);
                  }}
                  showTime={false}
                />
                <ArrowForwardIosIcon
                  style={{ cursor: "pointer", flex: "0 0 auto" }}
                  onClick={() => datePickerRef.current?.goToNextWeek()}
                />
              </CalendarControlsRow>
            </>
          )}
        </CalendarTitleRow>
        <CalendarContainer>
          {/* Hidden native date input for calendar icon trigger */}
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            date={startOfWeek(calendarDate, { weekStartsOn: 0 })}
            onNavigate={(date: any) => setCalendarDate(date)}
            style={{
              height: "100%",
              width: "100%",
              maxWidth: 900,
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              padding: 16,
              minHeight: 0,
              minWidth: 0,
              margin: "0 auto",
            }}
            views={["week"]}
            defaultView="week"
            toolbar={false}
            components={{
              event: ({ event }: { event: CalendarEvent }) => {
                const reservation = weekReservations.find(
                  (r) => r.id === event.reservationId
                );
                return (
                  <div
                    style={{
                      background: "#fff",
                      border: "1px solid #1976d2",
                      borderRadius: 8,
                      boxShadow: "0 2px 8px rgba(25, 118, 210, 0.08)",
                      color: "#1976d2",
                      padding: "8px 12px",
                      fontWeight: 500,
                      fontSize: 15,
                      minWidth: 120,
                      maxWidth: 260,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    <div style={{ fontWeight: 700 }}>{event.title}</div>
                    <div style={{ fontSize: 14 }}>
                      <strong>Time:</strong>{" "}
                      {event.start
                        ? event.start.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </div>
                    {reservation && (
                      <>
                        <div style={{ fontSize: 14 }}>
                          <strong>Address:</strong> {reservation.address},{" "}
                          {reservation.city}, {reservation.state}{" "}
                          {reservation.zipCode}
                        </div>
                        <div style={{ fontSize: 14 }}>
                          <strong>Phone:</strong> {reservation.phoneNumber}
                        </div>
                        <div style={{ fontSize: 14 }}>
                          <strong>Adults:</strong> {reservation.adult} &nbsp;{" "}
                          <strong>Kids:</strong> {reservation.kids}
                        </div>
                      </>
                    )}
                    {event.notes && (
                      <div style={{ fontSize: 13 }}>{event.notes}</div>
                    )}
                  </div>
                );
              },
            }}
            popup
            onSelectEvent={(event: CalendarEvent) =>
              navigate(`/reservation/${event.reservationId}`)
            }
            eventPropGetter={() => ({
              style: {
                backgroundColor: userRole === "admin" ? "#43a047" : "#1976d2",
                color: "#fff",
                borderRadius: 8,
                boxShadow: "0 1px 4px rgba(0,0,0,0.10)",
                padding: "4px 8px",
                fontSize: 14,
                border: "none",
              },
            })}
          />
        </CalendarContainer>
      </CalendarContent>
    </CalendarRoot>
  );
};

export default EmployeeCalendar;
