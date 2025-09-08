import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import { baseQuery } from "@/lib/service/api"

export const TransactionsApi = createApi({
  reducerPath: "transactions",
  baseQuery: baseQuery,
  tagTypes: ["Transactions"],
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
        return `/transactions/list/${queryString ? `?${queryString}` : ""}`
      },
    }),

    getTransactionById: builder.query({
      query: (id) => `/transactions/detail/${id}/`,
    }),

    addTransaction: builder.mutation({
      query: (data) => ({
        url: `/transactions/create/`,
        method: "POST",
        body: data,
      }),
    }),
  }),
})

export const {
  useGetTransactionsQuery,
  useGetTransactionByIdQuery,
  useAddTransactionMutation,
} = TransactionsApi
