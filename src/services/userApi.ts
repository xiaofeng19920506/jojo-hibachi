// src/services/userApi.ts
import type { EndpointBuilder, BaseQueryFn } from "@reduxjs/toolkit/query";
import { transformApiData } from "./apiTransforms";

export const userApiEndpoints = (
  builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
  getUserProfile: builder.query<any, void>({
    query: () => "/user/profile",
    providesTags: ["Auth"],
  }),
  updateUserProfile: builder.mutation<any, Partial<any>>({
    query: (data: Partial<any>) => ({
      url: "/user/profile",
      method: "PUT",
      body: data,
    }),
    invalidatesTags: ["Auth"],
  }),
  getUserReservations: builder.query<any[], void>({
    query: () => "/user/reservations",
    transformResponse: (response: { status: string; data: any[] }) => {
      if (response.status === "success") {
        return transformApiData(response.data || []);
      }
      return [];
    },
    providesTags: ["Reservations"],
  }),
  getUserReservationById: builder.query<any, string>({
    query: (id: string) => `/reservation/${id}`,
    transformResponse: (response: { status: string; data: any }) => {
      if (response.status === "success" && response.data) {
        return transformApiData([response.data])[0];
      }
      return null;
    },
    providesTags: ["Reservations"],
  }),
  cancelReservation: builder.mutation<any, { id: string }>({
    query: ({ id }: { id: string }) => ({
      url: `/reservation/${id}/cancel`,
      method: "PATCH",
    }),
    invalidatesTags: ["Reservations"],
  }),
  updateReservation: builder.mutation<any, { id: string; data: Partial<any> }>({
    query: ({ id, data }: { id: string; data: Partial<any> }) => ({
      url: `/reservation/${id}`,
      method: "PATCH",
      body: data,
    }),
    invalidatesTags: ["Reservations"],
  }),
});
