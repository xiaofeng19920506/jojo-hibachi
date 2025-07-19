import React, { useState, useEffect } from "react";
import CustomCalendar from "../../components/CustomCalendar/CustomCalendar";
import { format, startOfWeek, addDays, parseISO } from "date-fns";
import { useAppSelector } from "../../utils/hooks";
import {
  useGetAdminEmployeesQuery,
  useGetEmployeeAssignedByDateQuery,
  useGetAdminEmployeeAssignedReservationsQuery,
} from "../../services/api";
import { MenuItem, Select, InputLabel } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { skipToken } from "@reduxjs/toolkit/query";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRef } from "react";
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
import "./employee-calendar-custom.css";

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  reservationId: string;
  notes?: string;
}

const EmployeeCalendar: React.FC = () => {
  const theme = useTheme();
  const { user } = useAppSelector((state) => state.user);
  const userRole = user?.role || "user";
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const navigate = useNavigate();
  // Store week start as a string for reliable reactivity
  const [weekStartStr, setWeekStartStr] = useState(() =>
    format(startOfWeek(new Date(), { weekStartsOn: 0 }), "yyyy-MM-dd")
  );
  const calendarDate = parseISO(weekStartStr);

  const { data: allEmployees = [] } = useGetAdminEmployeesQuery(undefined, {
    skip: userRole !== "admin",
  });

  const weekStart = parseISO(weekStartStr);
  const weekEnd = addDays(weekStart, 6);
  const weekEndStr = format(weekEnd, "yyyy-MM-dd");

  const hasAuthToken = !!localStorage.getItem("authToken");
  const shouldFetch = hasAuthToken && !!weekStartStr && !!weekEndStr;

  if (!hasAuthToken) {
    return <div>Loading user info...</div>;
  }

  // For admin, use the admin endpoint; for others, use the employee endpoint
  const { data: weekReservations = [] } =
    userRole === "admin"
      ? useGetAdminEmployeeAssignedReservationsQuery(
          shouldFetch && selectedEmployeeId
            ? {
                employeeId: selectedEmployeeId,
                startDate: weekStartStr,
                endDate: weekEndStr,
              }
            : skipToken
        )
      : useGetEmployeeAssignedByDateQuery(
          shouldFetch
            ? {
                startDate: weekStartStr,
                endDate: weekEndStr,
              }
            : skipToken
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

  useEffect(() => {
    if (
      userRole === "admin" &&
      allEmployees.length > 0 &&
      !selectedEmployeeId
    ) {
      setSelectedEmployeeId(allEmployees[0].id);
    }
  }, [userRole, allEmployees, selectedEmployeeId]);

  // Removed the setBg useEffect since we're now using styled-components with theme props

  useEffect(() => {
    setTimeout(() => {
      const todayBg = document.querySelector(
        ".rbc-day-bg.rbc-today"
      ) as HTMLElement;
      const timeContent = document.querySelector(
        ".rbc-time-content"
      ) as HTMLElement;
      if (todayBg && timeContent) {
        const todayRect = todayBg.getBoundingClientRect();
        const contentRect = timeContent.getBoundingClientRect(); // Scroll so that today column is centered in the visible area
        const scrollLeft =
          todayBg.offsetLeft - contentRect.width / 2 + todayRect.width / 2;
        timeContent.scrollTo({ left: scrollLeft, behavior: "smooth" });
      }
    }, 100);
  }, [calendarDate]);
  1;
  useEffect(() => {
    // Auto-scroll to closest current time slot on mount
    setTimeout(() => {
      const now = new Date();
      const timeSlots = Array.from(
        document.querySelectorAll(".rbc-time-slot")
      ) as HTMLElement[];
      let closestSlot: HTMLElement | null = null;
      let minDiff = Infinity;
      for (const slot of timeSlots) {
        if (slot.innerText) {
          // slot.innerText is like "2:00 PM"
          const slotTime = new Date(now);
          const [time, ampm] = slot.innerText.trim().split(" ");
          if (!time || !ampm) continue;
          let [hour, minute] = time.split(":").map(Number);
          if (ampm === "PM" && hour !== 12) hour += 12;
          if (ampm === "AM" && hour === 12) hour = 0;
          slotTime.setHours(hour, minute || 0, 0, 0);
          const diff = Math.abs(now.getTime() - slotTime.getTime());
          if (diff < minDiff) {
            minDiff = diff;
            closestSlot = slot;
          }
        }
      }
      const timeContent = document.querySelector(
        ".rbc-time-content"
      ) as HTMLElement;
      if (closestSlot && timeContent) {
        const slotRect = closestSlot.getBoundingClientRect();
        const contentRect = timeContent.getBoundingClientRect();
        const scrollTop =
          closestSlot.offsetTop - contentRect.height / 2 + slotRect.height / 2;
        timeContent.scrollTo({ top: scrollTop, behavior: "smooth" });
      }
    }, 400);
  }, []);

  useEffect(() => {
    const updateLine = () => {
      const timeContent = document.querySelector(
        ".rbc-time-content"
      ) as HTMLElement;
      const gutterSlots = Array.from(
        document.querySelectorAll(".rbc-time-gutter .rbc-time-slot")
      ) as HTMLElement[];
      if (!timeContent || gutterSlots.length === 0) return;

      // Only show the line if today is in the current week
      const today = new Date();
      const weekStart = startOfWeek(calendarDate, { weekStartsOn: 0 });
      const weekEnd = addDays(weekStart, 6);
      if (today < weekStart || today > weekEnd) {
        return;
      }

      // Get the start time from the first gutter slot
      const firstSlotText = gutterSlots[0].innerText.trim();
      const [time, ampm] = firstSlotText.split(" ");
      let [startHour, startMinute] = time.split(":").map(Number);
      if (ampm === "PM" && startHour !== 12) startHour += 12;
      if (ampm === "AM" && startHour === 12) startHour = 0;
      const calendarStartMinutes = startHour * 60 + (startMinute || 0);

      // Get slot step in minutes
      let slotStep = 30; // default
      if (gutterSlots.length > 1) {
        const secondSlotText = gutterSlots[1].innerText.trim();
        const [time2, ampm2] = secondSlotText.split(" ");
        let [hour2, minute2] = time2.split(":").map(Number);
        if (ampm2 === "PM" && hour2 !== 12) hour2 += 12;
        if (ampm2 === "AM" && hour2 === 12) hour2 = 0;
        const slot2Minutes = hour2 * 60 + (minute2 || 0);
        slotStep = Math.abs(slot2Minutes - calendarStartMinutes);
      }

      // Get slot height in px
      const slotHeight = gutterSlots[0].offsetHeight;

      // Calculate offset for current time (device local time)
      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();
      const minutesSinceStart = nowMinutes - calendarStartMinutes;
      let top = (minutesSinceStart / slotStep) * slotHeight;
      // Clamp the line position to the visible area
      if (top < 0) top = 0;
      const maxTop = gutterSlots.length * slotHeight;
      if (top > maxTop) top = maxTop;

      // Scroll to the current time (if desired)
      if (timeContent && top > 0) {
        timeContent.scrollTo({
          top: top - timeContent.clientHeight / 2,
          behavior: "smooth",
        });
      }
    };

    updateLine();
    const interval = setInterval(updateLine, 60000);
    return () => clearInterval(interval);
  }, [calendarDate]);

  const datePickerRef = useRef<DatePickerRef>(null);

  return (
    <>
      {/* Removed inline styles since we're now using styled-components with theme props */}
      <CalendarRoot
        sx={{
          backgroundColor: theme.palette.mode === "dark" ? "#000" : "#f0f2f5",
          color: theme.palette.mode === "dark" ? "#fff" : "#000",
        }}
      >
        <CalendarAppBarWrapper></CalendarAppBarWrapper>
        <CalendarContent>
          {/* Title and Select Employee on the same row for admin, directly under AppBar */}
          <CalendarTitleRow>
            <CalendarTitle
              variant="h4"
              sx={{
                color: theme.palette.mode === "dark" ? "#fff" : "#000",
                display: { xs: "none", sm: "block" }, // Hide on mobile
              }}
            >
              Weekly Calendar
            </CalendarTitle>
            {userRole === "admin" && (
              <CalendarEmployeeSelect>
                <InputLabel id="employee-select-label">
                  Select Employee
                </InputLabel>
                <Select
                  labelId="employee-select-label"
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  label="Select Employee"
                  sx={{
                    minWidth: 200,
                    "@media (max-width: 600px)": {
                      minWidth: 150,
                    },
                    "@media (max-width: 600px) and (orientation: landscape)": {
                      minWidth: 120,
                      fontSize: "0.8rem",
                    },
                    "& .MuiInputLabel-root": {
                      color: theme.palette.mode === "dark" ? "#fff" : "#000",
                    },
                    "& .MuiSelect-select": {
                      color: theme.palette.mode === "dark" ? "#fff" : "#000",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor:
                        theme.palette.mode === "dark" ? "#666" : "#ccc",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor:
                        theme.palette.mode === "dark" ? "#888" : "#999",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  {allEmployees.map((emp: any) => (
                    <MenuItem key={emp.id} value={emp.id}>
                      {emp.name}
                    </MenuItem>
                  ))}
                </Select>
              </CalendarEmployeeSelect>
            )}
            <CalendarControlsRow>
              <ArrowBackIosNewIcon
                style={{
                  cursor: "pointer",
                  flex: "0 0 auto",
                  fontSize: window.innerWidth <= 600 ? "1.2rem" : "1.5rem",
                  color: theme.palette.mode === "dark" ? "#fff" : "#000",
                }}
                onClick={() => datePickerRef.current?.goToPrevWeek()}
              />
              <DatePicker
                ref={datePickerRef}
                value={calendarDate}
                onChange={(date) =>
                  setWeekStartStr(
                    format(startOfWeek(date, { weekStartsOn: 0 }), "yyyy-MM-dd")
                  )
                }
                showTime={false}
              />
              <ArrowForwardIosIcon
                style={{
                  cursor: "pointer",
                  flex: "0 0 auto",
                  fontSize: window.innerWidth <= 600 ? "1.2rem" : "1.5rem",
                  color: theme.palette.mode === "dark" ? "#fff" : "#000",
                }}
                onClick={() => datePickerRef.current?.goToNextWeek()}
              />
            </CalendarControlsRow>
          </CalendarTitleRow>
          <CalendarContainer
            style={{ position: "relative", height: "100%", overflow: "auto" }}
          >
            <CustomCalendar
              events={events}
              onEventClick={(event) =>
                navigate(`/reservation/${event.reservationId}`)
              }
              currentDate={calendarDate}
              onDateChange={(date) =>
                setWeekStartStr(
                  format(startOfWeek(date, { weekStartsOn: 0 }), "yyyy-MM-dd")
                )
              }
            />
          </CalendarContainer>
        </CalendarContent>
      </CalendarRoot>
    </>
  );
};

export default EmployeeCalendar;
