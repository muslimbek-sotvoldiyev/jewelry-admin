import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseQuery = fetchBaseQuery({
  baseUrl: "https://zargar.pythonanywhere.com/api/v1/",
  // baseUrl: "https://moved-steadily-bear.ngrok-free.app/api/v1/",
  // baseUrl: "http://127.0.0.1:8000/api/v1/",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("access");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    headers.set("ngrok-skip-browser-warning", true);

    return headers;
  },
});
