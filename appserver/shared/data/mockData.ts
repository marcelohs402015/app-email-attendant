import { EmailTemplate, CategoryStats, Service, ServiceCategory, Quotation, CalendarAvailability, Client, Appointment } from '../types.js';

export const mockTemplates: EmailTemplate[] = [
  {
    id: 'template_reclamacao',
    name: 'Complaint Response',
    subject: `Re: \${subject}`,
    body: `Dear Customer,

Thank you for contacting us and we apologize for the inconvenience caused.

We are analyzing your complaint (Protocol: ${Math.random().toString(36).substr(2, 9).toUpperCase()}) and will contact you within 24 hours with a solution.

Best regards,
Customer Service Team`,
    category: 'complaint',
    variables: ['subject', 'protocol'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'template_orcamento',
    name: 'Quote Response',
    subject: `Re: \${subject}`,
    body: `Dear Customer,

Thank you for your interest in our handyman services.

Please find attached the requested quote. The quote is valid for 30 days.

For any clarification, we are at your disposal.

Best regards,
Sales Team`,
    category: 'quote',
    variables: ['subject'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'template_informacoes_produto',
    name: 'Service Information',
    subject: `Re: \${subject}`,
    body: `Dear Customer,

Thank you for your interest in our handyman services.

Please find attached the requested service information. For more details, please check our complete documentation on the website.

We are available to clarify any questions.

Best regards,
Technical Team`,
    category: 'product_info',
    variables: ['subject'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'template_suporte',
    name: 'Technical Support',
    subject: `Re: \${subject}`,
    body: `Dear Customer,

We have received your support request and are working to resolve your issue.

Protocol: ${Math.random().toString(36).substr(2, 9).toUpperCase()}

We will return with a solution within 48 hours.

Best regards,
Support Team`,
    category: 'support',
    variables: ['subject', 'protocol'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'template_vendas',
    name: 'Sales Opportunities',
    subject: `Re: \${subject}`,
    body: `Dear Customer,

Thank you for your interest in establishing a partnership with us.

Our sales team will contact you to schedule a meeting and discuss opportunities.

Best regards,
Sales Team`,
    category: 'sales',
    variables: ['subject'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const mockCategoryStats: CategoryStats[] = [
  {
    category: 'complaint',
    count: 12,
    responded_count: 8
  },
  {
    category: 'quote',
    count: 8,
    responded_count: 7
  },
  {
    category: 'product_info',
    count: 15,
    responded_count: 10
  },
  {
    category: 'support',
    count: 20,
    responded_count: 18
  },
  {
    category: 'sales',
    count: 5,
    responded_count: 3
  }
];

export const mockClients: Client[] = [
  {
    id: 'client_001',
    name: 'Maria Silva',
    email: 'maria.silva@email.com',
    phone: '(555) 123-4567',
    address: '123 Flower Street - New York, NY',
    notes: 'Preferred client, always pays on time',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'client_002',
    name: 'John Santos',
    email: 'john.santos@email.com',
    phone: '(555) 234-5678',
    address: '456 Main Avenue - New York, NY',
    notes: 'Apartment with doorman',
    createdAt: '2024-01-05T00:00:00Z'
  },
  {
    id: 'client_003',
    name: 'Ana Costa',
    email: 'ana.costa@email.com',
    phone: '(555) 345-6789',
    address: '789 Commerce Street - New York, NY',
    createdAt: '2024-01-10T00:00:00Z'
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: 'appt_001',
    clientId: 'client_001',
    clientName: 'Maria Silva',
    serviceIds: ['serv_001', 'serv_002'],
    serviceNames: ['Outlet Installation', 'Light Fixture Installation'],
    date: '2024-01-20',
    time: '08:00',
    duration: 240,
    status: 'scheduled',
    address: '123 Flower Street - New York, NY',
    notes: 'Bring extension cord and equipment',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'appt_002',
    clientId: 'client_002',
    clientName: 'John Santos',
    serviceIds: ['serv_004', 'serv_005'],
    serviceNames: ['Leak Repair', 'Faucet Installation'],
    date: '2024-01-22',
    time: '13:00',
    duration: 180,
    status: 'confirmed',
    address: '456 Main Avenue - New York, NY',
    notes: 'Apartment 305, doorman will provide access',
    createdAt: '2024-01-19T09:15:00Z'
  }
];

export const mockServiceCategories: ServiceCategory[] = [
  {
    id: 'eletrica',
    name: 'Electrical',
    description: 'Residential and commercial electrical services',
    icon: 'electrical',
    color: '#3B82F6',
    services: ['serv_001', 'serv_002', 'serv_003']
  },
  {
    id: 'hidraulica',
    name: 'Plumbing',
    description: 'Plumbing installations and repairs',
    icon: 'plumbing',
    color: '#06B6D4',
    services: ['serv_004', 'serv_005', 'serv_006']
  },
  {
    id: 'pintura',
    name: 'Painting',
    description: 'Residential and commercial painting',
    icon: 'painting',
    color: '#8B5CF6',
    services: ['serv_007', 'serv_008']
  }
];

export const mockServices: Service[] = [
  {
    id: 'serv_001',
    name: 'Outlet Installation',
    description: 'Installation of new 110V or 220V outlets',
    category: 'eletrica',
    price: 80.00,
    unit: 'unit',
    estimatedTime: '1 hour',
    materials: ['Outlet', 'Wires', 'Covers', 'Junction Box'],
    active: true
  },
  {
    id: 'serv_002',
    name: 'Light Fixture Installation',
    description: 'Installation of light fixtures and lighting points',
    category: 'eletrica',
    price: 120.00,
    unit: 'unit',
    estimatedTime: '1.5 hours',
    materials: ['Light Fixture', 'Wires', 'Switch', 'Brackets'],
    active: true
  },
  {
    id: 'serv_004',
    name: 'Leak Repair',
    description: 'Identification and repair of pipe leaks',
    category: 'hidraulica',
    price: 100.00,
    unit: 'hour',
    estimatedTime: '2 hours',
    materials: ['Fittings', 'Sealants', 'PVC Glue'],
    active: true
  }
];

export const mockQuotations: Quotation[] = [
  {
    id: 'quot_001',
    clientId: 'client_001',
    clientName: 'Maria Silva',
    clientEmail: 'maria.silva@email.com',
    services: [
      {
        serviceId: 'serv_001',
        serviceName: 'Outlet Installation',
        quantity: 3,
        price: 80.00,
        total: 240.00
      },
      {
        serviceId: 'serv_002',
        serviceName: 'Light Fixture Installation',
        quantity: 2,
        price: 120.00,
        total: 240.00
      }
    ],
    subtotal: 480.00,
    discount: 50.00,
    total: 430.00,
    status: 'sent',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    validUntil: '2024-02-15T23:59:59Z',
    notes: 'Work to be performed over the weekend'
  }
];

export const mockCalendarAvailability: CalendarAvailability[] = [
  {
    date: '2024-01-20',
    timeSlots: [
      { time: '08:00', available: false, appointmentId: 'appt_001' },
      { time: '09:00', available: false, appointmentId: 'appt_001' },
      { time: '10:00', available: true },
      { time: '11:00', available: true }
    ]
  }
];