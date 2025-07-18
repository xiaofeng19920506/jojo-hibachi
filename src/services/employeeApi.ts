// src/services/employeeApi.ts
import type { EndpointBuilder, BaseQueryFn } from "@reduxjs/toolkit/query";
import { transformApiData } from "./apiTransforms";

export const employeeApiEndpoints = (
  builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
  getEmployeeProfile: builder.query<any, void>({
    query: () => "/employee/profile",
    providesTags: ["Auth"],
  }),
  getEmployeeAssigned: builder.query<any[], void>({
    query: () => "/employee/assigned",
    transformResponse: (response: { status: string; data: any[] }) => {
      if (response.status === "success") {
        return transformApiData(response.data || []);
      }
      return [];
    },
    providesTags: ["Reservations"],
  }),
  getEmployeeAssignedById: builder.query<any, string>({
    query: (id: string) => `/employee/assigned/${id}`,
    transformResponse: (response: { status: string; data: any }) => {
      if (response.status === "success" && response.data) {
        return transformApiData([response.data])[0];
      }
      return null;
    },
    providesTags: ["Reservations"],
  }),
  getEmployeeAssignedByDate: builder.query<
    any[],
    { startDate: string; endDate: string; employeeId?: string }
  >({
    query: ({ startDate, endDate, employeeId }) => {
      let url = `/employee/assigned-by-date?startDate=${startDate}&endDate=${endDate}`;
      if (employeeId) url += `&employeeId=${employeeId}`;
      return url;
    },
    transformResponse: (response: { status: string; data: any[] }) => {
      if (response.status === "success") {
        return transformApiData(response.data || []);
      }
      return [];
    },
    providesTags: ["Reservations"],
  }),
});
