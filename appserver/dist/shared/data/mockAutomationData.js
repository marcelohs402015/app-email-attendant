// Mock automation data for backend
export const mockAutomationRules = [
    {
        id: 'rule_electrical',
        name: 'Electrical Services Auto-Quote',
        description: 'Automatically generates quotes for electrical service requests',
        keywords: ['electrical', 'outlet', 'wiring', 'switch', 'light', 'fixture', 'circuit', 'power'],
        serviceIds: ['serv_electrical_1', 'serv_electrical_2', 'serv_electrical_3'],
        isActive: true,
        conditions: {
            minConfidence: 75,
            emailCategories: ['quote', 'product_info'],
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
            emailCategories: ['quote', 'support'],
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
export const mockPendingQuotes = [
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
            category: 'orcamento',
            confidence: 0.85,
            processed: true,
            responded: false,
            createdAt: '2024-02-01T09:15:00Z',
            updatedAt: '2024-02-01T09:15:00Z'
        },
        ruleId: 'rule_electrical',
        rule: mockAutomationRules[0],
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
            category: 'suporte',
            confidence: 0.92,
            processed: true,
            responded: false,
            createdAt: '2024-02-01T14:22:00Z',
            updatedAt: '2024-02-01T14:22:00Z'
        },
        ruleId: 'rule_urgent',
        rule: mockAutomationRules[3],
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
            category: 'orcamento',
            confidence: 0.78,
            processed: true,
            responded: false,
            createdAt: '2024-02-01T16:45:00Z',
            updatedAt: '2024-02-01T16:45:00Z'
        },
        ruleId: 'rule_painting',
        rule: mockAutomationRules[2],
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
export const mockAutomationMetrics = {
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
//# sourceMappingURL=mockAutomationData.js.map