import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"


export const UsersApi = createApi({
  reducerPath: "UsersApi",
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
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => `/auth/users/`,
    }),

    getUserById: builder.query({
      query: (id) => `/auth/users/${id}/`,
    }),

      addUsers: builder.mutation({
        query: (data) => ({
          url: `/auth/users/`,
          method: "POST",
          body: data,
        }),
      }),

      updateUser: builder.mutation({
        query: ({ id, ...data }) => ({
          url: `/auth/users/${id}/`,
          method: "PATCH",
          body: data,
        }),
      }),

      deleteUser: builder.mutation({
        query: (id) => ({
          url: `/auth/users/${id}/`,
          method: "DELETE",
        }),
      }),

  }),
})

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useAddUsersMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = UsersApi
