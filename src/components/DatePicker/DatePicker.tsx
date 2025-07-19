import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import styled, { keyframes } from "styled-components";
import ReactDOM from "react-dom";

// --- Animations ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- Styled components ---
const PickerWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const CalendarPopup = styled.div<{
  open: boolean;
}>`
  display: ${({ open }) => (open ? "block" : "none")};
  z-index: 9999;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  padding: 16px;
  min-width: 260px;
  animation: ${fadeIn} 0.18s ease;
  max-width: 90vw;
  max-height: 80vh;
  overflow-y: auto;

  @media (max-width: 600px) and (orientation: landscape) {
    min-width: 200px;
    max-width: 85vw;
    padding: 12px;
    font-size: 0.9rem;
  }
`;

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
  &:focus {
    outline: 2px solid #1976d2;
  }
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
`;

const DayCell = styled.button<{ selected?: boolean; disabled?: boolean }>`
  background: ${({ selected }) => (selected ? "#1976d2" : "#f5f5f5")};
  color: ${({ selected, disabled }) =>
    disabled ? "#bbb" : selected ? "#fff" : "#222"};
  border: none;
  border-radius: 4px;
  padding: 8px 0;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  font-size: 15px;
  &:hover {
    background: ${({ selected, disabled }) =>
      disabled ? undefined : selected ? "#1565c0" : "#e3f2fd"};
  }
  &:focus {
    outline: 2px solid #1976d2;
  }
`;

const WeekdayLabel = styled.div`
  font-size: 13px;
  color: #888;
  text-align: center;
  margin-bottom: 2px;
`;

const DateInputButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 16px;
  cursor: pointer;
`;

const CalendarIcon = styled.span`
  font-size: 20px;
`;

const TimeSelectRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  align-items: center;
`;

const TimeSelect = styled.select`
  font-size: 15px;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const HeaderSelect = styled.select`
  font-size: 15px;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin: 0 4px;
  background: #f5f5f5;
  &:focus {
    outline: 2px solid #1976d2;
  }
`;

// --- Helper functions ---
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// --- Main component ---
interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  showTime?: boolean;
}

/**
 * DatePicker ref API:
 * - goToPrevWeek(): Move selected date one week back and call onChange
 * - goToNextWeek(): Move selected date one week forward and call onChange
 */
export interface DatePickerRef {
  goToPrevWeek: () => void;
  goToNextWeek: () => void;
}

