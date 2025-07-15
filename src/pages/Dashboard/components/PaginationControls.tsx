import { Box, IconButton, Typography, Tooltip } from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

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
      justifyContent="center"
      sx={{ gap: 1 }}
    >
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        sx={{
          flexWrap: "wrap",
          flexDirection: "row",
          width: { xs: "100%", sm: "auto" },
          justifyContent: "center",
        }}
      >
        <Tooltip title="First Page">
          <span>
            <IconButton
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              size="small"
              sx={{ minWidth: 32, minHeight: 32 }}
            >
              <FirstPageIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Previous Page">
          <span>
            <IconButton
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              size="small"
              sx={{ minWidth: 32, minHeight: 32 }}
            >
              <NavigateBeforeIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Typography
          variant="body2"
          sx={{ minWidth: 40, textAlign: "center", fontWeight: 500 }}
        >
          {currentPage} / {totalPages}
        </Typography>

        <Tooltip title="Next Page">
          <span>
            <IconButton
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              size="small"
              sx={{ minWidth: 32, minHeight: 32 }}
            >
              <NavigateNextIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Last Page">
          <span>
            <IconButton
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              size="small"
              sx={{ minWidth: 32, minHeight: 32 }}
            >
              <LastPageIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          textAlign: "center",
          width: "100%",
          mt: 0,
        }}
      >
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
