import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Chat', 'Message'],
  endpoints: (builder) => ({
    getChats: builder.query({
      query: ({ clinicId, userId }) => ({
        url: `/chats/${clinicId}`,
        params: userId ? { userId } : undefined,
      }),
      providesTags: ['Chat'],
    }),
    getChat: builder.query({
      query: (id) => `/chat/${id}`,
      providesTags: (result, error, id) => [{ type: 'Chat', id }],
    }),
    createChat: builder.mutation({
      query: (chat) => ({
        url: '/chats',
        method: 'POST',
        body: chat,
      }),
      invalidatesTags: ['Chat'],
    }),
    getMessages: builder.query({
      query: (chatId) => `/chats/${chatId}/messages`,
      providesTags: (result, error, chatId) => [{ type: 'Message', id: chatId }],
    }),
    sendMessage: builder.mutation({
      query: ({ chatId, ...message }) => ({
        url: `/chats/${chatId}/messages`,
        method: 'POST',
        body: message,
      }),
      invalidatesTags: (result, error, { chatId }) => [{ type: 'Message', chatId }],
    }),
    markAllRead: builder.mutation({
      query: ({ chatId, userId }) => ({
        url: `/chats/${chatId}/mark-read`,
        method: 'POST',
        body: { userId },
      }),
      invalidatesTags: (result, error, { chatId }) => [{ type: 'Message', chatId }],
    }),
    deleteChat: builder.mutation({
      query: (chatId) => ({
        url: `/chats/${chatId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Chat'],
    }),
    archiveChat: builder.mutation({
      query: (chatId) => ({
        url: `/chats/${chatId}/archive`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Chat'],
    }),
    updateParticipants: builder.mutation({
      query: ({ chatId, participants, updatedBy }) => ({
        url: `/chats/${chatId}/participants`,
        method: 'PATCH',
        body: { participants, updatedBy },
      }),
      invalidatesTags: (result, error, { chatId }) => [{ type: 'Chat', id: chatId }],
    }),
  }),
});

export const {
  useGetChatsQuery,
  useGetChatQuery,
  useCreateChatMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkAllReadMutation,
  useDeleteChatMutation,
  useArchiveChatMutation,
  useUpdateParticipantsMutation,
} = chatApi;
