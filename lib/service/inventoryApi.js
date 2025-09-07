import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const InventoryApi = createApi({
  reducerPath: "InventoryApi",
  baseQuery: fetchBaseQuery({
    // baseUrl: "https://zargar.pythonanywhere.com/api/v1/",
    baseUrl:"https://moved-steadily-bear.ngrok-free.app/api/v1/",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("access")
      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
      }
      headers.set("Content-Type", "application/json")
      headers.set("ngrok-skip-browser-warning", true);
      return headers
    },
  }),
  tagTypes: ["Inventory"],
  endpoints: (builder) => ({
    getInventory: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        if (params.search) searchParams.append("search", params.search)
        if (params.ordering) searchParams.append("ordering", params.ordering)
        return `/inventory/?${searchParams.toString()}`
      },
      providesTags: ["Inventory"],
    }),

    getInventoryById: builder.query({
      query: (id) => `/inventory/${id}/`,
      providesTags: (result, error, id) => [{ type: "Inventory", id }],
    }),

    addInventory: builder.mutation({
      query: (data) => ({
        url: `/inventory/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Inventory"],
    }),

    updateInventory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/inventory/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Inventory", id }],
    }),

    deleteInventory: builder.mutation({
      query: (id) => ({
        url: `/inventory/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Inventory"],
    }),
  }),
})

export const {
  useGetInventoryQuery,
  useGetInventoryByIdQuery,
  useAddInventoryMutation,
  useUpdateInventoryMutation,
  useDeleteInventoryMutation,
} = InventoryApi
