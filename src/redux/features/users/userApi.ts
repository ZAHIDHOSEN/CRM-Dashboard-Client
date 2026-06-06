import { baseApi } from "../../api/baseApi";


export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createUser: builder.mutation({
      query: (data) => ({
        url: "/user",
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["User"],
    }),

      getAllUsers: builder.query({
      query: () => "/user",
      providesTags: ["User"],
    }),

      updateUser: builder.mutation({
      query: ({ id, data }: { id: string; data: { isApproved: boolean } }) => ({
        url: `/user/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),


    deleteUser: builder.mutation({
      query: (id: string) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

   

   

  }),
});

export const {
  useCreateUserMutation,
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
 
} = userApi