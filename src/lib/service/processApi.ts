import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./api";

export const ProcessesApi = createApi({
  reducerPath: "ProcessesApi",
  baseQuery,
  tagTypes: ["Processes"],
  endpoints: (builder) => ({
    GetProcesses: builder.query({
      query: () => "/processes/list/",
      providesTags: ["Processes"],
    }),
    // GetProcessById: builder.query({
    //   query: (id) => `/processes/${id}/`,
    // }),
    CreateProcess: builder.mutation({
      query: (data) => ({
        url: "/processes/create/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Processes"],
    }),
    // UpdateProcess: builder.mutation({
    //   query: ({id, ...data}) => ({
    //     url: '/process/'
    //   })
    // })
  }),
});

export const { useGetProcessesQuery, useCreateProcessMutation } = ProcessesApi;
