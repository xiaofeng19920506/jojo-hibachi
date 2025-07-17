import {
  useGetAdminReservationsQuery,
  useGetUserReservationsQuery,
  useGetEmployeeAssignedQuery,
} from "../../../services/api";

export function useReservationsData(activeTable: string, userRole: string) {
  const isReservations = activeTable === "reservations";
  const isAdmin = userRole === "admin";
  const isEmployee = userRole === "employee";

  const adminQuery = useGetAdminReservationsQuery(undefined, {
    skip: !isReservations || !isAdmin,
  });
  const employeeQuery = useGetEmployeeAssignedQuery(undefined, {
    skip: !isReservations || !isEmployee,
  });
  const userQuery = useGetUserReservationsQuery(undefined, {
    skip: !isReservations || isAdmin || isEmployee,
  });

  if (isAdmin) return adminQuery;
  if (isEmployee) return employeeQuery;
  return userQuery;
}
