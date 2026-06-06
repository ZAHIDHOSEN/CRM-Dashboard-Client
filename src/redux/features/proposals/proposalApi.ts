/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../api/baseApi";

export const proposalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createProposal: builder.mutation({
      query: (data) => ({
        url: "/proposal",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Proposal"],
    }),

    getAllProposals: builder.query({
      query: (params?) => ({
        url: "/proposal",
        params,
      }),
      providesTags: ["Proposal"],
    }),

    getSingleProposal: builder.query({
      query: (id: string) => `/proposal/${id}`,
      providesTags: ["Proposal"],
    }),

    updateProposal: builder.mutation({
      query: ({ id, data }: { id: string; data: any }) => ({
        url: `/proposal/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Proposal"],
    }),

    updateProposalStatus: builder.mutation({
      query: ({ id, status }: { id: string; status: string }) => ({
        url: `/proposal/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Proposal"],
    }),

    deleteProposal: builder.mutation({
      query: (id: string) => ({
        url: `/proposal/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Proposal"],
    }),

    getProposalAnalytics: builder.query({
      query: () => "/proposal/analytics",
      providesTags: ["Proposal"],
    }),

  }),
});

export const {
  useCreateProposalMutation,
  useGetAllProposalsQuery,
  useGetSingleProposalQuery,
  useUpdateProposalMutation,
  useUpdateProposalStatusMutation,
  useDeleteProposalMutation,
  useGetProposalAnalyticsQuery,
} = proposalApi;