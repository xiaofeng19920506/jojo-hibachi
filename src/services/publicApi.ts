import type { EndpointBuilder, BaseQueryFn } from "@reduxjs/toolkit/query";

export const publicApiEndpoints = (
  builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
  login: builder.mutation<
    { token: string; user: any },
    { email: string; password: string }
  >({
    query: (credentials: { email: string; password: string }) => ({
      url: "/auth/login",
      method: "POST",
      body: credentials,
    }),
    transformResponse: (response: {
      data?: { token: string; user: any };
      token?: string;
      user?: any;
    }) => {
      const token = response.data?.token || response.token;
      const user = response.data?.user || response.user;
      if (!token) {
        throw new Error("No token received from server");
      }
      if (!user) {
        throw new Error("No user data received from server");
      }
      return { token, user };
    },
    invalidatesTags: ["Auth"],
  }),
  register: builder.mutation<
    { token: string; user: any },
    {
      email: string;
      password: string;
      role: string;
      firstName: string;
      lastName: string;
      phone: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
    }
  >({
    query: (credentials: {
      email: string;
      password: string;
      role: string;
      firstName: string;
      lastName: string;
      phone: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
    }) => ({
      url: "/auth/register",
      method: "POST",
      body: credentials,
    }),
    transformResponse: (response: {
      data?: { token: string; user: any };
      token?: string;
      user?: any;
    }) => {
      const token = response.data?.token || response.token;
      const user = response.data?.user || response.user;
      if (!token) {
        throw new Error("No token received from server");
      }
      if (!user) {
        throw new Error("No user data received from server");
      }
      return { token, user };
    },
    invalidatesTags: ["Auth"],
  }),
  getAuthProfile: builder.query<any, void>({
    query: () => "/auth/profile",
    providesTags: ["Auth"],
  }),
  verifyToken: builder.query<any, void>({
    query: () => ({
      url: "/auth/verifyToken",
      method: "POST",
    }),
    providesTags: ["Auth"],
  }),
  forgotPassword: builder.mutation<any, { email: string }>({
    query: (credentials: { email: string }) => ({
      url: "/auth/forgot-password",
      method: "POST",
      body: { email: credentials.email },
    }),
  }),
  resetPassword: builder.mutation<
    any,
    { token: string; password: string; email?: string }
  >({
    query: (credentials: {
      token: string;
      password: string;
      email?: string;
    }) => ({
      url: "/auth/reset-password",
      method: "POST",
      body: {
        token: credentials.token,
        newPassword: credentials.password,
        email: credentials.email,
      },
    }),
  }),
  getMenuItems: builder.query<any[], void>({
    query: () => "/menu/items",
    providesTags: ["Menu"],
  }),
  updateReservationMenu: builder.mutation<
    any,
    {
      reservationId: string;
      menuItems: any[];
      additionalNotes?: string;
      deliveryInstructions?: string;
      totalAmount: number;
    }
  >({
    query: (data) => ({
      url: `/reservation/${data.reservationId}/menu`,
      method: "PATCH",
      body: data,
    }),
    invalidatesTags: ["Reservations", "Menu"],
  }),
});
