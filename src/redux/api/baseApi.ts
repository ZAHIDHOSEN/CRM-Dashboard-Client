// redux/api/baseApi.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1",

    credentials: "include", // 🔥 THIS IS IMPORTANT (cookies)

  }),

  tagTypes: ["Auth", "User", "Lead", "Proposal", "Training"],

  endpoints: () => ({}),
});