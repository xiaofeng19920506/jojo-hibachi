import {
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import type { ReservationStatus } from "../types";

interface FilterControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  startDate: string;
  onStartDateChange: (value: string) => void;
  endDate: string;
  onEndDateChange: (value: string) => void;
  statusFilter: ReservationStatus | "all";
  onStatusFilterChange: (value: ReservationStatus | "all") => void;
  activeTable: string;
  onTableChange?: (value: string) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  availableTables?: { value: string; label: string }[];
}

const FilterControls: React.FC<FilterControlsProps> = ({
  searchQuery,
  onSearchChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  statusFilter,
  onStatusFilterChange,
  activeTable,
  onTableChange,
  itemsPerPage,
  onItemsPerPageChange,
  availableTables,
}) => {
  return (
    <Box
      mb={2}
      display="flex"
      flexWrap="wrap"
      alignItems="center"
      sx={{ flexDirection: { xs: "column", sm: "row" }, gap: { xs: 1, sm: 2 } }}
    >
      {onTableChange && availableTables && (
        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel id="table-select-label">Table</InputLabel>
          <Select
            labelId="table-select-label"
            value={activeTable}
            label="Table"
            onChange={(e) => onTableChange(e.target.value)}
          >
            {availableTables.map((table) => (
              <MenuItem key={table.value} value={table.value}>
                {table.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <TextField
        label="Search"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ minWidth: 200, fontSize: { xs: 16, sm: 18 } }}
        InputProps={{ style: { fontSize: 16 } }}
        InputLabelProps={{ style: { fontSize: 16 } }}
      />

      <TextField
        label="Start Date"
        type="date"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        InputLabelProps={{ shrink: true, style: { fontSize: 16 } }}
        sx={{ minWidth: 150, fontSize: { xs: 16, sm: 18 } }}
        InputProps={{ style: { fontSize: 16 } }}
      />

      <TextField
        label="End Date"
        type="date"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        InputLabelProps={{ shrink: true, style: { fontSize: 16 } }}
        sx={{ minWidth: 150, fontSize: { xs: 16, sm: 18 } }}
        InputProps={{ style: { fontSize: 16 } }}
      />

      {activeTable === "reservations" && (
        <FormControl sx={{ minWidth: 140, fontSize: { xs: 16, sm: 18 } }}>
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            value={statusFilter}
            label="Status"
            onChange={(e) =>
              onStatusFilterChange(e.target.value as ReservationStatus | "all")
            }
            sx={{ fontSize: { xs: 16, sm: 18 } }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="confirmed">Confirmed</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      )}

      <FormControl sx={{ minWidth: 120, fontSize: { xs: 16, sm: 18 } }}>
        <InputLabel id="items-per-page-label">Items per page</InputLabel>
        <Select
          labelId="items-per-page-label"
          value={itemsPerPage}
          label="Items per page"
          onChange={(e) => {
            onItemsPerPageChange(Number(e.target.value));
          }}
          sx={{ fontSize: { xs: 16, sm: 18 } }}
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default FilterControls;
