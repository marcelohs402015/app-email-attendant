import { Database } from './Database.js';
import { CategorizedEmail, EmailTemplate } from '../types/email.js';
import { FilterOptions, PaginationOptions } from '../types/database.js';
export declare class EmailRepository {
    private db;
    private logger;
    constructor(database: Database);
    saveEmail(email: Omit<CategorizedEmail, 'id' | 'createdAt' | 'updatedAt'>): Promise<CategorizedEmail>;
    getEmails(filters?: FilterOptions, pagination?: PaginationOptions): Promise<{
        emails: CategorizedEmail[];
        total: number;
    }>;
    getEmailById(id: number): Promise<CategorizedEmail | null>;
    updateEmailStatus(id: number, updates: {
        processed?: boolean;
        responded?: boolean;
        responseTemplate?: string;
    }): Promise<boolean>;
    getEmailTemplates(category?: string): Promise<EmailTemplate[]>;
    createEmailTemplate(templateData: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<EmailTemplate>;
    updateEmailTemplate(id: string, templateData: Partial<Omit<EmailTemplate, 'id' | 'createdAt'>>): Promise<EmailTemplate | null>;
    deleteEmailTemplate(id: string): Promise<boolean>;
    getCategoryStats(): Promise<Array<{
        category: string;
        count: number;
        responded_count: number;
    }>>;
}
//# sourceMappingURL=EmailRepository.d.ts.map