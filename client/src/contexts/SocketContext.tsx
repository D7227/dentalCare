import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppSelector } from '@/store/hooks';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinChat: (chatId: string, userId: string) => void;
  leaveChat: (chatId: string, userId: string) => void;
  sendMessage: (chatId: string, message: any) => void;
  sendTyping: (chatId: number, user: string, isTyping: boolean) => void;
  getSocket: () => Socket | null;
  onUnreadCountUpdate: (callback: (data: { chatId: string; unreadCount: number }) => void) => void;
  offUnreadCountUpdate: (callback: (data: { chatId: string; unreadCount: number }) => void) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const user = useAppSelector((state) => state.userData.userData);

  // Delay socket connection until user is available
  useEffect(() => {
    if (user?.id) {
      // Use window.location.hostname and support ws/wss and env port
      const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
      const hostname = window.location.hostname;
      const envPort = import.meta.env.VITE_WS_PORT;
      let port = envPort || window.location.port;
      if (!port) {
        port = protocol === 'wss' ? '443' : '5000';
      }
      const serverUrl = `${protocol}://${hostname}:${port}`;
      const newSocket = io(serverUrl, {
        transports: ['websocket', 'polling'],
        autoConnect: true,
      });

      newSocket.on('connect', () => {
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        setIsConnected(false);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user?.id]);

  // Register user with socket after connection and user is available
  useEffect(() => {
    if (socket && isConnected && user?.id) {
      socket.emit('register-user', user.id);
      console.log('Registered socket with user.id:', user.id);
    }
  }, [socket, isConnected, user?.id]);

  const joinChat = (chatId: string, userId: string) => {
    if (socket && isConnected) {
      socket.emit('join-chat', chatId, userId);
      console.log(`Joined chat room: ${chatId} as user: ${userId}`);
    }
  };

  const leaveChat = (chatId: string, userId: string) => {
    if (socket && isConnected) {
      socket.emit('leave-chat', chatId, userId);
      console.log(`Left chat room: ${chatId} as user: ${userId}`);
    }
  };

  const sendMessage = (chatId: string, message: any) => {
    if (socket && isConnected) {
      socket.emit('send-message', { chatId, message });
      console.log(`Sending message to chat ${chatId}:`, message);
    }
  };

  const sendTyping = (chatId: number, user: string, isTyping: boolean) => {
    if (socket && isConnected) {
      socket.emit('typing', { chatId, user, isTyping });
    }
  };

  const getSocket = () => {
    return socket;
  };

  const onUnreadCountUpdate = (callback: (data: { chatId: string; unreadCount: number }) => void) => {
    if (socket) {
      socket.on('unread-count-update', callback);
    }
  };

  const offUnreadCountUpdate = (callback: (data: { chatId: string; unreadCount: number }) => void) => {
    if (socket) {
      socket.off('unread-count-update', callback);
    }
  };

  const value: SocketContextType = {
    socket,
    isConnected,
    joinChat,
    leaveChat,
    sendMessage,
    sendTyping,
    getSocket,
    onUnreadCountUpdate,
    offUnreadCountUpdate,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}; 