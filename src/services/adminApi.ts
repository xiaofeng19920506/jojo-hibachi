// src/services/adminApi.ts
import type { EndpointBuilder, BaseQueryFn } from "@reduxjs/toolkit/query";
import {
  transformCustomerData,
  transformEmployeeData,
  transformApiData,
} from "./apiTransforms";

export const adminApiEndpoints = (
  builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
  getAdminCustomers: builder.query<any[], void>({
    query: () => "/admin/customers",
    transformResponse: (response: {
      status: string;
      data: { customers: any[] };
    }) => {
      if (response.status === "success") {
        return transformCustomerData(response.data.customers || []);
      }
      return [];
    },
    providesTags: ["Customers"],
  }),
  getAdminEmployees: builder.query<any[], void>({
    query: () => "/admin/employees",
    transformResponse: (response: {
      status: string;
      data: { employees: any[] };
    }) => {
      if (response.status === "success") {
        return transformEmployeeData(response.data.employees || []);
      }
      return [];
    },
    providesTags: ["Employees"],
  }),
  getAdminReservations: builder.query<any[], void>({
    query: () => "/admin/reservations",
    transformResponse: (response: { status: string; data: any[] }) => {
      if (response.status === "success") {
        return transformApiData(response.data || []);
      }
      return [];
    },
    providesTags: ["Reservations"],
  }),
  getAdminReservationById: builder.query<any, string>({
    query: (id: string) => `/admin/reservation/${id}`,
    transformResponse: (response: { status: string; data: any }) => {
      if (response.status === "success" && response.data) {
        return transformApiData([response.data])[0];
      }
      return null;
    },
    providesTags: ["Reservations"],
  }),
  getAdminEmployeeAssignedReservations: builder.query<
    any[],
    { employeeId: string; startDate: string; endDate: string }
  >({
    query: ({ employeeId, startDate, endDate }) =>
      `/admin/employee-assigned-reservations?employeeId=${employeeId}&startDate=${startDate}&endDate=${endDate}`,
    transformResponse: (response: { status: string; data: any[] }) => {
      if (response.status === "success") {
        return transformApiData(response.data || []);
      }
      return [];
    },
    providesTags: ["Reservations"],
  }),
  changeUserRole: builder.mutation<any, { userId: string; role: string }>({
    query: ({ userId, role }: { userId: string; role: string }) => ({
      url: `/admin/users/${userId}/role`,
      method: "PUT",
      body: { role },
    }),
    invalidatesTags: ["Customers", "Employees"],
  }),
  updateReservationStatus: builder.mutation<
    any,
    { id: string; status: string }
  >({
    query: ({ id, status }: { id: string; status: string }) => ({
      url: `/reservation/${id}/status`,
      method: "PATCH",
      body: { status },
    }),
    invalidatesTags: ["Reservations"],
  }),
  assignChefToReservation: builder.mutation<
    any,
    { id: string; chefId: string }
  >({
    query: ({ id, chefId }: { id: string; chefId: string }) => ({
      url: `/reservation/${id}/assign-chef`,
      method: "PATCH",
      body: { chefId },
    }),
    invalidatesTags: ["Reservations"],
  }),
  createReservation: builder.mutation<any, any>({
    query: (reservation: any) => ({
      url: "/reservation",
      method: "POST",
      body: reservation,
    }),
    invalidatesTags: ["Reservations"],
  }),
  changeEmployeeStatus: builder.mutation<
    any,
    { userId: string; isActive: boolean }
  >({
    query: ({ userId, isActive }: { userId: string; isActive: boolean }) => ({
      url: `/admin/users/${userId}/status`,
      method: "PATCH",
      body: { isActive },
    }),
    invalidatesTags: ["Employees"],
  }),
});
