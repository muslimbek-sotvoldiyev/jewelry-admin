/*
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// Types
export interface Workshop {
  id: string
  name: string
  owner: string
  status: "active" | "busy" | "stopped"
  currentMaterial?: string
  workTime?: string
  process?: string
  email: string
  phone: string
  createdAt: string
  totalWorkTime?: string
  completedJobs?: number
}

export interface Transfer {
  id: string
  from: string
  to: string
  material: string
  materialType: "gold" | "silver" | "diamond" | "pearl"
  amount: number
  unit: string
  status: "confirmed" | "pending_sender" | "pending_receiver" | "returned" | "cancelled"
  senderConfirmed: boolean
  receiverConfirmed: boolean
  createdAt: string
  confirmedAt?: string
  note?: string
  processLoss?: number
}

export interface Notification {
  id: string
  type: string
  title: string
  message: string
  timestamp: string
  isRead: boolean
  priority: "high" | "medium" | "low"
  relatedId?: string
}

export interface HistoryItem {
  id: string
  timestamp: string
  type: string
  actor: string
  action: string
  details: string
  relatedId?: string
  status: "completed" | "pending" | "failed"
}

export interface DashboardStats {
  totalMaterials: number
  activeWorkshops: number
  todayTransfers: number
  pendingConfirmations: number
  materialData: Array<{ name: string; amount: number; unit: string }>
  weeklyTransfers: Array<{ day: string; transfers: number }>
  workshopStatus: Array<{ name: string; value: number; color: string }>
}

// API slice
export const jewelryApi = createApi({
  reducerPath: "jewelryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/",
    prepareHeaders: (headers, { getState }) => {
      // Add auth token if available
      const token = localStorage.getItem("authToken")
      if (token) {
        headers.set("authorization", `Bearer ${token}`)
      }
      headers.set("content-type", "application/json")
      return headers
    },
  }),
  tagTypes: ["Workshop", "Transfer", "Notification", "History", "Dashboard"],
  endpoints: (builder) => ({
    // Dashboard endpoints
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => "dashboard/stats/",
      providesTags: ["Dashboard"],
    }),

    // Workshop endpoints
    getWorkshops: builder.query<Workshop[], void>({
      query: () => "workshops/",
      providesTags: ["Workshop"],
    }),
    getWorkshop: builder.query<Workshop, string>({
      query: (id) => `workshops/${id}/`,
      providesTags: (result, error, id) => [{ type: "Workshop", id }],
    }),
    createWorkshop: builder.mutation<Workshop, Partial<Workshop>>({
      query: (workshop) => ({
        url: "workshops/",
        method: "POST",
        body: workshop,
      }),
      invalidatesTags: ["Workshop"],
    }),
    updateWorkshop: builder.mutation<Workshop, { id: string; data: Partial<Workshop> }>({
      query: ({ id, data }) => ({
        url: `workshops/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Workshop", id }],
    }),
    updateWorkshopStatus: builder.mutation<Workshop, { id: string; status: string; note?: string }>({
      query: ({ id, status, note }) => ({
        url: `workshops/${id}/status/`,
        method: "POST",
        body: { status, note },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Workshop", id }, "Dashboard"],
    }),

    // Transfer endpoints
    getTransfers: builder.query<Transfer[], void>({
      query: () => "transfers/",
      providesTags: ["Transfer"],
    }),
    getTransfer: builder.query<Transfer, string>({
      query: (id) => `transfers/${id}/`,
      providesTags: (result, error, id) => [{ type: "Transfer", id }],
    }),
    createTransfer: builder.mutation<Transfer, Partial<Transfer>>({
      query: (transfer) => ({
        url: "transfers/",
        method: "POST",
        body: transfer,
      }),
      invalidatesTags: ["Transfer", "Dashboard"],
    }),
    confirmTransfer: builder.mutation<
      Transfer,
      { id: string; type: "send" | "receive"; amount?: number; note?: string }
    >({
      query: ({ id, type, amount, note }) => ({
        url: `transfers/${id}/confirm/`,
        method: "POST",
        body: { type, amount, note },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Transfer", id }, "Dashboard", "Notification"],
    }),
    rejectTransfer: builder.mutation<Transfer, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `transfers/${id}/reject/`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Transfer", id }, "Dashboard"],
    }),

    // Notification endpoints
    getNotifications: builder.query<Notification[], void>({
      query: () => "notifications/",
      providesTags: ["Notification"],
    }),
    markNotificationAsRead: builder.mutation<Notification, string>({
      query: (id) => ({
        url: `notifications/${id}/read/`,
        method: "POST",
      }),
      invalidatesTags: ["Notification"],
    }),
    markAllNotificationsAsRead: builder.mutation<void, void>({
      query: () => ({
        url: "notifications/mark-all-read/",
        method: "POST",
      }),
      invalidatesTags: ["Notification"],
    }),

    // History endpoints
    getHistory: builder.query<
      HistoryItem[],
      {
        search?: string
        type?: string
        actor?: string
        dateFrom?: string
        dateTo?: string
      }
    >({
      query: (params) => ({
        url: "history/",
        params: Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined && value !== "")),
      }),
      providesTags: ["History"],
    }),
    exportHistory: builder.mutation<
      Blob,
      {
        search?: string
        type?: string
        actor?: string
        dateFrom?: string
        dateTo?: string
        format?: "csv" | "excel"
      }
    >({
      query: (params) => ({
        url: "history/export/",
        method: "POST",
        body: params,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Authentication endpoints
    login: builder.mutation<{ token: string; user: any }, { email: string; password: string }>({
      query: (credentials) => ({
        url: "auth/login/",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "auth/logout/",
        method: "POST",
      }),
    }),
    getCurrentUser: builder.query<any, void>({
      query: () => "auth/user/",
    }),
  }),
})

// Export hooks
export const {
  // Dashboard
  useGetDashboardStatsQuery,

  // Workshops
  useGetWorkshopsQuery,
  useGetWorkshopQuery,
  useCreateWorkshopMutation,
  useUpdateWorkshopMutation,
  useUpdateWorkshopStatusMutation,

  // Transfers
  useGetTransfersQuery,
  useGetTransferQuery,
  useCreateTransferMutation,
  useConfirmTransferMutation,
  useRejectTransferMutation,

  // Notifications
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,

  // History
  useGetHistoryQuery,
  useExportHistoryMutation,

  // Auth
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
} = jewelryApi
*/

export const jewelryApi = {} as any
export const useGetNotificationsQuery = () => ({ data: [] })
