import { useGetAdminReservationsQuery } from "../../../services/api";

export function useReservationsData(activeTable: string, userRole: string) {
  const shouldFetch =
    (userRole === "admin" && activeTable === "reservations") ||
    (userRole === "employee" && activeTable === "reservations") ||
    (userRole === "user" && activeTable === "reservations");
  return useGetAdminReservationsQuery(undefined, { skip: !shouldFetch });
}
