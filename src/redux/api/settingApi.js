import { indexApi } from "./indexApi";

const extendedIndexApi = indexApi.injectEndpoints({
  tagTypes: ["Setting"],
  endpoints: (builder) => ({
    getSetting: builder.query({
      query: () => "settings",
      providesTags: ["Setting"],
    }),
    updateSetting: builder.mutation({
      query: (payload) => ({
        url: "settings",
        method: "PUT",
        body: payload.body,
      }),
      invalidatesTags: ["Setting"],
    }),
  }),
});

export const { useGetSettingQuery, useUpdateSettingMutation } =
  extendedIndexApi;
