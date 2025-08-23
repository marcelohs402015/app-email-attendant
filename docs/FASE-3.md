## Fase 3 — Backend em modo real com SOLID e Padrões de Conexão

### Objetivo
- **Ativar o modo real de dados** para e-mails e categorias usando PostgreSQL, mantendo alternância segura com mock.
- **Garantir aderência a SOLID**, injeção de dependências e repositórios, com camadas claras (Routes → Service → Repository → Database).

### Escopo
- **Feature flag** `DATA_MODE=mock|real` com fallback automático para mock se o banco falhar.
- **Singleton de acesso ao banco** via `DatabaseService` (lifecycle único do pool, shutdown gracioso).
- **Interfaces** para abstrações principais: `IDatabase`, `ICategoryRepository`, `IEmailRepository`.
- **Rotas** utilizando Services/Repositórios no modo real; manter rotas atuais no modo mock.
- **Migrations** e **Seeds** separados (idempotentes) de `initializeDatabase`.
- **Config/SSL** tipado e validado no bootstrap.
- **Observabilidade**: logs estruturados com `requestId` e correlação por requisição.

### Decisões de Arquitetura
- **DIP (Dependency Inversion Principle)**: Services dependem de interfaces (`ICategoryRepository`, `IEmailRepository`), não de classes concretas.
- **Repository Pattern**: SQL parametrizado encapsulado; Services focam em regras de negócio.
- **Factory/Singleton**: `DatabaseService` controla pool `pg.Pool` (máximo 1 instância). Responsável por `init`, `close` e exposição do `Database`.
- **Feature toggle**: `DATA_MODE` governa wiring de rotas (mock vs real) sem mudar código de negócio.
- **Separação migrate/seed**: comandos independentes para pipeline (CI/CD) e idempotência.

### Variáveis de Ambiente
- `DATA_MODE=mock|real`
- `DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD`
- `DB_SSL=true|false` (ou opções TLS quando aplicável)
- `CLIENT_URL`, `NODE_ENV`, `APP_VERSION`

### Contratos Propostos (interfaces)
```ts
// src/database/interfaces/IDatabase.ts
export interface IDatabase {
  query<T = any>(text: string, params?: any[]): Promise<{ rows: T[]; rowCount: number }>;
  transaction<T>(callback: (client: any) => Promise<T>): Promise<T>;
  close(): Promise<void>;
}

// src/database/interfaces/ICategoryRepository.ts
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../../types/email.js';
import { FilterOptions, PaginationOptions } from '../../types/database.js';

export interface ICategoryRepository {
  createCategory(data: CreateCategoryRequest): Promise<Category>;
  getCategories(filters: FilterOptions, pagination: PaginationOptions): Promise<{ categories: Category[]; total: number }>;
  getCategoryById(id: number): Promise<Category | null>;
  getCategoryByName(name: string): Promise<Category | null>;
  updateCategory(id: number, data: UpdateCategoryRequest): Promise<Category | null>;
  deleteCategory(id: number): Promise<boolean>;
  getActiveCategories(): Promise<Category[]>;
  getCategoryStats(): Promise<Array<{ categoryId: number; categoryName: string; emailCount: number }>>;
}

// src/database/interfaces/IEmailRepository.ts
import { CategorizedEmail, EmailTemplate } from '../../types/email.js';
import { FilterOptions, PaginationOptions } from '../../types/database.js';

export interface IEmailRepository {
  saveEmail(email: Omit<CategorizedEmail, 'id' | 'createdAt' | 'updatedAt'>): Promise<CategorizedEmail>;
  getEmails(filters: FilterOptions, pagination: PaginationOptions): Promise<{ emails: CategorizedEmail[]; total: number }>;
  getEmailById(id: number): Promise<CategorizedEmail | null>;
  updateEmailStatus(id: number, updates: { processed?: boolean; responded?: boolean; responseTemplate?: string }): Promise<boolean>;
  getEmailTemplates(category?: string): Promise<EmailTemplate[]>;
  createEmailTemplate(templateData: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<EmailTemplate>;
  updateEmailTemplate(id: string, templateData: Partial<Omit<EmailTemplate, 'id' | 'createdAt'>>): Promise<EmailTemplate | null>;
  deleteEmailTemplate(id: string): Promise<boolean>;
  getCategoryStats(): Promise<Array<{ category: string; count: number; responded_count: number }>>;
}
```

