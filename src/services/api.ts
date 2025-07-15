import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  ReservationEntry,
  Employee,
  ApiReservationData,
  ApiEmployeeData,
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
      email: item.email,
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
    // --- AUTH ENDPOINTS ---
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
    register: builder.mutation<
      { token: string; user: any },
      { username: string; password: string; email: string }
    >({
      query: (credentials) => ({
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

    // --- USER ENDPOINTS ---
    getUserProfile: builder.query<any, void>({
      query: () => "/user/profile",
      providesTags: ["Auth"],
    }),
    updateUserProfile: builder.mutation<any, Partial<any>>({
      query: (data) => ({
        url: "/user/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
    getUserReservations: builder.query<ReservationEntry[], void>({
      query: () => "/user/reservations",
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
    getUserReservationById: builder.query<ReservationEntry | null, string>({
      query: (id) => `/user/reservation/${id}`,
      transformResponse: (response: {
        status: string;
        data: ApiReservationData;
      }) => {
        if (response.status === "success" && response.data) {
          return transformApiData([response.data])[0];
        }
        return null;
      },
      providesTags: ["Reservations"],
    }),

    // --- EMPLOYEE ENDPOINTS ---
    getEmployeeProfile: builder.query<any, void>({
      query: () => "/employee/profile",
      providesTags: ["Auth"],
    }),
    getEmployeeAssigned: builder.query<ReservationEntry[], void>({
      query: () => "/employee/assigned",
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
    getEmployeeAssignedById: builder.query<ReservationEntry | null, string>({
      query: (id) => `/employee/assigned/${id}`,
      transformResponse: (response: {
        status: string;
        data: ApiReservationData;
      }) => {
        if (response.status === "success" && response.data) {
          return transformApiData([response.data])[0];
        }
        return null;
      },
      providesTags: ["Reservations"],
    }),
    getEmployeeAssignedByDate: builder.query<
      ReservationEntry[],
      { startDate: string; endDate: string }
    >({
      query: ({ startDate, endDate }) =>
        `/employee/assigned-by-date?startDate=${startDate}&endDate=${endDate}`,
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

    // --- ADMIN ENDPOINTS ---
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
    getAdminEmployees: builder.query<Employee[], void>({
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
    getAdminReservations: builder.query<ReservationEntry[], void>({
      query: () => "/admin/reservations",
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
    getAdminReservationById: builder.query<ReservationEntry | null, string>({
      query: (id) => `/admin/reservation/${id}`,
      transformResponse: (response: {
        status: string;
        data: ApiReservationData;
      }) => {
        if (response.status === "success" && response.data) {
          return transformApiData([response.data])[0];
        }
        return null;
      },
      providesTags: ["Reservations"],
    }),
    updateReservationStatus: builder.mutation<
      any,
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
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
      query: ({ id, chefId }) => ({
        url: `/reservation/${id}/assign-chef`,
        method: "PATCH",
        body: { chefId },
      }),
      invalidatesTags: ["Reservations"],
    }),

    // --- RESERVATION ENDPOINTS ---
    createReservation: builder.mutation<any, any>({
      query: (reservation) => ({
        url: "/reservation",
        method: "POST",
        body: reservation,
      }),
      invalidatesTags: ["Reservations"],
    }),
    getReservationById: builder.query<ReservationEntry | null, string>({
      query: (id) => `/reservation/${id}`,
      transformResponse: (response: {
        status: string;
        data: ApiReservationData;
      }) => {
        if (response.status === "success" && response.data) {
          return transformApiData([response.data])[0];
        }
        return null;
      },
      providesTags: ["Reservations"],
    }),
  }),
});

// Export hooks
export const {
  useLoginMutation,
  useRegisterMutation,
  useGetAuthProfileQuery,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetUserReservationsQuery,
  useGetUserReservationByIdQuery,
  useGetEmployeeProfileQuery,
  useGetEmployeeAssignedQuery,
  useGetEmployeeAssignedByIdQuery,
  useGetEmployeeAssignedByDateQuery,
  useGetAdminCustomersQuery,
  useGetAdminEmployeesQuery,
  useGetAdminReservationsQuery,
  useGetAdminReservationByIdQuery,
  useUpdateReservationStatusMutation,
  useAssignChefToReservationMutation,
  useCreateReservationMutation,
  useGetReservationByIdQuery,
} = api;
