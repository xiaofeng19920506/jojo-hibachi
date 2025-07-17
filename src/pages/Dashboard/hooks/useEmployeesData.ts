import { useGetAdminEmployeesQuery } from "../../../services/api";

export function useEmployeesData(activeTable: string, userRole: string) {
  const shouldFetch = userRole === "admin" && activeTable === "employees";
  console.log("useEmployeesData", { activeTable, userRole, shouldFetch });
  return useGetAdminEmployeesQuery(undefined, { skip: !shouldFetch, refetchOnMountOrArgChange: true });
}
