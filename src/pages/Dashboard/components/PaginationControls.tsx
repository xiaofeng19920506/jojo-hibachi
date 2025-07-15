import { Box, Button, Pagination, Typography } from "@mui/material";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  filteredDataLength: number;
  itemsPerPage: number;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  filteredDataLength,
  itemsPerPage,
}) => {
  return (
    <Box
      mt={2}
      display="flex"
      alignItems="center"
      sx={{ flexDirection: { xs: "column", sm: "row" }, gap: { xs: 1, sm: 2 } }}
    >
      <Box display="flex" alignItems="center" gap={1} sx={{ flexWrap: "wrap" }}>
        <Button
          variant="outlined"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          size="small"
          sx={{ fontSize: { xs: 16, sm: 18 }, minWidth: 44, minHeight: 44 }}
        >
          First
        </Button>
        <Button
          variant="outlined"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          size="small"
          sx={{ fontSize: { xs: 16, sm: 18 }, minWidth: 44, minHeight: 44 }}
        >
          Previous
        </Button>

        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_, value) => onPageChange(value)}
          color="primary"
          shape="rounded"
          siblingCount={1}
          boundaryCount={1}
          size="small"
          sx={{ fontSize: { xs: 16, sm: 18 }, minHeight: 44 }}
        />

        <Button
          variant="outlined"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          size="small"
          sx={{ fontSize: { xs: 16, sm: 18 }, minWidth: 44, minHeight: 44 }}
        >
          Next
        </Button>
        <Button
          variant="outlined"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          size="small"
          sx={{ fontSize: { xs: 16, sm: 18 }, minWidth: 44, minHeight: 44 }}
        >
          Last
        </Button>
      </Box>

      <Typography variant="body2" color="text.secondary">
        {filteredDataLength > 0
          ? `Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(
              currentPage * itemsPerPage,
              filteredDataLength
            )} of ${filteredDataLength} entries`
          : "No entries to display"}
      </Typography>
    </Box>
  );
};

export default PaginationControls;
