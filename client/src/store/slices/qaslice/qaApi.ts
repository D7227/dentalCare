import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setQaUser, setQaToken, setQaDailyReports, addQaDailyReport, clearQa } from "./qaSlice";

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

export const qaApi = createApi({
  reducerPath: "qaApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["qa"],
  endpoints: (builder) => ({
    loginQa: builder.mutation<AuthToken, LoginRequest>({
      query: (body) => ({
        url: "/qa/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const res = await queryFulfilled;
          const { token, user } = res.data;
          localStorage.setItem("token", token);
          dispatch(setQaUser(user));
          dispatch(setQaToken(token));
        } catch (err) {
          dispatch(clearQa());
        }
      },
    }),
    registerQa: builder.mutation<AuthToken, RegisterRequest>({
      query: (body) => ({
        url: "/qa/register",
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const res = await queryFulfilled;
          const { token, user } = res.data;
          localStorage.setItem("token", token);
          dispatch(setQaUser(user));
          dispatch(setQaToken(token));
        } catch (err) {
          dispatch(clearQa());
        }
      },
    }),
    logoutQa: builder.mutation<void, void>({
      query: () => ({
        url: "/qa/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch }) {
        localStorage.removeItem("token");
        dispatch(clearQa());
      },
    }),
    deleteQa: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/qa/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(arg, { dispatch }) {
        dispatch(clearQa());
      },
    }),
    submitDailyReport: builder.mutation<any, DailyReportRequest>({
      query: (body) => ({
        url: "/qa/daily-report",
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const res = await queryFulfilled;
          dispatch(addQaDailyReport(res.data));
        } catch (err) {
          // handle error if needed
        }
      },
    }),
    getTodaysDailyReport: builder.query<any, { qaId: string }>({
      query: ({ qaId }) => ({
        url: `/qa/daily-report/today?qaId=${qaId}`,
        method: "GET",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const res = await queryFulfilled;
          dispatch(setQaDailyReports([res.data]));
        } catch (err) {
          // handle error if needed
        }
      },
    }),
    getAllDailyReports: builder.query<any, { qaId: string; page?: number; pageSize?: number }>({
      query: ({ qaId, page = 1, pageSize = 20 }) => ({
        url: `/qa/daily-report?qaId=${qaId}&page=${page}&pageSize=${pageSize}`,
        method: "GET",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const res = await queryFulfilled;
          dispatch(setQaDailyReports(res.data));
        } catch (err) {
          // handle error if needed
        }
      },
    }),
    getFilteredDailyReports: builder.query<any, { qaId: string; month?: number; year?: number; startDate?: string; endDate?: string; page?: number; pageSize?: number }>({
      query: (body) => ({
        url: "/qa/daily-report/filter",
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const res = await queryFulfilled;
          dispatch(setQaDailyReports(res.data));
        } catch (err) {
          // handle error if needed
        }
      },
    }),
  }),
});

export const {
  useLoginQaMutation,
  useRegisterQaMutation,
  useLogoutQaMutation,
  useDeleteQaMutation,
  useSubmitDailyReportMutation,
  useGetTodaysDailyReportQuery,
  useGetAllDailyReportsQuery,
  useGetFilteredDailyReportsQuery,
} = qaApi;
