import { EmailData, EmailTemplate, CategoryStats, ApiResponse, PaginatedResponse, FilterOptions, PaginationOptions, Service, ServiceCategory, Quotation, CalendarAvailability, Client, Appointment } from '../types/api';
import { mockEmails } from '../data/mockEmails';
import { mockTemplates, mockCategoryStats, mockServices, mockServiceCategories, mockQuotations, mockCalendarAvailability, mockClients, mockAppointments } from '../data/mockData';

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
};

// Remove axios export since we're using mocks
export default emailAPI;