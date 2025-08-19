import { ChatSession, ChatAction } from '../types/api';

// Mock Chat Sessions
export const mockChatSessions: ChatSession[] = [
  {
    id: 'session-1',
    title: 'Quotation for Kitchen Renovation',
    status: 'active',
    context: {
      currentAction: 'create_quotation',
      collectingData: {
        type: 'quotation',
        step: 3,
        data: {
          clientName: 'John Smith',
          clientEmail: 'john@email.com',
          services: ['electrical', 'plumbing']
        }
      }
    },
    messages: [
      {
        id: 'msg-1',
        sessionId: 'session-1',
        type: 'user',
        content: 'I need a quote for kitchen renovation',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'msg-2',
        sessionId: 'session-1',
        type: 'assistant',
        content: 'I\'d be happy to help you create a quote for your kitchen renovation! To provide an accurate estimate, I\'ll need some details. What\'s your name?',
        timestamp: new Date(Date.now() - 3500000).toISOString(),
        metadata: {
          action: 'create_quotation',
          confidence: 0.95
        }
      }
    ],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: 'session-2',
    title: 'Service Registration - Gardening',
    status: 'completed',
    context: {
      currentAction: 'register_service'
    },
    messages: [
      {
        id: 'msg-3',
        sessionId: 'session-2',
        type: 'user',
        content: 'I want to add a new gardening service',
        timestamp: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: 'msg-4',
        sessionId: 'session-2',
        type: 'assistant',
        content: 'Perfect! I\'ll help you register a new gardening service. Service has been created successfully with ID: SRV-GARDEN-001.',
        timestamp: new Date(Date.now() - 7100000).toISOString(),
        metadata: {
          action: 'register_service',
          data: {
            serviceId: 'SRV-GARDEN-001'
          }
        }
      }
    ],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 7100000).toISOString()
  }
];

// Mock Chat Actions
export const mockChatActions: ChatAction[] = [
  {
    id: 'action-1',
    type: 'create_quotation',
    label: 'Create Quotation',
    data: {
      clientName: 'John Smith',
      services: ['electrical', 'plumbing']
    },
    requiresConfirmation: true
  },
  {
    id: 'action-2',
    type: 'register_client',
    label: 'Register New Client',
    data: {
      name: 'John Smith',
      email: 'john@email.com'
    },
    requiresConfirmation: false
  }
];

// Mock AI Responses for different intents
export const mockAIResponses = {
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
  
  general_inquiry: [
    "I'm here to help! Could you please provide more details about what you'd like to know or do?",
    "I'd be happy to assist you. Could you be more specific about what you need help with?",
    "Sure! I'm here to help with your business needs. What specific information or task can I assist you with?"
  ],
  
  help: [
    "I can help you with several tasks:\n\n• **Create Quotations** - Generate professional quotes for your clients\n• **Register Services** - Add new services to your catalog\n• **Manage Clients** - Register and update client information\n• **General Questions** - Ask about your business, schedules, or services\n\nJust tell me what you'd like to do!",
    "Here's what I can help you with:\n\n✅ Creating detailed quotations\n✅ Adding new services\n✅ Registering clients\n✅ Answering business questions\n✅ Managing your workflow\n\nWhat would you like to start with?",
    "I'm your business assistant! I can help with:\n\n🔧 **Services** - Add, update, or manage your service catalog\n💰 **Quotations** - Create professional estimates for clients\n👥 **Clients** - Register and manage customer information\n❓ **Support** - Answer questions about your business\n\nHow can I assist you today?"
  ],
  
  error: [
    "I'm sorry, I didn't quite understand that. Could you please rephrase your request or try asking in a different way?",
    "I apologize, but I'm not sure how to help with that. Could you provide more details or try asking about quotations, services, or clients?",
    "I'm having trouble understanding your request. Could you please be more specific about what you'd like me to help you with?"
  ]
};

// Mock Intent Detection Patterns
export const mockIntentPatterns = {
  create_quotation: [
    /quote|quotation|estimate|price|cost|budget/i,
    /orçamento|preço|custo/i,
    /how much|quanto custa/i
  ],
  register_service: [
    /service|add service|new service|register service/i,
    /serviço|adicionar serviço|novo serviço/i,
    /cadastrar serviço/i
  ],
  register_client: [
    /client|customer|add client|new client|register client/i,
    /cliente|adicionar cliente|novo cliente/i,
    /cadastrar cliente/i
  ],
  help: [
    /help|ajuda|what can you do|o que você pode fazer/i,
    /commands|comandos|options|opções/i
  ],
  greeting: [
    /hello|hi|hey|oi|olá|good morning|good afternoon/i,
    /bom dia|boa tarde|boa noite/i
  ]
};

// Mock conversation flows
export const mockConversationFlows = {
  quotation: {
    steps: [
      { field: 'clientName', question: 'What\'s the client\'s name?', validation: 'required' },
      { field: 'clientEmail', question: 'What\'s their email address?', validation: 'email' },
      { field: 'services', question: 'What services do they need? You can mention multiple services.', validation: 'required' },
      { field: 'urgency', question: 'How urgent is this project? (low, medium, high)', validation: 'optional' },
      { field: 'budget', question: 'Do they have a specific budget in mind?', validation: 'optional' },
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
      { field: 'duration', question: 'How long does this service typically take? (in hours)', validation: 'number' },
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

// Export default object with all mock data
const mockData = {
  sessions: mockChatSessions,
  actions: mockChatActions,
  responses: mockAIResponses,
  patterns: mockIntentPatterns,
  flows: mockConversationFlows
};

export default mockData;
