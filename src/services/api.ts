import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { adminApiEndpoints } from "./adminApi";
import { employeeApiEndpoints } from "./employeeApi";
import { userApiEndpoints } from "./userApi";
import { publicApiEndpoints } from "./publicApi";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BACKEND_URL,
  prepareHeaders: (headers, {}) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Reservations", "Customers", "Orders", "Employees", "Auth"],
  endpoints: (builder) => ({
    ...publicApiEndpoints(builder),
    ...userApiEndpoints(builder),
    ...employeeApiEndpoints(builder),
    ...adminApiEndpoints(builder),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetAuthProfileQuery,
  useVerifyTokenQuery,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetUserReservationsQuery,
  useGetUserReservationByIdQuery,
  useCancelReservationMutation,
  useUpdateReservationMutation,
  useGetEmployeeProfileQuery,
  useGetEmployeeAssignedQuery,
  useGetEmployeeAssignedByIdQuery,
  useGetEmployeeAssignedByDateQuery,
  useGetAdminCustomersQuery,
  useGetAdminEmployeesQuery,
  useGetAdminReservationsQuery,
  useGetAdminReservationByIdQuery,
  useChangeUserRoleMutation,
  useUpdateReservationStatusMutation,
  useAssignChefToReservationMutation,
  useCreateReservationMutation,
  useChangeEmployeeStatusMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetAdminEmployeeAssignedReservationsQuery,
} = api;
