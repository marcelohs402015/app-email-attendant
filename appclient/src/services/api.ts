import { EmailData, EmailTemplate, CategoryStats, ApiResponse, PaginatedResponse, FilterOptions, PaginationOptions, Service, ServiceCategory, Quotation, CalendarAvailability, Client, Appointment, AutomationRule, PendingQuote, AutomationMetrics, Category, ChatSession, ChatMessage, ChatResponse } from '../types/api';
import { mockEmails } from '../data/mockEmails';
import { mockTemplates, mockCategoryStats, mockServices, mockServiceCategories, mockQuotations, mockCalendarAvailability, mockClients, mockAppointments, mockAutomationRules, mockPendingQuotes, mockAutomationMetrics, mockCategories } from '../data/mockData';
import mockChatData from '../data/mockChatData';
import { localStorageService } from './localStorage';
import axios from 'axios';
import { API_CONFIG } from '../config/api';

// Mock API service that simulates real API calls with localStorage persistence
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize localStorage with mock data on first load
localStorageService.initializeWithMockData({
  quotations: mockQuotations,
  clients: mockClients,
  services: mockServices,
  chatSessions: mockChatData.sessions,
  appointments: mockAppointments,
  emails: mockEmails,
  templates: mockTemplates,
  automationRules: mockAutomationRules,
  pendingQuotes: mockPendingQuotes
});

