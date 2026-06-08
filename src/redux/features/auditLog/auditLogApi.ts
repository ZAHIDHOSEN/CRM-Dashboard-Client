import { baseApi } from "../../api/baseApi";

export const auditLogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAllAuditLogs: builder.query({
      query: () => "/audit-log",
      providesTags: ["AuditLog"],
    }),

    getSingleAuditLog: builder.query({
      query: (id: string) => `/audit-log/${id}`,
      providesTags: ["AuditLog"],
    }),

    createAuditLog: builder.mutation({
      query: (data) => ({
        url: "/audit-log",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AuditLog"],
    }),

  }),
});

export const {
  useGetAllAuditLogsQuery,
  useGetSingleAuditLogQuery,
  useCreateAuditLogMutation,
} = auditLogApi;