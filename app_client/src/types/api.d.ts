export interface EmailData {
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
    responseTemplate?: string;
    createdAt: string;
    updatedAt: string;
}
export interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    body: string;
    category?: string;
    variables?: string[];
    createdAt: string;
    updatedAt: string;
}
export interface CategoryStats {
    category: string;
    count: number;
    responded_count: number;
}
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}
export interface FilterOptions {
    category?: string;
    from?: string;
    dateFrom?: string;
    dateTo?: string;
    responded?: boolean;
    processed?: boolean;
}
export interface PaginationOptions {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
export interface Service {
    id: string;
    name: string;
    description: string;
    category: string;
    defaultPrice: number;
    unit: string;
    estimatedDuration: number;
    materials?: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface ServiceCategory {
    id: string;
    name: string;
    description: string;
    color: string;
}
export interface QuotationItem {
    serviceId: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    notes?: string;
}
export interface Quotation {
    id: string;
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    clientAddress?: string;
    items: QuotationItem[];
    subtotal: number;
    discount?: number;
    total: number;
    notes?: string;
    status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'completed';
    validUntil: string;
    createdAt: string;
    updatedAt: string;
}
export interface TimeSlot {
    start: string;
    end: string;
}
export interface AvailabilityDay {
    date: string;
    isAvailable: boolean;
    timeSlots: TimeSlot[];
    notes?: string;
}
export interface WeeklyAvailability {
    id: string;
    dayOfWeek: number;
    isAvailable: boolean;
    timeSlots: TimeSlot[];
    effectiveFrom: string;
    effectiveUntil?: string;
}
export interface CalendarAvailability {
    id: string;
    type: 'specific' | 'weekly' | 'monthly';
    specificDays?: AvailabilityDay[];
    weeklyPattern?: WeeklyAvailability[];
    createdAt: string;
    updatedAt: string;
}
export interface Client {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    notes?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface Appointment {
    id: string;
    clientId: string;
    client: Client;
    quotationId?: string;
    title: string;
    description?: string;
    date: string;
    startTime: string;
    endTime: string;
    status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
    location?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}
//# sourceMappingURL=api.d.ts.map