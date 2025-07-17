import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { OrderType } from "@/types/orderType";

export interface CreateOrderRequest extends Partial<OrderType> {}
export interface UpdateOrderRequest extends Partial<OrderType> {}

export interface UpdateOrderStatusRequest {
  orderStatus: string;
}

export interface FilterOrdersQuery {
  patientName?: string;
  prescription?: string;
  refId?: string;
  order_id?: string;
}

export const orderApi = createApi({
  reducerPath: "orderApi",
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
  tagTypes: ["Order", "OrderList", "OrderChat"],
  endpoints: (builder) => ({
    // Get all orders
    getOrders: builder.query<OrderType[], void>({
      query: () => ({ url: "/orders", method: "GET" }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((order) => ({
                type: "Order" as const,
                id: order.orderId,
              })),
              { type: "OrderList", id: "LIST" },
            ]
          : [{ type: "OrderList", id: "LIST" }],
    }),

    // Get order by ID (ClinicId)
    getOrderById: builder.query<OrderType, string>({
      query: (clinicId) => ({ url: `/orders/${clinicId}`, method: "GET" }),
      providesTags: (result, error, clinicId) => [{ type: "Order", clinicId }],
    }),

    // Get order by ID (OrderId)
    getOrderByOrderId: builder.query<OrderType, string>({
      query: (orderId) => ({ url: `/orderData/${orderId}`, method: "GET" }),
      providesTags: (result, error, orderId) => [{ type: "Order", orderId }],
    }),

    // Create New order
    createOrder: builder.mutation<OrderType, CreateOrderRequest>({
      query: (body) => ({ url: "/orders", method: "POST", body }),
      invalidatesTags: [{ type: "OrderList", id: "LIST" }],
    }),

    // Update order
    updateOrder: builder.mutation<
      OrderType,
      { id: string; body: UpdateOrderRequest }
    >({
      query: ({ id, body }) => ({
        url: `/updateOrders/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Order", id },
        { type: "OrderList", id: "LIST" },
      ],
    }),

    // Update order status - not working
    updateOrderStatus: builder.mutation<
      OrderType,
      { id: string; orderStatus: string }
    >({
      query: ({ id, orderStatus }) => ({
        url: `/${id}/status`,
        method: "PATCH",
        body: { orderStatus },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Order", id },
        { type: "OrderList", id: "LIST" },
      ],
    }),

    // Filter orders by clinicId and query
    filterOrders: builder.query<
      OrderType[],
      { id: string; query?: FilterOrdersQuery }
    >({
      query: ({ id, query }) => ({
        url: `/filter/${id}`,
        method: "GET",
        params: query,
      }),
      providesTags: [{ type: "OrderList", id: "LIST" }],
    }),

    // Get chat by orderId - not working
    getOrderChat: builder.query<any, string>({
      query: (orderId) => ({ url: `/${orderId}/chat`, method: "GET" }),
      providesTags: (result, error, orderId) => [
        { type: "OrderChat", id: orderId },
      ],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useGetOrderByOrderIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useUpdateOrderStatusMutation,
  useFilterOrdersQuery,
  useGetOrderChatQuery,
} = orderApi;
