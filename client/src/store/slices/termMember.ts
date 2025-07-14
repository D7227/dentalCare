import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const teamMemberApi = createApi({
  reducerPath: "teamMemberApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_BASEURL }),
  endpoints: (builder) => ({
    getTeamMembers: builder.query<any, string>({
      // clinicId is the argument
      query: (clinicId) => `team-members/${clinicId}`,
    }),
  }),
});

export const { useGetTeamMembersQuery } = teamMemberApi;
