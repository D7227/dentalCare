import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useGetChatsQuery } from '@/store/slices/chatApi';
import { setSelectedChatId } from '@/store/slices/chatslice';
import { Badge } from '@/components/ui/badge';
import { useSocket } from '@/contexts/SocketContext';

const ClinicChats = () => {
  const user = useAppSelector((state) => state.userData.userData);
  const dispatch = useAppDispatch();
  // Always use user.id for userId in chat query
  // const { data: chats = [] , isLoading } = useGetChatsQuery({ clinicId: user?.clinicId, userId: user?.roleName === "main_doctor"? undefined: user?.fullName });
  const { data: chats = [] , isLoading } = useGetChatsQuery({ clinicId: user?.clinicId, userId: user?.fullName });
  const selectedChatId = useAppSelector((state) => state.chat.selectedChatId);
  const { onUnreadCountUpdate, offUnreadCountUpdate } = useSocket();

  // Local state to allow instant unread count updates
  const [localChats, setLocalChats] = useState<any[]>(chats);

  // Sync localChats with fetched chats
  useEffect(() => {
    setLocalChats(chats);
  }, [chats]);

  useEffect(() => {
    const handleUnreadUpdate = (data: { chatId: string; unreadCount: number }) => {
      setLocalChats((prevChats: any[]) =>
        prevChats.map((chat: any) =>
          chat.id === data.chatId ? { ...chat, unreadCount: data.unreadCount } : chat
        )
      );
    };
    onUnreadCountUpdate(handleUnreadUpdate);
    return () => {
      offUnreadCountUpdate(handleUnreadUpdate);
    };
  }, [onUnreadCountUpdate, offUnreadCountUpdate]);

  if (isLoading) return <div>Loading chats...</div>;

  return (
    <div>
      {localChats.length === 0 ? (
        <div>No chats found for your clinic.</div>
      ) : (
        <ul>
          {localChats.map((chat: any) => (
            <li
              key={chat.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                background: chat.id === selectedChatId ? '#e0f7fa' : 'transparent',
                borderRadius: '6px',
                padding: '6px 10px',
                fontWeight: chat.id === selectedChatId ? 'bold' : 'normal',
              }}
              onClick={() => dispatch(setSelectedChatId(chat.id))}
            >
              {chat.title || 'Untitled Chat'}
              {chat.unreadCount > 0 && (
                <Badge variant="secondary">{chat.unreadCount}</Badge>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClinicChats; 