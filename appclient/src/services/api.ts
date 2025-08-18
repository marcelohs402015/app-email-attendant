import { EmailData, EmailTemplate, CategoryStats, ApiResponse, PaginatedResponse, FilterOptions, PaginationOptions, Service, ServiceCategory, Quotation, CalendarAvailability, Client, Appointment, AutomationRule, PendingQuote, AutomationMetrics, Category, ChatSession, ChatMessage, ChatResponse } from '../types/api';
import { mockEmails } from '../data/mockEmails';
import { mockTemplates, mockCategoryStats, mockServices, mockServiceCategories, mockQuotations, mockCalendarAvailability, mockClients, mockAppointments, mockAutomationRules, mockPendingQuotes, mockAutomationMetrics, mockCategories } from '../data/mockData';
import mockChatData from '../data/mockChatData';

// Mock API service that simulates real API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const emailAPI = {
  // Get emails with filters and pagination
  getEmails: async (filters: FilterOptions = {}, pagination: PaginationOptions = { page: 1, limit: 50 }): Promise<PaginatedResponse<EmailData>> => {
    await delay(500); // Simulate network delay
    
    let filteredEmails = [...mockEmails];
    
    // Apply filters
    if (filters.category) {
      filteredEmails = filteredEmails.filter(email => email.category === filters.category);
    }
    if (filters.from) {
      filteredEmails = filteredEmails.filter(email => email.from.toLowerCase().includes(filters.from!.toLowerCase()));
    }
    if (filters.responded !== undefined) {
      filteredEmails = filteredEmails.filter(email => email.responded === filters.responded);
    }
    if (filters.processed !== undefined) {
      filteredEmails = filteredEmails.filter(email => email.processed === filters.processed);
    }
    
    // Apply pagination
    const total = filteredEmails.length;
    const pages = Math.ceil(total / pagination.limit);
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    const paginatedEmails = filteredEmails.slice(start, end);
    
    return {
      success: true,
      data: paginatedEmails,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        pages
      }
    };
  },

  // Get specific email by ID
  getEmailById: async (id: number): Promise<ApiResponse<EmailData>> => {
    await delay(300);
    
    const email = mockEmails.find(e => e.id === id);
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

  // Sync emails from Gmail (mock)
  syncEmails: async (query?: string, maxResults?: number): Promise<ApiResponse<{ synced: number; total_fetched: number }>> => {
    await delay(2000); // Simulate longer operation
    
    const syncedCount = Math.floor(Math.random() * 10) + 1;
    return {
      success: true,
      data: {
        synced: syncedCount,
        total_fetched: syncedCount + Math.floor(Math.random() * 5)
      },
      message: `${syncedCount} emails sincronizados com sucesso`
    };
  },

  // Reply to email (mock)
  replyToEmail: async (emailId: number, templateId?: string, customMessage?: string, quotationId?: string): Promise<ApiResponse<void>> => {
    await delay(1000);
    
    // Update the email as responded in mock data
    const emailIndex = mockEmails.findIndex(e => e.id === emailId);
    if (emailIndex !== -1) {
      mockEmails[emailIndex] = {
        ...mockEmails[emailIndex],
        responded: true,
        responseTemplate: templateId,
        updatedAt: new Date().toISOString()
      };
    }
    
    // Log quotation attachment if provided
    if (quotationId) {
      console.log(`Email ${emailId} replied with quotation ${quotationId} attached`);
    }
    
    return {
      success: true,
      message: quotationId ? 'Response sent with quotation attached successfully' : 'Response sent successfully'
    };
  },

  // Update email status (mock)
  updateEmailStatus: async (emailId: number, updates: { processed?: boolean; responded?: boolean }): Promise<ApiResponse<void>> => {
    await delay(300);
    
    const emailIndex = mockEmails.findIndex(e => e.id === emailId);
    if (emailIndex !== -1) {
      mockEmails[emailIndex] = {
        ...mockEmails[emailIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
    }
    
    return {
      success: true,
      message: 'Status updated successfully'
    };
  },

  // Get email templates
  getTemplates: async (category?: string): Promise<ApiResponse<EmailTemplate[]>> => {
    await delay(300);
    
    let templates = [...mockTemplates];
    if (category) {
      templates = templates.filter(template => template.category === category);
    }
    
    return {
      success: true,
      data: templates
    };
  },

  // Create email template
  createTemplate: async (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<EmailTemplate>> => {
    await delay(500);
    
    const newTemplate: EmailTemplate = {
      ...template,
      id: `template_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockTemplates.push(newTemplate);
    
    return {
      success: true,
      data: newTemplate,
      message: 'Template created successfully'
    };
  },

  // Update email template
  updateTemplate: async (templateId: string, updates: Partial<Omit<EmailTemplate, 'id' | 'createdAt'>>): Promise<ApiResponse<EmailTemplate>> => {
    await delay(500);
    
    const templateIndex = mockTemplates.findIndex(t => t.id === templateId);
    if (templateIndex === -1) {
      return {
        success: false,
        error: 'Template not found'
      };
    }
    
    const updatedTemplate = {
      ...mockTemplates[templateIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    mockTemplates[templateIndex] = updatedTemplate;
    
    return {
      success: true,
      data: updatedTemplate,
      message: 'Template updated successfully'
    };
  },

  // Delete email template
  deleteTemplate: async (templateId: string): Promise<ApiResponse<void>> => {
    await delay(500);
    
    const templateIndex = mockTemplates.findIndex(t => t.id === templateId);
    if (templateIndex === -1) {
      return {
        success: false,
        error: 'Template not found'
      };
    }
    
    mockTemplates.splice(templateIndex, 1);
    
    return {
      success: true,
      message: 'Template deleted successfully'
    };
  },

  // Get template by ID
  getTemplateById: async (templateId: string): Promise<ApiResponse<EmailTemplate>> => {
    await delay(300);
    
    const template = mockTemplates.find(t => t.id === templateId);
    if (!template) {
      return {
        success: false,
        error: 'Template not found'
      };
    }
    
    return {
      success: true,
      data: template
    };
  },

  // Get category statistics
  getCategoryStats: async (): Promise<ApiResponse<CategoryStats[]>> => {
    await delay(400);
    
    return {
      success: true,
      data: [...mockCategoryStats]
    };
  },

  // Get business statistics for handyman services
  getBusinessStats: async (): Promise<ApiResponse<any>> => {
    await delay(400);
    
    // Calculate service demand stats
    const servicesByCategory = mockServices.reduce((acc, service) => {
      acc[service.category] = (acc[service.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate quotation stats
    const quotationStats = {
      total: mockQuotations.length,
      accepted: mockQuotations.filter(q => q.status === 'accepted').length,
      pending: mockQuotations.filter(q => q.status === 'sent').length,
      rejected: mockQuotations.filter(q => q.status === 'rejected').length,
      completed: mockQuotations.filter(q => q.status === 'completed').length,
      averageValue: mockQuotations.length > 0 ? 
        mockQuotations.reduce((sum, q) => sum + q.total, 0) / mockQuotations.length : 0
    };

    // Calculate appointment stats
    const appointmentStats = {
      total: mockAppointments.length,
      scheduled: mockAppointments.filter(a => a.status === 'scheduled').length,
      confirmed: mockAppointments.filter(a => a.status === 'confirmed').length,
      completed: mockAppointments.filter(a => a.status === 'completed').length,
      inProgress: mockAppointments.filter(a => a.status === 'in_progress').length,
      cancelled: mockAppointments.filter(a => a.status === 'cancelled').length
    };

    // Calculate client stats
    const clientStats = {
      total: mockClients.length,
      active: mockClients.filter(c => c.isActive).length,
      withAppointments: mockClients.filter(c => 
        mockAppointments.some(a => a.clientId === c.id)
      ).length,
      withQuotations: mockClients.filter(c => 
        mockQuotations.some(q => q.clientEmail === c.email)
      ).length
    };

    // Calculate revenue estimation
    const totalRevenue = mockQuotations
      .filter(q => q.status === 'accepted' || q.status === 'completed')
      .reduce((sum, q) => sum + q.total, 0);

    // Service category performance
    const categoryPerformance = mockServiceCategories.map(category => {
      const categoryServices = mockServices.filter(s => s.category === category.id);
      const categoryQuotations = mockQuotations.filter(q => 
        q.items.some(item => 
          categoryServices.some(s => s.id === item.serviceId)
        )
      );
      
      return {
        id: category.id,
        name: category.name,
        servicesCount: categoryServices.length,
        quotationsCount: categoryQuotations.length,
        averagePrice: categoryServices.length > 0 ? 
          categoryServices.reduce((sum, s) => sum + s.defaultPrice, 0) / categoryServices.length : 0,
        color: category.color
      };
    });

    // Response time analysis (based on email data)
    const emailResponseTime = {
      totalEmails: mockEmails.length,
      respondedEmails: mockEmails.filter(e => e.responded).length,
      pendingEmails: mockEmails.filter(e => !e.responded).length,
      responseRate: mockEmails.length > 0 ? 
        (mockEmails.filter(e => e.responded).length / mockEmails.length) * 100 : 0
    };

    const businessStats = {
      servicesByCategory,
      quotationStats,
      appointmentStats,
      clientStats,
      totalRevenue,
      categoryPerformance,
      emailResponseTime
    };
    
    return {
      success: true,
      data: businessStats
    };
  },

  // Get revenue statistics by period
  getRevenueStats: async (period: string = 'monthly'): Promise<ApiResponse<any>> => {
    await delay(300);
    
    // Mock revenue data for demonstration
    const revenueData = {
      monthly: [
        { period: 'Jan 2024', revenue: 3250.00, quotations: 8, completed: 6 },
        { period: 'Fev 2024', revenue: 4100.00, quotations: 12, completed: 9 },
        { period: 'Mar 2024', revenue: 2800.00, quotations: 7, completed: 5 },
        { period: 'Abr 2024', revenue: 5200.00, quotations: 15, completed: 12 },
        { period: 'Mai 2024', revenue: 4650.00, quotations: 13, completed: 10 },
        { period: 'Jun 2024', revenue: 3900.00, quotations: 11, completed: 8 }
      ],
      weekly: [
        { period: 'Sem 1', revenue: 1200.00, quotations: 4, completed: 3 },
        { period: 'Sem 2', revenue: 900.00, quotations: 3, completed: 2 },
        { period: 'Sem 3', revenue: 1500.00, quotations: 5, completed: 4 },
        { period: 'Sem 4', revenue: 1300.00, quotations: 4, completed: 3 }
      ]
    };
    
    return {
      success: true,
      data: revenueData[period as keyof typeof revenueData] || revenueData.monthly
    };
  },

  // === SERVICES API ===
  
  // Get all services
  getServices: async (category?: string): Promise<ApiResponse<Service[]>> => {
    await delay(300);
    
    let services = [...mockServices];
    if (category) {
      services = services.filter(service => service.category === category);
    }
    
    return {
      success: true,
      data: services
    };
  },

  // Get service by ID
  getServiceById: async (serviceId: string): Promise<ApiResponse<Service>> => {
    await delay(300);
    
    const service = mockServices.find(s => s.id === serviceId);
    if (!service) {
      return {
        success: false,
        error: 'Service not found'
      };
    }
    
    return {
      success: true,
      data: service
    };
  },

  // Create service
  createService: async (service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Service>> => {
    await delay(500);
    
    const newService: Service = {
      ...service,
      id: `serv_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockServices.push(newService);
    
    return {
      success: true,
      data: newService,
      message: 'Service created successfully'
    };
  },

  // Update service
  updateService: async (serviceId: string, updates: Partial<Omit<Service, 'id' | 'createdAt'>>): Promise<ApiResponse<Service>> => {
    await delay(500);
    
    const serviceIndex = mockServices.findIndex(s => s.id === serviceId);
    if (serviceIndex === -1) {
      return {
        success: false,
        error: 'Service not found'
      };
    }
    
    const updatedService = {
      ...mockServices[serviceIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    mockServices[serviceIndex] = updatedService;
    
    return {
      success: true,
      data: updatedService,
      message: 'Service updated successfully'
    };
  },

  // Delete service
  deleteService: async (serviceId: string): Promise<ApiResponse<void>> => {
    await delay(500);
    
    const serviceIndex = mockServices.findIndex(s => s.id === serviceId);
    if (serviceIndex === -1) {
      return {
        success: false,
        error: 'Service not found'
      };
    }
    
    mockServices.splice(serviceIndex, 1);
    
    return {
      success: true,
      message: 'Service deleted successfully'
    };
  },

  // Get service categories
  getServiceCategories: async (): Promise<ApiResponse<ServiceCategory[]>> => {
    await delay(300);
    
    return {
      success: true,
      data: [...mockServiceCategories]
    };
  },

  // === QUOTATIONS API ===
  
  // Get quotations
  getQuotations: async (status?: string): Promise<ApiResponse<Quotation[]>> => {
    await delay(400);
    
    let quotations = [...mockQuotations];
    if (status) {
      quotations = quotations.filter(q => q.status === status);
    }
    
    return {
      success: true,
      data: quotations
    };
  },

  // Get quotation by ID
  getQuotationById: async (quotationId: string): Promise<ApiResponse<Quotation>> => {
    await delay(300);
    
    const quotation = mockQuotations.find(q => q.id === quotationId);
    if (!quotation) {
      return {
        success: false,
        error: 'Quotation not found'
      };
    }
    
    return {
      success: true,
      data: quotation
    };
  },

  // Create quotation
  createQuotation: async (quotation: Omit<Quotation, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Quotation>> => {
    await delay(600);
    
    const newQuotation: Quotation = {
      ...quotation,
      id: `quot_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockQuotations.push(newQuotation);
    
    return {
      success: true,
      data: newQuotation,
      message: 'Quotation created successfully'
    };
  },

  // Update quotation
  updateQuotation: async (quotationId: string, updates: Partial<Omit<Quotation, 'id' | 'createdAt'>>): Promise<ApiResponse<Quotation>> => {
    await delay(500);
    
    const quotationIndex = mockQuotations.findIndex(q => q.id === quotationId);
    if (quotationIndex === -1) {
      return {
        success: false,
        error: 'Quotation not found'
      };
    }
    
    const updatedQuotation = {
      ...mockQuotations[quotationIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    mockQuotations[quotationIndex] = updatedQuotation;
    
    return {
      success: true,
      data: updatedQuotation,
      message: 'Quotation updated successfully'
    };
  },

  // Delete quotation
  deleteQuotation: async (quotationId: string): Promise<ApiResponse<void>> => {
    await delay(500);
    
    const quotationIndex = mockQuotations.findIndex(q => q.id === quotationId);
    if (quotationIndex === -1) {
      return {
        success: false,
        error: 'Quotation not found'
      };
    }
    
    mockQuotations.splice(quotationIndex, 1);
    
    return {
      success: true,
      message: 'Quotation deleted successfully'
    };
  },

  // Send quotation by email (mock)
  sendQuotation: async (quotationId: string, recipientEmail: string): Promise<ApiResponse<void>> => {
    await delay(1500);
    
    const quotationIndex = mockQuotations.findIndex(q => q.id === quotationId);
    if (quotationIndex === -1) {
      return {
        success: false,
        error: 'Quotation not found'
      };
    }
    
    // Update status to sent
    mockQuotations[quotationIndex] = {
      ...mockQuotations[quotationIndex],
      status: 'sent',
      updatedAt: new Date().toISOString()
    };
    
    return {
      success: true,
      message: `Quotation sent to ${recipientEmail} successfully`
    };
  },

  // === CALENDAR AVAILABILITY API ===
  
  // Get availability
  getAvailability: async (): Promise<ApiResponse<CalendarAvailability[]>> => {
    await delay(400);
    
    return {
      success: true,
      data: [...mockCalendarAvailability]
    };
  },

  // Update availability
  updateAvailability: async (availabilityId: string, updates: Partial<Omit<CalendarAvailability, 'id' | 'createdAt'>>): Promise<ApiResponse<CalendarAvailability>> => {
    await delay(500);
    
    const availabilityIndex = mockCalendarAvailability.findIndex(a => a.id === availabilityId);
    if (availabilityIndex === -1) {
      return {
        success: false,
        error: 'Availability configuration not found'
      };
    }
    
    const updatedAvailability = {
      ...mockCalendarAvailability[availabilityIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    mockCalendarAvailability[availabilityIndex] = updatedAvailability;
    
    return {
      success: true,
      data: updatedAvailability,
      message: 'Availability updated successfully'
    };
  },

  // Create availability configuration
  createAvailability: async (availability: Omit<CalendarAvailability, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<CalendarAvailability>> => {
    await delay(500);
    
    const newAvailability: CalendarAvailability = {
      ...availability,
      id: `cal_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockCalendarAvailability.push(newAvailability);
    
    return {
      success: true,
      data: newAvailability,
      message: 'Availability configuration created successfully'
    };
  },

  // === CLIENTS API ===
  
  // Get all clients
  getClients: async (): Promise<ApiResponse<Client[]>> => {
    await delay(300);
    
    return {
      success: true,
      data: [...mockClients]
    };
  },

  // Get client by ID
  getClientById: async (clientId: string): Promise<ApiResponse<Client>> => {
    await delay(300);
    
    const client = mockClients.find(c => c.id === clientId);
    if (!client) {
      return {
        success: false,
        error: 'Client not found'
      };
    }
    
    return {
      success: true,
      data: client
    };
  },

  // Create client
  createClient: async (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Client>> => {
    await delay(500);
    
    const newClient: Client = {
      ...client,
      id: `client_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockClients.push(newClient);
    
    return {
      success: true,
      data: newClient,
      message: 'Client created successfully'
    };
  },

  // Update client
  updateClient: async (clientId: string, updates: Partial<Omit<Client, 'id' | 'createdAt'>>): Promise<ApiResponse<Client>> => {
    await delay(500);
    
    const clientIndex = mockClients.findIndex(c => c.id === clientId);
    if (clientIndex === -1) {
      return {
        success: false,
        error: 'Client not found'
      };
    }
    
    const updatedClient = {
      ...mockClients[clientIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    mockClients[clientIndex] = updatedClient;
    
    return {
      success: true,
      data: updatedClient,
      message: 'Client updated successfully'
    };
  },

  // Delete client
  deleteClient: async (clientId: string): Promise<ApiResponse<void>> => {
    await delay(500);
    
    const clientIndex = mockClients.findIndex(c => c.id === clientId);
    if (clientIndex === -1) {
      return {
        success: false,
        error: 'Client not found'
      };
    }
    
    mockClients.splice(clientIndex, 1);
    
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
      data: [...mockAppointments]
    };
  },

  // Get appointment by ID
  getAppointmentById: async (appointmentId: string): Promise<ApiResponse<Appointment>> => {
    await delay(300);
    
    const appointment = mockAppointments.find(a => a.id === appointmentId);
    if (!appointment) {
      return {
        success: false,
        error: 'Appointment not found'
      };
    }
    
    return {
      success: true,
      data: appointment
    };
  },

  // Create appointment
  createAppointment: async (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Appointment>> => {
    await delay(600);
    
    const newAppointment: Appointment = {
      ...appointment,
      id: `appt_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockAppointments.push(newAppointment);
    
    return {
      success: true,
      data: newAppointment,
      message: 'Appointment created successfully'
    };
  },

  // Update appointment
  updateAppointment: async (appointmentId: string, updates: Partial<Omit<Appointment, 'id' | 'createdAt'>>): Promise<ApiResponse<Appointment>> => {
    await delay(500);
    
    const appointmentIndex = mockAppointments.findIndex(a => a.id === appointmentId);
    if (appointmentIndex === -1) {
      return {
        success: false,
        error: 'Appointment not found'
      };
    }
    
    const updatedAppointment = {
      ...mockAppointments[appointmentIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    mockAppointments[appointmentIndex] = updatedAppointment;
    
    return {
      success: true,
      data: updatedAppointment,
      message: 'Appointment updated successfully'
    };
  },

  // Delete appointment
  deleteAppointment: async (appointmentId: string): Promise<ApiResponse<void>> => {
    await delay(500);
    
    const appointmentIndex = mockAppointments.findIndex(a => a.id === appointmentId);
    if (appointmentIndex === -1) {
      return {
        success: false,
        error: 'Appointment not found'
      };
    }
    
    mockAppointments.splice(appointmentIndex, 1);
    
    return {
      success: true,
      message: 'Appointment deleted successfully'
    };
  },

  // === AUTOMATION API ===
  
  // Get automation rules
  getAutomationRules: async (): Promise<ApiResponse<AutomationRule[]>> => {
    await delay(400);
    
    return {
      success: true,
      data: [...mockAutomationRules]
    };
  },

  // Get automation rule by ID
  getAutomationRuleById: async (ruleId: string): Promise<ApiResponse<AutomationRule>> => {
    await delay(300);
    
    const rule = mockAutomationRules.find(r => r.id === ruleId);
    if (!rule) {
      return {
        success: false,
        error: 'Automation rule not found'
      };
    }
    
    return {
      success: true,
      data: rule
    };
  },

  // Create automation rule
  createAutomationRule: async (rule: Omit<AutomationRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<AutomationRule>> => {
    await delay(600);
    
    const newRule: AutomationRule = {
      ...rule,
      id: `rule_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockAutomationRules.push(newRule);
    
    return {
      success: true,
      data: newRule,
      message: 'Automation rule created successfully'
    };
  },

  // Update automation rule
  updateAutomationRule: async (ruleId: string, updates: Partial<Omit<AutomationRule, 'id' | 'createdAt'>>): Promise<ApiResponse<AutomationRule>> => {
    await delay(500);
    
    const ruleIndex = mockAutomationRules.findIndex(r => r.id === ruleId);
    if (ruleIndex === -1) {
      return {
        success: false,
        error: 'Automation rule not found'
      };
    }
    
    const updatedRule = {
      ...mockAutomationRules[ruleIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    mockAutomationRules[ruleIndex] = updatedRule;
    
    return {
      success: true,
      data: updatedRule,
      message: 'Automation rule updated successfully'
    };
  },

  // Delete automation rule
  deleteAutomationRule: async (ruleId: string): Promise<ApiResponse<void>> => {
    await delay(500);
    
    const ruleIndex = mockAutomationRules.findIndex(r => r.id === ruleId);
    if (ruleIndex === -1) {
      return {
        success: false,
        error: 'Automation rule not found'
      };
    }
    
    mockAutomationRules.splice(ruleIndex, 1);
    
    return {
      success: true,
      message: 'Automation rule deleted successfully'
    };
  },

  // Get pending quotes
  getPendingQuotes: async (status?: string): Promise<ApiResponse<PendingQuote[]>> => {
    await delay(400);
    
    let pendingQuotes = [...mockPendingQuotes];
    if (status) {
      pendingQuotes = pendingQuotes.filter(q => q.status === status);
    }
    
    return {
      success: true,
      data: pendingQuotes
    };
  },

  // Get pending quote by ID
  getPendingQuoteById: async (quoteId: string): Promise<ApiResponse<PendingQuote>> => {
    await delay(300);
    
    const quote = mockPendingQuotes.find(q => q.id === quoteId);
    if (!quote) {
      return {
        success: false,
        error: 'Pending quote not found'
      };
    }
    
    return {
      success: true,
      data: quote
    };
  },

  // Approve pending quote
  approvePendingQuote: async (quoteId: string, managerNotes?: string): Promise<ApiResponse<void>> => {
    await delay(1500);
    
    const quoteIndex = mockPendingQuotes.findIndex(q => q.id === quoteId);
    if (quoteIndex === -1) {
      return {
        success: false,
        error: 'Pending quote not found'
      };
    }
    
    // Update quote status
    mockPendingQuotes[quoteIndex] = {
      ...mockPendingQuotes[quoteIndex],
      status: 'approved',
      managerNotes: managerNotes || mockPendingQuotes[quoteIndex].managerNotes,
      approvedAt: new Date().toISOString(),
      sentAt: new Date().toISOString()
    };

    // Update the generated quotation status
    const quotation = mockQuotations.find(q => q.id === mockPendingQuotes[quoteIndex].generatedQuote.id);
    if (quotation) {
      quotation.status = 'sent';
      quotation.updatedAt = new Date().toISOString();
    }

    // Mark corresponding email as responded
    const email = mockEmails.find(e => e.id === mockPendingQuotes[quoteIndex].emailId);
    if (email) {
      email.responded = true;
      email.updatedAt = new Date().toISOString();
    }
    
    return {
      success: true,
      message: 'Quote approved and sent successfully'
    };
  },

  // Reject pending quote
  rejectPendingQuote: async (quoteId: string, managerNotes?: string): Promise<ApiResponse<void>> => {
    await delay(800);
    
    const quoteIndex = mockPendingQuotes.findIndex(q => q.id === quoteId);
    if (quoteIndex === -1) {
      return {
        success: false,
        error: 'Pending quote not found'
      };
    }
    
    // Update quote status
    mockPendingQuotes[quoteIndex] = {
      ...mockPendingQuotes[quoteIndex],
      status: 'rejected',
      managerNotes: managerNotes || mockPendingQuotes[quoteIndex].managerNotes
    };
    
    // Update the generated quotation status
    const quotation = mockQuotations.find(q => q.id === mockPendingQuotes[quoteIndex].generatedQuote.id);
    if (quotation) {
      quotation.status = 'rejected';
      quotation.updatedAt = new Date().toISOString();
    }
    
    return {
      success: true,
      message: 'Quote rejected successfully'
    };
  },

  // Bulk approve pending quotes
  bulkApprovePendingQuotes: async (quoteIds: string[], managerNotes?: string): Promise<ApiResponse<void>> => {
    await delay(2000);
    
    let approvedCount = 0;
    
    for (const quoteId of quoteIds) {
      const result = await emailAPI.approvePendingQuote(quoteId, managerNotes);
      if (result.success) {
        approvedCount++;
      }
    }
    
    return {
      success: true,
      message: `${approvedCount} quotes approved and sent successfully`
    };
  },

  // Bulk reject pending quotes
  bulkRejectPendingQuotes: async (quoteIds: string[], managerNotes?: string): Promise<ApiResponse<void>> => {
    await delay(1500);
    
    let rejectedCount = 0;
    
    for (const quoteId of quoteIds) {
      const result = await emailAPI.rejectPendingQuote(quoteId, managerNotes);
      if (result.success) {
        rejectedCount++;
      }
    }
    
    return {
      success: true,
      message: `${rejectedCount} quotes rejected successfully`
    };
  },

  // Get automation metrics
  getAutomationMetrics: async (): Promise<ApiResponse<AutomationMetrics>> => {
    await delay(500);
    
    // Calculate real-time metrics from current data
    const activeRules = mockAutomationRules.filter(r => r.isActive).length;
    const approvedCount = mockPendingQuotes.filter(q => q.status === 'approved').length;
    const totalGenerated = mockPendingQuotes.length;
    const conversionRate = totalGenerated > 0 ? (approvedCount / totalGenerated) * 100 : 0;
    
    const updatedMetrics = {
      ...mockAutomationMetrics,
      activeRules,
      conversionRate,
      // Update current period with real data
      periodStats: mockAutomationMetrics.periodStats.map((period, index) => {
        if (index === 0) { // Current period
          return {
            ...period,
            generated: totalGenerated,
            approved: approvedCount,
            sent: mockPendingQuotes.filter(q => q.status === 'sent').length
          };
        }
        return period;
      })
    };
    
    return {
      success: true,
      data: updatedMetrics
    };
  },

  // Process emails with automation rules (simulate AI processing)
  processEmailsWithAutomation: async (): Promise<ApiResponse<{ processed: number; quotesGenerated: number }>> => {
    await delay(3000); // Simulate AI processing time
    
    // Mock processing logic - in real implementation, this would:
    // 1. Get unprocessed emails
    // 2. Run them through active automation rules
    // 3. Generate quotes for matching emails
    // 4. Add to pending queue
    
    const processed = Math.floor(Math.random() * 5) + 1;
    const quotesGenerated = Math.floor(Math.random() * 3);
    
    return {
      success: true,
      data: {
        processed,
        quotesGenerated
      },
      message: `Processed ${processed} emails, generated ${quotesGenerated} new quotes`
    };
  },

  // Test automation rule against sample email
  testAutomationRule: async (rule: Partial<AutomationRule>, emailContent: string): Promise<ApiResponse<{
    matches: boolean;
    confidence: number;
    detectedKeywords: string[];
    matchedServices: any[];
  }>> => {
    await delay(800);
    
    // Mock AI analysis
    const keywords = rule.keywords || [];
    const detectedKeywords = keywords.filter(keyword => 
      emailContent.toLowerCase().includes(keyword.toLowerCase())
    );
    
    const matches = detectedKeywords.length > 0;
    const confidence = matches ? (detectedKeywords.length / keywords.length) * 100 : 0;
    
    // Mock service matching
    const matchedServices = matches ? rule.serviceIds?.map(serviceId => {
      const service = mockServices.find(s => s.id === serviceId);
      return {
        serviceId,
        serviceName: service?.name || 'Unknown Service',
        relevanceScore: Math.random() * 0.5 + 0.5 // 0.5 to 1.0
      };
    }) || [] : [];
    
    return {
      success: true,
      data: {
        matches,
        confidence: Math.round(confidence),
        detectedKeywords,
        matchedServices
      }
    };
  },

  // Category Management Functions
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    await delay(500);
    return {
      success: true,
      data: mockCategories
    };
  },

  getCategoryById: async (id: string): Promise<ApiResponse<Category>> => {
    await delay(300);
    const category = mockCategories.find(c => c.id === id);
    if (!category) {
      return {
        success: false,
        error: 'Category not found'
      };
    }
    return {
      success: true,
      data: category
    };
  },

  createCategory: async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Category>> => {
    await delay(800);
    
    const newCategory: Category = {
      id: `cat_${Date.now()}`,
      ...categoryData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockCategories.push(newCategory);
    
    return {
      success: true,
      data: newCategory,
      message: 'Category created successfully'
    };
  },

  updateCategory: async (id: string, categoryData: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ApiResponse<Category>> => {
    await delay(600);
    
    const categoryIndex = mockCategories.findIndex(c => c.id === id);
    if (categoryIndex === -1) {
      return {
        success: false,
        error: 'Category not found'
      };
    }
    
    const updatedCategory: Category = {
      ...mockCategories[categoryIndex],
      ...categoryData,
      updatedAt: new Date().toISOString()
    };
    
    mockCategories[categoryIndex] = updatedCategory;
    
    return {
      success: true,
      data: updatedCategory,
      message: 'Category updated successfully'
    };
  },

  deleteCategory: async (id: string): Promise<ApiResponse<void>> => {
    await delay(400);
    
    const categoryIndex = mockCategories.findIndex(c => c.id === id);
    if (categoryIndex === -1) {
      return {
        success: false,
        error: 'Category not found'
      };
    }
    
    mockCategories.splice(categoryIndex, 1);
    
    return {
      success: true,
      message: 'Category deleted successfully'
    };
  },

  getActiveCategories: async (): Promise<ApiResponse<Category[]>> => {
    await delay(300);
    const activeCategories = mockCategories.filter(c => c.isActive);
    return {
      success: true,
      data: activeCategories
    };
  },
};

// Chat API - v2.0
export const chatAPI = {
  // Create a new chat session
  createSession: async (): Promise<ApiResponse<ChatSession>> => {
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
    mockChatData.sessions.push(newSession);

    return {
      success: true,
      data: newSession,
      message: 'Chat session created successfully'
    };
  },

  // List all chat sessions
  getSessions: async (): Promise<ApiResponse<ChatSession[]>> => {
    await delay(200);
    
    const sessions = [...mockChatData.sessions].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return {
      success: true,
      data: sessions
    };
  },

  // Get specific session by ID
  getSession: async (sessionId: string): Promise<ApiResponse<ChatSession>> => {
    await delay(200);
    
    const session = mockChatData.sessions.find(s => s.id === sessionId);
    
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
  },

  // Send message to chat session
  sendMessage: async (sessionId: string, message: string): Promise<ApiResponse<ChatResponse>> => {
    await delay(800); // Simulate AI processing time
    
    const session = mockChatData.sessions.find(s => s.id === sessionId);
    
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

    return {
      success: true,
      data: aiResponse
    };
  },

  // Update session status
  updateSessionStatus: async (sessionId: string, status: 'active' | 'completed' | 'archived'): Promise<ApiResponse<ChatSession>> => {
    await delay(200);
    
    const session = mockChatData.sessions.find(s => s.id === sessionId);
    
    if (!session) {
      return {
        success: false,
        error: 'Session not found'
      };
    }

    session.status = status;
    session.updatedAt = new Date().toISOString();

    return {
      success: true,
      data: session,
      message: `Session ${status} successfully`
    };
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
    for (const pattern of patterns) {
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
  const responses = (mockChatData.responses as any)[intent] || mockChatData.responses.error;
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
  const { collectingData } = session.context;
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
    message: `Great! ${nextStep.question}`,
    sessionId: session.id,
    metadata: {
      action: collectingData.type as any,
      nextStep: nextStep.field
    }
  };
}

// Create mock resource
function createMockResource(type: string, data: Record<string, any>): string {
  const id = Date.now().toString().substring(-6);
  
  switch (type) {
    case 'quotation':
      return `QUO-${id}`;
    case 'service':
      return `SRV-${id}`;
    case 'client':
      return `CLI-${id}`;
    default:
      return `RES-${id}`;
  }
}

// Generate session title
function generateSessionTitle(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('quote') || lowerMessage.includes('orçamento')) {
    return 'Quotation Request';
  }
  if (lowerMessage.includes('service') || lowerMessage.includes('serviço')) {
    return 'Service Registration';
  }
  if (lowerMessage.includes('client') || lowerMessage.includes('cliente')) {
    return 'Client Registration';
  }
  
  return 'Chat Session';
}

// Remove axios export since we're using mocks
export default emailAPI;