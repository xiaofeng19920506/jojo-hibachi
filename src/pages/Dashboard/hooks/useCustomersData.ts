import { useGetAdminCustomersQuery } from "../../../services/api";

export function useCustomersData(activeTable: string, userRole: string) {
  const shouldFetch = userRole === "admin" && activeTable === "customers";
  return useGetAdminCustomersQuery(undefined, { skip: !shouldFetch });
}
