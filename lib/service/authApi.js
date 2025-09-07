import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const AuthApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    // baseUrl: "https://zargar.pythonanywhere.com/api/v1/",
    baseUrl:"https://moved-steadily-bear.ngrok-free.app/api/v1/",
    prepareHeaders: (headers) => {
      headers.set("ngrok-skip-browser-warning", true);
      return headers;
    },
  }),
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
