/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../api/baseApi";

export const leadsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    createLead: builder.mutation({
      query: (data) => ({
        url: "/lead",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Leads"],
    }),

    getAllLeads: builder.query({
      query: () => "/lead",
      providesTags: ["Leads"],
    }),

    updateLead: builder.mutation({
      query: ({ id, data }: { id: string; data: any }) => ({
        url: `/lead/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Leads"],
    }),

    deleteLead: builder.mutation({
      query: (id: string) => ({
        url: `/lead/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Leads"],
    }),

  }),
});

export const {
  useCreateLeadMutation,
  useGetAllLeadsQuery,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
} = leadsApi;