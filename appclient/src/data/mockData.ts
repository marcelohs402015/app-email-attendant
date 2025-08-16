import { EmailTemplate, CategoryStats, Service, ServiceCategory, Quotation, CalendarAvailability, Client, Appointment, AutomationRule, PendingQuote, AutomationMetrics, Category } from '../types/api';

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

// Mock Clients
export const mockClients: Client[] = [
  {
    id: 'client_001',
    name: 'Maria Silva',
    email: 'maria.silva@email.com',
    phone: '(555) 123-4567',
    address: '123 Flower Street - New York, NY',
    notes: 'Preferred client, always pays on time',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'client_002',
    name: 'John Santos',
    email: 'john.santos@email.com',
    phone: '(555) 234-5678',
    address: '456 Main Avenue - New York, NY',
    notes: 'Apartment with doorman',
    isActive: true,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  },
  {
    id: 'client_003',
    name: 'Ana Costa',
    email: 'ana.costa@email.com',
    phone: '(555) 345-6789',
    address: '789 Commerce Street - New York, NY',
    isActive: true,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 'client_004',
    name: 'Carlos Oliveira',
    email: 'carlos.oliveira@email.com',
    phone: '(555) 456-7890',
    address: '321 Garden Lane - New York, NY',
    notes: 'House with dog, ring the doorbell',
    isActive: true,
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z'
  },
  {
    id: 'client_005',
    name: 'Fernanda Lima',
    email: 'fernanda.lima@email.com',
    phone: '(555) 567-8901',
    address: '654 New Street - New York, NY',
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  }
];

// Mock Appointments
export const mockAppointments: Appointment[] = [
  {
    id: 'appt_001',
    clientId: 'client_001',
    client: mockClients[0],
    quotationId: 'quot_001',
    title: 'Electrical Installation - Maria Silva',
    description: 'Install outlets and light fixtures as per quote',
    date: '2024-01-20',
    startTime: '08:00',
    endTime: '12:00',
    status: 'scheduled',
    location: '123 Flower Street - New York, NY',
    notes: 'Bring extension cord and equipment',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'appt_002',
    clientId: 'client_002',
    client: mockClients[1],
    quotationId: 'quot_002',
    title: 'Plumbing Repair - John Santos',
    description: 'Repair leak and replace faucets',
    date: '2024-01-22',
    startTime: '13:00',
    endTime: '16:00',
    status: 'confirmed',
    location: '456 Main Avenue - New York, NY',
    notes: 'Apartment 305, doorman will provide access',
    createdAt: '2024-01-19T09:15:00Z',
    updatedAt: '2024-01-19T14:30:00Z'
  },
  {
    id: 'appt_003',
    clientId: 'client_003',
    client: mockClients[2],
    title: 'Painting - Ana Costa',
    description: 'Living room and bedroom painting',
    date: '2024-01-25',
    startTime: '08:00',
    endTime: '17:00',
    status: 'scheduled',
    location: '789 Commerce Street - New York, NY',
    notes: 'Full day job, bring tarp and complete equipment',
    createdAt: '2024-01-18T11:00:00Z',
    updatedAt: '2024-01-18T11:00:00Z'
  },
  {
    id: 'appt_004',
    clientId: 'client_004',
    client: mockClients[3],
    title: 'General Maintenance - Carlos Oliveira',
    description: 'Inspection and minor repairs',
    date: '2024-01-18',
    startTime: '14:00',
    endTime: '16:00',
    status: 'completed',
    location: '321 Garden Lane - New York, NY',
    notes: 'Service completed successfully',
    createdAt: '2024-01-16T08:00:00Z',
    updatedAt: '2024-01-18T16:00:00Z'
  },
  {
    id: 'appt_005',
    clientId: 'client_005',
    client: mockClients[4],
    title: 'In-Person Quote - Fernanda Lima',
    description: 'Visit to assess bathroom renovation',
    date: '2024-01-19',
    startTime: '10:00',
    endTime: '11:00',
    status: 'completed',
    location: '654 New Street - New York, NY',
    notes: 'Quote delivered, awaiting response',
    createdAt: '2024-01-17T12:00:00Z',
    updatedAt: '2024-01-19T11:00:00Z'
  }
];

export const categoryLabels = {
  reclamacao: 'Complaint',
  orcamento: 'Quote',
  informacoes_produto: 'Product Information',
  suporte: 'Support',
  vendas: 'Sales'
};

