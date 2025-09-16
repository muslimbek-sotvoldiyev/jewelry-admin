import { createApi } from "@reduxjs/toolkit/query/react"

import { baseQuery } from "@/src/lib/service/api"


export const AtolyeApi = createApi({
  reducerPath: "AtolyeApi",
  baseQuery: baseQuery,
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
