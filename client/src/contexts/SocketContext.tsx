import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppSelector } from '@/store/hooks';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinChat: (chatId: number) => void;
  leaveChat: (chatId: number) => void;
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
      // Use window.location.hostname and default to 5000 if port is not set
      const port = window.location.port || '5000';
      const serverUrl = `http://${window.location.hostname}:${port}`;
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

  // Register user with socket after connection and user.fullName is available
  useEffect(() => {
    if (socket && isConnected && user?.fullName) {
      socket.emit('register-user', user.fullName);
    }
  }, [socket, isConnected, user?.fullName]);

  const joinChat = (chatId: number) => {
    if (socket && isConnected) {
      socket.emit('join-chat', chatId);
      console.log(`Joined chat room: ${chatId}`);
    }
  };

  const leaveChat = (chatId: number) => {
    if (socket && isConnected) {
      socket.emit('leave-chat', chatId);
      console.log(`Left chat room: ${chatId}`);
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