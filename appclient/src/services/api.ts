import { EmailData, EmailTemplate, CategoryStats, ApiResponse, PaginatedResponse, FilterOptions, PaginationOptions, Service, ServiceCategory, Quotation, CalendarAvailability, Client, Appointment, AutomationRule, PendingQuote, AutomationMetrics, Category, ChatSession, ChatMessage, ChatResponse } from '../types/api';
import axios from 'axios';
import { API_CONFIG } from '../config/api';

// Real API service that connects to backend
const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const emailAPI = {
  // Get emails with filters and pagination
  getEmails: async (filters?: FilterOptions, pagination?: PaginationOptions): Promise<ApiResponse<PaginatedResponse<EmailData>>> => {
    try {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.from) params.append('from', filters.from);
      if (filters?.responded !== undefined) params.append('responded', filters.responded.toString());
      if (filters?.processed !== undefined) params.append('processed', filters.processed.toString());
      if (pagination?.page) params.append('page', pagination.page.toString());
      if (pagination?.limit) params.append('limit', pagination.limit.toString());

      const response = await axiosInstance.get(`/emails?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch emails:', error);
      return {
        success: false,
        error: 'Failed to fetch emails',
        data: { items: [], total: 0, page: 1, limit: 10, totalPages: 0 }
      };
    }
  },

  // Get email by ID
  getEmail: async (id: number): Promise<ApiResponse<EmailData>> => {
    try {
      const response = await axiosInstance.get(`/emails/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch email:', error);
      return { success: false, error: 'Failed to fetch email' };
    }
  },

  // Sync emails from Gmail
  syncEmails: async (): Promise<ApiResponse<{ synced: number }>> => {
    try {
      const response = await axiosInstance.post('/emails/sync');
      return response.data;
    } catch (error) {
      console.error('Failed to sync emails:', error);
      return { success: false, error: 'Failed to sync emails' };
    }
  },

  // Reply to email
  replyToEmail: async (id: number, templateId: string, customMessage?: string): Promise<ApiResponse<{ sent: boolean }>> => {
    try {
      const response = await axiosInstance.post(`/emails/${id}/reply`, {
        templateId,
        customMessage
      });
      return response.data;
    } catch (error) {
      console.error('Failed to reply to email:', error);
      return { success: false, error: 'Failed to reply to email' };
    }
  },

  // Update email status
  updateEmailStatus: async (id: number, status: { processed?: boolean; responded?: boolean }): Promise<ApiResponse<EmailData>> => {
    try {
      const response = await axiosInstance.patch(`/emails/${id}/status`, status);
      return response.data;
    } catch (error) {
      console.error('Failed to update email status:', error);
      return { success: false, error: 'Failed to update email status' };
    }
  }
};

