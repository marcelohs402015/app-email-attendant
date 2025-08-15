export declare const mockAutomationRules: {
    id: string;
    name: string;
    description: string;
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
}[];
export declare const mockPendingQuotes: {
    id: string;
    emailId: number;
    email: {
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
        createdAt: string;
        updatedAt: string;
    };
    ruleId: string;
    rule: {
        id: string;
        name: string;
        description: string;
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
    };
    generatedQuote: {
        id: string;
        clientName: string;
        clientEmail: string;
        clientPhone: string;
        clientAddress: string;
        items: {
            serviceId: string;
            quantity: number;
            unitPrice: number;
            subtotal: number;
            notes: string;
        }[];
        subtotal: number;
        discount: number;
        total: number;
        notes: string;
        status: string;
        validUntil: string;
        createdAt: string;
        updatedAt: string;
    };
    aiAnalysis: {
        detectedKeywords: string[];
        confidence: number;
        extractedInfo: {
            clientName: string;
            urgency: string;
            estimatedBudget: number;
            preferredDate: string;
            description: string;
        };
        matchedServices: {
            serviceId: string;
            serviceName: string;
            relevanceScore: number;
        }[];
    };
    status: string;
    managerNotes: string;
    processedAt: string;
}[];
export declare const mockAutomationMetrics: {
    totalRules: number;
    activeRules: number;
    emailsProcessed: number;
    quotesGenerated: number;
    quotesApproved: number;
    quotesSent: number;
    averageConfidence: number;
    conversionRate: number;
    responseTime: number;
    periodStats: {
        period: string;
        processed: number;
        generated: number;
        approved: number;
        sent: number;
    }[];
};
//# sourceMappingURL=mockAutomationData.d.ts.map