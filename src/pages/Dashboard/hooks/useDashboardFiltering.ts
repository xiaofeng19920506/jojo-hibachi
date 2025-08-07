import { useMemo } from "react";
import type { ReservationEntry } from "../types";
import type { SortableEntry } from "../../../components/DataTable/types";

interface UseDashboardFilteringProps {
  searchQuery: string;
  startDate: string;
  endDate: string;
  sortConfig: { key: string; direction: "asc" | "desc" };
  activeTable: string;
  statusFilter: string;
  allReservationsData: SortableEntry[];
  pendingReservationsData: SortableEntry[];
  pendingReservationsPagination?: any;
  customersData: SortableEntry[];
  employeesData: SortableEntry[];
  foodData: SortableEntry[];
  itemsPerPage: number;
  currentPage: number;
}

export function useDashboardFiltering({
  searchQuery,
  startDate,
  endDate,
  sortConfig,
  activeTable,
  statusFilter,
  allReservationsData,
  pendingReservationsData,
  pendingReservationsPagination,
  customersData,
  employeesData,
  foodData,
  itemsPerPage,
  currentPage,
}: UseDashboardFilteringProps) {
  const getCurrentData = (): SortableEntry[] => {
    switch (activeTable) {
      case "reservations":
        return allReservationsData || [];
      case "pending-reservations":
        return pendingReservationsData || [];
      case "customers":
        return customersData || [];
      case "employees":
        return employeesData || [];
      case "food":
        return foodData || [];
      default:
        return [];
    }
  };

  const filteredSortedData = useMemo(() => {
    let result = [...getCurrentData()];

    // Search filtering for all table types
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((entry) => {
        const searchableFields = Object.values(entry).map((val) =>
          String(val).toLowerCase()
        );
        return searchableFields.some((field) => field.includes(query));
      });
    }

    // Status filtering for reservations and orders
    if (
      (activeTable === "reservations" ||
        activeTable === "pending-reservations") &&
      statusFilter !== "all"
    ) {
      result = result.filter(
        (entry) =>
          (entry as ReservationEntry | Record<string, unknown>).status ===
          statusFilter
      );
    }

    // Date filtering for all table types that have date fields
    if (startDate || endDate) {
      result = result.filter((entry) => {
        // Handle different date fields based on table type
        let dateField: string | undefined;

        switch (activeTable) {
          case "reservations":
          case "pending-reservations":
            dateField = (entry as unknown as Record<string, unknown>)
              .createdAt as string;
            break;
          case "customers":
            dateField = (entry as unknown as Record<string, unknown>)
              .date as string;
            break;
          case "employees":
            dateField = (entry as unknown as Record<string, unknown>)
              .joinDate as string;
            break;
          case "food":
            dateField = (entry as unknown as Record<string, unknown>)
              .createdAt as string;
            break;
          default:
            dateField = (entry as unknown as Record<string, unknown>)
              .date as string;
        }

        if (!dateField) return true; // Skip filtering if no date field

        const entryDate = new Date(dateField);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        return (!start || entryDate >= start) && (!end || entryDate <= end);
      });
    }

    // Sorting with proper date field handling and status priority
    result.sort((a, b) => {
      // For reservations, always prioritize status first, then sort by date
      if (
        activeTable === "reservations" ||
        activeTable === "pending-reservations"
      ) {
        const aStatus = (a as unknown as Record<string, unknown>)
          .status as string;
        const bStatus = (b as unknown as Record<string, unknown>)
          .status as string;

        // Define status priority: pending first, then other statuses
        const statusPriority: Record<string, number> = {
          pending: 1,
          confirmed: 2,
          "in-progress": 3,
          completed: 4,
          cancelled: 5,
        };

        const aPriority = statusPriority[aStatus] || 999;
        const bPriority = statusPriority[bStatus] || 999;

        // If statuses are different, sort by priority
        if (aPriority !== bPriority) {
          return aPriority - bPriority;
        }

        // If statuses are the same, sort by creation date (most recent first)
        const aCreatedAt = (a as unknown as Record<string, unknown>)
          .createdAt as string;
        const bCreatedAt = (b as unknown as Record<string, unknown>)
          .createdAt as string;

        if (aCreatedAt && bCreatedAt) {
          const dateA = new Date(aCreatedAt).getTime();
          const dateB = new Date(bCreatedAt).getTime();
          return dateB - dateA; // Most recent first
        }
      }

      // For other tables, use the original sorting logic
      const aVal = (a as unknown as Record<string, unknown>)[sortConfig.key];
      const bVal = (b as unknown as Record<string, unknown>)[sortConfig.key];

      // Handle date sorting for different date fields
      if (
        sortConfig.key === "date" ||
        sortConfig.key === "joinDate" ||
        sortConfig.key === "createdAt"
      ) {
        const dateA = new Date(aVal as string).getTime();
        const dateB = new Date(bVal as string).getTime();
        return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
      }

      // Handle numeric sorting
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      // Handle string sorting
      return sortConfig.direction === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

    return result;
  }, [
    searchQuery,
    startDate,
    endDate,
    sortConfig,
    activeTable,
    statusFilter,
    allReservationsData,
    customersData,
    employeesData,
    foodData,
  ]);

  // Handle server-side pagination for pending reservations
  let totalPages: number;
  let paginatedData: SortableEntry[];

  if (activeTable === "pending-reservations" && pendingReservationsPagination) {
    // Use server-side pagination data
    totalPages = pendingReservationsPagination.totalPages || 1;
    paginatedData = filteredSortedData; // Data is already paginated from server
  } else {
    // Use client-side pagination for other tables
    totalPages = Math.ceil(filteredSortedData.length / itemsPerPage);
    paginatedData = filteredSortedData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }

  return { filteredSortedData, totalPages, paginatedData };
}
