import { Box, CircularProgress, Alert, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DataTable from "../../components/DataTable/DataTable";
import type { TableType } from "../../components/DataTable/types";
import FilterControls from "./components/FilterControls";
import PaginationControls from "./components/PaginationControls";
import EditDialog from "./components/EditDialog";
import { useDashboard } from "./hooks/useDashboard";

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const theme = useTheme();
  const {
    // State
    searchQuery,
    setSearchQuery,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    activeTable,
    setActiveTable,
    statusFilter,
    setStatusFilter,
    dialogOpen,
    dialogType,
    editFormData,
    selectedEmployeeId,
    selectedStatus,
    loading,
    error,
    userRole,
    isInitialized,
    // Computed
    filteredSortedData,
    totalPages,
    paginatedData,
    getAvailableTables,
    getGreeting,
    // Handlers
    handleSort,
    handleActionClick,
    handleEditFormChange,
    handleAssignEmployeeChange,
    handleStatusChange,
    handleDialogClose,
    handleDialogSave,
    getAvailableActions,
    getEmployeeDisplayName,
    allEmployeesData,
  } = useDashboard();

  // Wait for auth/user to be initialized
  if (!isInitialized) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Compute availableEmployees for assign dialog
  const availableEmployees =
    dialogOpen &&
    dialogType === "assign" &&
    activeTable === "reservations" &&
    userRole.toLowerCase() === "admin"
      ? allEmployeesData
      : undefined;

  // Add this for debugging
  console.log("EditDialog props:", { dialogType, dialogOpen });

  return (
    <Box
      sx={{
        width: "100vw",
        height: { xs: "calc(100vh - 64px)", sm: "calc(100vh - 56px)" },
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: theme.palette.mode === "dark" ? "#000" : "#fff",
        color: theme.palette.mode === "dark" ? "#fff" : "#000",
      }}
    >
      <Box sx={{ flex: 1, p: { xs: 1, sm: 3 }, overflow: "auto" }}>
        <Typography
          variant="h4"
          mb={3}
          sx={{
            fontSize: { xs: 22, sm: 32 },
            color: theme.palette.mode === "dark" ? "#fff" : "#000",
          }}
        >
          {userRole === "admin" ? getGreeting() : "Reservations"}
        </Typography>

        <FilterControls
          searchQuery={searchQuery}
          onSearchChange={(value) => {
            setSearchQuery(value);
            setCurrentPage(1);
          }}
          startDate={startDate}
          onStartDateChange={setStartDate}
          endDate={endDate}
          onEndDateChange={setEndDate}
          statusFilter={statusFilter as string}
          onStatusFilterChange={(value) => {
            setStatusFilter(value);
            setCurrentPage(1);
          }}
          activeTable={activeTable}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={(value) => {
            setItemsPerPage(value);
            setCurrentPage(1);
          }}
          {...(userRole === "admin"
            ? {
                availableTables: getAvailableTables(),
                onTableChange: (value: string) => {
                  setActiveTable(value as TableType);
                  setCurrentPage(1);
                },
              }
            : {})}
        />

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ flex: 1 }}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        ) : (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                flex: 1,
                overflow: "auto",
                width: "100%",
                maxWidth: "100vw",
              }}
            >
              <Box
                sx={{ width: "100%", overflowX: { xs: "auto", sm: "visible" } }}
              >
                <DataTable
                  tableType={activeTable as TableType}
                  data={paginatedData || []}
                  onSort={handleSort}
                  sortConfig={{
                    key: "date",
                    direction: "desc",
                  }}
                  onActionClick={handleActionClick}
                  availableActions={getAvailableActions}
                  userRole={userRole}
                />
              </Box>
            </Box>
          </Box>
        )}

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          filteredDataLength={filteredSortedData.length}
          itemsPerPage={itemsPerPage}
        />
      </Box>

      <EditDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSave={handleDialogSave}
        dialogType={dialogType as any}
        activeTable={activeTable}
        userRole={userRole}
        loading={loading}
        editFormData={editFormData}
        onEditFormChange={handleEditFormChange}
        selectedEmployeeId={selectedEmployeeId}
        onAssignEmployeeChange={handleAssignEmployeeChange}
        selectedStatus={selectedStatus as string}
        onStatusChange={handleStatusChange}
        getEmployeeDisplayName={getEmployeeDisplayName}
        availableEmployees={availableEmployees}
      />
    </Box>
  );
};

export default Dashboard;
