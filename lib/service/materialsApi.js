import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const MaterialsApi = createApi({
  reducerPath: "MaterialsApi",
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
  tagTypes: ["Material"],
  endpoints: (builder) => ({
    getMaterials: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        if (params.search) {
          searchParams.append("search", params.search)
        }
        if (params.ordering) {
          searchParams.append("ordering", params.ordering)
        }
        const queryString = searchParams.toString()
        return `/materials/${queryString ? `?${queryString}` : ""}`
      },
    }),

    getMaterialById: builder.query({
      query: (id) => `/materials/${id}/`,
    }),

    addMaterial: builder.mutation({
      query: (data) => ({
        url: `/materials/`,
        method: "POST",
        body: data,
      }),
    }),

    updateMaterial: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/materials/${id}/`,
        method: "PATCH",
        body: data,
      }),
    }),

    deleteMaterial: builder.mutation({
      query: (id) => ({
        url: `/materials/${id}/`,
        method: "DELETE",
      }),
    }),
  }),
})

export const {
  useGetMaterialsQuery,
  useGetMaterialByIdQuery,
  useAddMaterialMutation,
  useUpdateMaterialMutation,
  useDeleteMaterialMutation,
} = MaterialsApi
