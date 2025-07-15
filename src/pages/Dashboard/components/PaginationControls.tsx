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
      flexDirection="column"
      alignItems="center"
      gap={2}
    >
      <Box display="flex" alignItems="center" gap={1}>
        <Button
          variant="outlined"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          size="small"
        >
          First
        </Button>
        <Button
          variant="outlined"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          size="small"
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
        />

        <Button
          variant="outlined"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          size="small"
        >
          Next
        </Button>
        <Button
          variant="outlined"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          size="small"
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
 