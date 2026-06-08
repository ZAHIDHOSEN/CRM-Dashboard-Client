import { baseApi } from "../../api/baseApi";

export const teamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createTeam: builder.mutation({
      query: (data) => ({
        url: "/team",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Team"],
    }),

    getAllTeams: builder.query({
      query: () => "/team/allTeam",
      providesTags: ["Team"],
    }),

    updateTeam: builder.mutation({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      query: ({ id, data }: { id: string; data: any }) => ({
        url: `/team/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Team"],
    }),

    deleteTeam: builder.mutation({
      query: (id: string) => ({
        url: `/team/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Team"],
    }),

    addMemberToTeam: builder.mutation({
      query: ({ teamId, userId }: { teamId: string; userId: string }) => ({
        url: `/team/${teamId}/add-member/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Team"],
    }),

    removeMemberFromTeam: builder.mutation({
      query: ({ teamId, userId }: { teamId: string; userId: string }) => ({
        url: `/team/${teamId}/remove-member/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Team"],
    }),

  }),
});

export const {
  useCreateTeamMutation,
  useGetAllTeamsQuery,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
  useAddMemberToTeamMutation,
 useRemoveMemberFromTeamMutation,
} = teamApi;