export const emailAPI = {
  // Get emails with filters and pagination
  getEmails: async (filters?: FilterOptions, pagination?: PaginationOptions): Promise<ApiResponse<PaginatedResponse<EmailData>>> => {
    await delay(300);
    
    let emails = localStorageService.getAll<EmailData>('emails');
    
    // Apply filters
    if (filters) {
      if (filters.category) {
        emails = emails.filter(email => email.category === filters.category);
      }
      if (filters.status) {
        emails = emails.filter(email => email.status === filters.status);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        emails = emails.filter(email => 
          email.subject.toLowerCase().includes(searchLower) ||
          email.sender.toLowerCase().includes(searchLower) ||
          email.content.toLowerCase().includes(searchLower)
        );
      }
    }
    
    // Apply pagination
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEmails = emails.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: {
        items: paginatedEmails,
        total: emails.length,
        page,
        limit,
        totalPages: Math.ceil(emails.length / limit)
      }
    };
  },

  // Get email by ID
  getEmailById: async (emailId: string): Promise<ApiResponse<EmailData>> => {
    await delay(200);
    
    const email = localStorageService.getById<EmailData>('emails', emailId);
    if (!email) {
      return {
        success: false,
        error: 'Email not found'
      };
    }
    
    return {
      success: true,
      data: email
    };
  },

  // Update email status
  updateEmailStatus: async (emailId: string, status: string): Promise<ApiResponse<EmailData>> => {
    await delay(300);
    
    const updatedEmail = localStorageService.update<EmailData>('emails', emailId, { status });
    if (!updatedEmail) {
      return {
        success: false,
        error: 'Email not found'
      };
    }
    
    return {
      success: true,
      data: updatedEmail,
      message: 'Email status updated successfully'
    };
  },

  // === TEMPLATES API ===
  
  // Get all templates
  getTemplates: async (): Promise<ApiResponse<EmailTemplate[]>> => {
    await delay(200);
    
    return {
      success: true,
      data: localStorageService.getAll<EmailTemplate>('templates')
    };
  },

  // Create template
  createTemplate: async (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<EmailTemplate>> => {
    await delay(400);
    
    const newTemplate = localStorageService.create<EmailTemplate>('templates', {
      ...template,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return {
      success: true,
      data: newTemplate,
      message: 'Template created successfully'
    };
  },

  // Update template
  updateTemplate: async (templateId: string, updates: Partial<Omit<EmailTemplate, 'id' | 'createdAt'>>): Promise<ApiResponse<EmailTemplate>> => {
    await delay(300);
    
    const updatedTemplate = localStorageService.update<EmailTemplate>('templates', templateId, updates);
    if (!updatedTemplate) {
      return {
        success: false,
        error: 'Template not found'
      };
    }
    
    return {
      success: true,
      data: updatedTemplate,
      message: 'Template updated successfully'
    };
  },

  // Delete template
  deleteTemplate: async (templateId: string): Promise<ApiResponse<void>> => {
    await delay(300);
    
    const deleted = localStorageService.delete('templates', templateId);
    if (!deleted) {
      return {
        success: false,
        error: 'Template not found'
      };
    }
    
    return {
      success: true,
      message: 'Template deleted successfully'
    };
  },

  // === SERVICES API ===
  
  // Get all services
  getServices: async (): Promise<ApiResponse<Service[]>> => {
    await delay(200);
    
    return {
      success: true,
      data: localStorageService.getAll<Service>('services')
    };
  },

  // Create service
  createService: async (service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Service>> => {
    await delay(400);
    
    const newService = localStorageService.create<Service>('services', {
      ...service,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return {
      success: true,
      data: newService,
      message: 'Service created successfully'
    };
  },

  // Update service
  updateService: async (serviceId: string, updates: Partial<Omit<Service, 'id' | 'createdAt'>>): Promise<ApiResponse<Service>> => {
    await delay(300);
    
    const updatedService = localStorageService.update<Service>('services', serviceId, updates);
    if (!updatedService) {
      return {
        success: false,
        error: 'Service not found'
      };
    }
    
    return {
      success: true,
      data: updatedService,
      message: 'Service updated successfully'
    };
  },

  // Delete service
  deleteService: async (serviceId: string): Promise<ApiResponse<void>> => {
    await delay(300);
    
    const deleted = localStorageService.delete('services', serviceId);
    if (!deleted) {
      return {
        success: false,
        error: 'Service not found'
      };
    }
    
    return {
      success: true,
      message: 'Service deleted successfully'
    };
  },

  // === QUOTATIONS API ===
  
  // Get all quotations
  getQuotations: async (): Promise<ApiResponse<Quotation[]>> => {
    await delay(300);
    
    return {
      success: true,
      data: localStorageService.getAll<Quotation>('quotations')
    };
  },

  // Create quotation
  createQuotation: async (quotation: Omit<Quotation, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Quotation>> => {
    await delay(500);
    
    const newQuotation = localStorageService.create<Quotation>('quotations', {
      ...quotation,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return {
      success: true,
      data: newQuotation,
      message: 'Quotation created successfully'
    };
  },

  // Update quotation
  updateQuotation: async (quotationId: string, updates: Partial<Omit<Quotation, 'id' | 'createdAt'>>): Promise<ApiResponse<Quotation>> => {
    await delay(400);
    
    const updatedQuotation = localStorageService.update<Quotation>('quotations', quotationId, updates);
    if (!updatedQuotation) {
      return {
        success: false,
        error: 'Quotation not found'
      };
    }
    
    return {
      success: true,
      data: updatedQuotation,
      message: 'Quotation updated successfully'
    };
  },

  // Delete quotation
  deleteQuotation: async (quotationId: string): Promise<ApiResponse<void>> => {
    await delay(300);
    
    const deleted = localStorageService.delete('quotations', quotationId);
    if (!deleted) {
      return {
        success: false,
        error: 'Quotation not found'
      };
    }
    
    return {
      success: true,
      message: 'Quotation deleted successfully'
    };
  },

  // === CLIENTS API ===
  
  // Get all clients
  getClients: async (): Promise<ApiResponse<Client[]>> => {
    await delay(300);
    
    return {
      success: true,
      data: localStorageService.getAll<Client>('clients')
    };
  },

  // Create client
  createClient: async (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Client>> => {
    await delay(400);
    
    const newClient = localStorageService.create<Client>('clients', {
      ...client,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return {
      success: true,
      data: newClient,
      message: 'Client created successfully'
    };
  },

  // Update client
  updateClient: async (clientId: string, updates: Partial<Omit<Client, 'id' | 'createdAt'>>): Promise<ApiResponse<Client>> => {
    await delay(300);
    
    const updatedClient = localStorageService.update<Client>('clients', clientId, updates);
    if (!updatedClient) {
      return {
        success: false,
        error: 'Client not found'
      };
    }
    
    return {
      success: true,
      data: updatedClient,
      message: 'Client updated successfully'
    };
  },

  // Delete client
  deleteClient: async (clientId: string): Promise<ApiResponse<void>> => {
    await delay(300);
    
    const deleted = localStorageService.delete('clients', clientId);
    if (!deleted) {
      return {
        success: false,
        error: 'Client not found'
      };
    }
    
    return {
      success: true,
      message: 'Client deleted successfully'
    };
  },

  // === APPOINTMENTS API ===
  
  // Get all appointments
  getAppointments: async (): Promise<ApiResponse<Appointment[]>> => {
    await delay(400);
    
    return {
      success: true,
      data: localStorageService.getAll<Appointment>('appointments')
    };
  },

  // Create appointment
  createAppointment: async (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Appointment>> => {
    await delay(600);
    
    const newAppointment = localStorageService.create<Appointment>('appointments', {
      ...appointment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return {
      success: true,
      data: newAppointment,
      message: 'Appointment created successfully'
    };
  },

  // Update appointment
  updateAppointment: async (appointmentId: string, updates: Partial<Omit<Appointment, 'id' | 'createdAt'>>): Promise<ApiResponse<Appointment>> => {
    await delay(500);
    
    const updatedAppointment = localStorageService.update<Appointment>('appointments', appointmentId, updates);
    if (!updatedAppointment) {
      return {
        success: false,
        error: 'Appointment not found'
      };
    }
    
    return {
      success: true,
      data: updatedAppointment,
      message: 'Appointment updated successfully'
    };
  },

  // Delete appointment
  deleteAppointment: async (appointmentId: string): Promise<ApiResponse<void>> => {
    await delay(300);
    
    const deleted = localStorageService.delete('appointments', appointmentId);
    if (!deleted) {
      return {
        success: false,
        error: 'Appointment not found'
      };
    }
    
    return {
      success: true,
      message: 'Appointment deleted successfully'
    };
  },

  // === STATS API ===
  
  // Get category stats
  getCategoryStats: async (): Promise<ApiResponse<CategoryStats[]>> => {
    await delay(300);
    
    return {
      success: true,
      data: mockCategoryStats
    };
  },

  // Get automation metrics
  getAutomationMetrics: async (): Promise<ApiResponse<AutomationMetrics>> => {
    await delay(400);
    
    return {
      success: true,
      data: mockAutomationMetrics
    };
  },

  // === AUTOMATION API ===
  
  // Get automation rules
  getAutomationRules: async (): Promise<ApiResponse<AutomationRule[]>> => {
    await delay(300);
    
    return {
      success: true,
      data: localStorageService.getAll<AutomationRule>('automationRules')
    };
  },

  // Create automation rule
  createAutomationRule: async (rule: Omit<AutomationRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<AutomationRule>> => {
    await delay(500);
    
    const newRule = localStorageService.create<AutomationRule>('automationRules', {
      ...rule,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return {
      success: true,
      data: newRule,
      message: 'Automation rule created successfully'
    };
  },

  // Update automation rule
  updateAutomationRule: async (ruleId: string, updates: Partial<Omit<AutomationRule, 'id' | 'createdAt'>>): Promise<ApiResponse<AutomationRule>> => {
    await delay(400);
    
    const updatedRule = localStorageService.update<AutomationRule>('automationRules', ruleId, updates);
    if (!updatedRule) {
      return {
        success: false,
        error: 'Automation rule not found'
      };
    }
    
    return {
      success: true,
      data: updatedRule,
      message: 'Automation rule updated successfully'
    };
  },

  // Delete automation rule
  deleteAutomationRule: async (ruleId: string): Promise<ApiResponse<void>> => {
    await delay(300);
    
    const deleted = localStorageService.delete('automationRules', ruleId);
    if (!deleted) {
      return {
        success: false,
        error: 'Automation rule not found'
      };
    }
    
    return {
      success: true,
      message: 'Automation rule deleted successfully'
    };
  },

  // Get pending quotes
  getPendingQuotes: async (): Promise<ApiResponse<PendingQuote[]>> => {
    await delay(300);
    
    return {
      success: true,
      data: localStorageService.getAll<PendingQuote>('pendingQuotes')
    };
  },

  // Approve pending quote
  approvePendingQuote: async (quoteId: string): Promise<ApiResponse<void>> => {
    await delay(400);
    
    const updatedQuote = localStorageService.update<PendingQuote>('pendingQuotes', quoteId, { 
      status: 'approved',
      approvedAt: new Date().toISOString()
    });
    
    if (!updatedQuote) {
      return {
        success: false,
        error: 'Pending quote not found'
      };
    }
    
    return {
      success: true,
      message: 'Quote approved successfully'
    };
  },

  // Reject pending quote
  rejectPendingQuote: async (quoteId: string): Promise<ApiResponse<void>> => {
    await delay(400);
    
    const updatedQuote = localStorageService.update<PendingQuote>('pendingQuotes', quoteId, { 
      status: 'rejected',
      rejectedAt: new Date().toISOString()
    });
    
    if (!updatedQuote) {
      return {
        success: false,
        error: 'Pending quote not found'
      };
    }
    
    return {
      success: true,
      message: 'Quote rejected successfully'
    };
  },

  // === CATEGORIES API ===
  
  // Get all categories
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    await delay(200);
    
    const activeCategories = mockCategories.filter(cat => cat.active);
    
    return {
      success: true,
      data: activeCategories
    };
  },
};

// Chat API - v2.0 - Real Backend Integration with localStorage persistence
export const chatAPI = {
  // Create a new chat session
  createSession: async (): Promise<ApiResponse<ChatSession>> => {
    try {
      if (API_CONFIG.baseURL === 'mock') {
        await delay(300);
        
        const sessionId = `session_${Date.now()}`;
        const newSession: ChatSession = {
          id: sessionId,
          title: 'New Chat Session',
          status: 'active',
          context: {},
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        // Add welcome message
        const welcomeMessage: ChatMessage = {
          id: `msg_${Date.now()}`,
          sessionId,
          type: 'assistant',
          content: mockChatData.responses.greeting[0],
          timestamp: new Date().toISOString(),
          metadata: { action: 'greeting' }
        };

        newSession.messages.push(welcomeMessage);
        
        // Save to localStorage
        localStorageService.create<ChatSession>('chatSessions', newSession);

        return {
          success: true,
          data: newSession,
          message: 'Chat session created successfully'
        };
      }

      // Real backend API call
      const response = await axios.post(`${API_CONFIG.baseURL}/api/chat/sessions`, {});
      return response.data;
    } catch (error) {
      console.error('Error creating chat session:', error);
      return {
        success: false,
        error: 'Failed to create chat session',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // List all chat sessions
  getSessions: async (): Promise<ApiResponse<ChatSession[]>> => {
    try {
      if (API_CONFIG.baseURL === 'mock') {
        await delay(200);
        
        const sessions = localStorageService.getAll<ChatSession>('chatSessions').sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );

        return {
          success: true,
          data: sessions
        };
      }

      // Real backend API call
      const response = await axios.get(`${API_CONFIG.baseURL}/api/chat/sessions`);
      return response.data;
    } catch (error) {
      console.error('Error getting chat sessions:', error);
      return {
        success: false,
        error: 'Failed to get chat sessions',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Get specific session by ID
  getSession: async (sessionId: string): Promise<ApiResponse<ChatSession>> => {
    try {
      if (API_CONFIG.baseURL === 'mock') {
        await delay(200);
        
        const session = localStorageService.getById<ChatSession>('chatSessions', sessionId);
        
        if (!session) {
          return {
            success: false,
            error: 'Session not found'
          };
        }

        return {
          success: true,
          data: session
        };
      }

      // Real backend API call
      const response = await axios.get(`${API_CONFIG.baseURL}/api/chat/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting chat session:', error);
      return {
        success: false,
        error: 'Failed to get chat session',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Send message to chat session
  sendMessage: async (sessionId: string, message: string): Promise<ApiResponse<ChatResponse>> => {
    try {
      if (API_CONFIG.baseURL === 'mock') {
        await delay(800); // Simulate AI processing time
        
        const session = localStorageService.getById<ChatSession>('chatSessions', sessionId);
        
        if (!session) {
          return {
            success: false,
            error: 'Session not found'
          };
        }

        // Add user message
        const userMessage: ChatMessage = {
          id: `msg_${Date.now()}_user`,
          sessionId,
          type: 'user',
          content: message,
          timestamp: new Date().toISOString()
        };

        session.messages.push(userMessage);

        // Generate AI response based on mock patterns
        const aiResponse = generateMockAIResponse(message, session);
        
        // Add AI message
        const aiMessage: ChatMessage = {
          id: `msg_${Date.now()}_ai`,
          sessionId,
          type: 'assistant',
          content: aiResponse.message,
          timestamp: new Date().toISOString(),
          metadata: aiResponse.metadata
        };

        session.messages.push(aiMessage);
        session.updatedAt = new Date().toISOString();

        // Update session title if it's meaningful
        if (session.messages.length === 3) { // First user message + welcome + AI response
          session.title = generateSessionTitle(message);
        }

        // Save updated session to localStorage
        localStorageService.update<ChatSession>('chatSessions', sessionId, session);

        return {
          success: true,
          data: aiResponse
        };
      }

      // Real backend API call
      const response = await axios.post(`${API_CONFIG.baseURL}/api/chat/sessions/${sessionId}/messages`, {
        message: message
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        success: false,
        error: 'Failed to send message',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Update session status
  updateSessionStatus: async (sessionId: string, status: string): Promise<ApiResponse<ChatSession>> => {
    try {
      if (API_CONFIG.baseURL === 'mock') {
        await delay(300);
        
        const updatedSession = localStorageService.update<ChatSession>('chatSessions', sessionId, { status });
        
        if (!updatedSession) {
          return {
            success: false,
            error: 'Session not found'
          };
        }

        return {
          success: true,
          data: updatedSession,
          message: 'Session status updated successfully'
        };
      }

      // Real backend API call
      const response = await axios.put(`${API_CONFIG.baseURL}/api/chat/sessions/${sessionId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating session status:', error);
      return {
        success: false,
        error: 'Failed to update session status',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
};

// Helper function to generate mock AI responses
function generateMockAIResponse(userMessage: string, session: ChatSession): ChatResponse {
  const lowerMessage = userMessage.toLowerCase();
  
  // Check if we're in a conversation flow
  if (session.context.collectingData) {
    return handleConversationFlow(userMessage, session);
  }

  // Detect intent
  for (const [intent, patterns] of Object.entries(mockChatData.patterns)) {
    for (const pattern of patterns as RegExp[]) {
      if (pattern.test(lowerMessage)) {
        return handleIntent(intent, userMessage, session);
      }
    }
  }

  // Default response
  return {
    message: mockChatData.responses.error[Math.floor(Math.random() * mockChatData.responses.error.length)],
    sessionId: session.id,
    metadata: { action: 'general_inquiry' }
  };
}

// Handle specific intents
function handleIntent(intent: string, userMessage: string, session: ChatSession): ChatResponse {
  const responses = mockChatData.responses[intent as keyof typeof mockChatData.responses] || mockChatData.responses.general_inquiry;
  const responseMessage = responses[Math.floor(Math.random() * responses.length)];

  switch (intent) {
    case 'create_quotation':
      session.context.currentAction = 'create_quotation';
      session.context.collectingData = {
        type: 'quotation',
        step: 0,
        data: {}
      };
      return {
        message: `${responseMessage}\n\nTo get started, what's the client's name?`,
        sessionId: session.id,
        metadata: { action: 'create_quotation', nextStep: 'clientName' }
      };

    case 'register_service':
      session.context.currentAction = 'register_service';
      session.context.collectingData = {
        type: 'service',
        step: 0,
        data: {}
      };
      return {
        message: `${responseMessage}\n\nWhat's the name of the service you'd like to add?`,
        sessionId: session.id,
        metadata: { action: 'register_service', nextStep: 'name' }
      };

    case 'register_client':
      session.context.currentAction = 'register_client';
      session.context.collectingData = {
        type: 'client',
        step: 0,
        data: {}
      };
      return {
        message: `${responseMessage}\n\nWhat's the client's full name?`,
        sessionId: session.id,
        metadata: { action: 'register_client', nextStep: 'name' }
      };

    default:
      return {
        message: responseMessage,
        sessionId: session.id,
        metadata: { action: intent as any }
      };
  }
}

// Handle conversation flow progression
function handleConversationFlow(userMessage: string, session: ChatSession): ChatResponse {
  const collectingData = session.context.collectingData;
  
  if (!collectingData) {
    return {
      message: "I'm sorry, something went wrong. Let's start over.",
      sessionId: session.id
    };
  }

  const flow = mockChatData.flows[collectingData.type];
  const currentStep = flow.steps[collectingData.step];
  
  // Store the data
  collectingData.data[currentStep.field] = userMessage;
  collectingData.step++;

  // Check if we've completed all steps
  if (collectingData.step >= flow.steps.length) {
    const resourceId = createMockResource(collectingData.type, collectingData.data);
    
    // Clear the collecting data
    session.context.collectingData = undefined;
    session.context.currentAction = undefined;

    const successMessages = {
      quotation: `Perfect! I've created the quotation successfully.\n\n**Quotation ID:** ${resourceId}\n**Client:** ${collectingData.data.clientName}\n**Email:** ${collectingData.data.clientEmail || 'Not provided'}\n\nThe quotation has been saved and is ready to be sent. Is there anything else I can help you with?`,
      service: `Excellent! I've registered the new service successfully.\n\n**Service ID:** ${resourceId}\n**Name:** ${collectingData.data.name}\n**Category:** ${collectingData.data.category || 'General'}\n\nThe service is now available in your catalog. What else can I help you with?`,
      client: `Great! I've registered the new client successfully.\n\n**Client ID:** ${resourceId}\n**Name:** ${collectingData.data.name}\n**Email:** ${collectingData.data.email || 'Not provided'}\n\nThe client is now in your system. How else can I assist you?`
    };

    return {
      message: successMessages[collectingData.type],
      sessionId: session.id,
      metadata: {
        action: `${collectingData.type}_completed` as any,
        data: { id: resourceId, ...collectingData.data }
      }
    };
  }

  // Move to next step
  const nextStep = flow.steps[collectingData.step];
  return {
    message: nextStep.prompt,
    sessionId: session.id,
    metadata: {
      action: collectingData.type,
      nextStep: nextStep.field
    }
  };
}

// Create mock resource and save to localStorage
function createMockResource(type: string, data: any): string {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substr(2, 9);
  const resourceId = `${type}_${timestamp}_${randomId}`;

  switch (type) {
    case 'quotation':
      const newQuotation = {
        id: resourceId,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone || '',
        clientAddress: data.clientAddress || '',
        items: [],
        subtotal: 0,
        total: 0,
        status: 'draft',
        notes: data.notes || '',
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      localStorageService.create('quotations', newQuotation);
      break;

    case 'service':
      const newService = {
        id: resourceId,
        name: data.name,
        description: data.description || '',
        category: data.category || 'General',
        price: parseFloat(data.price) || 0,
        duration: data.duration || 60,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      localStorageService.create('services', newService);
      break;

    case 'client':
      const newClient = {
        id: resourceId,
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        address: data.address || '',
        notes: data.notes || '',
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      localStorageService.create('clients', newClient);
      break;
  }

  return resourceId;
}

// Generate session title based on first user message
function generateSessionTitle(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('quote') || lowerMessage.includes('quotation')) {
    return 'Quotation Request';
  } else if (lowerMessage.includes('service')) {
    return 'Service Registration';
  } else if (lowerMessage.includes('client')) {
    return 'Client Registration';
  } else if (lowerMessage.includes('help')) {
    return 'General Inquiry';
  }
  
  return 'Chat Session';
}