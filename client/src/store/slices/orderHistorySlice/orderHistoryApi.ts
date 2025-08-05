import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderHistoryApi = createApi({
  reducerPath: "orderHistoryApi",
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
  tagTypes: ["OrderHistory"],
  endpoints: (builder) => ({
    createOrderHistory: builder.mutation<any, { orderId: string; historyEntry: any; updatedBy?: string }>({
      query: (body) => ({
        url: "/order-history",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: "OrderHistory", id: orderId },
      ],
    }),
    getOrderHistory: builder.query<any, string>({
      query: (orderId) => ({
        url: `/order-history/${orderId}`,
        method: "GET",
      }),
      providesTags: (result, error, orderId) => [
        { type: "OrderHistory", id: orderId },
      ],
    }),
  }),
});

export const {
  useCreateOrderHistoryMutation,
  useGetOrderHistoryQuery,
} = orderHistoryApi;
