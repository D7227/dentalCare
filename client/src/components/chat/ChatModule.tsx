import React, { useState, useEffect, useMemo, useLayoutEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, Settings, Check, CheckCheck, Clock, Users, Trash2, Archive, Plus, X, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/store/hooks';
import { useAppDispatch } from '@/store/hooks';
import { useGetChatQuery, useGetMessagesQuery, useSendMessageMutation, useUpdateParticipantsMutation, useArchiveChatMutation, useDeleteChatMutation, useMarkAllReadMutation, useGetChatsQuery } from '@/store/slices/chatApi';
import { setSelectedChatId } from '@/store/slices/chatslice';
import { useSocket } from '@/contexts/SocketContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useQuery } from '@tanstack/react-query';

interface ChatModuleProps {
  chatId?: string | null;
  onClose?: () => void;
  userData?: any;
  isAuthenticated?: boolean;
}

const ChatModule = ({ chatId, userData, onClose }: ChatModuleProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [showParticipants, setShowParticipants] = useState(false);
  const [newParticipant, setNewParticipant] = useState('');
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Force refresh trigger
  const [dropdownOpen, setDropdownOpen] = useState(false); // Track dropdown state
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const messagesContainerRef = React.useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const [messagesList, setMessagesList] = useState<any[]>([]);

  console.log('fullName', userData?.fullName);
  
  const { toast } = useToast();
  // Use useSocket context instead of Redux for socket
  const { joinChat, leaveChat, sendMessage: socketSendMessage, isConnected, getSocket, sendTyping } = useSocket();

  // Get user data from Redux
  const UserData = useAppSelector((state) => state.userData);
  const user = UserData.userData;

  // Check permissions using the new permission system

  // JWT token for all API calls
  const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('token');
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  };

  // Fetch chat details
  const { data: chatDetails } = useGetChatQuery(chatId ? String(chatId) : '');

  console.log(chatId , "chatIdchatIdchatIdchatIdchatId")
  // Fetch team members for participant selection
  const { data: teamMembers = [] } = useQuery({
    queryKey: ['/api/team-members', user?.clinicId],
    queryFn: async () => {
      const url = user?.clinicId 
        ? `/api/team-members/${user?.clinicId}`
        : '/api/team-members';
      const authHeaders = getAuthHeaders();
      const response = await fetch(url, {
        headers: authHeaders ? authHeaders : {},
      });
      if (!response.ok) throw new Error('Failed to fetch team members');
      const teamMembers = await response.json();
      return teamMembers;
    },
    enabled: !!user?.clinicName
  });

  // Fetch messages for the selected chat
  const { data: messages = [], isLoading, error: messagesError, refetch: refetchMessages } = useGetMessagesQuery(chatId ? String(chatId) : '');
  // Fetch chat list for refetching on new message
  
  const { refetch: refetchChats } = useGetChatsQuery({ clinicId: user?.clinicId, userId: user?.fullName });

  // Send message mutation
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

  // Delete chat mutation
  const [deleteChat, { isLoading: isDeleting }] = useDeleteChatMutation();

  // Archive chat mutation
  const [archiveChat, { isLoading: isArchiving }] = useArchiveChatMutation();

  // Update participants mutation
  const [updateParticipants, { isLoading: isUpdatingParticipants }] = useUpdateParticipantsMutation();

  // Mark all messages as read mutation
  const [markAllRead] = useMarkAllReadMutation();

  const isMainDoctor = user?.roleName === 'main_doctor';

  const addParticipant = () => {
    if (!isMainDoctor) {
      toast({ title: "Only main doctors can add participants", variant: "destructive" });
      return;
    }
    if (!newParticipant.trim()) return;
    
    const currentParticipants = chatDetails?.participants || [];
    if (currentParticipants.includes(newParticipant.trim())) {
      toast({ title: "Participant already exists", variant: "destructive" });
      return;
    }
    
    const updatedParticipants = [...currentParticipants, newParticipant.trim()];
    
    updateParticipants({
      chatId: chatId,
      participants: updatedParticipants,
      updatedBy: userData?.fullName || 'Unknown',
    });
    setNewParticipant(''); // Clear the selection after adding
    setRefreshTrigger(prev => prev + 1); // Force refresh
  };

  // Filter team members so only members from the main_doctor's clinic are available
 
  const availableTeamMembers = teamMembers.filter((member: any) => {
    const isAlreadyParticipant = chatDetails?.participants?.includes(member.fullName);
    const isCurrentUser = member.fullName === userData?.fullName;
    return !isAlreadyParticipant && !isCurrentUser;
  });


  const removeParticipant = (participantToRemove: string) => {
    if (!isMainDoctor) {
      toast({ title: "Only main doctors can remove participants", variant: "destructive" });
      return;
    }
    const currentParticipants = chatDetails?.participants || [];
    const updatedParticipants = currentParticipants.filter((p: string) => p !== participantToRemove);
    updateParticipants({
      chatId: chatId,
      participants: updatedParticipants,
      updatedBy: userData?.fullName || 'Unknown',
    });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chatId || !chatDetails?.id) {
      return;
    }

    // Use authenticated user data from Redux
    const currentUser = user?.fullName || `${user?.firstname} ${user?.lastname}`;
    const userRole = user?.roleName || 'main_doctor';
    const userType = user?.roleName === 'main_doctor' ? 'clinic' : 'team';

    const messageData = {
      sender: currentUser,
      senderRole: userRole,
      senderType: userType,
      content: newMessage,
      messageType: 'text',
      attachments: [],
      status: 'sent',
      readBy: [],
    };


    // Send message via Socket.IO for real-time delivery
    if (isConnected) {
      socketSendMessage(chatDetails.id, messageData);
      setNewMessage('');
      // Scroll to bottom immediately after sending
      setTimeout(() => {
        scrollToBottom("smooth");
        refetchMessages();
      }, 100);
      toast({ title: "Message sent" });
    } else {
      await sendMessage(messageData);
      setNewMessage('');
      setTimeout(() => {
        scrollToBottom("smooth");
        refetchMessages();
      }, 100);
    }
  };


  // Join/leave chat room when chat changes
  useEffect(() => {
    if (chatDetails?.id && isConnected && user?.fullName) {
      joinChat(chatDetails.id, user.fullName);

      if (typeof markAllRead === 'function' && userData?.fullName && chatDetails?.id && String(chatDetails.id)) {
        markAllRead({ chatId: String(chatDetails.id), userId: userData.fullName });
      }
      
      return () => {
        leaveChat(chatDetails.id, user.fullName);
      };
    }
  }, [chatDetails?.id, isConnected, joinChat, leaveChat, user?.fullName, markAllRead]);

  // Keep messagesList in sync with fetched messages (on chat change or initial load)
  useEffect(() => {
    setMessagesList(messages);
  }, [messages, chatId]);

  // Listen for real-time messages
  useEffect(() => {
    const socketInstance = getSocket();
    if (socketInstance && chatDetails?.id) {
      const handleNewMessage = (data: { chatId: string, message: any }) => {
        if (data.chatId === chatDetails.id) {
          setMessagesList((prev) => [...prev, data.message]);
          // Use setTimeout to ensure DOM is updated before scrolling
          setTimeout(() => {
            scrollToBottom("smooth");
          }, 50);
          // Mark messages as read since the user is actively viewing the chat
          if (userData?.fullName) {
            markAllRead({ chatId: chatDetails.id, userId: userData.fullName });
          }
          // Refetch messages and chats to update all data in real time
          refetchMessages();
          console.log("this time call refatch");
          refetchChats();
        }
      };

      const handleMessageError = (error: any) => {
        console.error('Message error:', error);
        toast({ title: "Failed to send message", variant: "destructive" });
      };

      const handleUserTyping = (data: { chatId: string; user: string; isTyping: boolean }) => {
        if (data.chatId === chatDetails.id) {
          setTypingUsers(prev => {
            if (data.isTyping) {
              return prev.includes(data.user) ? prev : [...prev, data.user];
            } else {
              return prev.filter(user => user !== data.user);
            }
          });
        }
      };

      const handleParticipantsUpdated = (data: { 
        chatId: string; 
        participants: string[]; 
        newParticipants: string[];
        removedParticipants: string[];
        updatedBy: string 
      }) => {
        if (data.chatId === chatDetails.id) {          
          // Update the cache immediately with new data
          // No need to invalidate queries here, RTK Query handles refetching
          
          // Force refetch
          // No need to refetch here, RTK Query handles refetching
          
          // Show notification if someone else updated participants
          if (data.updatedBy !== userData?.fullName) {
            let message = `${data.updatedBy} updated the group participants`;
            
            if (data.newParticipants.length > 0) {
              message = `${data.updatedBy} added ${data.newParticipants.join(', ')} to the group`;
            } else if (data.removedParticipants.length > 0) {
              message = `${data.updatedBy} removed ${data.removedParticipants.join(', ')} from the group`;
            }
            
            toast({ 
              title: "Participants updated", 
              description: message
            });
          }
        }
      };

      socketInstance.on('new-message', handleNewMessage);
      socketInstance.on('message-error', handleMessageError);
      socketInstance.on('user-typing', handleUserTyping);
      socketInstance.on('participants-updated', handleParticipantsUpdated);

      return () => {
        socketInstance.off('new-message', handleNewMessage);
        socketInstance.off('message-error', handleMessageError);
        socketInstance.off('user-typing', handleUserTyping);
        socketInstance.off('participants-updated', handleParticipantsUpdated);
      };
    }
  }, [getSocket, chatDetails?.id, userData?.fullName, markAllRead, toast, chatDetails, refetchMessages, refetchChats]);

  // Listen for unread-count-update socket events
  // React.useEffect(() => {
  //   if (!getSocket) return;
  //   const socketInstance = getSocket();
  //   if (!socketInstance) return;
  //   socketInstance.on('unread-count-update', handleUnreadUpdate);
  //   return () => {
  //     socketInstance.off('unread-count-update', handleUnreadUpdate);
  //   };
  // }, [getSocket, dispatch]);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = (behavior: ScrollBehavior = "auto") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
    // Also scroll the container to bottom as backup
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // Handle scroll events to show/hide scroll button
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  // When chatId or messagesList changes, scroll instantly (no animation)
  useLayoutEffect(() => {
    scrollToBottom("auto");
  }, [chatId, messagesList]);

  // When new messages arrive in the same chat, scroll smoothly
  useEffect(() => {
    if (messagesList.length > 0) {
      scrollToBottom("smooth");
    }
  }, [messagesList]);

  // Force scroll to bottom when component mounts or messages change
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom("auto");
    }, 100);
    return () => clearTimeout(timer);
  }, [messagesList, chatId]);

  // Reset selected participant when chat details change
  useEffect(() => {
    setNewParticipant('');
  }, [chatDetails?.participants]);

  // Force refresh when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger > 0) {
      // The refreshTrigger will cause the component to re-render
      // and recalculate availableTeamMembers
    }
  }, [refreshTrigger]);

  if (!chatId) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Select a chat to start messaging</p>
      </div>
    );
  }

  // Restrict access if user is not a participant
  const isParticipant = chatDetails?.participants?.includes(userData?.fullName);
  // const isMainDoctor = user?.roleName === 'main_doctor';
  if (chatDetails && !isParticipant && !isMainDoctor) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-destructive/10 border border-destructive/20 rounded p-6 text-center">
          <p className="text-destructive font-semibold text-lg mb-2">Access Denied</p>
          <p className="text-destructive text-sm">You are not a participant in this chat and cannot view or send messages.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-card rounded-lg border border-border overflow-hidden">
      {/* Chat Header */}
      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-blue-500">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-foreground">
                {chatDetails?.title || 'Loading...'}
              </h3>
              {chatDetails?.orderId && (
                <Badge variant="outline" className="text-xs mt-1">
                  Order ID: {chatDetails.orderId}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs"
                >
                  <Settings size={14} className="mr-1" />
                  Options
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                
                  <DropdownMenuItem onClick={() => setShowParticipants(!showParticipants)}>
                    <Users className="mr-2 h-4 w-4" />
                    Manage Participants
                  </DropdownMenuItem>
                
                
                  <>
                    <DropdownMenuItem 
                      onClick={async () => {
                        await archiveChat(chatDetails?.id ? String(chatDetails.id) : chatId);
                        if (typeof onClose === 'function') onClose();
                        if (typeof refetchChats === 'function') refetchChats();
                      }}
                      disabled={isArchiving}
                    >
                      <Archive className="mr-2 h-4 w-4" />
                      Archive Chat
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => deleteChat({ chatId: chatDetails?.id ? String(chatDetails.id) : '' })}
                      // disabled={deleteChatMutation.isPending || chatDetails?.orderId}
                      disabled={isDeleting}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Chat
                    </DropdownMenuItem>
                  </>
                
                {/* {!canManageChat && !canViewParticipants && (
                  <DropdownMenuItem disabled>
                    <Settings className="mr-2 h-4 w-4" />
                    Admin access required
                  </DropdownMenuItem>
                )} */}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Participants Management Panel */}
        {
          showParticipants && (
            <div className="mt-4 p-4 bg-muted/30 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-foreground">Chat Participants</h4>
              <Badge variant="secondary" className="text-xs">
                {chatDetails?.participants?.length || 0} members
              </Badge>
            </div>
            
            {/* Current User Note */}
            {/* {isAuthenticated && userData && (
              <div className="mb-3 p-2 bg-primary/10 rounded border border-primary/20">
                <p className="text-xs text-primary">
                  <strong>You ({userData.fullName})</strong> are already a participant in this chat.
                </p>
              </div>
            )} */}
            
            {/* Add Participant Section - Only for admin_doctor */}
            {isMainDoctor && (
              <div className="mb-4 p-3 bg-background rounded border">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium text-foreground">Add Team Member</h5>
                  <Badge variant="outline" className="text-xs">
                    {availableTeamMembers.length} available
                  </Badge>
                </div>
                {availableTeamMembers.length > 0 ? (
                  <div className="flex gap-2">
                    <Select value={newParticipant} onValueChange={setNewParticipant}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select team member to add..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTeamMembers.map((member: any) => (
                          <SelectItem key={member.id} value={member.fullName}>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {member.role}
                              </Badge>
                              {member.fullName}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      size="sm" 
                      onClick={addParticipant}
                      disabled={!newParticipant.trim() || isUpdatingParticipants}
                      style={{ backgroundColor: '#00A3C8' }}
                      className="text-white hover:opacity-90"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <p className="text-sm text-muted-foreground">
                      All team members are already in this group
                    </p>
                  </div>
                )}
              </div>
            )}
            {!isMainDoctor && (
              <div className="mb-4 p-3 bg-background rounded border text-center">
                <Badge variant="secondary" className="text-xs">Admin Only: Only main doctors can add participants</Badge>
              </div>
            )}

            {/* Participants List */}
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {chatDetails?.participants?.map((participant: string, index: number) => {
                const isCurrentUser = participant === userData?.fullName;
                return (
                  <div key={index} className="flex items-center justify-between p-2 bg-background rounded border">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#00A3C8' }}>
                        <span className="text-xs font-medium text-white">
                          {participant.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {participant}
                        {isCurrentUser && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            You
                          </Badge>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {participant.includes('Dr.') ? 'Doctor' : participant.includes('Lab') ? 'Lab' : 'Team'}
                      </Badge>
                      {!isCurrentUser && isMainDoctor && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeParticipant(participant)}
                          disabled={isUpdatingParticipants}
                          className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                      {isCurrentUser && (
                        <Badge variant="secondary" className="text-xs">
                          Cannot Remove
                        </Badge>
                      )}
                      {!isCurrentUser && !isMainDoctor && (
                        <Badge variant="secondary" className="text-xs">
                          Admin Only
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              }) || (
                <p className="text-sm text-muted-foreground">No participants found</p>
              )}
            </div>
            
            {isUpdatingParticipants && (
              <div className="mt-3 text-sm text-muted-foreground">
                Updating participants...
              </div>
            )}
          </div>
          )
        }
          
        

        {/* Access Denied Message */}
        
          {/* <div className="mt-4 p-4 bg-muted/30 border-b border-border">
            <div className="p-3 bg-destructive/10 rounded border border-destructive/20">
              <p className="text-sm text-destructive">
                <strong>Access Restricted:</strong> You can only view participants in groups created by admin doctors.
                {chatDetails?.createdBy && chatDetails.createdBy !== 'admin_doctor' && (
                  <span> This group was created by {chatDetails.createdBy}.</span>
                )}
              </p>
            </div>
          </div> */}
        

      </div>

      {/* Messages Area - Scrollable */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 relative" ref={messagesContainerRef} onScroll={handleScroll}>
        
        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading messages...</div>
        ) : messagesError ? (
          <div className="text-center text-destructive">
            <p>Error loading messages: {typeof messagesError === 'string' ? messagesError : (messagesError && 'status' in messagesError && messagesError.status ? `Status ${messagesError.status}` : 'Unknown error')}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {}} // No-op or refetch if available
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        ) : messagesList.length === 0 ? (
          <div className="text-center text-muted-foreground">No messages yet. Start the conversation!</div>
        ) : (
          messagesList.map((message: any) => (
            <div key={message.id} className="space-y-2">
              <div className={`flex ${message.sender === userData?.fullName ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === userData?.fullName 
                    ? 'text-white' 
                    : 'bg-muted text-foreground'
                }`}
                style={message.sender === userData?.fullName ? { backgroundColor: '#00A3C8' } : {}}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium">
                      {message.sender}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {message.senderRole.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm">{message.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs opacity-70">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        {/* Scroll target for auto-scroll */}
        <div ref={messagesEndRef} style={{ height: '1px' }} />
        
        {/* Scroll to bottom button */}
        {/* {showScrollButton && (
          <Button
            size="sm"
            onClick={scrollToBottom}
            className="absolute bottom-4 right-4 rounded-full w-10 h-10 p-0 shadow-lg"
            style={{ backgroundColor: '#00A3C8' }}
          >
            <ChevronDown className="h-4 w-4 text-white" />
          </Button>
        )} */}
      </div>

      {/* Message Input - Fixed at bottom */}
      <div className="flex-shrink-0 p-4 border-t border-border">
        {/* Typing Indicators */}
        {typingUsers.length > 0 && (
          <div className="mb-2 text-xs text-muted-foreground italic">
            {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </div>
        )}
        
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              // Send typing indicator
              if (chatDetails?.id && userData?.fullName) {
                sendTyping(chatDetails.id, userData.fullName, e.target.value.length > 0);
              }
            }}
            placeholder="Type your message..."
            className="flex-1 min-h-[80px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            onBlur={() => {
              // Stop typing indicator when input loses focus
              if (chatDetails?.id && userData?.fullName) {
                sendTyping(chatDetails.id, userData.fullName, false);
              }
            }}
          />
          <div className="flex flex-col gap-2">
            <Button
              onClick={() =>  handleSendMessage()}
              disabled={!newMessage.trim() || isSending}
              className="px-3"
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-muted-foreground">
            Press Enter to send, Shift+Enter for new line
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatModule;