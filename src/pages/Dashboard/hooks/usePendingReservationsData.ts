import { useGetEmployeePendingReservationsQuery } from "../../../services/api";

export const usePendingReservationsData = (
  activeTable: string,
  userRole: string,
  currentPage: number = 1,
  itemsPerPage: number = 10
) => {
  const {
    data: pendingReservationsResponse,
    isLoading: pendingReservationsLoading,
    error: pendingReservationsError,
  } = useGetEmployeePendingReservationsQuery(
    { page: currentPage, limit: itemsPerPage },
    {
      skip: activeTable !== "pending-reservations" || userRole !== "employee",
    }
  );

  return {
    data: pendingReservationsResponse?.reservations || [],
    pagination: pendingReservationsResponse?.pagination || {},
    isLoading: pendingReservationsLoading,
    error: pendingReservationsError,
  };
};