### Serviços e Wiring
- Criar `appserver/services/DatabaseService.ts` (Singleton):
  - `initialize(): Promise<Database>` — configura pool, cria tabelas apenas quando chamado por migrate/seed dedicados.
  - `getDatabase(): Database | null` — retorna instância atual.
  - `close(): Promise<void>` — encerra pool em shutdown gracioso.
- Nas rotas do `appserver/server.ts`:
  - Se `DATA_MODE=real`, instanciar `DatabaseService.initialize()`, criar `EmailRepository`/`CategoryRepository` e injetar em Services/rotas.
  - Se falhar, logar warn e fallback para mock, mantendo o servidor saudável.

### Rotas — Modo Real vs Mock
- `appserver/routes/emailRoutes.ts`:
  - Modo mock: manter comportamento atual.
  - Modo real: expor endpoints usando `EmailService` (que usa `IEmailRepository`).
- `src/server/routes/categoryRoutes.ts` já usa `CategoryService` com repo; apenas alinhar a injeção via interfaces.

### Migrations e Seeds
- Separar de `initializeDatabase`:
  - `scripts/migrate.ts`: chama `Database.createTables()`.
  - `scripts/seed.ts`: chama `insertDefaultTemplates()` e `insertDefaultCategories()`.
- Executar em CI/CD: migrate antes do deploy, seed opcional por env flag (ex.: `RUN_SEED=true`).

### Config/SSL Tipado
- Ajustar `DatabaseConfig.ssl` para aceitar `boolean | tls.TlsOptions`.
- Validar envs obrigatórias no modo real e falhar rápido com mensagem clara.

### Observabilidade e Logs
- Middleware de correlação: gerar/injetar `requestId` (header `x-request-id`) e criar child logger por request.
- Logs estruturados (JSON) com nível apropriado: info (fluxo), debug (SQL timing), warn (fallbacks), error (falhas).

### Segurança e Validação
- Validar/sanitizar inputs nas rotas (tipos, ranges, whitelists de `sortBy`).
- Impedir `sortBy` arbitrário — usar whitelist de colunas permitidas.
- Nunca logar credenciais; mascarar parâmetros sensíveis.

### Critérios de Aceite
- Alternância `DATA_MODE` funcionando: mock e real.
- Conexões de banco com pool único; shutdown limpo.
- Services dependem de interfaces; testes unitários com mocks dos repositórios.
- Migrations/Seeds executáveis separadamente e idempotentes.
- Logs com `requestId` visíveis em requisições.

### Rollback/Toggle
- Para incidentes no banco: setar `DATA_MODE=mock` e reiniciar serviço.
- Sem mudanças de schema em runtime; migrations reversíveis.

### Plano de Implementação (sem executar agora)
1) Criar interfaces (`IDatabase`, `ICategoryRepository`, `IEmailRepository`).
2) Introduzir `DatabaseService` (Singleton no `appserver`).
3) Adaptar `CategoryService`/rotas para usar interfaces (sem mudar comportamento).
4) Implementar `emailRoutes` modo real com `EmailService`/repo e toggling por `DATA_MODE`.
5) Criar `scripts/migrate.ts` e `scripts/seed.ts`; atualizar documentação de deploy.
6) Adicionar middleware de `requestId` e padronizar logs.
7) Testes unitários dos Services com mocks; smoke test das rotas no modo real.

### Notas
- Este documento descreve o desenho e os passos; nenhuma implementação foi aplicada ainda.


