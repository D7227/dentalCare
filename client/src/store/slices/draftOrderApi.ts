import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { DraftOrderType } from "@/types/draftOrderType";

export interface CreateDraftOrderRequest extends Partial<DraftOrderType> {}

export const draftOrderApi = createApi({
  reducerPath: "draftOrderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/draft-orders",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["DraftOrder", "DraftOrderList"],
  endpoints: (builder) => ({
    // Get all draft orders for a clinic
    getDraftOrders: builder.query<DraftOrderType[], string>({
      query: (clinicId) => ({ url: `/clinic/${clinicId}`, method: "GET" }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((order) => ({
                type: "DraftOrder" as const,
                id: order.orderId,
              })),
              { type: "DraftOrderList", id: "LIST" },
            ]
          : [{ type: "DraftOrderList", id: "LIST" }],
    }),

    // Get draft order by ID
    getDraftOrderById: builder.query<DraftOrderType, string>({
      query: (id) => ({ url: `/${id}`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "DraftOrder", id }],
    }),

    // Create draft order
    createDraftOrder: builder.mutation<DraftOrderType, CreateDraftOrderRequest>({
      query: (body) => ({ url: "", method: "POST", body }),
      invalidatesTags: [{ type: "DraftOrderList", id: "LIST" }],
    }),

    // Delete draft order
    deleteDraftOrder: builder.mutation<DraftOrderType, string>({
      query: (id) => ({ url: `/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "DraftOrderList", id: "LIST" }],
    }),
  }),
});

export const {
  useGetDraftOrdersQuery,
  useGetDraftOrderByIdQuery,
  useCreateDraftOrderMutation,
  useDeleteDraftOrderMutation,
} = draftOrderApi; 