import { v4 as uuidv4 } from 'uuid';
/**
 * Mock Data Generator for Chat Service
 *
 * This utility provides realistic mock data to simulate user interactions
 * with the AI chat system, including various conversation scenarios.
 */
export class MockDataGenerator {
    /**
     * Generate mock chat sessions with realistic conversations
     */
    static generateMockSessions() {
        const sessions = [];
        // Session 1: Quotation Creation
        sessions.push(this.createQuotationSession());
        // Session 2: Service Registration
        sessions.push(this.createServiceRegistrationSession());
        // Session 3: Client Registration
        sessions.push(this.createClientRegistrationSession());
        // Session 4: General Inquiry
        sessions.push(this.createGeneralInquirySession());
        // Session 5: Help Request
        sessions.push(this.createHelpSession());
        return sessions;
    }
    /**
     * Create a mock session for quotation creation
     */
    static createQuotationSession() {
        const sessionId = uuidv4();
        const createdAt = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(); // 2 hours ago
        return {
            id: sessionId,
            title: 'Quotation for Electrical Repair',
            status: 'completed',
            context: {
                currentAction: 'create_quotation',
                collectingData: {
                    type: 'quotation',
                    step: 5,
                    data: {
                        clientName: 'João Silva',
                        clientEmail: 'joao.silva@email.com',
                        services: 'Electrical repair and installation',
                        urgency: 'medium'
                    }
                }
            },
            messages: [
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'user',
                    content: 'Preciso criar um orçamento para reparo elétrico',
                    timestamp: createdAt
                },
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'assistant',
                    content: 'Perfeito! Vou ajudá-lo a criar um orçamento profissional. Para começar, qual é o nome do cliente?',
                    timestamp: new Date(Date.parse(createdAt) + 1000).toISOString(),
                    metadata: {
                        action: 'create_quotation',
                        confidence: 0.95
                    }
                },
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'user',
                    content: 'João Silva',
                    timestamp: new Date(Date.parse(createdAt) + 5000).toISOString()
                },
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'assistant',
                    content: 'Ótimo! Qual é o email do João Silva?',
                    timestamp: new Date(Date.parse(createdAt) + 6000).toISOString(),
                    metadata: {
                        action: 'create_quotation',
                        confidence: 0.92
                    }
                },
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'user',
                    content: 'joao.silva@email.com',
                    timestamp: new Date(Date.parse(createdAt) + 10000).toISOString()
                },
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'assistant',
                    content: 'Perfeito! Que serviços o João precisa? Você pode mencionar múltiplos serviços.',
                    timestamp: new Date(Date.parse(createdAt) + 11000).toISOString(),
                    metadata: {
                        action: 'create_quotation',
                        confidence: 0.90
                    }
                },
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'user',
                    content: 'Reparo elétrico e instalação',
                    timestamp: new Date(Date.parse(createdAt) + 15000).toISOString()
                },
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'assistant',
                    content: 'Excelente! Qual é a urgência deste projeto? (baixa, média, alta)',
                    timestamp: new Date(Date.parse(createdAt) + 16000).toISOString(),
                    metadata: {
                        action: 'create_quotation',
                        confidence: 0.88
                    }
                },
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'user',
                    content: 'Média',
                    timestamp: new Date(Date.parse(createdAt) + 20000).toISOString()
                },
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'assistant',
                    content: `Perfeito! Criei o orçamento com sucesso.

**ID do Orçamento:** QUO-A1B2C3D4
**Cliente:** João Silva
**Email:** joao.silva@email.com
**Serviços:** Reparo elétrico e instalação
**Urgência:** Média

O orçamento foi salvo e está pronto para ser enviado. Posso ajudá-lo com mais alguma coisa?`,
                    timestamp: new Date(Date.parse(createdAt) + 21000).toISOString(),
                    metadata: {
                        action: 'quotation_completed',
                        data: {
                            id: 'QUO-A1B2C3D4',
                            clientName: 'João Silva',
                            clientEmail: 'joao.silva@email.com',
                            services: 'Reparo elétrico e instalação',
                            urgency: 'média'
                        }
                    }
                }
            ],
            createdAt,
            updatedAt: new Date(Date.parse(createdAt) + 21000).toISOString()
        };
    }
    /**
     * Create a mock session for service registration
     */
    static createServiceRegistrationSession() {
        const sessionId = uuidv4();
        const createdAt = new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(); // 4 hours ago
        return {
            id: sessionId,
            title: 'Service Registration - Painting',
            status: 'completed',
            context: {
                currentAction: 'register_service',
                collectingData: {
                    type: 'service',
                    step: 6,
                    data: {
                        name: 'Pintura Residencial',
                        category: 'painting',
                        description: 'Serviços de pintura para residências',
                        price: 45,
                        unit: 'hour'
                    }
                }
            },
            messages: [
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'user',
                    content: 'Quero adicionar um novo serviço de pintura',
                    timestamp: createdAt
                },
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'assistant',
                    content: 'Ótimo! Vou ajudá-lo a registrar um novo serviço. Qual é o nome do serviço?',
                    timestamp: new Date(Date.parse(createdAt) + 2000).toISOString(),
                    metadata: {
                        action: 'register_service',
                        confidence: 0.94
                    }
                },
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'user',
                    content: 'Pintura Residencial',
                    timestamp: new Date(Date.parse(createdAt) + 8000).toISOString()
                },
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'assistant',
                    content: 'Perfeito! A qual categoria este serviço pertence? (elétrica, encanamento, pintura, etc.)',
                    timestamp: new Date(Date.parse(createdAt) + 9000).toISOString(),
                    metadata: {
                        action: 'register_service',
                        confidence: 0.91
                    }
                },
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'user',
                    content: 'Pintura',
                    timestamp: new Date(Date.parse(createdAt) + 12000).toISOString()
                },
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'assistant',
                    content: 'Excelente! Por favor, forneça uma breve descrição do serviço.',
                    timestamp: new Date(Date.parse(createdAt) + 13000).toISOString(),
                    metadata: {
                        action: 'register_service',
                        confidence: 0.89
                    }
                },
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'user',
                    content: 'Serviços de pintura para residências',
                    timestamp: new Date(Date.parse(createdAt) + 18000).toISOString()
                },
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'assistant',
                    content: 'Ótimo! Qual é o preço padrão para este serviço?',
                    timestamp: new Date(Date.parse(createdAt) + 19000).toISOString(),
                    metadata: {
                        action: 'register_service',
                        confidence: 0.87
                    }
                },
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'user',
                    content: '45',
                    timestamp: new Date(Date.parse(createdAt) + 25000).toISOString()
                },
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'assistant',
                    content: 'Perfeito! Qual é a unidade de medida? (hora, dia, metro quadrado, etc.)',
                    timestamp: new Date(Date.parse(createdAt) + 26000).toISOString(),
                    metadata: {
                        action: 'register_service',
                        confidence: 0.85
                    }
                },
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'user',
                    content: 'Hora',
                    timestamp: new Date(Date.parse(createdAt) + 30000).toISOString()
                },
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'assistant',
                    content: `Excelente! Registrei o novo serviço com sucesso.

**ID do Serviço:** SRV-E5F6G7H8
**Nome:** Pintura Residencial
**Categoria:** Pintura
**Descrição:** Serviços de pintura para residências
**Preço:** R$ 45,00 por hora

O serviço agora está disponível no seu catálogo. Como mais posso ajudá-lo?`,
                    timestamp: new Date(Date.parse(createdAt) + 31000).toISOString(),
                    metadata: {
                        action: 'service_completed',
                        data: {
                            id: 'SRV-E5F6G7H8',
                            name: 'Pintura Residencial',
                            category: 'Pintura',
                            description: 'Serviços de pintura para residências',
                            price: 45,
                            unit: 'hora'
                        }
                    }
                }
            ],
            createdAt,
            updatedAt: new Date(Date.parse(createdAt) + 31000).toISOString()
        };
    }
    /**
     * Create a mock session for client registration
     */
    static createClientRegistrationSession() {
        const sessionId = uuidv4();
        const createdAt = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(); // 6 hours ago
        return {
            id: sessionId,
            title: 'Client Registration - Maria Santos',
            status: 'completed',
            context: {
                currentAction: 'register_client',
                collectingData: {
                    type: 'client',
                    step: 5,
                    data: {
                        name: 'Maria Santos',
                        email: 'maria.santos@email.com',
                        phone: '(11) 99999-8888',
                        address: 'Rua das Flores, 123 - São Paulo, SP'
                    }
                }
            },
            messages: [
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'user',
                    content: 'Preciso cadastrar uma nova cliente',
                    timestamp: createdAt
                },
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'assistant',
                    content: 'Perfeito! Vou ajudá-lo a registrar uma nova cliente. Qual é o nome completo da cliente?',
                    timestamp: new Date(Date.parse(createdAt) + 1500).toISOString(),
                    metadata: {
                        action: 'register_client',
                        confidence: 0.93
                    }
                },
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'user',
                    content: 'Maria Santos',
                    timestamp: new Date(Date.parse(createdAt) + 7000).toISOString()
                },
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'assistant',
                    content: 'Ótimo! Qual é o email da Maria?',
                    timestamp: new Date(Date.parse(createdAt) + 7500).toISOString(),
                    metadata: {
                        action: 'register_client',
                        confidence: 0.90
                    }
                },
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'user',
                    content: 'maria.santos@email.com',
                    timestamp: new Date(Date.parse(createdAt) + 11000).toISOString()
                },
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'assistant',
                    content: 'Perfeito! Qual é o número de telefone da Maria? (opcional)',
                    timestamp: new Date(Date.parse(createdAt) + 11500).toISOString(),
                    metadata: {
                        action: 'register_client',
                        confidence: 0.88
                    }
                },
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'user',
                    content: '(11) 99999-8888',
                    timestamp: new Date(Date.parse(createdAt) + 14000).toISOString()
                },
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'assistant',
                    content: 'Excelente! Qual é o endereço da Maria? (opcional)',
                    timestamp: new Date(Date.parse(createdAt) + 14500).toISOString(),
                    metadata: {
                        action: 'register_client',
                        confidence: 0.86
                    }
                },
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'user',
                    content: 'Rua das Flores, 123 - São Paulo, SP',
                    timestamp: new Date(Date.parse(createdAt) + 17000).toISOString()
                },
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'assistant',
                    content: `Ótimo! Registrei a nova cliente com sucesso.

**ID da Cliente:** CLI-I9J0K1L2
**Nome:** Maria Santos
**Email:** maria.santos@email.com
**Telefone:** (11) 99999-8888
**Endereço:** Rua das Flores, 123 - São Paulo, SP

A cliente agora está no seu sistema. Como mais posso ajudá-lo?`,
                    timestamp: new Date(Date.parse(createdAt) + 17500).toISOString(),
                    metadata: {
                        action: 'client_completed',
                        data: {
                            id: 'CLI-I9J0K1L2',
                            name: 'Maria Santos',
                            email: 'maria.santos@email.com',
                            phone: '(11) 99999-8888',
                            address: 'Rua das Flores, 123 - São Paulo, SP'
                        }
                    }
                }
            ],
            createdAt,
            updatedAt: new Date(Date.parse(createdAt) + 17500).toISOString()
        };
    }
    /**
     * Create a mock session for general inquiry
     */
    static createGeneralInquirySession() {
        const sessionId = uuidv4();
        const createdAt = new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(); // 1 hour ago
        return {
            id: sessionId,
            title: 'General Inquiry - Business Hours',
            status: 'active',
            context: {},
            messages: [
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'user',
                    content: 'Olá! Quais são os horários de atendimento?',
                    timestamp: createdAt
                },
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'assistant',
                    content: 'Olá! Nossos horários de atendimento são:\n\n**Segunda a Sexta:** 8h às 18h\n**Sábados:** 8h às 12h\n**Domingos:** Fechado\n\nPara emergências, temos plantão 24h. Como posso ajudá-lo hoje?',
                    timestamp: new Date(Date.parse(createdAt) + 2000).toISOString(),
                    metadata: {
                        action: 'general_inquiry',
                        confidence: 0.85
                    }
                },
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'user',
                    content: 'Vocês fazem serviços de encanamento?',
                    timestamp: new Date(Date.parse(createdAt) + 8000).toISOString()
                },
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'assistant',
                    content: 'Sim! Oferecemos diversos serviços de encanamento:\n\n• Reparo de vazamentos\n• Instalação de pias e chuveiros\n• Desentupimento\n• Substituição de tubulações\n• Instalação de aquecedores\n\nGostaria de solicitar um orçamento para algum serviço específico?',
                    timestamp: new Date(Date.parse(createdAt) + 8500).toISOString(),
                    metadata: {
                        action: 'general_inquiry',
                        confidence: 0.88
                    }
                }
            ],
            createdAt,
            updatedAt: new Date(Date.parse(createdAt) + 8500).toISOString()
        };
    }
    /**
     * Create a mock session for help request
     */
    static createHelpSession() {
        const sessionId = uuidv4();
        const createdAt = new Date(Date.now() - 30 * 60 * 1000).toISOString(); // 30 minutes ago
        return {
            id: sessionId,
            title: 'Help Request',
            status: 'active',
            context: {},
            messages: [
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'user',
                    content: 'O que você pode fazer?',
                    timestamp: createdAt
                },
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'assistant',
                    content: 'Posso ajudá-lo com várias tarefas:\n\n• **Criar Orçamentos** - Gerar orçamentos profissionais para seus clientes\n• **Registrar Serviços** - Adicionar novos serviços ao seu catálogo\n• **Gerenciar Clientes** - Registrar e atualizar informações de clientes\n• **Perguntas Gerais** - Responder sobre seu negócio, horários ou serviços\n\nApenas me diga o que você gostaria de fazer!',
                    timestamp: new Date(Date.parse(createdAt) + 1500).toISOString(),
                    metadata: {
                        action: 'help',
                        confidence: 0.95
                    }
                },
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'user',
                    content: 'Como faço para criar um orçamento?',
                    timestamp: new Date(Date.parse(createdAt) + 10000).toISOString()
                },
                {
                    id: uuidv4(),
                    sessionId,
                    type: 'assistant',
                    content: 'Para criar um orçamento, siga estes passos:\n\n1. **Digite:** "criar orçamento" ou "preciso de um orçamento"\n2. **Informe:** Nome do cliente\n3. **Forneça:** Email do cliente\n4. **Descreva:** Serviços necessários\n5. **Especifique:** Urgência (baixa, média, alta)\n\nVou guiá-lo por todo o processo! Gostaria de começar agora?',
                    timestamp: new Date(Date.parse(createdAt) + 10500).toISOString(),
                    metadata: {
                        action: 'help',
                        confidence: 0.92
                    }
                }
            ],
            createdAt,
            updatedAt: new Date(Date.parse(createdAt) + 10500).toISOString()
        };
    }
}
//# sourceMappingURL=mockData.js.map