import { Box, CircularProgress, Alert, Typography } from "@mui/material";
import DataTable from "../../components/DataTable/DataTable";
import type { TableType } from "../../components/DataTable/types";
import GlobalAppBar from "../../components/GloabalAppBar/GlobalAppBar";
import FilterControls from "./components/FilterControls";
import PaginationControls from "./components/PaginationControls";
import EditDialog from "./components/EditDialog";
import { useDashboard } from "./hooks/useDashboard";

// Main Dashboard Component
const Dashboard: React.FC = () => {
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
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <GlobalAppBar />
      <Box sx={{ flex: 1, p: 3, overflow: "auto" }}>
        <Typography variant="h4" mb={3}>
          {getGreeting}
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
          statusFilter={statusFilter}
          onStatusFilterChange={(value) => {
            setStatusFilter(value);
            setCurrentPage(1);
          }}
          activeTable={activeTable}
          onTableChange={(value) => {
            setActiveTable(value as TableType);
            setCurrentPage(1);
          }}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={(value) => {
            setItemsPerPage(value);
            setCurrentPage(1);
          }}
          availableTables={getAvailableTables()} // Call as function
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
            <Box sx={{ flex: 1, overflow: "auto" }}>
              <DataTable
                tableType={activeTable as TableType}
                data={paginatedData}
                onSort={handleSort}
                sortConfig={{
                  key: "date",
                  direction: "desc",
                }}
                onActionClick={handleActionClick}
                availableActions={getAvailableActions}
              />
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
        dialogType={dialogType}
        activeTable={activeTable}
        userRole={userRole}
        loading={loading}
        editFormData={editFormData}
        onEditFormChange={handleEditFormChange}
        selectedEmployeeId={selectedEmployeeId}
        onAssignEmployeeChange={handleAssignEmployeeChange}
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
        getEmployeeDisplayName={getEmployeeDisplayName}
        availableEmployees={availableEmployees}
      />
    </Box>
  );
};

export default Dashboard;
