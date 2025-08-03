import { useGetAdminEmployeesQuery } from "../../../services/api";

export function useEmployeesData(activeTable: string, userRole: string) {
  const shouldFetch = userRole === "admin" && activeTable === "employees";
  return useGetAdminEmployeesQuery(undefined, { skip: !shouldFetch, refetchOnMountOrArgChange: true });
}
