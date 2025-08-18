import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { chatAPI } from '../services/api';
import { ChatSession, ChatMessage } from '../types/api';
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
  const { t } = useTranslation();
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
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50">
      {/* Sessions Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-900 flex items-center">
              <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
              AI Assistant
            </h1>
            <button
              onClick={handleNewChat}
              disabled={createSessionMutation.isPending}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
              title="New Chat"
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Ask me to create quotes, register services, or manage clients
          </p>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto">
          {sessionsLoading ? (
            <div className="p-4 text-center text-gray-500">
              Loading sessions...
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No chat sessions yet.
              <br />
              <button
                onClick={handleNewChat}
                className="mt-2 text-primary-600 hover:text-primary-500"
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
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedSessionId === session.id
                      ? 'bg-primary-50 border border-primary-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {session.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatSessionTime(session.updatedAt)}
                      </p>
                      {session.messages.length > 0 && (
                        <p className="text-xs text-gray-600 mt-1 truncate">
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
              <div className="p-4 bg-white border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {currentSession.title}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {currentSession.messages.length} messages • {currentSession.status}
                    </p>
                  </div>
                  {currentSession.context.currentAction && (
                    <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {currentSession.context.currentAction.replace('_', ' ')}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {sessionLoading ? (
                <div className="text-center text-gray-500">
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
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user'
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {getMessageIcon(message.type)}
                    </div>

                    {/* Message Content */}
                    <div
                      className={`rounded-lg p-4 ${
                        message.type === 'user'
                          ? 'bg-primary-500 text-white'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      
                      {/* Message Actions */}
                      {message.metadata?.suggestedActions && (
                        <div className="mt-3 space-y-2">
                          {message.metadata.suggestedActions.map((action) => (
                            <button
                              key={action.id}
                              className="block w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded border text-sm"
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}

                      <div
                        className={`text-xs mt-2 ${
                          message.type === 'user' ? 'text-primary-100' : 'text-gray-500'
                        }`}
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
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
                      <SparklesIcon className="h-5 w-5" />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here... (Press Enter to send)"
                    rows={1}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    disabled={sendMessageMutation.isPending}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || sendMessageMutation.isPending}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
              
              {/* Quick Actions */}
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => setInputMessage('I need a quote for kitchen renovation')}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  Create Quote
                </button>
                <button
                  onClick={() => setInputMessage('I want to register a new service')}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  Add Service
                </button>
                <button
                  onClick={() => setInputMessage('I need to register a new client')}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  Add Client
                </button>
                <button
                  onClick={() => setInputMessage('What can you help me with?')}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  Help
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Welcome Screen */
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Welcome to AI Assistant
              </h2>
              <p className="text-gray-600 mb-6">
                I can help you create quotations, register services, manage clients, and answer questions about your business.
              </p>
              <button
                onClick={handleNewChat}
                disabled={createSessionMutation.isPending}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-colors"
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
