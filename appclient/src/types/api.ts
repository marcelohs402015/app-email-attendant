export interface EmailData {
  id: number;
  gmailId: string;
  subject: string;
  from: string;
  date: string;
  body: string;
  snippet: string;
  category: string;
  confidence: number;
  processed: boolean;
  responded: boolean;
  responseTemplate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category?: string;
  variables?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CategoryStats {
  category: string;
  count: number;
  responded_count: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  patterns: string[];
  domains: string[];
  color: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface FilterOptions {
  category?: string;
  from?: string;
  dateFrom?: string;
  dateTo?: string;
  responded?: boolean;
  processed?: boolean;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// Services and Quotations
export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  defaultPrice: number;
  unit: string; // 'hora', 'dia', 'metro', 'unidade', etc.
  estimatedDuration: number; // em horas
  materials?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface QuotationItem {
  serviceId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  notes?: string;
}

export interface Quotation {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientAddress?: string;
  items: QuotationItem[];
  subtotal: number;
  discount?: number;
  total: number;
  notes?: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'completed';
  validUntil: string;
  createdAt: string;
  updatedAt: string;
}

// Calendar Availability
export interface TimeSlot {
  start: string; // HH:MM
  end: string; // HH:MM
}

export interface AvailabilityDay {
  date: string; // YYYY-MM-DD
  isAvailable: boolean;
  timeSlots: TimeSlot[];
  notes?: string;
}

export interface WeeklyAvailability {
  id: string;
  dayOfWeek: number; // 0=Sunday, 1=Monday, etc.
  isAvailable: boolean;
  timeSlots: TimeSlot[];
  effectiveFrom: string;
  effectiveUntil?: string;
}

export interface CalendarAvailability {
  id: string;
  type: 'specific' | 'weekly' | 'monthly';
  specificDays?: AvailabilityDay[];
  weeklyPattern?: WeeklyAvailability[];
  createdAt: string;
  updatedAt: string;
}

// Client Management
export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Calendar Appointments
export interface Appointment {
  id: string;
  clientId: string;
  client: Client;
  quotationId?: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  location?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// AI Automation Types
export interface AutomationRule {
  id: string;
  name: string;
  description?: string;
  keywords: string[];
  serviceIds: string[];
  isActive: boolean;
  conditions: {
    minConfidence: number;
    emailCategories: string[];
    senderDomain: string;
    requireAllKeywords: boolean;
  };
  actions: {
    generateQuote: boolean;
    autoSend: boolean;
    notifyManager: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PendingQuote {
  id: string;
  emailId: number;
  email: EmailData;
  ruleId: string;
  rule: AutomationRule;
  generatedQuote: Quotation;
  aiAnalysis: {
    detectedKeywords: string[];
    confidence: number;
    extractedInfo: {
      clientName?: string;
      urgency?: 'low' | 'medium' | 'high';
      estimatedBudget?: number;
      preferredDate?: string;
      description?: string;
    };
    matchedServices: Array<{
      serviceId: string;
      serviceName: string;
      relevanceScore: number;
    }>;
  };
  status: 'pending' | 'approved' | 'rejected' | 'sent';
  managerNotes?: string;
  processedAt: string;
  approvedAt?: string;
  sentAt?: string;
}

export interface AutomationMetrics {
  totalRules: number;
  activeRules: number;
  emailsProcessed: number;
  quotesGenerated: number;
  quotesApproved: number;
  quotesSent: number;
  averageConfidence: number;
  conversionRate: number; // approved/generated
  responseTime: number; // average time from email to quote
  periodStats: {
    period: string;
    processed: number;
    generated: number;
    approved: number;
    sent: number;
  }[];
}

// Chat System Types - v2.0
export interface ChatMessage {
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

export interface ChatAction {
  id: string;
  type: 'create_quotation' | 'register_service' | 'register_client' | 'view_details';
  label: string;
  data: any;
  requiresConfirmation: boolean;
}

export interface ChatSession {
  id: string;
  clientId?: string;
  title: string;
  messages: ChatMessage[];
  status: 'active' | 'completed' | 'archived';
  context: ChatContext;
  createdAt: string;
  updatedAt: string;
}

export interface ChatContext {
  currentAction?: string;
  collectingData?: {
    type: 'quotation' | 'service' | 'client';
    step: number;
    data: Record<string, any>;
  };
  lastClientId?: string;
  preferredServices?: string[];
}

export interface ChatQuotationData {
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  services: Array<{
    serviceId: string;
    quantity: number;
    notes?: string;
  }>;
  urgency?: 'low' | 'medium' | 'high';
  description?: string;
  budget?: number;
}

export interface ChatServiceData {
  name: string;
  description: string;
  category: string;
  defaultPrice: number;
  unit: string;
  estimatedDuration: number;
  materials?: string[];
}

export interface ChatClientData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  notes?: string;
}

export interface ChatResponse {
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

export interface ChatIntent {
  type: 'create_quotation' | 'register_service' | 'register_client' | 'general_inquiry' | 'help';
  confidence: number;
  entities: Record<string, any>;
}