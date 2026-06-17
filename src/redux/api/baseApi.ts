import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "https://crm-dashboard-server.vercel.app/api/v1",
    credentials: "include", 

  }),

  tagTypes: ["Auth", "User", "Lead", "Proposal", "Training","Payroll","Organization","Team","AuditLog","Leads"],

  endpoints: () => ({}),
});