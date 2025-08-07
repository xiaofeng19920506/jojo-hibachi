import { useState } from "react";

export function useDashboardTableNavigation() {
  const [activeTable, setActiveTable] = useState<string>("reservations");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Default sort configuration - will be updated based on active table
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({ key: "date", direction: "desc" });

  // Update sort config when table changes to ensure most recent data on top
  const updateSortConfigForTable = (tableType: string) => {
    let defaultSortKey = "date";
    let defaultDirection: "asc" | "desc" = "desc";

    switch (tableType) {
      case "reservations":
      case "pending-reservations":
        defaultSortKey = "status";
        defaultDirection = "asc";
        break;
      case "customers":
        defaultSortKey = "date";
        defaultDirection = "desc";
        break;
      case "employees":
        defaultSortKey = "joinDate";
        defaultDirection = "desc";
        break;
      case "food":
        defaultSortKey = "createdAt";
        defaultDirection = "desc";
        break;
      default:
        defaultSortKey = "date";
        defaultDirection = "desc";
    }

    setSortConfig({ key: defaultSortKey, direction: defaultDirection });
  };

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const setActiveTableWithDefaultSort = (tableType: string) => {
    setActiveTable(tableType);
    updateSortConfigForTable(tableType);
    setCurrentPage(1); // Reset to first page when changing tables
  };

  return {
    activeTable,
    setActiveTable: setActiveTableWithDefaultSort,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    sortConfig,
    setSortConfig,
    handleSort,
  };
}
