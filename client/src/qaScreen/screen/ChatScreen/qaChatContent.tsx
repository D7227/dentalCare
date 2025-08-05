import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Users, Package, Search, MoreVertical, Plus, Archive, Settings, MessageCircle, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import QaChatModule from './qaChatModule';
import { useGetChatsQuery } from '@/store/slices/chatApi';
import { useAppSelector } from '@/store/hooks';

// const MOCK_USER = { fullName: 'Dr. Alice Smith', roleName: 'main_doctor', clinicId: 'clinic1' };
const MOCK_ORDERS = [
  { id: 'order1', orderId: 'ORD-1234', refId: 'REF-001' },
  { id: 'order2', orderId: 'ORD-5678', refId: 'REF-002' },
];
const MOCK_CHATS = [
  {
    id: 'chat1',
    type: 'order',
    title: 'Order #1234',
    orderId: 'ORD-1234',
    participants: ['Dr. Alice Smith', 'John Doe'],
    isActive: true,
    updatedAt: new Date().toISOString(),
    unreadCount: 2,
  },
  {
    id: 'chat2',
    type: 'order',
    title: 'Order #5678',
    orderId: 'ORD-5678',
    participants: ['Dr. Alice Smith', 'Jane Miller'],
    isActive: true,
    updatedAt: new Date().toISOString(),
    unreadCount: 0,
  },
];

const QaChatContent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [newChatTitle, setNewChatTitle] = useState('');
  const [selectedOrder, setSelectedOrder] = useState('');
  // const [chats, setChats] = useState(MOCK_CHATS);
  const user = useAppSelector(state => state.userData.userData);
  const { data: chats = [] , isLoading, error, refetch } = useGetChatsQuery({ clinicId: user?.clinicId, userId: "qa dental" });
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  // const user = MOCK_USER;
  const orders = MOCK_ORDERS;
  const isMainDoctor = user?.roleName === 'main_doctor';

  // Filter chats based on active tab and search
  const filteredChats = useMemo(() => {
    let filtered = chats;
    filtered = filtered.filter((chat) => {
      const matchesSearch = chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.participants.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));
      switch (activeTab) {
        case 'order':
          return chat.type === 'order' && chat.isActive && matchesSearch;
        case 'archived':
          return !chat.isActive && matchesSearch;
        default:
          return chat.isActive && matchesSearch;
      }
    });
    return filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [chats, activeTab, searchQuery]);

  const selectedChatItem = chats.find((item) => item.id === selectedChat);

  const orderHasChat = (orderId: string) => {
    return chats.some((chat) => chat.orderId === orderId);
  };

  const handleCreateChat = () => {
    if (!isMainDoctor) return;
    if (!newChatTitle) return;
    if (!selectedOrder) return;
    if (orderHasChat(selectedOrder)) return;
    const newChat = {
      id: `chat${chats.length + 1}`,
      type: 'order',
      title: newChatTitle,
      orderId: selectedOrder,
      participants: [user.fullName],
      isActive: true,
      updatedAt: new Date().toISOString(),
      unreadCount: 0,
    };
    // setChats((prev) => [...prev, newChat]);
    setNewChatTitle('');
    setSelectedOrder('');
  };

  const handleDeleteChat = (chatId: string) => {
    // setChats((prev) => prev.filter((chat) => chat.id !== chatId));
    if (selectedChat === chatId) setSelectedChat(null);
  };

  return (
    <div className='flex-1 p-6' >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 max-w-full"></div>
      {/* Chat Tabs */}
      <div className='flex gap-4 mb-3'>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Chats</TabsTrigger>
            <TabsTrigger value="order">Orders</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="h-[calc(100vh-200px)] flex flex-col md:flex-row bg-background rounded-lg overflow-hidden border border-border min-h-[400px]">
        {/* Left Sidebar - Chat List */}
        <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-border flex flex-col bg-card min-h-[200px] max-h-[50vh] md:max-h-none md:min-h-0">
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
          <div className="flex-1 min-h-0 overflow-y-auto">
            {filteredChats.length === 0 ? (
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
                {filteredChats.map((chat:any) => (
                  <div
                    key={chat.id}
                    className={`group p-4 border-b border-border cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedChat === chat.id ? 'bg-muted border-l-4 border-l-primary' : ''
                    }`}
                    onClick={() => setSelectedChat(chat.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-2 bg-primary/10 rounded-full">
                        <Package className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-foreground truncate text-sm">
                            {chat.title}
                          </h3>
                          <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
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
                              {chat.type === 'order' && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteChat(chat.id);
                                  }}
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
              <div className="flex-shrink-0 p-4 border-b border-border bg-card">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">
                      {selectedChatItem?.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedChatItem?.orderId}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <QaChatModule 
                  chatId={selectedChat}
                  onClose={() => setSelectedChat(null)}
                  userData={user}
                  isAuthenticated={!!user}
                />
              </div>
            </>
          ) : (
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

export default QaChatContent;
