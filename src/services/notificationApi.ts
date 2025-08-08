// src/services/notificationApi.ts
import type { EndpointBuilder, BaseQueryFn } from "@reduxjs/toolkit/query";

export interface BackendNotification {
  _id: string; // Backend uses _id, not id
  recipient: string;
  type: string;
  title: string;
  message: string;
  reservationId?: string;
  customerInfo?: Record<string, unknown>;
  reservationDetails?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetUserNotificationsParams {
  userId: string;
  page?: number;
  limit?: number;
  isRead?: boolean;
}

export interface GetUserNotificationsResponse {
  notifications: BackendNotification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const notificationApiEndpoints = (
  builder: EndpointBuilder<BaseQueryFn, string, string>
) => ({
  getUserNotifications: builder.query<
    GetUserNotificationsResponse,
    GetUserNotificationsParams
  >({
    query: ({ userId, page = 1, limit = 20, isRead }) => {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (typeof isRead === "boolean") params.set("isRead", String(isRead));
      return `/notification/user/${userId}?${params.toString()}`;
    },
    transformResponse: (response: {
      status: string;
      data?: { notifications?: BackendNotification[]; pagination?: any };
    }) => {
      if (response.status === "success" && response.data) {
        const notifications = response.data.notifications || [];
        const pagination = response.data.pagination || {
          page: 1,
          limit: notifications.length,
          total: notifications.length,
          pages: 1,
        };
        return { notifications, pagination } as GetUserNotificationsResponse;
      }
      return {
        notifications: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 },
      };
    },
    providesTags: ["Notifications"],
  }),
  markNotificationRead: builder.mutation<
    { status: string; data?: any },
    { id: string }
  >({
    query: ({ id }) => ({
      url: `/notification/${id}/read`,
      method: "PATCH",
    }),
    invalidatesTags: ["Notifications"],
  }),
  markAllNotificationsRead: builder.mutation<
    { status: string; data?: { updatedCount: number } },
    { userId: string }
  >({
    query: ({ userId }) => ({
      url: `/notification/user/${userId}/read-all`,
      method: "PATCH",
    }),
    invalidatesTags: ["Notifications"],
  }),
  markUserNotificationsReadBatch: builder.mutation<
    { status: string; data?: { updatedCount: number } },
    { userId: string; ids: string[] }
  >({
    query: ({ userId, ids }) => ({
      url: `/notification/user/${userId}/read-batch`,
      method: "PATCH",
      body: { ids },
    }),
    invalidatesTags: ["Notifications"],
  }),
});

export type { BackendNotification as NotificationItem };
