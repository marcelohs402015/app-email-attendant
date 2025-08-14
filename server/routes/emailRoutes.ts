import { Router, Request, Response } from 'express';
import { createLogger } from '../shared/logger.js';
import { mockTemplates, mockCategoryStats, mockServices, mockServiceCategories, mockQuotations, mockClients, mockAppointments, mockCalendarAvailability } from '../shared/data/mockData.js';
import { mockEmails } from '../shared/data/mockEmails.js';
import { EmailTemplate } from '../shared/types.js';

const logger = createLogger('EmailRoutes');

// Mock data storage (in-memory)
let emails = [...mockEmails];
let templates = [...mockTemplates];
let services = [...mockServices];
let quotations = [...mockQuotations];
let clients = [...mockClients];
let appointments = [...mockAppointments];

// Helper function to simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function createEmailRoutes(): Router {
  const router = Router();

  // Get emails with filters and pagination
  router.get('/emails', async (req: Request, res: Response) => {
    try {
      await delay(300);
      
      let filteredEmails = [...emails];
      
      // Apply filters
      if (req.query.category) {
        filteredEmails = filteredEmails.filter(email => email.category === req.query.category);
      }
      if (req.query.from) {
        filteredEmails = filteredEmails.filter(email => 
          email.from.toLowerCase().includes((req.query.from as string).toLowerCase())
        );
      }
      if (req.query.responded !== undefined) {
        const responded = req.query.responded === 'true';
        filteredEmails = filteredEmails.filter(email => email.responded === responded);
      }
      if (req.query.processed !== undefined) {
        const processed = req.query.processed === 'true';
        filteredEmails = filteredEmails.filter(email => email.processed === processed);
      }
      
      // Pagination
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const total = filteredEmails.length;
      const pages = Math.ceil(total / limit);
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedEmails = filteredEmails.slice(start, end);
      
      return res.json({
        success: true,
        data: paginatedEmails,
        pagination: {
          page,
          limit,
          total,
          pages
        }
      });
    } catch (error) {
      logger.error('Failed to get emails:', (error as Error).message);
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve emails'
      });
    }
  });

  // Get specific email by ID
  router.get('/emails/:id', async (req: Request, res: Response) => {
    try {
      await delay(300);
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid email ID'
        });
      }

      const email = emails.find(e => e.id === id);
      if (!email) {
        return res.status(404).json({
          success: false,
          error: 'Email not found'
        });
      }

      return res.json({
        success: true,
        data: email
      });
    } catch (error) {
      logger.error('Failed to get email by ID:', (error as Error).message);
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve email'
      });
    }
  });

  // Sync emails from Gmail (mock)
  router.post('/emails/sync', async (req: Request, res: Response) => {
    try {
      await delay(2000); // Simulate longer operation
      
      const syncedCount = Math.floor(Math.random() * 10) + 1;
      
      return res.json({
        success: true,
        message: `Synced ${syncedCount} emails`,
        data: {
          synced: syncedCount,
          total_fetched: syncedCount + Math.floor(Math.random() * 5)
        }
      });
    } catch (error) {
      logger.error('Failed to sync emails:', (error as Error).message);
      return res.status(500).json({
        success: false,
        error: 'Failed to sync emails'
      });
    }
  });

  // Reply to email (mock)
  router.post('/emails/:id/reply', async (req: Request, res: Response) => {
    try {
      await delay(1000);
      
      const id = parseInt(req.params.id);
      const { templateId, customMessage, quotationId } = req.body;

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid email ID'
        });
      }

      const emailIndex = emails.findIndex(e => e.id === id);
      if (emailIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Email not found'
        });
      }

      if (!templateId && !customMessage) {
        return res.status(400).json({
          success: false,
          error: 'Reply message or template required'
        });
      }

      // Validate quotation if provided
      if (quotationId) {
        const quotation = quotations.find(q => q.id === quotationId);
        if (!quotation) {
          return res.status(400).json({
            success: false,
            error: 'Orçamento não encontrado'
          });
        }
        logger.info(`Attaching quotation ${quotationId} to email reply ${id}`);
      }

      // Update email status
      emails[emailIndex] = {
        ...emails[emailIndex],
        responded: true,
        processed: true,
        responseTemplate: templateId,
        updatedAt: new Date().toISOString()
      };

      return res.json({
        success: true,
        message: quotationId ? 'Resposta enviada com orçamento anexado com sucesso' : 'Resposta enviada com sucesso'
      });
    } catch (error) {
      logger.error('Failed to send reply:', (error as Error).message);
      return res.status(500).json({
        success: false,
        error: 'Failed to send reply'
      });
    }
  });

  // Get email templates
  router.get('/templates', async (req: Request, res: Response) => {
    try {
      await delay(300);
      
      let filteredTemplates = [...templates];
      if (req.query.category) {
        filteredTemplates = filteredTemplates.filter(template => 
          template.category === req.query.category
        );
      }
      
      return res.json({
        success: true,
        data: filteredTemplates
      });
    } catch (error) {
      logger.error('Failed to get templates:', (error as Error).message);
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve templates'
      });
    }
  });

  // Get template by ID
  router.get('/templates/:id', async (req: Request, res: Response) => {
    try {
      await delay(300);
      
      const templateId = req.params.id;
      const template = templates.find(t => t.id === templateId);
      
      if (!template) {
        return res.status(404).json({
          success: false,
          error: 'Template not found'
        });
      }

      return res.json({
        success: true,
        data: template
      });
    } catch (error) {
      logger.error('Failed to get template by ID:', (error as Error).message);
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve template'
      });
    }
  });

  // Create email template
  router.post('/templates', async (req: Request, res: Response) => {
    try {
      await delay(500);
      
      const { name, subject, body, category } = req.body;

      if (!name || !subject || !body) {
        return res.status(400).json({
          success: false,
          error: 'Name, subject, and body are required'
        });
      }

      const newTemplate: EmailTemplate = {
        id: `template_${Date.now()}`,
        name,
        subject,
        body,
        category: category || null,
        variables: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      templates.push(newTemplate);
      
      return res.status(201).json({
        success: true,
        data: newTemplate,
        message: 'Template created successfully'
      });
    } catch (error) {
      logger.error('Failed to create template:', (error as Error).message);
      return res.status(500).json({
        success: false,
        error: 'Failed to create template'
      });
    }
  });

  // Update email template
  router.put('/templates/:id', async (req: Request, res: Response) => {
    try {
      await delay(500);
      
      const templateId = req.params.id;
      const { name, subject, body, category } = req.body;

      if (!name || !subject || !body) {
        return res.status(400).json({
          success: false,
          error: 'Name, subject, and body are required'
        });
      }

      const templateIndex = templates.findIndex(t => t.id === templateId);
      if (templateIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Template not found'
        });
      }

      const updatedTemplate = {
        ...templates[templateIndex],
        name,
        subject,
        body,
        category: category || null,
        updatedAt: new Date().toISOString()
      };

      templates[templateIndex] = updatedTemplate;

      return res.json({
        success: true,
        data: updatedTemplate,
        message: 'Template updated successfully'
      });
    } catch (error) {
      logger.error('Failed to update template:', (error as Error).message);
      return res.status(500).json({
        success: false,
        error: 'Failed to update template'
      });
    }
  });

  // Delete email template
  router.delete('/templates/:id', async (req: Request, res: Response) => {
    try {
      await delay(500);
      
      const templateId = req.params.id;
      
      const templateIndex = templates.findIndex(t => t.id === templateId);
      if (templateIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Template not found'
        });
      }

      templates.splice(templateIndex, 1);

      return res.json({
        success: true,
        message: 'Template deleted successfully'
      });
    } catch (error) {
      logger.error('Failed to delete template:', (error as Error).message);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete template'
      });
    }
  });

  // Get category statistics
  router.get('/stats/categories', async (req: Request, res: Response) => {
    try {
      await delay(400);
      
      return res.json({
        success: true,
        data: [...mockCategoryStats]
      });
    } catch (error) {
      logger.error('Failed to get category stats:', (error as Error).message);
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve statistics'
      });
    }
  });

  // Update email status
  router.patch('/emails/:id/status', async (req: Request, res: Response) => {
    try {
      await delay(300);
      
      const id = parseInt(req.params.id);
      const { processed, responded } = req.body;

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid email ID'
        });
      }

      const emailIndex = emails.findIndex(e => e.id === id);
      if (emailIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Email not found or no changes made'
        });
      }

      emails[emailIndex] = {
        ...emails[emailIndex],
        ...(processed !== undefined && { processed }),
        ...(responded !== undefined && { responded }),
        updatedAt: new Date().toISOString()
      };

      return res.json({
        success: true,
        message: 'Email status updated'
      });
    } catch (error) {
      logger.error('Failed to update email status:', (error as Error).message);
      return res.status(500).json({
        success: false,
        error: 'Failed to update email status'
      });
    }
  });

  // === SERVICES ROUTES ===
  
  // Get services
  router.get('/services', async (req: Request, res: Response) => {
    try {
      await delay(300);
      
      let filteredServices = [...services];
      if (req.query.category) {
        filteredServices = filteredServices.filter(service => service.category === req.query.category);
      }
      
      return res.json({
        success: true,
        data: filteredServices
      });
    } catch (error) {
      logger.error('Failed to get services:', (error as Error).message);
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve services'
      });
    }
  });

  // Get service categories
  router.get('/service-categories', async (req: Request, res: Response) => {
    try {
      await delay(300);
      
      return res.json({
        success: true,
        data: [...mockServiceCategories]
      });
    } catch (error) {
      logger.error('Failed to get service categories:', (error as Error).message);
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve service categories'
      });
    }
  });

  // Create service
  router.post('/services', async (req: Request, res: Response) => {
    try {
      await delay(500);
      
      const { name, description, category, price, unit, estimatedTime, materials } = req.body;

      if (!name || !description || !category) {
        return res.status(400).json({
          success: false,
          error: 'Name, description, and category are required'
        });
      }

      const newService = {
        id: `serv_${Date.now()}`,
        name,
        description,
        category,
        price: parseFloat(price) || 0,
        unit: unit || 'hour',
        estimatedTime: estimatedTime || '1 hour',
        materials: materials || [],
        active: true
      };

      services.push(newService);
      
      return res.status(201).json({
        success: true,
        data: newService,
        message: 'Service created successfully'
      });
    } catch (error) {
      logger.error('Failed to create service:', (error as Error).message);
      return res.status(500).json({
        success: false,
        error: 'Failed to create service'
      });
    }
  });

  // Update service
  router.put('/services/:id', async (req: Request, res: Response) => {
    try {
      await delay(500);
      
      const serviceId = req.params.id;
      const { name, description, category, price, unit, estimatedTime, materials, active } = req.body;

      const serviceIndex = services.findIndex(s => s.id === serviceId);
      if (serviceIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Service not found'
        });
      }

      const updatedService = {
        ...services[serviceIndex],
        name: name || services[serviceIndex].name,
        description: description || services[serviceIndex].description,
        category: category || services[serviceIndex].category,
        price: price !== undefined ? parseFloat(price) : services[serviceIndex].price,
        unit: unit || services[serviceIndex].unit,
        estimatedTime: estimatedTime !== undefined ? estimatedTime : services[serviceIndex].estimatedTime,
        materials: materials || services[serviceIndex].materials,
        active: active !== undefined ? active : services[serviceIndex].active,
        updatedAt: new Date().toISOString()
      };

      services[serviceIndex] = updatedService;

      return res.json({
        success: true,
        data: updatedService,
        message: 'Service updated successfully'
      });
    } catch (error) {
      logger.error('Failed to update service:', (error as Error).message);
      return res.status(500).json({
        success: false,
        error: 'Failed to update service'
      });
    }
  });

  // Delete service
  router.delete('/services/:id', async (req: Request, res: Response) => {
    try {
      await delay(500);
      
      const serviceId = req.params.id;
      
      const serviceIndex = services.findIndex(s => s.id === serviceId);
      if (serviceIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Service not found'
        });
      }

      services.splice(serviceIndex, 1);

      return res.json({
        success: true,
        message: 'Service deleted successfully'
      });
    } catch (error) {
      logger.error('Failed to delete service:', (error as Error).message);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete service'
      });
    }
  });

  // === CLIENTS ROUTES ===
  
  // Get clients
  router.get('/clients', async (req: Request, res: Response) => {
    try {
      await delay(300);
      
      return res.json({
        success: true,
        data: [...clients]
      });
    } catch (error) {
      logger.error('Failed to get clients:', (error as Error).message);
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve clients'
      });
    }
  });

  // Create client
  router.post('/clients', async (req: Request, res: Response) => {
    try {
      await delay(500);
      
      const { name, email, phone, address, notes } = req.body;

      if (!name || !email) {
        return res.status(400).json({
          success: false,
          error: 'Name and email are required'
        });
      }

      const newClient = {
        id: `client_${Date.now()}`,
        name,
        email,
        phone: phone || '',
        address: address || '',
        notes: notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      clients.push(newClient);
      
      return res.status(201).json({
        success: true,
        data: newClient,
        message: 'Client created successfully'
      });
    } catch (error) {
      logger.error('Failed to create client:', (error as Error).message);
      return res.status(500).json({
        success: false,
        error: 'Failed to create client'
      });
    }
  });

  // Update client
  router.put('/clients/:id', async (req: Request, res: Response) => {
    try {
      await delay(500);
      
      const clientId = req.params.id;
      const { name, email, phone, address, notes } = req.body;

      const clientIndex = clients.findIndex(c => c.id === clientId);
      if (clientIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Client not found'
        });
      }

      const updatedClient = {
        ...clients[clientIndex],
        name: name || clients[clientIndex].name,
        email: email || clients[clientIndex].email,
        phone: phone !== undefined ? phone : clients[clientIndex].phone,
        address: address !== undefined ? address : clients[clientIndex].address,
        notes: notes !== undefined ? notes : clients[clientIndex].notes,
        updatedAt: new Date().toISOString()
      };

      clients[clientIndex] = updatedClient;

      return res.json({
        success: true,
        data: updatedClient,
        message: 'Client updated successfully'
      });
    } catch (error) {
      logger.error('Failed to update client:', (error as Error).message);
      return res.status(500).json({
        success: false,
        error: 'Failed to update client'
      });
    }
  });

  // Delete client
  router.delete('/clients/:id', async (req: Request, res: Response) => {
    try {
      await delay(500);
      
      const clientId = req.params.id;
      
      const clientIndex = clients.findIndex(c => c.id === clientId);
      if (clientIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Client not found'
        });
      }

      clients.splice(clientIndex, 1);

      return res.json({
        success: true,
        message: 'Client deleted successfully'
      });
    } catch (error) {
      logger.error('Failed to delete client:', (error as Error).message);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete client'
      });
    }
  });

  // === STATISTICS ROUTES ===
  
  // Get business statistics for handyman services
  router.get('/stats/business', async (req: Request, res: Response) => {
    try {
      await delay(400);
      
      // Calculate service demand stats
      const servicesByCategory = mockServices.reduce((acc, service) => {
        acc[service.category] = (acc[service.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Calculate quotation stats
      const quotationStats = {
        total: quotations.length,
        accepted: quotations.filter(q => q.status === 'accepted').length,
        pending: quotations.filter(q => q.status === 'sent').length,
        rejected: quotations.filter(q => q.status === 'rejected').length,
        completed: quotations.filter(q => q.status === 'completed').length,
        averageValue: quotations.length > 0 ? 
          quotations.reduce((sum, q) => sum + q.total, 0) / quotations.length : 0
      };

      // Calculate appointment stats
      const appointmentStats = {
        total: appointments.length,
        scheduled: appointments.filter(a => a.status === 'scheduled').length,
        confirmed: appointments.filter(a => a.status === 'confirmed').length,
        completed: appointments.filter(a => a.status === 'completed').length,
        inProgress: appointments.filter(a => a.status === 'in_progress').length,
        cancelled: appointments.filter(a => a.status === 'cancelled').length
      };

      // Calculate client stats
      const clientStats = {
        total: clients.length,
        active: clients.length,
        withAppointments: clients.filter(c => 
          appointments.some(a => a.clientId === c.id)
        ).length,
        withQuotations: clients.filter(c => 
          quotations.some(q => q.clientEmail === c.email)
        ).length
      };

      // Calculate revenue estimation
      const totalRevenue = quotations
        .filter(q => q.status === 'accepted' || q.status === 'completed')
        .reduce((sum, q) => sum + q.total, 0);

      // Service category performance
      const categoryPerformance = mockServiceCategories.map(category => {
        const categoryServices = mockServices.filter(s => s.category === category.id);
        const categoryQuotations = quotations.filter(q => 
          q.services.some((service: any) => 
            categoryServices.some(s => s.id === service.serviceId)
          )
        );
        
        return {
          id: category.id,
          name: category.name,
          servicesCount: categoryServices.length,
          quotationsCount: categoryQuotations.length,
          averagePrice: categoryServices.length > 0 ? 
            categoryServices.reduce((sum, s) => sum + s.price, 0) / categoryServices.length : 0,
          color: category.color
        };
      });

      // Response time analysis (based on email data)
      const emailResponseTime = {
        totalEmails: emails.length,
        respondedEmails: emails.filter(e => e.responded).length,
        pendingEmails: emails.filter(e => !e.responded).length,
        responseRate: emails.length > 0 ? 
          (emails.filter(e => e.responded).length / emails.length) * 100 : 0
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
      
      return res.json({
        success: true,
        data: businessStats
      });
    } catch (error) {
      logger.error('Failed to get business stats:', (error as Error).message);
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve business statistics'
      });
    }
  });

  // Get revenue statistics by period
  router.get('/stats/revenue', async (req: Request, res: Response) => {
    try {
      await delay(300);
      
      const period = req.query.period as string || 'monthly';
      
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
      
      return res.json({
        success: true,
        data: revenueData[period as keyof typeof revenueData] || revenueData.monthly
      });
    } catch (error) {
      logger.error('Failed to get revenue stats:', (error as Error).message);
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve revenue statistics'
      });
    }
  });

  // === APPOINTMENTS ROUTES ===
  
  // Get appointments
  router.get('/appointments', async (req: Request, res: Response) => {
    try {
      await delay(400);
      
      return res.json({
        success: true,
        data: [...appointments]
      });
    } catch (error) {
      logger.error('Failed to get appointments:', (error as Error).message);
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve appointments'
      });
    }
  });

  // Create appointment
  router.post('/appointments', async (req: Request, res: Response) => {
    try {
      await delay(600);
      
      const { clientId, serviceIds, date, time, duration, address, notes } = req.body;

      if (!clientId || !date || !time) {
        return res.status(400).json({
          success: false,
          error: 'Client ID, date, and time are required'
        });
      }

      const client = clients.find(c => c.id === clientId);
      if (!client) {
        return res.status(400).json({
          success: false,
          error: 'Client not found'
        });
      }

      // Get service names if serviceIds provided
      let serviceNames: string[] = [];
      if (serviceIds && Array.isArray(serviceIds)) {
        serviceNames = serviceIds.map((serviceId: string) => {
          const service = services.find(s => s.id === serviceId);
          return service ? service.name : serviceId;
        });
      }

      const newAppointment = {
        id: `appt_${Date.now()}`,
        clientId,
        clientName: client.name,
        serviceIds: serviceIds || [],
        serviceNames,
        date,
        time,
        duration: duration || 120,
        address: address || client.address,
        notes: notes || '',
        status: 'scheduled' as const,
        createdAt: new Date().toISOString()
      };

      appointments.push(newAppointment);
      
      return res.status(201).json({
        success: true,
        data: newAppointment,
        message: 'Appointment created successfully'
      });
    } catch (error) {
      logger.error('Failed to create appointment:', (error as Error).message);
      return res.status(500).json({
        success: false,
        error: 'Failed to create appointment'
      });
    }
  });

  // Update appointment
  router.put('/appointments/:id', async (req: Request, res: Response) => {
    try {
      await delay(500);
      
      const appointmentId = req.params.id;
      const { clientId, serviceIds, date, time, duration, address, notes, status } = req.body;

      const appointmentIndex = appointments.findIndex(a => a.id === appointmentId);
      if (appointmentIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Appointment not found'
        });
      }

      let clientName = appointments[appointmentIndex].clientName;
      if (clientId && clientId !== appointments[appointmentIndex].clientId) {
        const foundClient = clients.find(c => c.id === clientId);
        if (!foundClient) {
          return res.status(400).json({
            success: false,
            error: 'Client not found'
          });
        }
        clientName = foundClient.name;
      }

      // Get service names if serviceIds provided
      let serviceNames = appointments[appointmentIndex].serviceNames;
      if (serviceIds && Array.isArray(serviceIds)) {
        serviceNames = serviceIds.map((serviceId: string) => {
          const service = services.find(s => s.id === serviceId);
          return service ? service.name : serviceId;
        });
      }

      const updatedAppointment = {
        ...appointments[appointmentIndex],
        clientId: clientId || appointments[appointmentIndex].clientId,
        clientName,
        serviceIds: serviceIds || appointments[appointmentIndex].serviceIds,
        serviceNames,
        date: date || appointments[appointmentIndex].date,
        time: time || appointments[appointmentIndex].time,
        duration: duration !== undefined ? duration : appointments[appointmentIndex].duration,
        address: address !== undefined ? address : appointments[appointmentIndex].address,
        notes: notes !== undefined ? notes : appointments[appointmentIndex].notes,
        status: status || appointments[appointmentIndex].status
      };

      appointments[appointmentIndex] = updatedAppointment;

      return res.json({
        success: true,
        data: updatedAppointment,
        message: 'Appointment updated successfully'
      });
    } catch (error) {
      logger.error('Failed to update appointment:', (error as Error).message);
      return res.status(500).json({
        success: false,
        error: 'Failed to update appointment'
      });
    }
  });

  // Delete appointment
  router.delete('/appointments/:id', async (req: Request, res: Response) => {
    try {
      await delay(500);
      
      const appointmentId = req.params.id;
      
      const appointmentIndex = appointments.findIndex(a => a.id === appointmentId);
      if (appointmentIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Appointment not found'
        });
      }

      appointments.splice(appointmentIndex, 1);

      return res.json({
        success: true,
        message: 'Appointment deleted successfully'
      });
    } catch (error) {
      logger.error('Failed to delete appointment:', (error as Error).message);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete appointment'
      });
    }
  });

  // === QUOTATION EMAIL ROUTES ===

  // Send quotation by email
  router.post('/quotations/:id/send', async (req: Request, res: Response) => {
    try {
      await delay(1500);
      
      const quotationId = req.params.id;
      const { recipientEmail } = req.body;
      
      if (!recipientEmail) {
        return res.status(400).json({
          success: false,
          error: 'Recipient email is required'
        });
      }

      const quotationIndex = quotations.findIndex(q => q.id === quotationId);
      if (quotationIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Quotation not found'
        });
      }

      // Update quotation status to sent
      quotations[quotationIndex] = {
        ...quotations[quotationIndex],
        status: 'sent',
        updatedAt: new Date().toISOString()
      };

      logger.info(`Quotation ${quotationId} sent to ${recipientEmail}`);

      return res.json({
        success: true,
        message: `Orçamento enviado para ${recipientEmail} com sucesso`
      });
    } catch (error) {
      logger.error('Failed to send quotation:', (error as Error).message);
      return res.status(500).json({
        success: false,
        error: 'Failed to send quotation'
      });
    }
  });

  return router;
}