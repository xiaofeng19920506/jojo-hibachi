import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import type { ToolbarProps } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  addDays,
  differenceInCalendarWeeks,
  format as formatDate,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { useAppSelector } from "../../utils/hooks";
import {
  useGetAdminEmployeesQuery,
  useGetEmployeeAssignedByDateQuery,
} from "../../services/api";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./employee-calendar-custom.css";
import { skipToken } from "@reduxjs/toolkit/query";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRef } from "react";
import GlobalAppBar from "../../components/GloabalAppBar/GlobalAppBar";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

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
  const dateInputRef = useRef<HTMLInputElement>(null);

  const { data: allEmployees = [] } = useGetAdminEmployeesQuery(undefined, {
    skip: userRole !== "admin",
  });

  const now = new Date();
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

  useEffect(() => {
    console.log("calendarDate changed:", calendarDate);
  }, [calendarDate]);

  const CustomToolbar = (toolbar: any & { calendarDate: Date }) => {
    const weekStartDate = startOfWeek(toolbar.calendarDate, {
      weekStartsOn: 0,
    });
    const weekEndDate = addDays(weekStartDate, 6);
    const weekLabel = `${formatDate(weekStartDate, "M/d/yy")} - ${formatDate(
      weekEndDate,
      "M/d/yy"
    )}`;
    console.log("CustomToolbar calendarDate:", toolbar.calendarDate);
    return (
      <div
        className="rbc-toolbar"
        style={{
          textAlign: "center",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          flexWrap: "nowrap",
          gap: 0,
        }}
      >
        <ArrowBackIosNewIcon
          style={{ cursor: "pointer", marginRight: 8, flex: "0 0 auto" }}
          onClick={() => {
            const prev = addDays(weekStart, -7);
            setCalendarDate(prev);
            toolbar.onNavigate("PREV");
          }}
        />
        <span
          className="rbc-toolbar-label"
          style={{
            minWidth: 70,
            fontWeight: 500,
            fontSize: 14,
            margin: "0 2px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {weekLabel}
        </span>
        <CalendarMonthIcon
          sx={{
            fontSize: 24,
            color: "primary.main",
            cursor: "pointer",
            ml: 1,
            mr: 1,
            flex: "0 0 auto",
          }}
          onClick={() => {
            if (dateInputRef.current) {
              dateInputRef.current.focus();
              dateInputRef.current.click();
            }
          }}
        />
        <input
          type="date"
          ref={dateInputRef}
          tabIndex={-1}
          style={{
            opacity: 0,
            position: "absolute",
            left: "-9999px",
            width: 0,
            height: 0,
            pointerEvents: "none",
          }}
          onChange={(e) => {
            if (e.target.value) {
              const pickedDate = new Date(e.target.value);
              setCalendarDate(startOfWeek(pickedDate, { weekStartsOn: 0 }));
            }
          }}
        />
        <ArrowForwardIosIcon
          style={{ cursor: "pointer", marginLeft: 8, flex: "0 0 auto" }}
          onClick={() => {
            const next = addDays(weekStart, 7);
            setCalendarDate(next);
            toolbar.onNavigate("NEXT");
          }}
        />
      </div>
    );
  };

  return (
    <>
      <GlobalAppBar />
      <Box
        sx={{
          p: { xs: 0, sm: 2 },
          m: 0,
          width: "100vw",
          height: "100vh",
          minHeight: "100vh",
          minWidth: "100vw",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" mb={2} sx={{ p: 3 }}>
          Weekly Calendar
        </Typography>
        {userRole === "admin" && (
          <FormControl sx={{ mb: 2, minWidth: 240, mx: 3 }}>
            <InputLabel id="employee-select-label">Select Employee</InputLabel>
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
          </FormControl>
        )}
        <Box
          sx={{
            flex: 1,
            width: "100%",
            maxWidth: 900,
            height: "100%",
            minHeight: 0,
            minWidth: 0,
            mx: "auto",
            px: { xs: 1, sm: 2 },
          }}
        >
          {/* Hidden native date input for calendar icon trigger */}
          <input
            type="date"
            ref={dateInputRef}
            style={{ opacity: 0, position: "absolute", left: "-9999px" }}
            onChange={(e) => {
              if (e.target.value) {
                const pickedDate = new Date(e.target.value);
                setCalendarDate(startOfWeek(pickedDate, { weekStartsOn: 0 }));
              }
            }}
          />
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
            toolbar={true}
            components={{
              toolbar: (props: ToolbarProps & { calendarDate: Date }) => (
                <CustomToolbar {...props} calendarDate={calendarDate} />
              ),
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
        </Box>
      </Box>
    </>
  );
};

export default EmployeeCalendar;
