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
  onTableChange: (value: string) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  availableTables: { value: string; label: string }[];
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
    <Box mb={2} display="flex" gap={2} flexWrap="wrap" alignItems="center">
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

      <TextField
        label="Search"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ minWidth: 200 }}
      />

      <TextField
        label="Start Date"
        type="date"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ minWidth: 150 }}
      />

      <TextField
        label="End Date"
        type="date"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ minWidth: 150 }}
      />

      {activeTable === "reservations" && (
        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            value={statusFilter}
            label="Status"
            onChange={(e) =>
              onStatusFilterChange(e.target.value as ReservationStatus | "all")
            }
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="confirmed">Confirmed</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      )}

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="items-per-page-label">Items per page</InputLabel>
        <Select
          labelId="items-per-page-label"
          value={itemsPerPage}
          label="Items per page"
          onChange={(e) => {
            onItemsPerPageChange(Number(e.target.value));
          }}
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
