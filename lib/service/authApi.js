import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "@/lib/service/api"


const AuthApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ username, password }) => ({
        url: "auth/login/",
        method: "POST",
        body: {
          username,
          password,
        },
      }),
    }),

    // tokenVerify: builder.mutation({
    //   query: (token) => ({
    //     url: "/token/verify/",
    //     method: "POST",
    //     body: { token },
    //   }),
    // }),

    tokenVerify: builder.query({
      query: () => `/organizations/`,
    }),

    refreshToken: builder.mutation({
      query: (refresh) => ({
        url: "auth/refresh/",
        method: "POST",
        body: { refresh },
      }),
    }),
  }),
});

export const {
  useTokenVerifyQuery,
  useRefreshTokenMutation,
  useLoginMutation,
} = AuthApi;

export default AuthApi;
