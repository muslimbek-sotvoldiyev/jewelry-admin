import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://zargar.pythonanywhere.com/api/v1/";

console.log("Backend url", BASE_URL);

export const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  // baseUrl: "https://moved-steadily-bear.ngrok-free.app/api/v1/",
  // baseUrl: "http://127.0.0.1:8000/api/v1/",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("access");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    headers.set("ngrok-skip-browser-warning", "true");

    return headers;
  },
});
