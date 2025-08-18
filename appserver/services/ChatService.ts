import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';

// Chat Types (duplicated for backend - ideally shared)
interface ChatMessage {
  id: string;
  sessionId: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    action?: 'create_quotation' | 'register_service' | 'register_client' | 'general_inquiry';
    data?: any;
    confidence?: number;
    suggestedActions?: ChatAction[];
  };
}

interface ChatAction {
  id: string;
  type: 'create_quotation' | 'register_service' | 'register_client' | 'view_details';
  label: string;
  data: any;
  requiresConfirmation: boolean;
}

interface ChatSession {
  id: string;
  clientId?: string;
  title: string;
  messages: ChatMessage[];
  status: 'active' | 'completed' | 'archived';
  context: ChatContext;
  createdAt: string;
  updatedAt: string;
}

interface ChatContext {
  currentAction?: string;
  collectingData?: {
    type: 'quotation' | 'service' | 'client';
    step: number;
    data: Record<string, any>;
  };
  lastClientId?: string;
  preferredServices?: string[];
}

interface ChatResponse {
  message: string;
  sessionId: string;
  metadata?: {
    action?: string;
    data?: any;
    nextStep?: string;
    suggestedActions?: ChatAction[];
    confidence?: number;
  };
}

interface ChatIntent {
  type: 'create_quotation' | 'register_service' | 'register_client' | 'general_inquiry' | 'help' | 'greeting';
  confidence: number;
  entities: Record<string, any>;
}

/**
 * ChatService - Intelligent Chat System for Business Management
 * 
 * This service provides AI-powered chat functionality for:
 * - Creating quotations through conversation
 * - Registering services and clients
 * - General business inquiries
 * 
 * Uses mock AI responses for demonstration purposes.
 */
export class ChatService {
  private sessions: Map<string, ChatSession> = new Map();
  
  // Mock AI responses
  private readonly mockResponses = {
    greeting: [
      "Hello! I'm your AI assistant. I can help you create quotations, register services, manage clients, or answer questions about your business. What would you like to do today?",
      "Hi there! How can I assist you today? I can help with quotations, services, clients, or any other questions you might have.",
      "Welcome! I'm here to help you manage your handyman business. Feel free to ask me about creating quotes, adding services, or anything else!"
    ],
    
    create_quotation: [
      "I'd be happy to help you create a quotation! To get started, I'll need some information about the client and the services they need. What's the client's name?",
      "Great! Let's create a new quotation. First, could you tell me the client's name and what type of work they need done?",
      "Perfect! I'll help you generate a professional quotation. To begin, what's the client's name and what services are they requesting?"
    ],
    
    register_service: [
      "I'll help you register a new service. What type of service would you like to add? Please provide the service name and a brief description.",
      "Great! Let's add a new service to your catalog. What's the name of the service and which category does it belong to?",
      "Perfect! I can help you register a new service. What's the service name and what category should it be under?"
    ],
    
    register_client: [
      "I'll help you register a new client. What's the client's full name and email address?",
      "Great! Let's add a new client to your system. I'll need their name, email, and any other relevant contact information.",
      "Perfect! To register a new client, I'll need their basic information. What's their name and email?"
    ],
    
    help: [
      "I can help you with several tasks:\n\n• **Create Quotations** - Generate professional quotes for your clients\n• **Register Services** - Add new services to your catalog\n• **Manage Clients** - Register and update client information\n• **General Questions** - Ask about your business, schedules, or services\n\nJust tell me what you'd like to do!",
      "Here's what I can help you with:\n\n✅ Creating detailed quotations\n✅ Adding new services\n✅ Registering clients\n✅ Answering business questions\n✅ Managing your workflow\n\nWhat would you like to start with?"
    ],
    
    error: [
      "I'm sorry, I didn't quite understand that. Could you please rephrase your request or try asking in a different way?",
      "I apologize, but I'm not sure how to help with that. Could you provide more details or try asking about quotations, services, or clients?"
    ]
  };

