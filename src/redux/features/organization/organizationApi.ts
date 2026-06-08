/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../api/baseApi";

export const organizationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createOrganization: builder.mutation({
      query: (data) => ({
        url: "/organization",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Organization"],
    }),

    getAllOrganizations: builder.query({
      query: () => "/organization",
      providesTags: ["Organization"],
    }),

    getSingleOrganization: builder.query({
      query: (id: string) => `/organization/${id}`,
      providesTags: ["Organization"],
    }),

    getMyOrganization: builder.query({
      query: () => "/organization/me",
      providesTags: ["Organization"],
    }),

    updateOrganization: builder.mutation({
      query: ({ id, data }: { id: string; data: any }) => ({
        url: `/organization/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Organization"],
    }),

    deleteOrganization: builder.mutation({
      query: (id: string) => ({
        url: `/organization/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Organization"],
    }),

    addUserToOrganization: builder.mutation({
      query: ({ id, userId }: { id: string; userId: string }) => ({
        url: `/organization/${id}/users`,
        method: "POST",
        body: { userId },
      }),
      invalidatesTags: ["Organization"],
    }),

    removeUserFromOrganization: builder.mutation({
      query: ({ id, userId }: { id: string; userId: string }) => ({
        url: `/organization/${id}/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Organization"],
    }),

    updateUserRole: builder.mutation({
      query: ({ id, userId, role }: { id: string; userId: string; role: string }) => ({
        url: `/organization/${id}/users/${userId}`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["Organization", "User"],
    }),

  }),
});

export const {
  useCreateOrganizationMutation,
  useGetAllOrganizationsQuery,
  useGetSingleOrganizationQuery,
  useGetMyOrganizationQuery,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
  useAddUserToOrganizationMutation,
  useRemoveUserFromOrganizationMutation,
  useUpdateUserRoleMutation,
} = organizationApi;