export const templateAPI = {
  // Get all templates
  getTemplates: async (): Promise<ApiResponse<EmailTemplate[]>> => {
    try {
      const response = await axiosInstance.get('/templates');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      return { success: false, error: 'Failed to fetch templates', data: [] };
    }
  },

  // Get template by ID
  getTemplate: async (id: string): Promise<ApiResponse<EmailTemplate>> => {
    try {
      const response = await axiosInstance.get(`/templates/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch template:', error);
      return { success: false, error: 'Failed to fetch template' };
    }
  },

  // Create template
  createTemplate: async (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<EmailTemplate>> => {
    try {
      const response = await axiosInstance.post('/templates', template);
      return response.data;
    } catch (error) {
      console.error('Failed to create template:', error);
      return { success: false, error: 'Failed to create template' };
    }
  },

  // Update template
  updateTemplate: async (id: string, template: Partial<EmailTemplate>): Promise<ApiResponse<EmailTemplate>> => {
    try {
      const response = await axiosInstance.put(`/templates/${id}`, template);
      return response.data;
    } catch (error) {
      console.error('Failed to update template:', error);
      return { success: false, error: 'Failed to update template' };
    }
  },

  // Delete template
  deleteTemplate: async (id: string): Promise<ApiResponse<{ deleted: boolean }>> => {
    try {
      const response = await axiosInstance.delete(`/templates/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete template:', error);
      return { success: false, error: 'Failed to delete template' };
    }
  }
};

export const categoryAPI = {
  // Get all categories
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    try {
      const response = await axiosInstance.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return { success: false, error: 'Failed to fetch categories', data: [] };
    }
  },

  // Get category by ID
  getCategory: async (id: number): Promise<ApiResponse<Category>> => {
    try {
      const response = await axiosInstance.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch category:', error);
      return { success: false, error: 'Failed to fetch category' };
    }
  },

  // Create category
  createCategory: async (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Category>> => {
    try {
      const response = await axiosInstance.post('/categories', category);
      return response.data;
    } catch (error) {
      console.error('Failed to create category:', error);
      return { success: false, error: 'Failed to create category' };
    }
  },

  // Update category
  updateCategory: async (id: number, category: Partial<Category>): Promise<ApiResponse<Category>> => {
    try {
      const response = await axiosInstance.put(`/categories/${id}`, category);
      return response.data;
    } catch (error) {
      console.error('Failed to update category:', error);
      return { success: false, error: 'Failed to update category' };
    }
  },

  // Delete category
  deleteCategory: async (id: number): Promise<ApiResponse<{ deleted: boolean }>> => {
    try {
      const response = await axiosInstance.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete category:', error);
      return { success: false, error: 'Failed to delete category' };
    }
  },

  // Get category statistics
  getCategoryStats: async (): Promise<ApiResponse<CategoryStats[]>> => {
    try {
      const response = await axiosInstance.get('/categories/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch category stats:', error);
      return { success: false, error: 'Failed to fetch category stats', data: [] };
    }
  }
};

export const serviceAPI = {
  // Get all services
  getServices: async (): Promise<ApiResponse<Service[]>> => {
    try {
      const response = await axiosInstance.get('/services');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch services:', error);
      return { success: false, error: 'Failed to fetch services', data: [] };
    }
  },

  // Get service by ID
  getService: async (id: string): Promise<ApiResponse<Service>> => {
    try {
      const response = await axiosInstance.get(`/services/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch service:', error);
      return { success: false, error: 'Failed to fetch service' };
    }
  },

  // Create service
  createService: async (service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Service>> => {
    try {
      const response = await axiosInstance.post('/services', service);
      return response.data;
    } catch (error) {
      console.error('Failed to create service:', error);
      return { success: false, error: 'Failed to create service' };
    }
  },

  // Update service
  updateService: async (id: string, service: Partial<Service>): Promise<ApiResponse<Service>> => {
    try {
      const response = await axiosInstance.put(`/services/${id}`, service);
      return response.data;
    } catch (error) {
      console.error('Failed to update service:', error);
      return { success: false, error: 'Failed to update service' };
    }
  },

  // Delete service
  deleteService: async (id: string): Promise<ApiResponse<{ deleted: boolean }>> => {
    try {
      const response = await axiosInstance.delete(`/services/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete service:', error);
      return { success: false, error: 'Failed to delete service' };
    }
  }
};

export const clientAPI = {
  // Get all clients
  getClients: async (): Promise<ApiResponse<Client[]>> => {
    try {
      const response = await axiosInstance.get('/clients');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      return { success: false, error: 'Failed to fetch clients', data: [] };
    }
  },

  // Get client by ID
  getClient: async (id: string): Promise<ApiResponse<Client>> => {
    try {
      const response = await axiosInstance.get(`/clients/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch client:', error);
      return { success: false, error: 'Failed to fetch client' };
    }
  },

  // Create client
  createClient: async (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Client>> => {
    try {
      const response = await axiosInstance.post('/clients', client);
      return response.data;
    } catch (error) {
      console.error('Failed to create client:', error);
      return { success: false, error: 'Failed to create client' };
    }
  },

  // Update client
  updateClient: async (id: string, client: Partial<Client>): Promise<ApiResponse<Client>> => {
    try {
      const response = await axiosInstance.put(`/clients/${id}`, client);
      return response.data;
    } catch (error) {
      console.error('Failed to update client:', error);
      return { success: false, error: 'Failed to update client' };
    }
  },

  // Delete client
  deleteClient: async (id: string): Promise<ApiResponse<{ deleted: boolean }>> => {
    try {
      const response = await axiosInstance.delete(`/clients/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete client:', error);
      return { success: false, error: 'Failed to delete client' };
    }
  }
};

export const quotationAPI = {
  // Get all quotations
  getQuotations: async (): Promise<ApiResponse<Quotation[]>> => {
    try {
      const response = await axiosInstance.get('/quotations');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch quotations:', error);
      return { success: false, error: 'Failed to fetch quotations', data: [] };
    }
  },

  // Get quotation by ID
  getQuotation: async (id: string): Promise<ApiResponse<Quotation>> => {
    try {
      const response = await axiosInstance.get(`/quotations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch quotation:', error);
      return { success: false, error: 'Failed to fetch quotation' };
    }
  },

  // Create quotation
  createQuotation: async (quotation: Omit<Quotation, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Quotation>> => {
    try {
      const response = await axiosInstance.post('/quotations', quotation);
      return response.data;
    } catch (error) {
      console.error('Failed to create quotation:', error);
      return { success: false, error: 'Failed to create quotation' };
    }
  },

  // Update quotation
  updateQuotation: async (id: string, quotation: Partial<Quotation>): Promise<ApiResponse<Quotation>> => {
    try {
      const response = await axiosInstance.put(`/quotations/${id}`, quotation);
      return response.data;
    } catch (error) {
      console.error('Failed to update quotation:', error);
      return { success: false, error: 'Failed to update quotation' };
    }
  },

  // Delete quotation
  deleteQuotation: async (id: string): Promise<ApiResponse<{ deleted: boolean }>> => {
    try {
      const response = await axiosInstance.delete(`/quotations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete quotation:', error);
      return { success: false, error: 'Failed to delete quotation' };
    }
  },

  // Send quotation by email
  sendQuotation: async (id: string): Promise<ApiResponse<{ sent: boolean }>> => {
    try {
      const response = await axiosInstance.post(`/quotations/${id}/send`);
      return response.data;
    } catch (error) {
      console.error('Failed to send quotation:', error);
      return { success: false, error: 'Failed to send quotation' };
    }
  }
};

export const appointmentAPI = {
  // Get all appointments
  getAppointments: async (): Promise<ApiResponse<Appointment[]>> => {
    try {
      const response = await axiosInstance.get('/appointments');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      return { success: false, error: 'Failed to fetch appointments', data: [] };
    }
  },

  // Get appointment by ID
  getAppointment: async (id: string): Promise<ApiResponse<Appointment>> => {
    try {
      const response = await axiosInstance.get(`/appointments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch appointment:', error);
      return { success: false, error: 'Failed to fetch appointment' };
    }
  },

  // Create appointment
  createAppointment: async (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Appointment>> => {
    try {
      const response = await axiosInstance.post('/appointments', appointment);
      return response.data;
    } catch (error) {
      console.error('Failed to create appointment:', error);
      return { success: false, error: 'Failed to create appointment' };
    }
  },

  // Update appointment
  updateAppointment: async (id: string, appointment: Partial<Appointment>): Promise<ApiResponse<Appointment>> => {
    try {
      const response = await axiosInstance.put(`/appointments/${id}`, appointment);
      return response.data;
    } catch (error) {
      console.error('Failed to update appointment:', error);
      return { success: false, error: 'Failed to update appointment' };
    }
  },

  // Delete appointment
  deleteAppointment: async (id: string): Promise<ApiResponse<{ deleted: boolean }>> => {
    try {
      const response = await axiosInstance.delete(`/appointments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete appointment:', error);
      return { success: false, error: 'Failed to delete appointment' };
    }
  }
};

export const automationAPI = {
  // Get automation metrics
  getMetrics: async (): Promise<ApiResponse<AutomationMetrics>> => {
    try {
      const response = await axiosInstance.get('/automation/metrics');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch automation metrics:', error);
      return { 
        success: false, 
        error: 'Failed to fetch automation metrics',
        data: {
          totalRules: 0,
          activeRules: 0,
          emailsProcessed: 0,
          quotesGenerated: 0,
          successRate: 0,
          avgResponseTime: 0
        }
      };
    }
  },

  // Get automation rules
  getRules: async (): Promise<ApiResponse<AutomationRule[]>> => {
    try {
      const response = await axiosInstance.get('/automation/rules');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch automation rules:', error);
      return { success: false, error: 'Failed to fetch automation rules', data: [] };
    }
  },

  // Create automation rule
  createRule: async (rule: Omit<AutomationRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<AutomationRule>> => {
    try {
      const response = await axiosInstance.post('/automation/rules', rule);
      return response.data;
    } catch (error) {
      console.error('Failed to create automation rule:', error);
      return { success: false, error: 'Failed to create automation rule' };
    }
  },

  // Update automation rule
  updateRule: async (id: string, rule: Partial<AutomationRule>): Promise<ApiResponse<AutomationRule>> => {
    try {
      const response = await axiosInstance.put(`/automation/rules/${id}`, rule);
      return response.data;
    } catch (error) {
      console.error('Failed to update automation rule:', error);
      return { success: false, error: 'Failed to update automation rule' };
    }
  },

  // Delete automation rule
  deleteRule: async (id: string): Promise<ApiResponse<{ deleted: boolean }>> => {
    try {
      const response = await axiosInstance.delete(`/automation/rules/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete automation rule:', error);
      return { success: false, error: 'Failed to delete automation rule' };
    }
  },

  // Get pending quotes
  getPendingQuotes: async (): Promise<ApiResponse<PendingQuote[]>> => {
    try {
      const response = await axiosInstance.get('/automation/pending-quotes');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch pending quotes:', error);
      return { success: false, error: 'Failed to fetch pending quotes', data: [] };
    }
  },

  // Approve pending quote
  approvePendingQuote: async (id: string): Promise<ApiResponse<{ approved: boolean }>> => {
    try {
      const response = await axiosInstance.post(`/automation/pending-quotes/${id}/approve`);
      return response.data;
    } catch (error) {
      console.error('Failed to approve pending quote:', error);
      return { success: false, error: 'Failed to approve pending quote' };
    }
  },

  // Reject pending quote
  rejectPendingQuote: async (id: string, reason?: string): Promise<ApiResponse<{ rejected: boolean }>> => {
    try {
      const response = await axiosInstance.post(`/automation/pending-quotes/${id}/reject`, { reason });
      return response.data;
    } catch (error) {
      console.error('Failed to reject pending quote:', error);
      return { success: false, error: 'Failed to reject pending quote' };
    }
  }
};

export const chatAPI = {
  // Get chat sessions
  getSessions: async (): Promise<ApiResponse<ChatSession[]>> => {
    try {
      const response = await axiosInstance.get('/chat/sessions');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch chat sessions:', error);
      return { success: false, error: 'Failed to fetch chat sessions', data: [] };
    }
  },

  // Get chat session by ID
  getSession: async (id: string): Promise<ApiResponse<ChatSession>> => {
    try {
      const response = await axiosInstance.get(`/chat/sessions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch chat session:', error);
      return { success: false, error: 'Failed to fetch chat session' };
    }
  },

  // Send message
  sendMessage: async (sessionId: string, message: string): Promise<ApiResponse<ChatResponse>> => {
    try {
      const response = await axiosInstance.post(`/chat/sessions/${sessionId}/messages`, { message });
      return response.data;
    } catch (error) {
      console.error('Failed to send message:', error);
      return { success: false, error: 'Failed to send message' };
    }
  },

  // Create new chat session
  createSession: async (): Promise<ApiResponse<ChatSession>> => {
    try {
      const response = await axiosInstance.post('/chat/sessions');
      return response.data;
    } catch (error) {
      console.error('Failed to create chat session:', error);
      return { success: false, error: 'Failed to create chat session' };
    }
  }
};

// Unified API export
export const api = {
  email: emailAPI,
  template: templateAPI,
  category: categoryAPI,
  service: serviceAPI,
  client: clientAPI,
  quotation: quotationAPI,
  appointment: appointmentAPI,
  automation: automationAPI,
  chat: chatAPI
};

export default api;