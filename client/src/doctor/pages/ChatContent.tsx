import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Users, Package, Search, MoreVertical, Plus, HeadphonesIcon, UserPlus, Shield, Archive, Settings, Bell, BellOff, MessageCircle, X, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useAppSelector, useAppDispatch, hasPermission } from '@/store/hooks';
import { useGetChatsQuery, useCreateChatMutation, useDeleteChatMutation } from '@/store/slices/chatApi';
import { setSelectedChatId } from '@/store/slices/chatslice';
import ChatModule from '../../components/chat/ChatModule';
import { useGetOrderByIdQuery, useGetOrdersQuery } from '@/store/slices/orderApi';
import { useSocket } from '@/contexts/SocketContext';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [newChatModal, setNewChatModal] = useState(false);
  const [newChatType, setNewChatType] = useState<string>('order');
  const [newChatTitle, setNewChatTitle] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<string>('');
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.userData.userData);
  const { data: chats = [] , isLoading, error, refetch } = useGetChatsQuery({ clinicId: user?.clinicId, userId: user?.fullName });
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const { toast } = useToast();
  const [createChat, { isLoading: isCreating, isSuccess: isCreateSuccess }] = useCreateChatMutation();
  const [deleteChat, { isLoading: isDeleting }] = useDeleteChatMutation();
  const {getSocket} = useSocket();
  
  // Get user data from Redux
  const userRole = user?.roleName;
  const isMainDoctor = userRole === 'main_doctor';

  // Add at the top of the component (inside ChatContent)
  const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('token');
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  };


  // Fetch orders for creating order-specific chats
  // const { data: orders = [] } = useGetOrdersQuery();
  const { data: orders = [] } = useGetOrderByIdQuery(
    user?.clinicId ?? ""
  );

  console.log(orders ,"orders data")

  // Create new chat mutation
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
      clinicId: user?.clinicId,
      type: newChatType,
      title: newChatTitle,
      orderId: selectedOrder,
      participants,
      createdBy: currentUser,
      userRole: userRole,
      roleName: userRole, // Send roleName for backend validation
    };
    createChat(chatData);
  };

  // Close modal on successful chat creation
  React.useEffect(() => {
    if (isCreateSuccess) {
      setNewChatModal(false);
      setNewChatTitle('');
      setSelectedOrder('');
    }
  }, [isCreateSuccess]);

  // Filter chats based on active tab and search
  const filteredChats = React.useMemo(() => {
    if (!Array.isArray(chats) || chats.length === 0) return [];
    let filtered = chats;
    
    // Check if user has chat permission
    const hasChatPermission = hasPermission(user, 'chat');
    
    // If user doesn't have chat permission, only show chats where they are participants
    if (!hasChatPermission) {
      const userId = user?.fullName?.toLowerCase() || '';
      filtered = chats.filter((chat: ChatItem) =>
        chat.participants.some(
          (participant) => participant.trim().toLowerCase() === userId.trim().toLowerCase()
        )
      );
    } else {
      // For users with chat permission, show all chats but apply role-based filtering for specific roles
      if (userRole === 'admin_doctor' || userRole === 'assistant_doctor' || userRole === 'receptionist') {
        const userId = user?.fullName?.toLowerCase() || '';
        filtered = chats.filter((chat: ChatItem) =>
          chat.participants.some(
            (participant) => participant.trim().toLowerCase() === userId.trim().toLowerCase()
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
      // No need to invalidate queries here, as useGetChatsQuery will refetch on chat update
    };
    // onUnreadCountUpdate(handleUnreadCountUpdate); // Removed as per edit hint
    return () => {
      // offUnreadCountUpdate(handleUnreadCountUpdate); // Removed as per edit hint
    };
  }, [user]); // Removed onUnreadCountUpdate, offUnreadCountUpdate, queryClient

  // Listen for real-time participant updates
  useEffect(() => {

    const socket = getSocket();
    if (!socket) return;

    const handleParticipantsUpdated = (data: { 
      chatId: string; 
      participants: string[]; 
      newParticipants: string[];
      removedParticipants: string[];
      updatedBy: string 
    }) => {
      refetch();
      // If the currently open chat is the one updated, check if user is still a participant
      if (selectedChat === data.chatId && user) {
        const userId = user.fullName || '';
        const isParticipant = data.participants.some(
          (participant: string) =>
            participant.toLowerCase() === userId.toLowerCase() ||
            participant.toLowerCase().includes(userId.toLowerCase()) ||
            userId.toLowerCase().includes(participant.toLowerCase())
        );
        // Only close the chat if the user is actually removed from the group and is not a main doctor
        if (!isParticipant) {
          setSelectedChat(null);
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
    
    socket.on('participants-updated', handleParticipantsUpdated);
    
    return () => {
      socket.off('participants-updated', handleParticipantsUpdated);
    };
  }, [getSocket, selectedChat, user, refetch, toast]);

  // Check if a chat already exists for a given orderId
  const orderHasChat = (orderId: string) => {
    return chats.some((chat: ChatItem) => chat.orderId?.toString() === orderId.toString());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* <div> */}
          {/* <h1 className="text-3xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground">Communicate with your team and discuss orders</p> */}
          {/* {user && (
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
          )} */}
        {/* </div> */}
        
      </div>

      {/* Chat Tabs */}
      <div className='flex gap-4'>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Chats</TabsTrigger>
          <TabsTrigger value="master">Master</TabsTrigger>
          <TabsTrigger value="order">Orders</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
      </Tabs>
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
                    {orders.map((order: any) => {
                      const disabled = orderHasChat(order.id);
                      return (
                        <SelectItem key={order.id} value={order.id.toString()} disabled={disabled}>
                          {/* ORD-{order.id.toString().padStart(4, '0')} - */}
                          {order.orderId || order.refId}
                          {disabled && ' (Chat Exists)'}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Show warning if selected order already has a chat */}
              {selectedOrder && orderHasChat(selectedOrder) && (
                <div className="text-destructive text-sm">A chat already exists for this order.</div>
              )}

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleCreateChat}
                  disabled={isCreating || (selectedOrder && orderHasChat(selectedOrder))}
                  className="flex-1"
                >
                  {isCreating ? 'Creating...' : 'Create Chat'}
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
                    onClick={() => refetch()} // Refetch using RTK Query
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
                                    deleteChat(chat.id);
                                  }}
                                  disabled={isDeleting}
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