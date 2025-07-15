import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  ReservationEntry,
  Employee,
  ApiReservationData,
  ApiEmployeeData,
  ReservationStatus,
} from "../pages/Dashboard/types";

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

// Transform functions (moved from apiService.ts)
export const transformApiData = (
  apiData: ApiReservationData[]
): ReservationEntry[] => {
  return apiData.map((item) => {
    // Handle assignedChef which can be an object or string
    let employeeId: string | undefined;
    let employeeName: string | undefined;

    if (item.assignedChef) {
      if (typeof item.assignedChef === "object" && item.assignedChef !== null) {
        // New API response structure with employee object
        const chefData = item.assignedChef as ApiEmployeeData;
        employeeId = chefData._id;
        employeeName =
          chefData.fullName || `${chefData.firstName} ${chefData.lastName}`;
      } else {
        // Legacy API response with just ID
        employeeId = item.assignedChef as string;
        employeeName = item.assignedChef as string;
      }
    }

    return {
      id: item._id,
      customerId: item._id,
      customerName: `${item.firstName} ${item.lastName}`,
      employeeId,
      employeeName,
      service: item.eventType || "Dining",
      // Use reservationDate object for date
      date: item.reservationDate
        ? `${item.reservationDate.year}-${item.reservationDate.month.padStart(
            2,
            "0"
          )}-${item.reservationDate.day.padStart(2, "0")}`
        : "",
      time: item.time,
      status: item.status,
      price: item.price || 0,
      notes: item.notes,
      phoneNumber: item.phoneNumber,
      address: item.address,
      city: item.city,
      state: item.state,
      zipCode: item.zipCode,
      adult: item.adult,
      kids: item.kids,
      allergies: item.allergies,
      eventType: item.eventType,
      assignedChef: employeeId ?? "unAssigned",
      timeStamp: item.timeStamp,
    };
  });
};

export const transformCustomerData = (apiData: any[]) => {
  return apiData.map((item) => ({
    id: item._id || item.id,
    name: `${item.firstName || item.name} ${item.lastName || ""}`,
    date: item.createdAt || item.date || new Date().toISOString().split("T")[0],
    address: item.address || "N/A",
    price: item.totalSpent || item.price || 0,
    email: item.email || "",
    phone: item.phone || item.phoneNumber || "",
  }));
};

export const transformOrderData = (apiData: any[]) => {
  return apiData.map((item) => ({
    id: item._id || item.id,
    customerName:
      item.customerName || `${item.firstName || ""} ${item.lastName || ""}`,
    service: item.service || item.eventType || "Dining",
    date: item.date || item.createdAt || new Date().toISOString().split("T")[0],
    status: item.status || "pending",
    assignedEmployee:
      item.assignedEmployee || item.assignedChef || "Unassigned",
    price: item.price || 0,
  }));
};

export const transformEmployeeData = (apiData: any[]) => {
  return apiData.map((item) => ({
    id: item._id || item.id,
    name: `${item.firstName || item.name} ${item.lastName || ""}`,
    email: item.email || "",
    role: item.role || "employee",
    joinDate:
      item.joinDate || item.createdAt || new Date().toISOString().split("T")[0],
    status: item.status || "active",
    ordersAssigned: item.ordersAssigned || 0,
  }));
};

// Create the API slice
export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Reservations", "Customers", "Orders", "Employees", "Auth"],
  endpoints: (builder) => ({
    // Authentication
    login: builder.mutation<
      { token: string; user: any },
      { username: string; password: string }
    >({
      query: (credentials) => ({
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

    verifyToken: builder.query<any, void>({
      query: () => ({
        url: "/auth/verifyToken",
        method: "POST",
      }),
      providesTags: ["Auth"],
    }),

    // Reservations
    getReservations: builder.query<ReservationEntry[], void>({
      query: () => "/reservation",
      transformResponse: (response: {
        status: string;
        data: ApiReservationData[];
      }) => {
        if (response.status === "success") {
          return transformApiData(response.data || []);
        }
        return [];
      },
      providesTags: ["Reservations"],
    }),

    getUserReservations: builder.query<ReservationEntry[], void>({
      query: () => "/reservation",
      transformResponse: (response: {
        status: string;
        data: ApiReservationData[];
      }) => {
        if (response.status === "success") {
          return transformApiData(response.data || []);
        }
        return [];
      },
      providesTags: ["Reservations"],
    }),

    updateReservation: builder.mutation<
      any,
      { id: string; data: Partial<ReservationEntry> }
    >({
      query: ({ id, data }) => ({
        url: `/reservation/${id}`,
        method: "PATCH",
        body: (() => {
          const transformedData: any = {};
          if (data.service) transformedData.eventType = data.service;
          if (data.date) {
            const dateObj = new Date(data.date);
            transformedData.reservationDay = dateObj.getDate().toString();
            transformedData.reservationMonth = (
              dateObj.getMonth() + 1
            ).toString();
            transformedData.reservationYear = dateObj.getFullYear().toString();
          }
          if (data.time) transformedData.time = data.time;
          if (data.status) transformedData.status = data.status;
          if (data.notes) transformedData.notes = data.notes;
          if (data.price !== undefined) transformedData.price = data.price;
          if (data.employeeId) transformedData.assignedChef = data.employeeId;
          return transformedData;
        })(),
      }),
      invalidatesTags: ["Reservations"],
    }),

    // Admin-only reservation updates
    updateReservationAdmin: builder.mutation<
      any,
      { id: string; data: Partial<ReservationEntry> }
    >({
      query: ({ id, data }) => {
        const transformedData: any = {};
        if (data.service) transformedData.eventType = data.service;
        if (data.date) {
          const dateObj = new Date(data.date);
          transformedData.reservationDay = dateObj.getDate().toString();
          transformedData.reservationMonth = (
            dateObj.getMonth() + 1
          ).toString();
          transformedData.reservationYear = dateObj.getFullYear().toString();
        }
        if (data.time) transformedData.time = data.time;
        if (data.status) transformedData.status = data.status;
        if (data.notes) transformedData.notes = data.notes;
        if (data.price !== undefined) transformedData.price = data.price;
        if (data.employeeId) transformedData.assignedChef = data.employeeId;

        console.log(
          "updateReservationAdmin - URL:",
          `/admin/reservation/${id}/status`
        );
        console.log("updateReservationAdmin - Data:", data);
        console.log("updateReservationAdmin - Transformed:", transformedData);

        return {
          url: `/admin/reservation/${id}/status`,
          method: "PATCH",
          body: transformedData,
        };
      },
      invalidatesTags: ["Reservations"],
    }),

    // User/Employee reservation updates (restricted)
    updateReservationUser: builder.mutation<
      any,
      { id: string; data: Partial<ReservationEntry> }
    >({
      query: ({ id, data }) => ({
        url: `/reservation/${id}/user`,
        method: "PATCH",
        body: (() => {
          const transformedData: any = {};
          // Only allow basic fields for regular users
          if (data.date) {
            const dateObj = new Date(data.date);
            transformedData.reservationDay = dateObj.getDate().toString();
            transformedData.reservationMonth = (
              dateObj.getMonth() + 1
            ).toString();
            transformedData.reservationYear = dateObj.getFullYear().toString();
          }
          if (data.time) transformedData.time = data.time;
          if (data.notes) transformedData.notes = data.notes;
          // Explicitly NOT allowing: status, price, employeeId
          return transformedData;
        })(),
      }),
      invalidatesTags: ["Reservations"],
    }),

    // Admin-only employee assignment
    assignEmployeeToReservation: builder.mutation<
      any,
      { id: string; employeeId: string }
    >({
      query: ({ id, employeeId }) => ({
        url: `/admin/reservations/${id}/assign-employee`,
        method: "PATCH",
        body: { assignedChef: employeeId },
      }),
      invalidatesTags: ["Reservations"],
    }),

    deleteReservation: builder.mutation<any, string>({
      query: (id) => ({
        url: `/reservations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reservations"],
    }),

    createReservation: builder.mutation<any, any>({
      query: (reservation) => ({
        url: "/reservation",
        method: "POST",
        body: reservation,
      }),
      invalidatesTags: ["Reservations"],
    }),

    // Customers
    getCustomers: builder.query<any[], void>({
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

    // Orders
    getOrders: builder.query<any[], void>({
      query: () => "/orders",
      transformResponse: (response: { status: string; data: any[] }) => {
        if (response.status === "success") {
          return transformOrderData(response.data || []);
        }
        return [];
      },
      providesTags: ["Orders"],
    }),

    // Employees
    getEmployees: builder.query<Employee[], void>({
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

    // All Employees (for assignment dropdowns)
    getAllEmployees: builder.query<Employee[], void>({
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

    // Employee mutations
    updateEmployee: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/admin/employees/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Employees"],
    }),

    // Customer mutations
    updateCustomer: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/admin/customers/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Customers"],
    }),
  }),
});

// Export hooks
export const {
  useLoginMutation,
  useVerifyTokenQuery,
  useGetReservationsQuery,
  useGetUserReservationsQuery,
  useUpdateReservationMutation,
  useUpdateReservationAdminMutation,
  useUpdateReservationUserMutation,

  useAssignEmployeeToReservationMutation,
  useDeleteReservationMutation,
  useGetCustomersQuery,
  useGetOrdersQuery,
  useGetEmployeesQuery,
  useGetAllEmployeesQuery,
  useCreateReservationMutation,
  useUpdateEmployeeMutation,
  useUpdateCustomerMutation,
} = api;