const DatePicker = forwardRef<DatePickerRef, DatePickerProps>(
  ({ value, onChange, minDate, maxDate, showTime = false }, ref) => {
    const [open, setOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(
      value || null
    );
    const [viewYear, setViewYear] = useState(
      value ? value.getFullYear() : new Date().getFullYear()
    );
    const [viewMonth, setViewMonth] = useState(
      value ? value.getMonth() : new Date().getMonth()
    );
    const [selectedHour, setSelectedHour] = useState<number>(
      value ? value.getHours() : 12
    );
    const [selectedMinute, setSelectedMinute] = useState<number>(
      value ? value.getMinutes() : 0
    );
    const wrapperRef = useRef<HTMLDivElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const [popupCoords, setPopupCoords] = useState({ top: 0, left: 0 });

    // Add force re-render on orientation/resize
    const [, forceUpdate] = useState(0);
    useEffect(() => {
      const handleResize = () => forceUpdate((n) => n + 1);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        goToPrevWeek: () => {
          const base = new Date(
            viewYear,
            viewMonth,
            selectedDate?.getDate() || 1
          );
          const prev = new Date(base);
          prev.setDate(base.getDate() - 7);
          setViewYear(prev.getFullYear());
          setViewMonth(prev.getMonth());
          setSelectedDate(prev);
          onChange?.(prev);
        },
        goToNextWeek: () => {
          const base = new Date(
            viewYear,
            viewMonth,
            selectedDate?.getDate() || 1
          );
          const next = new Date(base);
          next.setDate(base.getDate() + 7);
          setViewYear(next.getFullYear());
          setViewMonth(next.getMonth());
          setSelectedDate(next);
          onChange?.(next);
        },
      }),
      [viewYear, viewMonth, selectedDate, onChange]
    );

    // --- Calculate popup position ---
    useEffect(() => {
      if (open && wrapperRef.current && popupRef.current) {
        const inputRect = wrapperRef.current.getBoundingClientRect();
        const popupRect = popupRef.current.getBoundingClientRect();
        let top = inputRect.bottom + 8; // 8px gap
        let left = inputRect.left;

        // Prevent right overflow
        if (left + popupRect.width > window.innerWidth - 8) {
          left = window.innerWidth - popupRect.width - 8;
        }
        // Prevent left overflow
        if (left < 8) left = 8;

        // Prevent bottom overflow
        if (top + popupRect.height > window.innerHeight - 8) {
          top = inputRect.top - popupRect.height - 8;
          if (top < 8) top = 8;
        }

        setPopupCoords({ top, left });
      }
    }, [open]);

    // --- Accessibility: Focus trap in popup ---
    useEffect(() => {
      if (open) {
        const focusable = wrapperRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        focusable?.[0]?.focus();
      }
    }, [open]);

    // --- Close popup on outside click or Escape ---
    useEffect(() => {
      function handleClick(e: MouseEvent) {
        const target = e.target as Node;
        const insideWrapper =
          wrapperRef.current && wrapperRef.current.contains(target);
        const insidePopup =
          popupRef.current && popupRef.current.contains(target);
        if (!insideWrapper && !insidePopup) {
          setOpen(false);
        }
      }
      function handleKey(e: KeyboardEvent) {
        if (e.key === "Escape") setOpen(false);
      }
      if (open) {
        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleKey);
      } else {
        document.removeEventListener("mousedown", handleClick);
        document.removeEventListener("keydown", handleKey);
      }
      return () => {
        document.removeEventListener("mousedown", handleClick);
        document.removeEventListener("keydown", handleKey);
      };
    }, [open]);

    // --- Update view when value changes ---
    useEffect(() => {
      if (value) {
        setSelectedDate(value);
        setViewYear(value.getFullYear());
        setViewMonth(value.getMonth());
        setSelectedHour(value.getHours());
        setSelectedMinute(value.getMinutes());
      }
    }, [value]);

    // --- Calendar grid ---
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDayOfWeek = getFirstDayOfWeek(viewYear, viewMonth);
    const days: (number | null)[] = [
      ...Array(firstDayOfWeek).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    // --- Handlers ---
    const handleDayClick = (day: number | null) => {
      if (!day) return;
      let date: Date;
      if (showTime) {
        date = new Date(viewYear, viewMonth, day, selectedHour, selectedMinute);
      } else {
        date = new Date(viewYear, viewMonth, day, 0, 0, 0, 0);
      }
      if (minDate && date < minDate) return;
      if (maxDate && date > maxDate) return;
      setSelectedDate(date);
      onChange?.(new Date(date)); // Always emit a new Date object
      setOpen(false);
    };

    const handlePrevMonth = () => {
      if (viewMonth === 0) {
        setViewMonth(11);
        setViewYear((y) => y - 1);
      } else {
        setViewMonth((m) => m - 1);
      }
    };
    const handleNextMonth = () => {
      if (viewMonth === 11) {
        setViewMonth(0);
        setViewYear((y) => y + 1);
      } else {
        setViewMonth((m) => m + 1);
      }
    };

    // --- Keyboard navigation ---
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!open) return;
      if (!selectedDate) return;
      let newDate = new Date(selectedDate);
      switch (e.key) {
        case "ArrowLeft":
          newDate.setDate(selectedDate.getDate() - 1);
          break;
        case "ArrowRight":
          newDate.setDate(selectedDate.getDate() + 1);
          break;
        case "ArrowUp":
          newDate.setDate(selectedDate.getDate() - 7);
          break;
        case "ArrowDown":
          newDate.setDate(selectedDate.getDate() + 7);
          break;
        case "Enter":
          setOpen(false);
          onChange?.(selectedDate);
          return;
        default:
          return;
      }
      if (
        (!minDate || newDate >= minDate) &&
        (!maxDate || newDate <= maxDate) &&
        newDate.getMonth() === viewMonth
      ) {
        setSelectedDate(newDate);
      }
    };

    // --- Time selection ---
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = [0, 15, 30, 45];

    const handleTimeChange = (h: number, m: number) => {
      setSelectedHour(h);
      setSelectedMinute(m);
      if (selectedDate) {
        const newDate = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          h,
          m
        );
        setSelectedDate(newDate);
        onChange?.(newDate);
      }
    };

    // Month and year options
    const MONTHS = Array.from({ length: 12 }, (_, i) =>
      new Date(2000, i).toLocaleString("default", { month: "long" })
    );
    const currentYear = new Date().getFullYear();
    const YEARS = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

    // Debug log

    return (
      <PickerWrapper ref={wrapperRef}>
        <DateInputButton
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={
            selectedDate ? selectedDate.toLocaleString() : "Select date"
          }
          onClick={() => {
            const newOpen = !open;
            setOpen(newOpen);
          }}
        >
          <span>
            {selectedDate
              ? showTime
                ? selectedDate.toLocaleDateString() +
                  " " +
                  selectedHour.toString().padStart(2, "0") +
                  ":" +
                  selectedMinute.toString().padStart(2, "0")
                : selectedDate.toLocaleDateString()
              : showTime
              ? "Select date & time"
              : "Select date"}
          </span>
          <CalendarIcon role="img" aria-label="calendar">
            📅
          </CalendarIcon>
        </DateInputButton>
        {open &&
          ReactDOM.createPortal(
            <CalendarPopup
              ref={popupRef}
              open={open}
              style={{
                position: "absolute",
                top: popupCoords.top,
                left: popupCoords.left,
                zIndex: 9999,
                minWidth: 260,
                maxWidth: "90vw",
                maxHeight: "80vh",
                overflowY: "auto",
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: 8,
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
                padding: 16,
              }}
              role="dialog"
              aria-modal="true"
              tabIndex={-1}
              onKeyDown={handleKeyDown}
            >
              <CalendarHeader>
                <NavButton
                  onClick={handlePrevMonth}
                  aria-label="Previous month"
                >
                  &lt;
                </NavButton>
                <HeaderSelect
                  value={viewMonth}
                  onChange={(e) => setViewMonth(Number(e.target.value))}
                  aria-label="Select month"
                >
                  {MONTHS.map((m, i) => (
                    <option key={m} value={i}>
                      {m}
                    </option>
                  ))}
                </HeaderSelect>
                <HeaderSelect
                  value={viewYear}
                  onChange={(e) => setViewYear(Number(e.target.value))}
                  aria-label="Select year"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </HeaderSelect>
                <NavButton onClick={handleNextMonth} aria-label="Next month">
                  &gt;
                </NavButton>
              </CalendarHeader>
              <DaysGrid>
                {WEEKDAYS.map((wd) => (
                  <WeekdayLabel key={wd}>{wd}</WeekdayLabel>
                ))}
                {days.map((day, idx) => {
                  if (!day) return <div key={idx} />;
                  const thisDate = new Date(viewYear, viewMonth, day);
                  const disabled =
                    (minDate && thisDate < minDate) ||
                    (maxDate && thisDate > maxDate);
                  return (
                    <DayCell
                      key={idx}
                      selected={
                        !!(
                          selectedDate &&
                          isSameDay(thisDate, selectedDate) &&
                          thisDate.getMonth() === viewMonth
                        )
                      }
                      disabled={disabled}
                      tabIndex={disabled ? -1 : 0}
                      aria-selected={
                        !!(
                          selectedDate &&
                          isSameDay(thisDate, selectedDate) &&
                          thisDate.getMonth() === viewMonth
                        )
                      }
                      aria-disabled={disabled}
                      onClick={() => handleDayClick(day)}
                    >
                      {day}
                    </DayCell>
                  );
                })}
              </DaysGrid>
              {/* Time selection (optional) */}
              {showTime && (
                <TimeSelectRow>
                  <label htmlFor="hour-select">Hour:</label>
                  <TimeSelect
                    id="hour-select"
                    value={selectedHour}
                    onChange={(e) =>
                      handleTimeChange(Number(e.target.value), selectedMinute)
                    }
                  >
                    {hours.map((h) => (
                      <option key={h} value={h}>
                        {h.toString().padStart(2, "0")}
                      </option>
                    ))}
                  </TimeSelect>
                  <label htmlFor="minute-select">Minute:</label>
                  <TimeSelect
                    id="minute-select"
                    value={selectedMinute}
                    onChange={(e) =>
                      handleTimeChange(selectedHour, Number(e.target.value))
                    }
                  >
                    {minutes.map((m) => (
                      <option key={m} value={m}>
                        {m.toString().padStart(2, "0")}
                      </option>
                    ))}
                  </TimeSelect>
                </TimeSelectRow>
              )}
            </CalendarPopup>,
            document.body
          )}
      </PickerWrapper>
    );
  }
);
export default DatePicker;
