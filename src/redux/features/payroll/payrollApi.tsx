/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../api/baseApi";

export const payrollApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createPayroll: builder.mutation({
      query: (data) => ({
        url: "/payroll",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Payroll"],
    }),

    getAllPayroll: builder.query({
      query: (params?) => ({
        url: "/payroll",
        params,
      }),
      providesTags: ["Payroll"],
    }),

    getSinglePayroll: builder.query({
      query: (id: string) => `/payroll/${id}`,
      providesTags: ["Payroll"],
    }),

    updatePayroll: builder.mutation({
      query: ({ id, data }: { id: string; data: any }) => ({
        url: `/payroll/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Payroll"],
    }),

    updatePayrollStatus: builder.mutation({
      query: ({ id, status }: { id: string; status: string }) => ({
        url: `/payroll/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Payroll"],
    }),

    deletePayroll: builder.mutation({
      query: (id: string) => ({
        url: `/payroll/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Payroll"],
    }),

    getPayrollAnalytics: builder.query({
      query: () => "/payroll/analytics",
      providesTags: ["Payroll"],
    }),

  }),
});

export const {
  useCreatePayrollMutation,
  useGetAllPayrollQuery,
  useGetSinglePayrollQuery,
  useUpdatePayrollMutation,
  useUpdatePayrollStatusMutation,
  useDeletePayrollMutation,
  useGetPayrollAnalyticsQuery,
} = payrollApi;