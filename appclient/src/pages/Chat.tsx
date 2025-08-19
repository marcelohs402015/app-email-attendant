import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTheme } from '../contexts/ThemeContext';
import { chatAPI } from '../services/api';
import { 
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  PlusIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon,
  SparklesIcon,
  UserIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';

const Chat: React.FC = () => {
  const { currentTheme } = useTheme();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Fetch chat sessions
  const { data: sessionsResponse, isLoading: sessionsLoading } = useQuery({
    queryKey: ['chat-sessions'],
    queryFn: () => chatAPI.getSessions(),
  });

  // Fetch selected session details
  const { data: sessionResponse, isLoading: sessionLoading } = useQuery({
    queryKey: ['chat-session', selectedSessionId],
    queryFn: () => selectedSessionId ? chatAPI.getSession(selectedSessionId) : null,
    enabled: !!selectedSessionId,
  });

  // Create new session mutation
  const createSessionMutation = useMutation({
    mutationFn: () => chatAPI.createSession(),
    onSuccess: (response) => {
      if (response.success && response.data) {
        queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
        setSelectedSessionId(response.data.id);
      }
    }
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: ({ sessionId, message }: { sessionId: string; message: string }) => 
      chatAPI.sendMessage(sessionId, message),
    onMutate: () => {
      setIsTyping(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-session', selectedSessionId] });
      queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
      setInputMessage('');
    },
    onSettled: () => {
      setIsTyping(false);
    }
  });

  const sessions = sessionsResponse?.data || [];
  const currentSession = sessionResponse?.data;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !selectedSessionId || sendMessageMutation.isPending) return;

    sendMessageMutation.mutate({
      sessionId: selectedSessionId,
      message: inputMessage.trim()
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    createSessionMutation.mutate();
  };

  const getMessageIcon = (type: 'user' | 'assistant' | 'system') => {
    switch (type) {
      case 'user':
        return <UserIcon className="h-5 w-5" />;
      case 'assistant':
        return <SparklesIcon className="h-5 w-5" />;
      default:
        return <ComputerDesktopIcon className="h-5 w-5" />;
    }
  };

  const getSessionStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <ClockIcon className="h-4 w-4 text-green-500" />;
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4 text-blue-500" />;
      case 'archived':
        return <XMarkIcon className="h-4 w-4 text-gray-500" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatMessageTime = (timestamp: string) => {
    try {
      return format(parseISO(timestamp), 'HH:mm', { locale: enUS });
    } catch {
      return '';
    }
  };

  const formatSessionTime = (timestamp: string) => {
    try {
      return format(parseISO(timestamp), 'MMM d, HH:mm', { locale: enUS });
    } catch {
      return '';
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]" style={{ backgroundColor: currentTheme.colors.background.primary }}>
      {/* Sessions Sidebar */}
      <div className="w-80 border-r flex flex-col" style={{ backgroundColor: currentTheme.colors.background.card, borderColor: currentTheme.colors.border.primary }}>
        {/* Header */}
        <div className="p-4 border-b" style={{ borderColor: currentTheme.colors.border.primary }}>
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold flex items-center" style={{ color: currentTheme.colors.text.primary }}>
              <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
              AI Assistant
            </h1>
            <button
              onClick={handleNewChat}
              disabled={createSessionMutation.isPending}
              className="p-2 rounded-md transition-colors disabled:opacity-50"
              style={{ 
                color: currentTheme.colors.text.muted,
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = currentTheme.colors.text.primary;
                e.currentTarget.style.backgroundColor = currentTheme.colors.background.secondary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = currentTheme.colors.text.muted;
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              title="New Chat"
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>
          <p className="text-sm mt-1" style={{ color: currentTheme.colors.text.muted }}>
            Ask me to create quotes, register services, or manage clients
          </p>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto">
          {sessionsLoading ? (
            <div className="p-4 text-center" style={{ color: currentTheme.colors.text.muted }}>
              Loading sessions...
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-4 text-center" style={{ color: currentTheme.colors.text.muted }}>
              No chat sessions yet.
              <br />
              <button
                onClick={handleNewChat}
                className="mt-2"
                style={{ color: currentTheme.colors.primary[600] }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = currentTheme.colors.primary[500];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = currentTheme.colors.primary[600];
                }}
              >
                Start your first chat
              </button>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => setSelectedSessionId(session.id)}
                  className="w-full text-left p-3 rounded-lg transition-colors"
                  style={{
                    backgroundColor: selectedSessionId === session.id 
                      ? currentTheme.colors.primary[50] 
                      : 'transparent',
                    border: selectedSessionId === session.id 
                      ? `1px solid ${currentTheme.colors.primary[200]}` 
                      : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedSessionId !== session.id) {
                      e.currentTarget.style.backgroundColor = currentTheme.colors.background.secondary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedSessionId !== session.id) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium truncate" style={{ color: currentTheme.colors.text.primary }}>
                        {session.title}
                      </h3>
                      <p className="text-xs mt-1" style={{ color: currentTheme.colors.text.muted }}>
                        {formatSessionTime(session.updatedAt)}
                      </p>
                      {session.messages.length > 0 && (
                        <p className="text-xs mt-1 truncate" style={{ color: currentTheme.colors.text.secondary }}>
                          {session.messages[session.messages.length - 1].content}
                        </p>
                      )}
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      {getSessionStatusIcon(session.status)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedSessionId ? (
          <>
            {/* Chat Header */}
            {currentSession && (
              <div className="p-4 border-b" style={{ backgroundColor: currentTheme.colors.background.card, borderColor: currentTheme.colors.border.primary }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold" style={{ color: currentTheme.colors.text.primary }}>
                      {currentSession.title}
                    </h2>
                    <p className="text-sm" style={{ color: currentTheme.colors.text.muted }}>
                      {currentSession.messages.length} messages • {currentSession.status}
                    </p>
                  </div>
                  {currentSession.context.currentAction && (
                    <div className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: currentTheme.colors.primary[100], color: currentTheme.colors.primary[800] }}>
                      {currentSession.context.currentAction.replace('_', ' ')}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {sessionLoading ? (
                <div className="text-center" style={{ color: currentTheme.colors.text.muted }}>
                  Loading conversation...
                </div>
              ) : currentSession?.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-3xl flex items-start space-x-3 ${
                      message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: message.type === 'user'
                          ? currentTheme.colors.primary[500]
                          : currentTheme.colors.background.secondary,
                        color: message.type === 'user'
                          ? 'white'
                          : currentTheme.colors.text.secondary
                      }}
                    >
                      {getMessageIcon(message.type)}
                    </div>

                    {/* Message Content */}
                    <div
                      className="rounded-lg p-4"
                      style={{
                        backgroundColor: message.type === 'user'
                          ? currentTheme.colors.primary[500]
                          : currentTheme.colors.background.card,
                        color: message.type === 'user'
                          ? 'white'
                          : currentTheme.colors.text.primary,
                        border: message.type === 'user'
                          ? 'none'
                          : `1px solid ${currentTheme.colors.border.primary}`
                      }}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      
                      {/* Message Actions */}
                      {message.metadata?.suggestedActions && (
                        <div className="mt-3 space-y-2">
                          {message.metadata.suggestedActions.map((action) => (
                            <button
                              key={action.id}
                              className="block w-full text-left px-3 py-2 rounded border text-sm"
                              style={{
                                backgroundColor: currentTheme.colors.background.secondary,
                                borderColor: currentTheme.colors.border.primary,
                                color: currentTheme.colors.text.primary
                              }}
                                                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = currentTheme.colors.background.secondary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = currentTheme.colors.background.primary;
                  }}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}

                      <div
                        className="text-xs mt-2"
                        style={{
                          color: message.type === 'user' 
                            ? currentTheme.colors.primary[100] 
                            : currentTheme.colors.text.muted
                        }}
                      >
                        {formatMessageTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-3xl flex items-start space-x-3">
                    <div 
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: currentTheme.colors.background.secondary,
                        color: currentTheme.colors.text.secondary
                      }}
                    >
                      <SparklesIcon className="h-5 w-5" />
                    </div>
                    <div 
                      className="rounded-lg p-4"
                      style={{
                        backgroundColor: currentTheme.colors.background.card,
                        border: `1px solid ${currentTheme.colors.border.primary}`
                      }}
                    >
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: currentTheme.colors.text.muted }}></div>
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: currentTheme.colors.text.muted, animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: currentTheme.colors.text.muted, animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t" style={{ backgroundColor: currentTheme.colors.background.card, borderColor: currentTheme.colors.border.primary }}>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here... (Press Enter to send)"
                    rows={1}
                    className="w-full px-4 py-2 rounded-lg resize-none"
                    style={{
                      border: `1px solid ${currentTheme.colors.border.primary}`,
                      backgroundColor: currentTheme.colors.background.primary,
                      color: currentTheme.colors.text.primary,
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = currentTheme.colors.primary[500];
                      e.target.style.boxShadow = `0 0 0 2px ${currentTheme.colors.primary[500]}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = currentTheme.colors.border.primary;
                      e.target.style.boxShadow = 'none';
                    }}
                    disabled={sendMessageMutation.isPending}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || sendMessageMutation.isPending}
                  className="px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  style={{
                    backgroundColor: currentTheme.colors.primary[500],
                    color: 'white'
                  }}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.backgroundColor = currentTheme.colors.primary[600];
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.backgroundColor = currentTheme.colors.primary[500];
                    }
                  }}
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
              
              {/* Quick Actions */}
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => setInputMessage('I need a quote for kitchen renovation')}
                  className="px-3 py-1 text-sm rounded-full transition-colors"
                  style={{
                    backgroundColor: currentTheme.colors.background.secondary,
                    color: currentTheme.colors.text.primary
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = currentTheme.colors.background.secondary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = currentTheme.colors.background.primary;
                  }}
                >
                  Create Quote
                </button>
                <button
                  onClick={() => setInputMessage('I want to register a new service')}
                  className="px-3 py-1 text-sm rounded-full transition-colors"
                  style={{
                    backgroundColor: currentTheme.colors.background.secondary,
                    color: currentTheme.colors.text.primary
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = currentTheme.colors.background.secondary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = currentTheme.colors.background.primary;
                  }}
                >
                  Add Service
                </button>
                <button
                  onClick={() => setInputMessage('I need to register a new client')}
                  className="px-3 py-1 text-sm rounded-full transition-colors"
                  style={{
                    backgroundColor: currentTheme.colors.background.secondary,
                    color: currentTheme.colors.text.primary
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = currentTheme.colors.background.secondary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = currentTheme.colors.background.primary;
                  }}
                >
                  Add Client
                </button>
                <button
                  onClick={() => setInputMessage('What can you help me with?')}
                  className="px-3 py-1 text-sm rounded-full transition-colors"
                  style={{
                    backgroundColor: currentTheme.colors.background.secondary,
                    color: currentTheme.colors.text.primary
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = currentTheme.colors.background.secondary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = currentTheme.colors.background.primary;
                  }}
                >
                  Help
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Welcome Screen */
          <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: currentTheme.colors.background.primary }}>
            <div className="text-center max-w-md">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: currentTheme.colors.primary[100] }}>
                <ChatBubbleLeftRightIcon className="h-8 w-8" style={{ color: currentTheme.colors.primary[600] }} />
              </div>
              <h2 className="text-xl font-semibold mb-2" style={{ color: currentTheme.colors.text.primary }}>
                Welcome to AI Assistant
              </h2>
              <p className="mb-6" style={{ color: currentTheme.colors.text.secondary }}>
                I can help you create quotations, register services, manage clients, and answer questions about your business.
              </p>
              <button
                onClick={handleNewChat}
                disabled={createSessionMutation.isPending}
                className="px-6 py-3 rounded-lg disabled:opacity-50 transition-colors"
                style={{
                  backgroundColor: currentTheme.colors.primary[500],
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = currentTheme.colors.primary[600];
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = currentTheme.colors.primary[500];
                  }
                }}
              >
                Start New Chat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
