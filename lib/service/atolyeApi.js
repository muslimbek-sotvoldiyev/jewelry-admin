import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"


export const AtolyeApi = createApi({
  reducerPath: "AtolyeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://zargar.pythonanywhere.com/api/v1/",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("access")
      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
      }
      headers.set("Content-Type", "application/json")
      return headers
    },
  }),
  tagTypes: ["Organization"],
  endpoints: (builder) => ({
    getOrganizations: builder.query({
      query: () => `/organizations/`,
      providesTags: ["Organization"],
    }),

    getOrganizationById: builder.query({
      query: (id) => `/organizations/${id}/`,
      providesTags: (result, error, id) => [{ type: "Organization", id }],
    }),

    addOrganization: builder.mutation({
      query: (data) => ({
        url: `/organizations/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Organization"],
    }),

    updateOrganization: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/organizations/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Organization", id }],
    }),

    deleteOrganization: builder.mutation({
      query: (id) => ({
        url: `/organizations/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Organization"],
    }),
  }),
})

export const {
  useGetOrganizationsQuery,
  useGetOrganizationByIdQuery,
  useAddOrganizationMutation,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
} = AtolyeApi
