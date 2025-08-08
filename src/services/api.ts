import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { adminApiEndpoints } from "./adminApi";
import { employeeApiEndpoints } from "./employeeApi";
import { userApiEndpoints } from "./userApi";
import { publicApiEndpoints } from "./publicApi";
import { notificationApiEndpoints } from "./notificationApi";

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
  tagTypes: [
    "Reservations",
    "Customers",
    "Orders",
    "Employees",
    "Auth",
    "MenuItems",
    "Notifications",
  ],
  endpoints: (builder) => ({
    ...publicApiEndpoints(builder),
    ...userApiEndpoints(builder),
    ...employeeApiEndpoints(builder),
    ...adminApiEndpoints(builder),
    ...notificationApiEndpoints(builder),
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
  useGetEmployeePendingReservationsQuery,
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
  // Food/Menu Management
  useGetMenuItemsQuery,
  useGetMenuItemByIdQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
  // Food Order Management
  useAddFoodOrderMutation,
  useAddFoodOrderAdminMutation,
  // Notifications
  useGetUserNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useMarkUserNotificationsReadBatchMutation,
} = api;
