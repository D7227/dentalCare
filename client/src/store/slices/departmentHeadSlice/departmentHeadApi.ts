import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  setDepartmentHeadUser,
  setDepartmentHeadToken,
  clearDepartmentHead,
} from "./departmentHeadSlice";

export interface AuthToken {
  token: string;
  user: any;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface DailyReportRequest {
  // Define the fields required for submitting a daily report
  [key: string]: any;
}

export const departmentHeadApi = createApi({
  reducerPath: "departmentHeadApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/head",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("department-head-token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["departmentHead"],
  endpoints: (builder) => ({
    loginDepartmentHead: builder.mutation<AuthToken, LoginRequest>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const res = await queryFulfilled;
          const { token, user } = res.data;
          localStorage.setItem("department-head-token", token);
          dispatch(setDepartmentHeadUser(user));
          dispatch(setDepartmentHeadToken(token));
        } catch (err) {
          dispatch(clearDepartmentHead());
        }
      },
    }),
    registerDepartmentHead: builder.mutation<AuthToken, RegisterRequest>({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const res = await queryFulfilled;
          const { token, user } = res.data;
          localStorage.setItem("department-head-token", token);
          dispatch(setDepartmentHeadUser(user));
          dispatch(setDepartmentHeadToken(token));
        } catch (err) {
          dispatch(clearDepartmentHead());
        }
      },
    }),
    deleteDepartmentHead: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(arg, { dispatch }) {
        dispatch(clearDepartmentHead());
      },
    }),
    getDepartmentHeadProfile: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "GET",
      }),
      providesTags: ["departmentHead"],
    }),
  }),
});

export const {
  useLoginDepartmentHeadMutation,
  useRegisterDepartmentHeadMutation,
  useDeleteDepartmentHeadMutation,
  useGetDepartmentHeadProfileQuery,
} = departmentHeadApi;
