interface ChatMessage {
    id: string;
    sessionId: string;
    type: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
    metadata?: {
        action?: 'create_quotation' | 'register_service' | 'register_client' | 'general_inquiry';
        data?: any;
        confidence?: number;
        suggestedActions?: ChatAction[];
    };
}
interface ChatAction {
    id: string;
    type: 'create_quotation' | 'register_service' | 'register_client' | 'view_details';
    label: string;
    data: any;
    requiresConfirmation: boolean;
}
interface ChatSession {
    id: string;
    clientId?: string;
    title: string;
    messages: ChatMessage[];
    status: 'active' | 'completed' | 'archived';
    context: ChatContext;
    createdAt: string;
    updatedAt: string;
}
interface ChatContext {
    currentAction?: string;
    collectingData?: {
        type: 'quotation' | 'service' | 'client';
        step: number;
        data: Record<string, any>;
    };
    lastClientId?: string;
    preferredServices?: string[];
}
interface ChatResponse {
    message: string;
    sessionId: string;
    metadata?: {
        action?: string;
        data?: any;
        nextStep?: string;
        suggestedActions?: ChatAction[];
        confidence?: number;
    };
}
/**
 * ChatService - Intelligent Chat System for Business Management
 *
 * This service provides AI-powered chat functionality for:
 * - Creating quotations through conversation
 * - Registering services and clients
 * - General business inquiries
 *
 * Uses mock AI responses for demonstration purposes.
 */
export declare class ChatService {
    private sessions;
    private readonly mockResponses;
    private readonly intentPatterns;
    private readonly conversationFlows;
    /**
     * Create a new chat session
     */
    createSession(): Promise<ChatSession>;
    /**
     * Process user message and generate AI response
     */
    processMessage(sessionId: string, userMessage: string): Promise<ChatResponse>;
    /**
     * Get session by ID
     */
    getSession(sessionId: string): Promise<ChatSession | null>;
    /**
     * List all sessions
     */
    listSessions(): Promise<ChatSession[]>;
    /**
     * Detect user intent from message
     */
    private detectIntent;
    /**
     * Extract entities from user message
     */
    private extractEntities;
    /**
     * Generate AI response based on intent and context
     */
    private generateResponse;
    /**
     * Start quotation creation flow
     */
    private startQuotationFlow;
    /**
     * Start service registration flow
     */
    private startServiceFlow;
    /**
     * Start client registration flow
     */
    private startClientFlow;
    /**
     * Handle conversation flow progression
     */
    private handleConversationFlow;
    /**
     * Complete the conversation flow and create the resource
     */
    private completeFlow;
    /**
     * Mock resource creation (in real implementation, this would call actual services)
     */
    private createResource;
    /**
     * Validate user input
     */
    private validateInput;
    /**
     * Generate session title based on intent and message
     */
    private generateSessionTitle;
    /**
     * Get random response from array
     */
    private getRandomResponse;
}
export {};
//# sourceMappingURL=ChatService.d.ts.map