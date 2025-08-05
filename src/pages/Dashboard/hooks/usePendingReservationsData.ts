import { useGetEmployeePendingReservationsQuery } from "../../../services/api";

export const usePendingReservationsData = (
  activeTable: string,
  userRole: string
) => {
  const {
    data: pendingReservationsData,
    isLoading: pendingReservationsLoading,
    error: pendingReservationsError,
  } = useGetEmployeePendingReservationsQuery(undefined, {
    skip: activeTable !== "pending-reservations" || userRole !== "employee",
  });

  return {
    data: pendingReservationsData || [],
    isLoading: pendingReservationsLoading,
    error: pendingReservationsError,
  };
};
