import React, { useMemo, useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer, Event } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  addDays,
  isSameWeek,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { useAppSelector } from "../../utils/hooks";
import {
  useGetAssignedReservationsQuery,
  useGetAllEmployeesQuery,
  useGetReservationsQuery,
} from "../../services/api";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./employee-calendar-custom.css";

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

  // Fetch all employees for admin filter
  const { data: allEmployees = [] } = useGetAllEmployeesQuery(undefined, {
    skip: userRole !== "admin",
  });

  // Fetch reservations
  const assignedEmployeeId =
    userRole === "employee" ? user?.id : selectedEmployeeId;
  const { data: assignedReservations = [], isLoading: assignedLoading } =
    useGetAssignedReservationsQuery(undefined, {
      skip: userRole !== "employee" && !selectedEmployeeId,
    });
  const { data: allReservations = [], isLoading: allLoading } =
    useGetReservationsQuery(undefined, {
      skip: userRole !== "admin" || !selectedEmployeeId,
      refetchOnMountOrArgChange: true,
    });

  // Filter reservations for the selected employee (admin) or current user (employee)
  const reservations = useMemo(() => {
    if (userRole === "employee") {
      return assignedReservations;
    }
    if (userRole === "admin" && selectedEmployeeId) {
      // Filter all reservations for the selected employee
      return allReservations.filter(
        (r: any) => r.employeeId === selectedEmployeeId
      );
    }
    return [];
  }, [userRole, assignedReservations, allReservations, selectedEmployeeId]);

  // Only show reservations for the current week
  const now = new Date();
  const weekReservations = reservations.filter((r: any) => {
    const date = new Date(r.date + "T" + (r.time || "00:00"));
    return isSameWeek(date, now, { weekStartsOn: 0 });
  });

  // Map reservations to calendar events
  const events: CalendarEvent[] = weekReservations.map((r: any) => {
    const start = new Date(r.date + "T" + (r.time || "00:00"));
    // Assume 2-hour reservation for display
    const end = addDays(start, 0);
    end.setHours(start.getHours() + 2);
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

  return (
    <Box
      sx={{
        p: 0,
        m: 0,
        width: "100vw",
        height: "100vh",
        minHeight: "100vh",
        minWidth: "100vw",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
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
          height: "100%",
          minHeight: 0,
          minWidth: 0,
        }}
      >
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{
            height: "100%",
            width: "100%",
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            padding: 16,
            minHeight: 0,
            minWidth: 0,
          }}
          views={["week"]}
          defaultView="week"
          toolbar={true}
          popup
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
          components={{
            event: ({ event }: { event: CalendarEvent }) => {
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
                    maxWidth: 220,
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
                  {event.notes && (
                    <div style={{ fontSize: 13 }}>{event.notes}</div>
                  )}
                  {/* Add more reservation details here if needed */}
                </div>
              );
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default EmployeeCalendar;
