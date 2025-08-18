interface MockChatMessage {
    id: string;
    sessionId: string;
    type: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
    metadata?: {
        action?: 'create_quotation' | 'register_service' | 'register_client' | 'general_inquiry' | 'quotation_completed' | 'service_completed' | 'client_completed' | 'help' | 'greeting';
        data?: any;
        confidence?: number;
        suggestedActions?: any[];
    };
}
interface MockChatSession {
    id: string;
    clientId?: string;
    title: string;
    messages: MockChatMessage[];
    status: 'active' | 'completed' | 'archived';
    context: any;
    createdAt: string;
    updatedAt: string;
}
/**
 * Mock Data Generator for Chat Service
 *
 * This utility provides realistic mock data to simulate user interactions
 * with the AI chat system, including various conversation scenarios.
 */
export declare class MockDataGenerator {
    /**
     * Generate mock chat sessions with realistic conversations
     */
    static generateMockSessions(): MockChatSession[];
    /**
     * Create a mock session for quotation creation
     */
    private static createQuotationSession;
    /**
     * Create a mock session for service registration
     */
    private static createServiceRegistrationSession;
    /**
     * Create a mock session for client registration
     */
    private static createClientRegistrationSession;
    /**
     * Create a mock session for general inquiry
     */
    private static createGeneralInquirySession;
    /**
     * Create a mock session for help request
     */
    private static createHelpSession;
}
export {};
//# sourceMappingURL=mockData.d.ts.map