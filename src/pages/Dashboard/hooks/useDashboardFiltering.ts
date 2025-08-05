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
    if (activeTable === "reservations" && statusFilter !== "all") {
      result = result.filter(
        (entry) =>
          (entry as ReservationEntry | Record<string, unknown>).status ===
          statusFilter
      );
    }

    // Date filtering for all table types that have date fields
    if (startDate || endDate) {
      result = result.filter((entry) => {
        const dateField =
          (entry as unknown as Record<string, unknown>).date ||
          (entry as unknown as Record<string, unknown>).joinDate;
        if (!dateField) return true; // Skip filtering if no date field

        const entryDate = new Date(dateField as string);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        return (!start || entryDate >= start) && (!end || entryDate <= end);
      });
    }

    // Sorting
    result.sort((a, b) => {
      const aVal = (a as unknown as Record<string, unknown>)[sortConfig.key];
      const bVal = (b as unknown as Record<string, unknown>)[sortConfig.key];

      if (sortConfig.key === "date" || sortConfig.key === "joinDate") {
        const dateA = new Date(aVal as string).getTime();
        const dateB = new Date(bVal as string).getTime();
        return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      }

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

  const totalPages = Math.ceil(filteredSortedData.length / itemsPerPage);
  const paginatedData = filteredSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return { filteredSortedData, totalPages, paginatedData };
}
