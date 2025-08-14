"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockCalendarAvailability = exports.mockQuotations = exports.mockServices = exports.mockServiceCategories = exports.categoryColors = exports.categoryLabels = exports.mockAppointments = exports.mockClients = exports.mockCategoryStats = exports.mockTemplates = void 0;
exports.mockTemplates = [
    {
        id: 'template_reclamacao',
        name: 'Complaint Response',
        subject: `Re: \${subject}`,
        body: `Dear Customer,

Thank you for contacting us and we apologize for the inconvenience caused.

We are analyzing your complaint (Protocol: ${Math.random().toString(36).substr(2, 9).toUpperCase()}) and will contact you within 24 hours with a solution.

Best regards,
Customer Service Team`,
        category: 'reclamacao',
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
        category: 'orcamento',
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
        category: 'informacoes_produto',
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
        category: 'suporte',
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
        category: 'vendas',
        variables: ['subject'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    }
];
exports.mockCategoryStats = [
    {
        category: 'reclamacao',
        count: 12,
        responded_count: 8
    },
    {
        category: 'orcamento',
        count: 8,
        responded_count: 7
    },
    {
        category: 'informacoes_produto',
        count: 15,
        responded_count: 10
    },
    {
        category: 'suporte',
        count: 20,
        responded_count: 18
    },
    {
        category: 'vendas',
        count: 5,
        responded_count: 3
    }
];
exports.mockClients = [
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
exports.mockAppointments = [
    {
        id: 'appt_001',
        clientId: 'client_001',
        client: exports.mockClients[0],
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
        client: exports.mockClients[1],
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
        client: exports.mockClients[2],
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
        client: exports.mockClients[3],
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
        client: exports.mockClients[4],
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
exports.categoryLabels = {
    reclamacao: 'Complaint',
    orcamento: 'Quote',
    informacoes_produto: 'Product Information',
    suporte: 'Support',
    vendas: 'Sales'
};
exports.categoryColors = {
    reclamacao: '#ef4444',
    orcamento: '#3b82f6',
    informacoes_produto: '#10b981',
    suporte: '#f59e0b',
    vendas: '#8b5cf6'
};
exports.mockServiceCategories = [
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
exports.mockServices = [
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
exports.mockQuotations = [
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
exports.mockCalendarAvailability = [
    {
        id: 'cal_001',
        type: 'weekly',
        weeklyPattern: [
            {
                id: 'week_mon',
                dayOfWeek: 1,
                isAvailable: true,
                timeSlots: [
                    { start: '08:00', end: '12:00' },
                    { start: '13:00', end: '17:00' }
                ],
                effectiveFrom: '2024-01-01T00:00:00Z'
            },
            {
                id: 'week_tue',
                dayOfWeek: 2,
                isAvailable: true,
                timeSlots: [
                    { start: '08:00', end: '12:00' },
                    { start: '13:00', end: '17:00' }
                ],
                effectiveFrom: '2024-01-01T00:00:00Z'
            },
            {
                id: 'week_wed',
                dayOfWeek: 3,
                isAvailable: true,
                timeSlots: [
                    { start: '08:00', end: '12:00' },
                    { start: '13:00', end: '17:00' }
                ],
                effectiveFrom: '2024-01-01T00:00:00Z'
            },
            {
                id: 'week_thu',
                dayOfWeek: 4,
                isAvailable: true,
                timeSlots: [
                    { start: '08:00', end: '12:00' },
                    { start: '13:00', end: '17:00' }
                ],
                effectiveFrom: '2024-01-01T00:00:00Z'
            },
            {
                id: 'week_fri',
                dayOfWeek: 5,
                isAvailable: true,
                timeSlots: [
                    { start: '08:00', end: '12:00' },
                    { start: '13:00', end: '17:00' }
                ],
                effectiveFrom: '2024-01-01T00:00:00Z'
            },
            {
                id: 'week_sat',
                dayOfWeek: 6,
                isAvailable: true,
                timeSlots: [
                    { start: '08:00', end: '14:00' }
                ],
                effectiveFrom: '2024-01-01T00:00:00Z'
            },
            {
                id: 'week_sun',
                dayOfWeek: 0,
                isAvailable: false,
                timeSlots: [],
                effectiveFrom: '2024-01-01T00:00:00Z'
            }
        ],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    }
];
//# sourceMappingURL=mockData.js.map