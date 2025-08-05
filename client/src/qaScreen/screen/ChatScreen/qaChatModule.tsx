import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, Settings, Users, Trash2, Archive, Plus, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ChatModuleProps {
  chatId?: string | null;
  onClose?: () => void;
  userData?: any;
  isAuthenticated?: boolean;
}

const MOCK_TEAM_MEMBERS = [
  { id: '1', fullName: 'Dr. Alice Smith', role: 'main_doctor' },
  { id: '2', fullName: 'John Doe', role: 'assistant_doctor' },
  { id: '3', fullName: 'Jane Miller', role: 'receptionist' },
];

const MOCK_CHAT_DETAILS = {
  id: 'chat1',
  title: 'Order #1234',
  orderId: 'ORD-1234',
  participants: ['Dr. Alice Smith', 'John Doe'],
};

const MOCK_MESSAGES = [
  {
    id: 'msg1',
    sender: 'Dr. Alice Smith',
    senderRole: 'main_doctor',
    content: 'Hello, please review the order details.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'msg2',
    sender: 'John Doe',
    senderRole: 'assistant_doctor',
    content: 'Sure, I will check and update.',
    createdAt: new Date().toISOString(),
  },
];

const QaChatModule = ({ chatId, userData, onClose }: ChatModuleProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [showParticipants, setShowParticipants] = useState(false);
  const [newParticipant, setNewParticipant] = useState('');
  const [messagesList, setMessagesList] = useState(MOCK_MESSAGES);
  const [participants, setParticipants] = useState(MOCK_CHAT_DETAILS.participants);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const user = userData || { fullName: 'Dr. Alice Smith', roleName: 'main_doctor' };
  const isMainDoctor = user.roleName === 'main_doctor';

  // Filter team members so only members not already in participants
  const availableTeamMembers = MOCK_TEAM_MEMBERS.filter(
    (member) => !participants.includes(member.fullName) && member.fullName !== user.fullName
  );

  const addParticipant = () => {
    if (!isMainDoctor) return;
    if (!newParticipant.trim()) return;
    if (participants.includes(newParticipant.trim())) return;
    setParticipants((prev) => [...prev, newParticipant.trim()]);
    setNewParticipant('');
  };

  const removeParticipant = (participantToRemove: string) => {
    if (!isMainDoctor) return;
    setParticipants((prev) => prev.filter((p) => p !== participantToRemove));
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setMessagesList((prev) => [
      ...prev,
      {
        id: `msg${prev.length + 1}`,
        sender: user.fullName,
        senderRole: user.roleName,
        content: newMessage,
        createdAt: new Date().toISOString(),
      },
    ]);
    setNewMessage('');
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messagesList]);

  if (!chatId) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Select a chat to start messaging</p>
      </div>
    );
  }

  const isParticipant = participants.includes(user.fullName);
  if (!isParticipant && !isMainDoctor) {
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
    <div className="h-full flex flex-col bg-card rounded-lg border border-border">
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
                {MOCK_CHAT_DETAILS.title}
              </h3>
              {MOCK_CHAT_DETAILS.orderId && (
                <Badge variant="outline" className="text-xs mt-1">
                  Order ID: {MOCK_CHAT_DETAILS.orderId}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs">
                  <Settings size={14} className="mr-1" />
                  Options
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowParticipants(!showParticipants)}>
                  <Users className="mr-2 h-4 w-4" />
                  Manage Participants
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Archive className="mr-2 h-4 w-4" />
                  Archive Chat
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Chat
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {/* Participants Management Panel */}
        {showParticipants && (
          <div className="mt-4 p-4 bg-muted/30 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-foreground">Chat Participants</h4>
              <Badge variant="secondary" className="text-xs">
                {participants.length} members
              </Badge>
            </div>
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
                        {availableTeamMembers.map((member) => (
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
                      disabled={!newParticipant.trim()}
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
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {participants.map((participant, index) => {
                const isCurrentUser = participant === user.fullName;
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
              })}
            </div>
          </div>
        )}
      </div>
      {/* Messages Area */}
      <div className="flex-1 min-h-0 max-h-[50vh] overflow-y-auto p-4 space-y-4 relative" ref={messagesContainerRef}>
        {messagesList.length === 0 ? (
          <div className="text-center text-muted-foreground">No messages yet. Start the conversation!</div>
        ) : (
          messagesList.map((message) => (
            <div key={message.id} className="space-y-2">
              <div className={`flex ${message.sender === user.fullName ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === user.fullName 
                    ? 'text-white' 
                    : 'bg-muted text-foreground'
                }`}
                style={message.sender === user.fullName ? { backgroundColor: '#00A3C8' } : {}}>
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
        <div />
      </div>
      {/* Message Input */}
      <div className="flex-shrink-0 p-4 border-t border-border">
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 min-h-[80px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
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

export default QaChatModule;
