import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface TeamMember {
  id: string;
  fullName: string;
  clinicId?: string;
  clinicName?: string;
  contactNumber?: string;
  email?: string;
  roleId?: string;
  roleName?: string;
  permissions?: string[];
  [key: string]: any;
}

export interface CreateTeamMemberRequest {
  [key: string]: any;
}

export interface UpdateTeamMemberRequest {
  id: string;
  updates: Record<string, any>;
}

const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: "/api",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const teamMemberApi = createApi({
  reducerPath: "teamMemberApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    getTeamMembersByClinic: builder.query<TeamMember[], string>({
      query: (clinicId) => ({
        url: `/team-members/${clinicId}`,
        method: "GET",
      }),
    }),
    getTeamMemberById: builder.query<TeamMember, string>({
      query: (id) => ({
        url: `/team-member/${id}`,
        method: "GET",
      }),
    }),
    createTeamMember: builder.mutation<TeamMember, CreateTeamMemberRequest>({
      query: (body) => ({
        url: "/create/team-members",
        method: "POST",
        body,
      }),
    }),
    updateTeamMember: builder.mutation<TeamMember, UpdateTeamMemberRequest>({
      query: ({ id, updates }) => ({
        url: `/update/team-member/${id}`,
        method: "PATCH",
        body: updates,
      }),
    }),
    deleteTeamMember: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/team-member/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetTeamMembersByClinicQuery,
  useGetTeamMemberByIdQuery,
  useCreateTeamMemberMutation,
  useUpdateTeamMemberMutation,
  useDeleteTeamMemberMutation,
} = teamMemberApi; 