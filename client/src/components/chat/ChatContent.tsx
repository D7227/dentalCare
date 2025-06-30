import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Users, Package, Search, MoreVertical, Plus, HeadphonesIcon, UserPlus, Shield, Archive, Settings, Bell, BellOff, MessageCircle, X, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useAppSelector, hasPermission } from '@/store/hooks';
import ChatModule from './ChatModule';
import { useSocket } from '@/contexts/SocketContext';
import { v4 as uuidv4 } from 'uuid';

interface ChatItem {
  id: string;
  type: 'master' | 'order' | 'support' | 'internal';
  title: string;
  orderId?: number;
  participants: string[];
  createdBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  unreadCount?: number;
}

const ChatContent = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [newChatModal, setNewChatModal] = useState(false);
  const [newChatType, setNewChatType] = useState<string>('order');
  const [newChatTitle, setNewChatTitle] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<string>('');

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { getSocket, onUnreadCountUpdate, offUnreadCountUpdate } = useSocket();
  
  // Get user data from Redux
  const user = useAppSelector(state => state.auth.user);
  const clinicName = user?.clinicName;

  // Check permissions using the new permission system
  // const canCreateChat = hasPermission(user, 'create_chat');
  // const canDeleteChat = hasPermission(user, 'delete_chat');
  // const canViewAdminChats = hasPermission(user, 'view_admin_chats');

  const userRole = user?.roleName;
  const isMainDoctor = userRole === 'main_doctor';

  // Delete chat mutation
  const deleteChatMutation = useMutation({
    mutationFn: async (chatId: string) => {
      const response = await fetch(`/api/chats/${chatId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete chat');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chats'] });
      toast({ title: "Chat deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: error.message, variant: "destructive" });
    }
  });

  // Fetch team members
  const { data: teamMembers = [] } = useQuery({
    queryKey: ['/api/team-members'],
    queryFn: async () => {
      const response = await fetch('/api/team-members');
      if (!response.ok) throw new Error('Failed to fetch team members');
      return response.json();
    },
    // enabled: canCreateChat,
  });

  // Fetch chats from API
  const { data: chats = [], isLoading, error } = useQuery({
    queryKey: ['/api/chats', user?.fullName],
    queryFn: async () => {
      const url = user?.fullName 
        ? `/api/chats?userId=${encodeURIComponent(user.fullName)}`
        : '/api/chats';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch chats');
      return response.json();
    },
    enabled: !!user?.fullName
  });

  // Fetch orders for creating order-specific chats
  const { data: orders = [] } = useQuery({
    queryKey: ['/api/orders'],
    queryFn: async () => {
      const response = await fetch('/api/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json();
    }
  });

  // Create new chat mutation
  const createChatMutation = useMutation({
    mutationFn: async (chatData: any) => {
      if (!clinicName) {
        console.error('No clinic name found in Redux user data', user);
        throw new Error('No clinic name found in user data');
      }
      // 1. Fetch clinicId using clinicName
      const clinicRes = await fetch(`/api/clinics/name/${encodeURIComponent(clinicName)}`);
      if (!clinicRes.ok) throw new Error('Could not find clinicId for this clinic');
      const { id: clinicId } = await clinicRes.json();

      // 2. Remove id from chatData if present (do not send id)
      const { id, ...chatDataWithoutId } = chatData;
      const chatPayload = { ...chatDataWithoutId, clinicId };
      delete chatPayload.id;

      // 3. Create the chat
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chatPayload)
      });
      if (!response.ok) throw new Error('Failed to create chat');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chats'] });
      setNewChatModal(false);
      setNewChatTitle('');
      setSelectedOrder('');
      toast({ title: "Chat created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create chat", variant: "destructive" });
    }
  });

  const handleCreateChat = () => {
    if (!isMainDoctor) {
      toast({ title: "Only main doctors can create new chats", variant: "destructive" });
      return;
    }
    if (!newChatTitle) {
      toast({ title: "Please enter a chat title", variant: "destructive" });
      return;
    }
    if (!selectedOrder) {
      toast({ title: "Please select an order", variant: "destructive" });
      return;
    }
    const currentUser = user?.fullName || 'Dr. Sarah Mitchell';
    const userRole = user?.roleName || 'main_doctor';
    // Only add the main_doctor as a participant
    const participants = [currentUser];
    const chatData = {
      type: newChatType,
      title: newChatTitle,
      orderId: selectedOrder,
      participants,
      createdBy: currentUser,
      userRole: userRole,
      roleName: userRole, // Send roleName for backend validation
    };
    createChatMutation.mutate(chatData);
  };

  // Filter chats based on active tab and search
  const filteredChats = React.useMemo(() => {
    if (!Array.isArray(chats) || chats.length === 0) return [];
    let filtered = chats;
    
    // Check if user has chat permission
    const hasChatPermission = hasPermission(user, 'chat');
    
    // If user doesn't have chat permission, only show chats where they are participants
    if (!hasChatPermission) {
      const userFullName = user?.fullName?.toLowerCase() || '';
      filtered = chats.filter((chat: ChatItem) =>
        chat.participants.some(
          (participant) => participant.trim().toLowerCase() === userFullName.trim().toLowerCase()
        )
      );
    } else {
      // For users with chat permission, show all chats but apply role-based filtering for specific roles
      if (userRole === 'admin_doctor' || userRole === 'assistant_doctor' || userRole === 'receptionist') {
        const userFullName = user?.fullName?.toLowerCase() || '';
        filtered = chats.filter((chat: ChatItem) =>
          chat.participants.some(
            (participant) => participant.trim().toLowerCase() === userFullName.trim().toLowerCase()
          )
        );
      }
      // For main_doctor and other roles with chat permission, show all chats
    }
    
    filtered = filtered.filter((chat: ChatItem) => {
      const matchesSearch = chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.participants.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
      switch (activeTab) {
        case 'master':
          return chat.type === 'master' && chat.isActive && matchesSearch;
        case 'order':
          return chat.type === 'order' && chat.isActive && matchesSearch;
        case 'archived':
          return !chat.isActive && matchesSearch;
        default:
          return chat.isActive && matchesSearch;
      }
    });
    return filtered.sort((a: ChatItem, b: ChatItem) => {
      if (a.type === 'master' && b.type !== 'master') return -1;
      if (b.type === 'master' && a.type !== 'master') return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [chats, activeTab, searchQuery, user]);

  // Calculate unread group count
  const unreadGroupCount = filteredChats.filter((chat: ChatItem) => chat.unreadCount && chat.unreadCount > 0).length;

  const selectedChatItem = chats.find((item: ChatItem) => item.id === selectedChat);

  const getChatIcon = (type: string) => {
    switch (type) {
      case 'master':
        return <Shield className="h-4 w-4" />;
      case 'order':
        return <Package className="h-4 w-4" />;
      case 'support':
        return <HeadphonesIcon className="h-4 w-4" />;
      case 'internal':
        return <Users className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getChatBadgeColor = (type: string) => {
    switch (type) {
      case 'master':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'order':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'support':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'internal':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  useEffect(() => {
    const handleUnreadCountUpdate = (data: { chatId: string; unreadCount: number }) => {
      queryClient.invalidateQueries({ queryKey: ['/api/chats', user?.fullName] });
    };
    onUnreadCountUpdate(handleUnreadCountUpdate);
    return () => {
      offUnreadCountUpdate(handleUnreadCountUpdate);
    };
  }, [onUnreadCountUpdate, offUnreadCountUpdate, queryClient, user?.fullName]);

  // Listen for real-time participant updates
  useEffect(() => {
    const socketInstance = getSocket();
    if (socketInstance && socketInstance.on) {
      const handleParticipantsUpdated = (data: { 
        chatId: string; 
        participants: string[]; 
        newParticipants: string[];
        removedParticipants: string[];
        updatedBy: string 
      }) => {
        queryClient.invalidateQueries({ queryKey: ['/api/chats', user?.fullName] });
        queryClient.invalidateQueries({ queryKey: ['/api/chats', data.chatId] });

        // If the currently open chat is the one updated, check if user is still a participant
        if (selectedChat === data.chatId && user) {
          const userFullName = user.fullName || '';
          const isParticipant = data.participants.some(
            (participant: string) =>
              participant.toLowerCase() === userFullName.toLowerCase() ||
              participant.toLowerCase().includes(userFullName.toLowerCase()) ||
              userFullName.toLowerCase().includes(participant.toLowerCase())
          );
          // Only close the chat if the user is actually removed from the group and is not a main doctor
          if (!isParticipant) {
            setSelectedChat(null);
            // Force refetch of chats to update sidebar and unread counts
            queryClient.invalidateQueries({ queryKey: ['/api/chats', user?.fullName] });
            toast({
              title: "Removed from group",
              description: "You have been removed from this group and can no longer access it.",
              variant: "destructive"
            });
          } else {
            // If user is still a participant or is a main doctor, do not close the chat
            // Optionally, you can show a toast if participants were updated
            // toast({ title: "Group participants updated" });
          }
        }
      };
      
      socketInstance.on('participants-updated', handleParticipantsUpdated);
      
      return () => {
        socketInstance.off('participants-updated', handleParticipantsUpdated);
      };
    }
  }, [getSocket, queryClient, toast, user, selectedChat]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground">Communicate with your team and discuss orders</p>
          {user && (
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                Logged in as: {user.fullName}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {user.roleName}
              </Badge>
              {user.clinicName && (
                <Badge variant="outline" className="text-xs">
                  {user.clinicName}
                </Badge>
              )}
            </div>
          )}
        </div>
        <Dialog open={newChatModal} onOpenChange={setNewChatModal}>
          {
            isMainDoctor && (
               <DialogTrigger asChild>
            <Button className="btn-primary" disabled={!isMainDoctor}>
              <Plus className="mr-2" size={16} />
              New Chat
            </Button>
          </DialogTrigger>
            )
          }
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Chat</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="chatType">Chat Type</Label>
                <Select value={newChatType} onValueChange={(value) => setNewChatType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="order">Order Chat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="chatTitle">Chat Title</Label>
                <Input
                  id="chatTitle"
                  value={newChatTitle}
                  onChange={(e) => setNewChatTitle(e.target.value)}
                  placeholder="Enter chat title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="orderSelect">Select Order</Label>
                <Select value={selectedOrder} onValueChange={setSelectedOrder}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an order" />
                  </SelectTrigger>
                  <SelectContent>
                    {orders.map((order: any) => (
                      <SelectItem key={order.id} value={order.id.toString()}>
                        {/* ORD-{order.id.toString().padStart(4, '0')} - */}
                         {order.orderId || order.referenceId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleCreateChat}
                  disabled={createChatMutation.isPending}
                  className="flex-1"
                >
                  {createChatMutation.isPending ? 'Creating...' : 'Create Chat'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setNewChatModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Chat Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Chats</TabsTrigger>
          <TabsTrigger value="master">Master</TabsTrigger>
          <TabsTrigger value="order">Orders</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="h-[calc(100vh-200px)] flex flex-col md:flex-row bg-background rounded-lg overflow-hidden border border-border min-h-[400px]">
        {/* Left Sidebar - Chat List */}
        <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-border flex flex-col bg-card min-h-[200px] max-h-[50vh] md:max-h-none md:min-h-0">
          {/* Header */}
          <div className="flex-shrink-0 p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Conversations</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-md">
                    <MoreVertical size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setActiveTab('archived')}>
                    <Archive className="mr-2 h-4 w-4" />
                    View Archived Chats
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Chat Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-md"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Loading chats...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <p className="text-sm text-destructive">Failed to load chats</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/chats'] })}
                    className="mt-2"
                  >
                    Retry
                  </Button>
                </div>
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {activeTab === 'all' ? 'No chats found' : `No ${activeTab} chats found`}
                  </p>
                  {activeTab === 'all' && (
                    <div className="text-xs text-muted-foreground mt-2 space-y-1">
                      <p>No chats found. Create a new chat to get started.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredChats.map((chat: ChatItem) => (
                  <div
                    key={chat.id}
                    className={`group p-4 border-b border-border cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedChat === chat.id ? 'bg-muted border-l-4 border-l-primary' : ''
                    }`}
                    onClick={() => setSelectedChat(chat.id)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className="mt-1 p-2 bg-primary/10 rounded-full">
                        {getChatIcon(chat.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-foreground truncate text-sm">
                            {chat.title}
                          </h3>
                          <Badge className={`text-xs ${getChatBadgeColor(chat.type)}`}>
                            {chat.type}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{chat.title}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-2">
                              {chat.unreadCount && chat.unreadCount > 0 ? (
                                <Badge
                                  style={{ backgroundColor: '#00A3C8' }}
                                  className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs text-white border-0"
                                >
                                  {chat.unreadCount}
                                </Badge>
                              ):null}
                              {/* Delete button for order chats */}
                              {chat.type === 'order' && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteChatMutation.mutate(chat.id);
                                  }}
                                  disabled={deleteChatMutation.isPending}
                                  className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Chat Area */}
        <div className="flex-1 flex flex-col min-h-[300px] max-h-[60vh] md:max-h-none md:min-h-0 w-full">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="flex-shrink-0 p-4 border-b border-border bg-card">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    {selectedChatItem?.type === 'master' ? (
                      <Users className="h-5 w-5 text-primary" />
                    ) : (
                      <Package className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">
                      {selectedChatItem?.type === 'master' 
                        ? 'Master Chat' 
                        : selectedChatItem?.title.split('--')[0]
                      }
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedChatItem?.type === 'master' 
                        ? 'Team Communication' 
                        : selectedChatItem?.title.split('--').slice(1).join(' - ')
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Module */}
              <div className="flex-1 min-h-0">
                <ChatModule 
                  chatId={selectedChat ? selectedChat : null}
                  onClose={() => setSelectedChat(null)}
                  userData={user}
                  isAuthenticated={user ? true : false}
                />
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Select a conversation
                </h3>
                <p className="text-muted-foreground">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatContent;