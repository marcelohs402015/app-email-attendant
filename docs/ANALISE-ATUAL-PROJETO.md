# 📊 Análise Atual do Projeto - Email Attendant

## 🎯 Visão Geral
Este documento descreve o estado atual do projeto, confirma o uso de dados mockados no backend atual e propõe um plano detalhado de migração para uso de PostgreSQL real.

Data da análise: 2024-12
Versão do projeto: 2.0.0
Status: Dados Mockados → Migrar para PostgreSQL

---

## 📋 Situação Atual

### Backend (appserver)
- `appserver/server.ts` loga: "Starting server with mock data..." e expõe rotas sob `/api`.
- `appserver/routes/emailRoutes.ts` utiliza dados mockados importando de `appserver/shared/data/mockData.ts`, `mockAutomationData.ts` e `mockEmails.ts`.
- O servidor atual não inicializa conexão real com banco.

### Implementação de Banco (existente, mas não utilizada no appserver)
- Código pronto em `src/database/`:
  - `Database.ts`: conexão com PostgreSQL via `pg`, criação de tabelas, índices e triggers.
  - `EmailRepository.ts`: CRUD de emails, templates e estatísticas por categoria.
  - `CategoryRepository.ts`: gerenciamento de categorias (carregamento/atualização).
- Arquivos de setup: `src/setup.ts` e `src/server/database.ts` para inicialização e carga de defaults.
- `.env.example` possui chaves de banco (`DB_HOST`, `DB_PORT`, etc.).

### Dados Mockados Ativos
```
appserver/shared/data/
├── mockData.ts
├── mockEmails.ts
└── mockAutomationData.ts
```

---

## 🚀 Plano de Migração para PostgreSQL

Objetivo: substituir gradualmente dados mockados por persistência real em PostgreSQL, com feature flag e caminho de rollback.

### Fase 1 — Preparação e Configuração
1) Provisionar banco:
   - Opção A (Recomendado): Supabase (SSL, backups, dashboard).
   - Opção B: PostgreSQL local (Docker ou serviço local).
   - Opção C: RDS/GCP/Azure.
2) Configurar `.env`:
```
DB_HOST=your-host.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-password
DB_SSL=true
```
3) Validar conexão localmente (porta liberada, SSL quando aplicável).

### Fase 2 — Serviço de Banco e Feature Flags
1) Criar `appserver/services/DatabaseService.ts` para inicialização única do `Database` (Singleton):
```ts
import { Database } from '../../src/database/Database.js';
import { DatabaseConfig } from '../../src/types/database.js';

export class DatabaseService {
  private static instance: DatabaseService;
  private database: Database | null = null;

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) DatabaseService.instance = new DatabaseService();
    return DatabaseService.instance;
  }

  async initialize(): Promise<Database> {
    if (this.database) return this.database;
    const config: DatabaseConfig = {
      host: process.env.DB_HOST!,
      port: parseInt(process.env.DB_PORT!),
      database: process.env.DB_NAME!,
      user: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
      ssl: process.env.DB_SSL === 'true'
    };
    this.database = new Database(config);
    await this.database.createTables();
    await this.database.insertDefaultTemplates();
    await this.database.insertDefaultCategories();
    return this.database;
  }

  getDatabase(): Database | null { return this.database; }
}
```
2) Adicionar feature flags (`USE_DATABASE`, `USE_MOCK_DATA`) para alternar entre mock e banco no `appserver`.

### Fase 3 — Rotas usando Repositórios
Atualizar `appserver/routes/emailRoutes.ts` para usar `EmailRepository` quando `USE_DATABASE=true`.
```ts
import { Router } from 'express';
import { EmailRepository } from '../../src/database/EmailRepository.js';
import { DatabaseService } from '../services/DatabaseService.js';

export function createEmailRoutes(): Router {
  const router = Router();
  const dbService = DatabaseService.getInstance();
  const useDb = process.env.USE_DATABASE === 'true';

  if (useDb) {
    router.use(async (_req, res, next) => {
      try { await dbService.initialize(); next(); }
      catch { res.status(500).json({ success: false, error: 'Database connection failed' }); }
    });

    router.get('/emails', async (req, res) => {
      const repo = new EmailRepository(dbService.getDatabase()!);
      // mapear query params -> filtros e paginação
      // retornar dados do banco em vez de mocks
    });
  } else {
    // comportamento atual (mock) permanece como fallback
  }

  return router;
}
```

### Fase 4 — Migração de Dados (Opcional)
Se necessário, migrar dados dos mocks para o banco para manter consistência visual na transição.
```ts
// appserver/scripts/migrateMockData.ts
// Iterar sobre mockEmails e inserir via EmailRepository.saveEmail(...)
```

### Fase 5 — Testes, Observabilidade e Rollout
- Testes de conexão, CRUD e performance.
- Logging estruturado com níveis apropriados (`info`, `warn`, `error`).
- Deploy com `USE_DATABASE=true` em ambiente de staging; monitorar e então promover para prod.
- Plano de rollback: setar `USE_DATABASE=false` rapidamente se necessário.

---

## ✅ Checklist de Migração
- [ ] Banco PostgreSQL provisionado (Supabase/local/cloud)
- [ ] `.env` atualizado com credenciais
- [ ] `DatabaseService` criado e integrado
- [ ] Feature flags aplicadas (`USE_DATABASE`)
- [ ] Rotas atualizadas para usar repositórios (`EmailRepository` etc.)
- [ ] Scripts de migração (se necessário)
- [ ] Testes de conexão/CRUD/performance
- [ ] Deploy com monitoramento e rollback plan

---

## 🗄️ Esquema de Banco (existente em `src/database/Database.ts`)
Tabelas: `emails`, `email_templates`, `categories` com índices e triggers de `updated_at`.

Exemplo de criação (resumo):
```sql
CREATE TABLE IF NOT EXISTS emails (
  id SERIAL PRIMARY KEY,
  gmail_id VARCHAR(255) UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  sender VARCHAR(500) NOT NULL,
  date TIMESTAMP NOT NULL,
  body TEXT,
  snippet TEXT,
  category VARCHAR(100),
  confidence DECIMAL(3,2),
  processed BOOLEAN DEFAULT FALSE,
  responded BOOLEAN DEFAULT FALSE,
  response_template VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🧪 Comandos sugeridos
```bash
# Copiar e ajustar .env
cp .env.example .env

# Rodar servidor em modo mock (atual)
USE_DATABASE=false npm run dev --prefix appserver

# Rodar servidor usando banco (após configurar DatabaseService)
USE_DATABASE=true npm run dev --prefix appserver
```

---

## 📈 Benefícios Esperados
- Persistência real de dados e histórico completo.
- Performance com índices e paginação.
- Escalabilidade (conexão pool, opções cloud).
- Manutenibilidade (camadas e repositórios claros; SOLID; clean code).

---

## 🔚 Próximos Passos
1) Confirmar provedor do banco (Supabase/local).
2) Preencher `.env` com credenciais reais.
3) Implementar `DatabaseService` e feature flags.
4) Atualizar rotas para usar repositórios.
5) Validar com testes e logs, realizar rollout gradual.