  // Intent detection patterns
  private readonly intentPatterns = {
    greeting: [/hello|hi|hey|oi|olá|good morning|good afternoon/i],
    create_quotation: [/quote|quotation|estimate|price|cost|budget|orçamento|preço/i],
    register_service: [/service|add service|new service|register service|serviço|adicionar serviço/i],
    register_client: [/client|customer|add client|new client|register client|cliente|adicionar cliente/i],
    help: [/help|ajuda|what can you do|o que você pode fazer|commands|comandos/i]
  };

  // Conversation flows
  private readonly conversationFlows = {
    quotation: {
      steps: [
        { field: 'clientName', question: 'What\'s the client\'s name?', validation: 'required' },
        { field: 'clientEmail', question: 'What\'s their email address?', validation: 'email' },
        { field: 'services', question: 'What services do they need? You can mention multiple services.', validation: 'required' },
        { field: 'urgency', question: 'How urgent is this project? (low, medium, high)', validation: 'optional' },
        { field: 'confirmation', question: 'Here\'s the quotation summary. Would you like me to create it?', validation: 'confirmation' }
      ]
    },
    service: {
      steps: [
        { field: 'name', question: 'What\'s the name of the service?', validation: 'required' },
        { field: 'category', question: 'Which category does this service belong to? (electrical, plumbing, painting, etc.)', validation: 'required' },
        { field: 'description', question: 'Please provide a brief description of the service.', validation: 'required' },
        { field: 'price', question: 'What\'s the default price for this service?', validation: 'number' },
        { field: 'unit', question: 'What\'s the unit of measurement? (hour, day, square meter, etc.)', validation: 'required' },
        { field: 'confirmation', question: 'Here\'s the service details. Should I create it?', validation: 'confirmation' }
      ]
    },
    client: {
      steps: [
        { field: 'name', question: 'What\'s the client\'s full name?', validation: 'required' },
        { field: 'email', question: 'What\'s their email address?', validation: 'email' },
        { field: 'phone', question: 'What\'s their phone number? (optional)', validation: 'optional' },
        { field: 'address', question: 'What\'s their address? (optional)', validation: 'optional' },
        { field: 'confirmation', question: 'Here\'s the client information. Should I register them?', validation: 'confirmation' }
      ]
    }
  };