export const categoryColors = {
  reclamacao: '#ef4444',
  orcamento: '#3b82f6',
  informacoes_produto: '#10b981',
  suporte: '#f59e0b',
  vendas: '#8b5cf6'
};

// Service Categories
export const mockServiceCategories: ServiceCategory[] = [
  {
    id: 'eletrica',
    name: 'Electrical',
    description: 'Residential and commercial electrical services',
    color: '#f59e0b'
  },
  {
    id: 'hidraulica',
    name: 'Plumbing',
    description: 'Plumbing installations and repairs',
    color: '#3b82f6'
  },
  {
    id: 'pintura',
    name: 'Painting',
    description: 'Residential and commercial painting',
    color: '#10b981'
  },
  {
    id: 'marcenaria',
    name: 'Carpentry',
    description: 'Carpentry and woodworking services',
    color: '#8b5cf6'
  },
  {
    id: 'alvenaria',
    name: 'Masonry',
    description: 'Masonry construction and repairs',
    color: '#ef4444'
  },
  {
    id: 'jardinagem',
    name: 'Gardening',
    description: 'Garden care and landscaping services',
    color: '#22c55e'
  },
  {
    id: 'limpeza',
    name: 'Cleaning',
    description: 'Cleaning and organization services',
    color: '#06b6d4'
  },
  {
    id: 'montagem',
    name: 'Assembly',
    description: 'Furniture and equipment assembly',
    color: '#f97316'
  }
];

