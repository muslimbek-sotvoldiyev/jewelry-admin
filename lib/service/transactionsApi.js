import { createApi } from "@reduxjs/toolkit/query/react"

import { baseQuery } from "@/lib/service/api"

export const TransactionsApi = createApi({
  reducerPath: "transactions",
  baseQuery: baseQuery,
  tagTypes: ["Transactions"],
  endpoints: (builder) => ({
    GetTransactions: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        if (params.search) {
          searchParams.append("search", params.search)
        }
        if (params.ordering) {
          searchParams.append("ordering", params.ordering)
        }
        if (params.status) {
          searchParams.append("status", params.status)
        }
        const queryString = searchParams.toString()
        return `/transactions/list/${queryString ? `?${queryString}` : ""}`
      },
      providesTags: ["Transactions"],
    }),

    getTransactionById: builder.query({
      query: (id) => `/transactions/detail/${id}/`,
      providesTags: (result, error, id) => [{ type: "Transactions", id }],
    }),

    addTransaction: builder.mutation({
      query: (data) => ({
        url: `/transactions/create/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Transactions"],
    }),

    acceptTransaction: builder.mutation({
      query: ({ id, receivedAmounts, note }) => ({
        url: `/transactions/${id}/accept/`,
        method: "POST",
        body: {
          received_amounts: receivedAmounts,
          note: note || "",
        },
      }),
      invalidatesTags: (result, error, { id }) => ["Transactions", { type: "Transactions", id }],
    }),
  }),
})

export const {
  useGetTransactionsQuery,
  useGetTransactionByIdQuery,
  useAddTransactionMutation,
  useAcceptTransactionMutation,
} = TransactionsApi
