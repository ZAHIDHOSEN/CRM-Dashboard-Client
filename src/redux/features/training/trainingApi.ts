/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../api/baseApi";

export const trainingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createTraining: builder.mutation({
      query: (data) => ({
        url: "/training",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Training"],
    }),

    getAllTraining: builder.query({
      query: () => "/training",
      providesTags: ["Training"],
    }),

    getSingleTraining: builder.query({
      query: (id: string) => `/training/${id}`,
      providesTags: ["Training"],
    }),

    updateTraining: builder.mutation({
      query: ({ id, data }: { id: string; data: any }) => ({
        url: `/training/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Training"],
    }),

    deleteTraining: builder.mutation({
      query: (id: string) => ({
        url: `/training/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Training"],
    }),

    togglePublishTraining: builder.mutation({
      query: (id: string) => ({
        url: `/training/publish/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Training"],
    }),

    getMyTraining: builder.query({
      query: () => "/training/my-training",
      providesTags: ["Training"],
    }),

    getPublishedTrainings: builder.query({
      query: () => "/training/published",
      providesTags: ["Training"],
    }),

    submitQuiz: builder.mutation({
      query: ({ id, answers }: { id: string; answers: string[] }) => ({
        url: `/training/submit-quiz/${id}`,
        method: "POST",
        body: { answers },
      }),
    }),

  }),
});

export const {
  useCreateTrainingMutation,
  useGetAllTrainingQuery,
  useGetSingleTrainingQuery,
  useUpdateTrainingMutation,
  useDeleteTrainingMutation,
  useTogglePublishTrainingMutation,
  useGetMyTrainingQuery,
  useGetPublishedTrainingsQuery,
  useSubmitQuizMutation,
} = trainingApi;