// Services
export const mockServices: Service[] = [
  // Electrical
  {
    id: 'serv_001',
    name: 'Outlet Installation',
    description: 'Installation of new 110V or 220V outlets',
    category: 'eletrica',
    defaultPrice: 80.00,
    unit: 'unit',
    estimatedDuration: 1,
    materials: ['Outlet', 'Wires', 'Covers', 'Junction Box'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'serv_002',
    name: 'Light Fixture Installation',
    description: 'Installation of light fixtures and lighting points',
    category: 'eletrica',
    defaultPrice: 120.00,
    unit: 'unit',
    estimatedDuration: 1.5,
    materials: ['Light Fixture', 'Wires', 'Switch', 'Brackets'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'serv_003',
    name: 'Electric Shower Installation',
    description: 'Installation and replacement of electric showers',
    category: 'eletrica',
    defaultPrice: 150.00,
    unit: 'unit',
    estimatedDuration: 2,
    materials: ['Electric Shower', 'Special Wires', 'Circuit Breaker'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // Plumbing
  {
    id: 'serv_004',
    name: 'Leak Repair',
    description: 'Identification and repair of pipe leaks',
    category: 'hidraulica',
    defaultPrice: 100.00,
    unit: 'hour',
    estimatedDuration: 2,
    materials: ['Fittings', 'Sealants', 'PVC Glue'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'serv_005',
    name: 'Faucet Installation',
    description: 'Installation and replacement of faucets',
    category: 'hidraulica',
    defaultPrice: 80.00,
    unit: 'unit',
    estimatedDuration: 1,
    materials: ['Faucet', 'Seals', 'Flexible Hose'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'serv_006',
    name: 'Drain Unclogging',
    description: 'Unclogging of sinks, drains, and toilets',
    category: 'hidraulica',
    defaultPrice: 120.00,
    unit: 'unit',
    estimatedDuration: 1,
    materials: ['Chemical products', 'Equipment'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // Pintura
  {
    id: 'serv_007',
    name: 'Wall Painting',
    description: 'Interior or exterior wall painting',
    category: 'pintura',
    defaultPrice: 25.00,
    unit: 'meter',
    estimatedDuration: 0.5,
    materials: ['Paint', 'Rollers', 'Brushes', 'Masking Tape'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'serv_008',
    name: 'Gate Painting',
    description: 'Painting and treatment of metal gates',
    category: 'pintura',
    defaultPrice: 200.00,
    unit: 'unit',
    estimatedDuration: 4,
    materials: ['Enamel Paint', 'Primer', 'Sandpaper', 'Thinner'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // Marcenaria
  {
    id: 'serv_009',
    name: 'Furniture Assembly',
    description: 'Assembly of custom and modular furniture',
    category: 'marcenaria',
    defaultPrice: 150.00,
    unit: 'unit',
    estimatedDuration: 3,
    materials: ['Screws', 'Wall Anchors', 'Glue'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'serv_010',
    name: 'Door Adjustment',
    description: 'Door and lock adjustments and repairs',
    category: 'marcenaria',
    defaultPrice: 80.00,
    unit: 'unit',
    estimatedDuration: 1,
    materials: ['Locks', 'Screws', 'Sandpaper'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // Alvenaria
  {
    id: 'serv_011',
    name: 'Crack Repair',
    description: 'Wall crack repair and correction',
    category: 'alvenaria',
    defaultPrice: 50.00,
    unit: 'meter',
    estimatedDuration: 2,
    materials: ['Filler', 'Mesh', 'Primer'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'serv_012',
    name: 'Tile Installation',
    description: 'Installation of tiles and ceramics',
    category: 'alvenaria',
    defaultPrice: 35.00,
    unit: 'meter',
    estimatedDuration: 1,
    materials: ['Mortar', 'Grout', 'Spacers'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // Jardinagem
  {
    id: 'serv_013',
    name: 'Tree Pruning',
    description: 'Pruning and maintenance of trees and shrubs',
    category: 'jardinagem',
    defaultPrice: 100.00,
    unit: 'hour',
    estimatedDuration: 2,
    materials: ['Pruning Tools', 'Safety Equipment'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'serv_014',
    name: 'Garden Maintenance',
    description: 'General garden cleaning and maintenance',
    category: 'jardinagem',
    defaultPrice: 80.00,
    unit: 'hour',
    estimatedDuration: 3,
    materials: ['Fertilizers', 'Seeds', 'Soil'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // Limpeza
  {
    id: 'serv_015',
    name: 'Post-Construction Cleaning',
    description: 'Complete cleaning after renovations',
    category: 'limpeza',
    defaultPrice: 15.00,
    unit: 'meter',
    estimatedDuration: 0.3,
    materials: ['Cleaning Products', 'Equipment'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Sample Quotations
export const mockQuotations: Quotation[] = [
  {
    id: 'quot_001',
    clientName: 'Maria Silva',
    clientEmail: 'maria.silva@email.com',
    clientPhone: '(11) 99999-9999',
    clientAddress: '123 Flower Street - New York',
    items: [
      {
        serviceId: 'serv_001',
        quantity: 3,
        unitPrice: 80.00,
        subtotal: 240.00,
        notes: 'Install 3 outlets in the living room'
      },
      {
        serviceId: 'serv_002',
        quantity: 2,
        unitPrice: 120.00,
        subtotal: 240.00,
        notes: 'Bedroom and kitchen light fixtures'
      }
    ],
    subtotal: 480.00,
    discount: 50.00,
    total: 430.00,
    notes: 'Work to be performed over the weekend',
    status: 'sent',
    validUntil: '2024-02-15T23:59:59Z',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'quot_002',
    clientName: 'John Santos',
    clientEmail: 'joao.santos@email.com',
    clientPhone: '(11) 88888-8888',
    clientAddress: '456 Main Avenue - New York',
    items: [
      {
        serviceId: 'serv_004',
        quantity: 1,
        unitPrice: 100.00,
        subtotal: 100.00,
        notes: 'Kitchen leak'
      },
      {
        serviceId: 'serv_005',
        quantity: 2,
        unitPrice: 80.00,
        subtotal: 160.00,
        notes: 'Replace bathroom faucets'
      }
    ],
    subtotal: 260.00,
    total: 260.00,
    status: 'accepted',
    validUntil: '2024-02-20T23:59:59Z',
    createdAt: '2024-01-18T14:30:00Z',
    updatedAt: '2024-01-19T09:15:00Z'
  }
];

// Calendar Availability
export const mockCalendarAvailability: CalendarAvailability[] = [
  {
    id: 'cal_001',
    type: 'weekly',
    weeklyPattern: [
      {
        id: 'week_mon',
        dayOfWeek: 1, // Monday
        isAvailable: true,
        timeSlots: [
          { start: '08:00', end: '12:00' },
          { start: '13:00', end: '17:00' }
        ],
        effectiveFrom: '2024-01-01T00:00:00Z'
      },
      {
        id: 'week_tue',
        dayOfWeek: 2, // Tuesday
        isAvailable: true,
        timeSlots: [
          { start: '08:00', end: '12:00' },
          { start: '13:00', end: '17:00' }
        ],
        effectiveFrom: '2024-01-01T00:00:00Z'
      },
      {
        id: 'week_wed',
        dayOfWeek: 3, // Wednesday
        isAvailable: true,
        timeSlots: [
          { start: '08:00', end: '12:00' },
          { start: '13:00', end: '17:00' }
        ],
        effectiveFrom: '2024-01-01T00:00:00Z'
      },
      {
        id: 'week_thu',
        dayOfWeek: 4, // Thursday
        isAvailable: true,
        timeSlots: [
          { start: '08:00', end: '12:00' },
          { start: '13:00', end: '17:00' }
        ],
        effectiveFrom: '2024-01-01T00:00:00Z'
      },
      {
        id: 'week_fri',
        dayOfWeek: 5, // Friday
        isAvailable: true,
        timeSlots: [
          { start: '08:00', end: '12:00' },
          { start: '13:00', end: '17:00' }
        ],
        effectiveFrom: '2024-01-01T00:00:00Z'
      },
      {
        id: 'week_sat',
        dayOfWeek: 6, // Saturday
        isAvailable: true,
        timeSlots: [
          { start: '08:00', end: '14:00' }
        ],
        effectiveFrom: '2024-01-01T00:00:00Z'
      },
      {
        id: 'week_sun',
        dayOfWeek: 0, // Sunday
        isAvailable: false,
        timeSlots: [],
        effectiveFrom: '2024-01-01T00:00:00Z'
      }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Automation Rules Mock Data
export const mockAutomationRules: AutomationRule[] = [
  {
    id: 'rule_electrical',
    name: 'Electrical Services Auto-Quote',
    description: 'Automatically generates quotes for electrical service requests',
    keywords: ['electrical', 'outlet', 'wiring', 'switch', 'light', 'fixture', 'circuit', 'power'],
    serviceIds: ['serv_electrical_1', 'serv_electrical_2', 'serv_electrical_3'],
    isActive: true,
    conditions: {
      minConfidence: 75,
      emailCategories: ['orcamento', 'informacoes_produto'],
      senderDomain: '',
      requireAllKeywords: false,
    },
    actions: {
      generateQuote: true,
      autoSend: false,
      notifyManager: true,
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  },
  {
    id: 'rule_plumbing',
    name: 'Plumbing Services Auto-Quote',
    description: 'Handles plumbing service requests with automated quote generation',
    keywords: ['plumbing', 'leak', 'faucet', 'pipe', 'drain', 'toilet', 'sink', 'water'],
    serviceIds: ['serv_plumbing_1', 'serv_plumbing_2', 'serv_plumbing_3'],
    isActive: true,
    conditions: {
      minConfidence: 70,
      emailCategories: ['orcamento', 'suporte'],
      senderDomain: '',
      requireAllKeywords: false,
    },
    actions: {
      generateQuote: true,
      autoSend: false,
      notifyManager: true,
    },
    createdAt: '2024-01-16T09:15:00Z',
    updatedAt: '2024-01-22T11:45:00Z'
  },
  {
    id: 'rule_painting',
    name: 'Painting Services Auto-Quote',
    description: 'Automated quotes for painting and decoration services',
    keywords: ['paint', 'painting', 'wall', 'color', 'brush', 'decoration', 'interior', 'exterior'],
    serviceIds: ['serv_painting_1', 'serv_painting_2'],
    isActive: true,
    conditions: {
      minConfidence: 65,
      emailCategories: ['orcamento'],
      senderDomain: '',
      requireAllKeywords: false,
    },
    actions: {
      generateQuote: true,
      autoSend: false,
      notifyManager: true,
    },
    createdAt: '2024-01-18T15:20:00Z',
    updatedAt: '2024-01-25T08:10:00Z'
  },
  {
    id: 'rule_urgent',
    name: 'Urgent Repairs Priority',
    description: 'Fast-track urgent repair requests',
    keywords: ['urgent', 'emergency', 'asap', 'immediately', 'broken', 'not working'],
    serviceIds: ['serv_electrical_1', 'serv_plumbing_1', 'serv_general_1'],
    isActive: true,
    conditions: {
      minConfidence: 80,
      emailCategories: ['suporte', 'reclamacao'],
      senderDomain: '',
      requireAllKeywords: false,
    },
    actions: {
      generateQuote: true,
      autoSend: false,
      notifyManager: true,
    },
    createdAt: '2024-01-20T12:00:00Z',
    updatedAt: '2024-01-28T16:30:00Z'
  },
  {
    id: 'rule_inactive',
    name: 'Carpentry Services (Inactive)',
    description: 'Temporarily disabled carpentry automation',
    keywords: ['carpentry', 'wood', 'cabinet', 'door', 'furniture'],
    serviceIds: ['serv_carpentry_1'],
    isActive: false,
    conditions: {
      minConfidence: 70,
      emailCategories: ['orcamento'],
      senderDomain: '',
      requireAllKeywords: false,
    },
    actions: {
      generateQuote: true,
      autoSend: false,
      notifyManager: true,
    },
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-30T10:15:00Z'
  }
];

// Mock Pending Quotes
export const mockPendingQuotes: PendingQuote[] = [
  {
    id: 'pending_1',
    emailId: 1,
    email: {
      id: 1,
      gmailId: 'msg_123',
      subject: 'Need electrical outlet installation',
      from: 'john.doe@email.com',
      date: '2024-02-01T09:15:00Z',
      body: 'Hi, I need to install 3 new electrical outlets in my kitchen. Can you provide a quote?',
      snippet: 'Hi, I need to install 3 new electrical outlets in my kitchen...',
      category: 'quote',
      confidence: 0.85,
      processed: true,
      responded: false,
      createdAt: '2024-02-01T09:15:00Z',
      updatedAt: '2024-02-01T09:15:00Z'
    },
    ruleId: 'rule_electrical',
    rule: {
      id: 'rule_electrical',
      name: 'Electrical Services Auto-Quote',
      description: 'Automatically generates quotes for electrical service requests',
      keywords: ['electrical', 'outlet', 'wiring', 'switch', 'light', 'fixture', 'circuit', 'power'],
      serviceIds: ['serv_electrical_1', 'serv_electrical_2', 'serv_electrical_3'],
      isActive: true,
      conditions: {
        minConfidence: 75,
        emailCategories: ['orcamento', 'informacoes_produto'],
        senderDomain: '',
        requireAllKeywords: false,
      },
      actions: {
        generateQuote: true,
        autoSend: false,
        notifyManager: true,
      },
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z'
    },
    generatedQuote: {
      id: 'quote_auto_1',
      clientName: 'John Doe',
      clientEmail: 'john.doe@email.com',
      clientPhone: '',
      clientAddress: '',
      items: [
        {
          serviceId: 'serv_electrical_1',
          quantity: 3,
          unitPrice: 85.00,
          subtotal: 255.00,
          notes: 'Standard outlet installation'
        }
      ],
      subtotal: 255.00,
      discount: 0,
      total: 255.00,
      notes: 'Auto-generated quote based on email analysis',
      status: 'draft',
      validUntil: '2024-03-01T00:00:00Z',
      createdAt: '2024-02-01T09:30:00Z',
      updatedAt: '2024-02-01T09:30:00Z'
    },
    aiAnalysis: {
      detectedKeywords: ['electrical', 'outlet', 'installation', 'kitchen'],
      confidence: 85,
      extractedInfo: {
        clientName: 'John Doe',
        urgency: 'medium',
        estimatedBudget: 300,
        preferredDate: '',
        description: 'Kitchen outlet installation - 3 outlets needed'
      },
      matchedServices: [
        {
          serviceId: 'serv_electrical_1',
          serviceName: 'Electrical Outlet Installation',
          relevanceScore: 0.95
        }
      ]
    },
    status: 'pending',
    managerNotes: '',
    processedAt: '2024-02-01T09:30:00Z',
  },
  {
    id: 'pending_2',
    emailId: 2,
    email: {
      id: 2,
      gmailId: 'msg_124',
      subject: 'URGENT: Leaking faucet repair needed',
      from: 'sarah.wilson@gmail.com',
      date: '2024-02-01T14:22:00Z',
      body: 'My kitchen faucet is leaking badly and I need it fixed as soon as possible. Water is everywhere!',
      snippet: 'My kitchen faucet is leaking badly and I need it fixed...',
      category: 'support',
      confidence: 0.92,
      processed: true,
      responded: false,
      createdAt: '2024-02-01T14:22:00Z',
      updatedAt: '2024-02-01T14:22:00Z'
    },
    ruleId: 'rule_urgent',
    rule: {
      id: 'rule_urgent',
      name: 'Urgent Repairs Priority',
      description: 'Fast-track urgent repair requests',
      keywords: ['urgent', 'emergency', 'asap', 'immediately', 'broken', 'not working'],
      serviceIds: ['serv_electrical_1', 'serv_plumbing_1', 'serv_general_1'],
      isActive: true,
      conditions: {
        minConfidence: 80,
        emailCategories: ['suporte', 'reclamacao'],
        senderDomain: '',
        requireAllKeywords: false,
      },
      actions: {
        generateQuote: true,
        autoSend: false,
        notifyManager: true,
      },
      createdAt: '2024-01-20T12:00:00Z',
      updatedAt: '2024-01-28T16:30:00Z'
    },
    generatedQuote: {
      id: 'quote_auto_2',
      clientName: 'Sarah Wilson',
      clientEmail: 'sarah.wilson@gmail.com',
      clientPhone: '',
      clientAddress: '',
      items: [
        {
          serviceId: 'serv_plumbing_1',
          quantity: 1,
          unitPrice: 120.00,
          subtotal: 120.00,
          notes: 'Emergency faucet repair'
        }
      ],
      subtotal: 120.00,
      discount: 0,
      total: 120.00,
      notes: 'URGENT: Auto-generated quote for emergency repair',
      status: 'draft',
      validUntil: '2024-02-15T00:00:00Z',
      createdAt: '2024-02-01T14:35:00Z',
      updatedAt: '2024-02-01T14:35:00Z'
    },
    aiAnalysis: {
      detectedKeywords: ['urgent', 'leaking', 'faucet', 'repair', 'asap'],
      confidence: 92,
      extractedInfo: {
        clientName: 'Sarah Wilson',
        urgency: 'high',
        estimatedBudget: 150,
        preferredDate: 'ASAP',
        description: 'Emergency faucet leak repair in kitchen'
      },
      matchedServices: [
        {
          serviceId: 'serv_plumbing_1',
          serviceName: 'Plumbing Repair Service',
          relevanceScore: 0.98
        }
      ]
    },
    status: 'pending',
    managerNotes: '',
    processedAt: '2024-02-01T14:35:00Z',
  },
  {
    id: 'pending_3',
    emailId: 3,
    email: {
      id: 3,
      gmailId: 'msg_125',
      subject: 'Interior wall painting quote request',
      from: 'mike.brown@company.com',
      date: '2024-02-01T16:45:00Z',
      body: 'Hello, I would like to get a quote for painting 2 bedrooms. The walls are about 400 sq ft total.',
      snippet: 'Hello, I would like to get a quote for painting 2 bedrooms...',
      category: 'quote',
      confidence: 0.78,
      processed: true,
      responded: false,
      createdAt: '2024-02-01T16:45:00Z',
      updatedAt: '2024-02-01T16:45:00Z'
    },
    ruleId: 'rule_painting',
    rule: {
      id: 'rule_painting',
      name: 'Painting Services Auto-Quote',
      description: 'Automated quotes for painting and decoration services',
      keywords: ['paint', 'painting', 'wall', 'color', 'brush', 'decoration', 'interior', 'exterior'],
      serviceIds: ['serv_painting_1', 'serv_painting_2'],
      isActive: true,
      conditions: {
        minConfidence: 65,
        emailCategories: ['orcamento'],
        senderDomain: '',
        requireAllKeywords: false,
      },
      actions: {
        generateQuote: true,
        autoSend: false,
        notifyManager: true,
      },
      createdAt: '2024-01-18T15:20:00Z',
      updatedAt: '2024-01-25T08:10:00Z'
    },
    generatedQuote: {
      id: 'quote_auto_3',
      clientName: 'Mike Brown',
      clientEmail: 'mike.brown@company.com',
      clientPhone: '',
      clientAddress: '',
      items: [
        {
          serviceId: 'serv_painting_1',
          quantity: 400,
          unitPrice: 3.50,
          subtotal: 1400.00,
          notes: 'Interior wall painting - 2 bedrooms'
        }
      ],
      subtotal: 1400.00,
      discount: 50.00,
      total: 1350.00,
      notes: 'Auto-generated quote with volume discount applied',
      status: 'draft',
      validUntil: '2024-03-01T00:00:00Z',
      createdAt: '2024-02-01T17:00:00Z',
      updatedAt: '2024-02-01T17:00:00Z'
    },
    aiAnalysis: {
      detectedKeywords: ['painting', 'interior', 'wall', 'bedrooms', 'quote'],
      confidence: 78,
      extractedInfo: {
        clientName: 'Mike Brown',
        urgency: 'low',
        estimatedBudget: 1500,
        preferredDate: '',
        description: 'Interior wall painting for 2 bedrooms, 400 sq ft total'
      },
      matchedServices: [
        {
          serviceId: 'serv_painting_1',
          serviceName: 'Interior Painting Service',
          relevanceScore: 0.88
        }
      ]
    },
    status: 'pending',
    managerNotes: '',
    processedAt: '2024-02-01T17:00:00Z',
  }
];

// Mock Automation Metrics
export const mockAutomationMetrics: AutomationMetrics = {
  totalRules: 5,
  activeRules: 4,
  emailsProcessed: 127,
  quotesGenerated: 45,
  quotesApproved: 38,
  quotesSent: 35,
  averageConfidence: 81.5,
  conversionRate: 84.4, // (38/45) * 100
  responseTime: 23, // minutes
  periodStats: [
    {
      period: 'Jan 2024',
      processed: 89,
      generated: 32,
      approved: 28,
      sent: 26
    },
    {
      period: 'Dec 2023',
      processed: 76,
      generated: 29,
      approved: 24,
      sent: 22
    },
    {
      period: 'Nov 2023',
      processed: 64,
      generated: 22,
      approved: 19,
      sent: 17
    },
    {
      period: 'Oct 2023',
      processed: 52,
      generated: 18,
      approved: 15,
      sent: 13
    },
    {
      period: 'Sep 2023',
      processed: 43,
      generated: 14,
      approved: 11,
      sent: 10
    },
    {
      period: 'Aug 2023',
      processed: 38,
      generated: 12,
      approved: 9,
      sent: 8
    }
  ]
};

// Mock Categories for Email Classification
export const mockCategories: Category[] = [
  {
    id: 'cat_001',
    name: 'reclamacao',
    description: 'Emails relacionados a reclamações e problemas',
    keywords: ['reclamação', 'reclamar', 'problema', 'defeito', 'erro', 'falha', 'insatisfação', 'ruim', 'péssimo', 'horrível'],
    patterns: ['\\b(problema|defeito|erro|falha)\\b', '\\b(reclamação|reclamar|insatisfação)\\b', '\\b(ruim|péssimo|horrível|terrível)\\b', 'não funciona', 'não está funcionando'],
    domains: [],
    color: '#EF4444',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat_002',
    name: 'orcamento',
    description: 'Emails solicitando orçamentos e cotações',
    keywords: ['orçamento', 'cotação', 'preço', 'valor', 'quanto custa', 'quanto é', 'precisa de orçamento', 'gostaria de saber o preço'],
    patterns: ['\\b(orçamento|cotação|preço|valor)\\b', 'quanto (custa|é|vale)', 'precisa de (orçamento|cotação)', 'gostaria de saber o preço'],
    domains: [],
    color: '#3B82F6',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat_003',
    name: 'informacoes_produto',
    description: 'Emails pedindo informações sobre produtos e serviços',
    keywords: ['informação', 'dúvida', 'pergunta', 'como funciona', 'quais são', 'pode me explicar', 'gostaria de saber'],
    patterns: ['\\b(informação|dúvida|pergunta)\\b', 'como funciona', 'quais são', 'pode me explicar', 'gostaria de saber'],
    domains: [],
    color: '#10B981',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat_004',
    name: 'suporte',
    description: 'Emails de suporte técnico e ajuda',
    keywords: ['suporte', 'ajuda', 'assistência', 'técnico', 'problema técnico', 'não consigo', 'preciso de ajuda'],
    patterns: ['\\b(suporte|ajuda|assistência|técnico)\\b', 'problema técnico', 'não consigo', 'preciso de ajuda'],
    domains: [],
    color: '#F59E0B',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat_005',
    name: 'vendas',
    description: 'Emails relacionados a vendas e promoções',
    keywords: ['venda', 'compra', 'promoção', 'desconto', 'oferta', 'especial', 'limitado', 'última chance'],
    patterns: ['\\b(venda|compra|promoção|desconto|oferta)\\b', 'especial', 'limitado', 'última chance'],
    domains: [],
    color: '#8B5CF6',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];