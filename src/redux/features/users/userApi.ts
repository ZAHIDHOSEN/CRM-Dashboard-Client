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

   

   

  }),
});

export const {useCreateUserMutation} = userApi