  /**
   * Create a new chat session
   */
  async createSession(): Promise<ChatSession> {
    const sessionId = uuidv4();
    const session: ChatSession = {
      id: sessionId,
      title: 'New Chat Session',
      status: 'active',
      context: {},
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.sessions.set(sessionId, session);
    logger.info(`Created new chat session: ${sessionId}`);

    return session;
  }

  /**
   * Process user message and generate AI response
   */
  async processMessage(sessionId: string, userMessage: string): Promise<ChatResponse> {
    try {
      const session = this.sessions.get(sessionId);
      if (!session) {
        throw new Error(`Session ${sessionId} not found`);
      }

      // Add user message to session
      const userMsg: ChatMessage = {
        id: uuidv4(),
        sessionId,
        type: 'user',
        content: userMessage,
        timestamp: new Date().toISOString()
      };

      session.messages.push(userMsg);

      // Detect intent
      const intent = this.detectIntent(userMessage);
      logger.info(`Detected intent: ${intent.type} (confidence: ${intent.confidence})`);

      // Generate response based on intent and context
      const response = await this.generateResponse(session, intent, userMessage);

      // Add assistant message to session
      const assistantMsg: ChatMessage = {
        id: uuidv4(),
        sessionId,
        type: 'assistant',
        content: response.message,
        timestamp: new Date().toISOString(),
        metadata: response.metadata
      };

      session.messages.push(assistantMsg);
      session.updatedAt = new Date().toISOString();

      // Update session title if it's the first meaningful interaction
      if (session.messages.length === 2 && intent.type !== 'greeting') {
        session.title = this.generateSessionTitle(intent.type, userMessage);
      }

      this.sessions.set(sessionId, session);

      return response;
    } catch (error) {
      logger.error('Error processing message:', error);
      return {
        message: this.getRandomResponse('error'),
        sessionId,
        metadata: { action: 'error' }
      };
    }
  }

  /**
   * Get session by ID
   */
  async getSession(sessionId: string): Promise<ChatSession | null> {
    return this.sessions.get(sessionId) || null;
  }

  /**
   * List all sessions
   */
  async listSessions(): Promise<ChatSession[]> {
    return Array.from(this.sessions.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  /**
   * Detect user intent from message
   */
  private detectIntent(message: string): ChatIntent {
    const lowerMessage = message.toLowerCase();
    
    for (const [intentType, patterns] of Object.entries(this.intentPatterns)) {
      for (const pattern of patterns) {
        if (pattern.test(lowerMessage)) {
          return {
            type: intentType as any,
            confidence: 0.85,
            entities: this.extractEntities(message)
          };
        }
      }
    }

    return {
      type: 'general_inquiry',
      confidence: 0.5,
      entities: {}
    };
  }

  /**
   * Extract entities from user message
   */
  private extractEntities(message: string): Record<string, any> {
    const entities: Record<string, any> = {};
    
    // Extract email addresses
    const emailMatch = message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) {
      entities.email = emailMatch[0];
    }

    // Extract phone numbers
    const phoneMatch = message.match(/\d{3}-?\d{3}-?\d{4}/);
    if (phoneMatch) {
      entities.phone = phoneMatch[0];
    }

    // Extract monetary values
    const moneyMatch = message.match(/\$?\d+(?:\.\d{2})?/);
    if (moneyMatch) {
      entities.amount = parseFloat(moneyMatch[0].replace('$', ''));
    }

    return entities;
  }

  /**
   * Generate AI response based on intent and context
   */
  private async generateResponse(session: ChatSession, intent: ChatIntent, userMessage: string): Promise<ChatResponse> {
    const { context } = session;

    // Handle continuing conversations
    if (context.collectingData) {
      return this.handleConversationFlow(session, userMessage);
    }

    // Handle new conversations
    switch (intent.type) {
      case 'greeting':
        return {
          message: this.getRandomResponse('greeting'),
          sessionId: session.id,
          metadata: { action: 'greeting' }
        };

      case 'create_quotation':
        return this.startQuotationFlow(session);

      case 'register_service':
        return this.startServiceFlow(session);

      case 'register_client':
        return this.startClientFlow(session);

      case 'help':
        return {
          message: this.getRandomResponse('help'),
          sessionId: session.id,
          metadata: { action: 'help' }
        };

      default:
        return {
          message: this.getRandomResponse('error'),
          sessionId: session.id,
          metadata: { action: 'general_inquiry' }
        };
    }
  }

  /**
   * Start quotation creation flow
   */
  private startQuotationFlow(session: ChatSession): ChatResponse {
    session.context.currentAction = 'create_quotation';
    session.context.collectingData = {
      type: 'quotation',
      step: 0,
      data: {}
    };

    const firstStep = this.conversationFlows.quotation.steps[0];
    
    return {
      message: `${this.getRandomResponse('create_quotation')}\n\n${firstStep.question}`,
      sessionId: session.id,
      metadata: {
        action: 'create_quotation',
        nextStep: firstStep.field
      }
    };
  }

  /**
   * Start service registration flow
   */
  private startServiceFlow(session: ChatSession): ChatResponse {
    session.context.currentAction = 'register_service';
    session.context.collectingData = {
      type: 'service',
      step: 0,
      data: {}
    };

    const firstStep = this.conversationFlows.service.steps[0];
    
    return {
      message: `${this.getRandomResponse('register_service')}\n\n${firstStep.question}`,
      sessionId: session.id,
      metadata: {
        action: 'register_service',
        nextStep: firstStep.field
      }
    };
  }

  /**
   * Start client registration flow
   */
  private startClientFlow(session: ChatSession): ChatResponse {
    session.context.currentAction = 'register_client';
    session.context.collectingData = {
      type: 'client',
      step: 0,
      data: {}
    };

    const firstStep = this.conversationFlows.client.steps[0];
    
    return {
      message: `${this.getRandomResponse('register_client')}\n\n${firstStep.question}`,
      sessionId: session.id,
      metadata: {
        action: 'register_client',
        nextStep: firstStep.field
      }
    };
  }

  /**
   * Handle conversation flow progression
   */
  private handleConversationFlow(session: ChatSession, userMessage: string): ChatResponse {
    const { collectingData } = session.context;
    if (!collectingData) {
      return {
        message: this.getRandomResponse('error'),
        sessionId: session.id
      };
    }

    const flow = this.conversationFlows[collectingData.type];
    const currentStep = flow.steps[collectingData.step];
    
    // Validate and store user input
    const isValid = this.validateInput(userMessage, currentStep.validation);
    
    if (!isValid && currentStep.validation !== 'optional') {
      return {
        message: `I'm sorry, that doesn't seem to be a valid ${currentStep.field}. ${currentStep.question}`,
        sessionId: session.id,
        metadata: {
          action: collectingData.type,
          nextStep: currentStep.field
        }
      };
    }

    // Store the data
    collectingData.data[currentStep.field] = userMessage;
    collectingData.step++;

    // Check if we've completed all steps
    if (collectingData.step >= flow.steps.length) {
      return this.completeFlow(session);
    }

    // Move to next step
    const nextStep = flow.steps[collectingData.step];
    
    return {
      message: `Great! ${nextStep.question}`,
      sessionId: session.id,
      metadata: {
        action: collectingData.type,
        nextStep: nextStep.field
      }
    };
  }

  /**
   * Complete the conversation flow and create the resource
   */
  private completeFlow(session: ChatSession): ChatResponse {
    const { collectingData } = session.context;
    if (!collectingData) {
      return {
        message: this.getRandomResponse('error'),
        sessionId: session.id
      };
    }

    const resourceId = this.createResource(collectingData.type, collectingData.data);
    
    // Clear the collecting data
    session.context.collectingData = undefined;
    session.context.currentAction = undefined;

    const successMessages = {
      quotation: `Perfect! I've created the quotation successfully.\n\n**Quotation ID:** ${resourceId}\n**Client:** ${collectingData.data.clientName}\n**Email:** ${collectingData.data.clientEmail}\n\nThe quotation has been saved and is ready to be sent. Is there anything else I can help you with?`,
      service: `Excellent! I've registered the new service successfully.\n\n**Service ID:** ${resourceId}\n**Name:** ${collectingData.data.name}\n**Category:** ${collectingData.data.category}\n\nThe service is now available in your catalog. What else can I help you with?`,
      client: `Great! I've registered the new client successfully.\n\n**Client ID:** ${resourceId}\n**Name:** ${collectingData.data.name}\n**Email:** ${collectingData.data.email}\n\nThe client is now in your system. How else can I assist you?`
    };

    return {
      message: successMessages[collectingData.type],
      sessionId: session.id,
      metadata: {
        action: `${collectingData.type}_completed`,
        data: { id: resourceId, ...collectingData.data }
      }
    };
  }

  /**
   * Mock resource creation (in real implementation, this would call actual services)
   */
  private createResource(type: string, data: Record<string, any>): string {
    const id = uuidv4().substring(0, 8).toUpperCase();
    
    switch (type) {
      case 'quotation':
        logger.info(`Created quotation ${id} for client ${data.clientName}`);
        return `QUO-${id}`;
      case 'service':
        logger.info(`Created service ${id}: ${data.name}`);
        return `SRV-${id}`;
      case 'client':
        logger.info(`Created client ${id}: ${data.name}`);
        return `CLI-${id}`;
      default:
        return `RES-${id}`;
    }
  }

  /**
   * Validate user input
   */
  private validateInput(input: string, validation: string): boolean {
    switch (validation) {
      case 'required':
        return input.trim().length > 0;
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
      case 'number':
        return !isNaN(parseFloat(input)) && isFinite(parseFloat(input));
      case 'optional':
        return true;
      case 'confirmation':
        return /yes|sim|y|s|ok|confirm|confirma/i.test(input);
      default:
        return true;
    }
  }

  /**
   * Generate session title based on intent and message
   */
  private generateSessionTitle(intentType: string, message: string): string {
    const titles = {
      create_quotation: 'New Quotation Request',
      register_service: 'Service Registration',
      register_client: 'Client Registration',
      general_inquiry: 'General Inquiry'
    };

    return titles[intentType] || 'Chat Session';
  }

  /**
   * Get random response from array
   */
  private getRandomResponse(type: string): string {
    const responses = this.mockResponses[type] || this.mockResponses.error;
    return responses[Math.floor(Math.random() * responses.length)];
  }
}
