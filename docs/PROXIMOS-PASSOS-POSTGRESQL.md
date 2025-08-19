# 🗄️ Próximos Passos para Integração com PostgreSQL

Este documento guia a migração do uso de dados mock para PostgreSQL no Handyman Manager, cobrindo arquitetura, schema, migrações, serviços, segurança, automação e testes.

## 🎯 Objetivos

- Persistir dados em PostgreSQL com integridade e transações ACID
- Substituir leituras/escritas mock por acesso real ao banco
- Manter camadas e responsabilidades (Controller → Service → Repository/DB)
- Garantir segurança, observabilidade e automação de migrações

## 🧱 Arquitetura de Dados

```
Frontend (React) ──► Backend (Node/Express + TS)
                          │
                          ├─► Database Layer (Knex/pg)
                          │     ├─ Pool de conexões
                          │     ├─ Migrações/Seeds
                          │     └─ Repositórios
                          │
                          └─► Cache (opcional, Redis)
```

## 🔐 Variáveis de Ambiente (.env)

```
NODE_ENV=development
PORT=3001
CLIENT_URL=http://localhost:3000

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=handyman_manager
DB_USER=handyman_user
DB_PASSWORD=secure_password

# JWT
JWT_SECRET=change_me
JWT_EXPIRES_IN=24h

# Logging
LOG_LEVEL=info
```

## 🐳 Docker Compose (dev opcional)

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: handyman_manager
      POSTGRES_USER: handyman_user
      POSTGRES_PASSWORD: secure_password
    ports:
      - "5432:5432"
    volumes:
      - pg_data:/var/lib/postgresql/data
volumes:
  pg_data:
```

## 🧰 Dependências (backend)

```bash
cd appserver
npm install pg knex dotenv
npm install -D @types/pg
```

## 📁 Estrutura proposta (backend)

```
appserver/
├── database/
│   ├── config/
│   │   └── knexfile.ts
│   ├── migrations/
│   ├── seeds/
│   └── models/        # Tipos/Interfaces TS
├── services/
│   ├── DatabaseService.ts
│   ├── EmailService.ts      # Lê/Escreve em "emails"
│   ├── QuotationService.ts  # Lê/Escreve em "quotations"
│   └── ...
└── routes/
```

## 🗃️ Schema inicial (SQL)

> Ajuste nomes e domínios conforme sua necessidade. Índices incluídos para consultas frequentes.

```sql
-- Usuários
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clientes
CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  address TEXT,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Emails
CREATE TABLE IF NOT EXISTS emails (
  id SERIAL PRIMARY KEY,
  subject VARCHAR(500) NOT NULL,
  sender_email VARCHAR(255) NOT NULL,
  sender_name VARCHAR(255),
  content TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'unread',
  priority VARCHAR(20) DEFAULT 'normal',
  client_id INTEGER REFERENCES clients(id),
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Serviços
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cotações
CREATE TABLE IF NOT EXISTS quotations (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id),
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  discount_percentage DECIMAL(5,2) DEFAULT 0,
  final_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  valid_until DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Itens de Cotação
CREATE TABLE IF NOT EXISTS quotation_items (
  id SERIAL PRIMARY KEY,
  quotation_id INTEGER REFERENCES quotations(id) ON DELETE CASCADE,
  service_id INTEGER REFERENCES services(id),
  description TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agendamentos
CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id),
  service_id INTEGER REFERENCES services(id),
  quotation_id INTEGER REFERENCES quotations(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'scheduled',
  location TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_emails_category ON emails(category);
CREATE INDEX IF NOT EXISTS idx_emails_status ON emails(status);
CREATE INDEX IF NOT EXISTS idx_emails_created_at ON emails(created_at);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);
CREATE INDEX IF NOT EXISTS idx_quotations_client_id ON quotations(client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON appointments(start_time);
```

## ⚙️ Knex config (database/config/knexfile.ts)

```ts
import { Knex } from 'knex';
import dotenv from 'dotenv';
dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 5432),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    pool: { min: 2, max: 10 },
    migrations: { tableName: 'knex_migrations', directory: '../migrations' },
    seeds: { directory: '../seeds' },
  },
  production: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 5432),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: { rejectUnauthorized: false },
    },
    pool: { min: 2, max: 20 },
    migrations: { tableName: 'knex_migrations', directory: '../migrations' },
  },
};

export default config;
```

## 🔌 Serviço de Banco (services/DatabaseService.ts)

```ts
import knex from 'knex';
import config from '../database/config/knexfile.js';
import { createLogger } from '../shared/logger.js';

const logger = createLogger('DatabaseService');

class DatabaseService {
  private db: knex.Knex;

  constructor() {
    this.db = knex(config[process.env.NODE_ENV || 'development']);
  }

  getConnection(): knex.Knex {
    return this.db;
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.db.raw('SELECT 1');
      return true;
    } catch (error) {
      logger.error('Database health check failed', { error });
      return false;
    }
  }
}

export const databaseService = new DatabaseService();
```

## 📧 Exemplo de Serviço (services/EmailService.ts)

```ts
import { databaseService } from './DatabaseService.js';
import { createLogger } from '../shared/logger.js';

const logger = createLogger('EmailService');

export class EmailService {
  async list(params?: { category?: string; status?: string; limit?: number; offset?: number; }) {
    try {
      let q = databaseService.getConnection().select('*').from('emails').orderBy('created_at', 'desc');
      if (params?.category) q = q.where('category', params.category);
      if (params?.status) q = q.where('status', params.status);
      if (params?.limit) q = q.limit(params.limit);
      if (params?.offset) q = q.offset(params.offset);
      return await q;
    } catch (error) {
      logger.error('Error listing emails', { error });
      throw new Error('Failed to list emails');
    }
  }

  async create(data: { subject: string; sender_email: string; content: string; category: string; status?: string; priority?: string; }) {
    try {
      const [created] = await databaseService.getConnection().insert(data).into('emails').returning('*');
      logger.info('Email created', { id: created.id });
      return created;
    } catch (error) {
      logger.error('Error creating email', { error });
      throw new Error('Failed to create email');
    }
  }
}
```

## 🔄 Migrações e Seeds (exemplos)

```bash
# criar migração
npx knex migrate:make 001_create_users_table --knexfile src/database/config/knexfile.ts

# rodar migrações
npx knex migrate:latest --knexfile src/database/config/knexfile.ts

# criar seed
npx knex seed:make 001_seed_services --knexfile src/database/config/knexfile.ts

# rodar seeds
npx knex seed:run --knexfile src/database/config/knexfile.ts
```

## 🔒 Segurança (boas práticas)

- Usar `password_encryption = 'scram-sha-256'` no PostgreSQL
- Não versionar `.env`
- Rotacionar `JWT_SECRET` e senhas periodicamente
- Validar entradas (Zod) e usar query builder (Knex) para evitar SQL Injection
- Não registrar dados sensíveis em logs

## 🧪 Testes (integração básica)

```ts
import { databaseService } from '../../services/DatabaseService.js';

test('db health', async () => {
  const ok = await databaseService.healthCheck();
  expect(ok).toBe(true);
});
```

## ✅ Checklist de Entrega

- [ ] Variáveis de ambiente configuradas
- [ ] Banco disponível (local ou Docker)
- [ ] Migrações aplicadas sem erros
- [ ] Seeds (opcional) executadas
- [ ] Serviços principais lendo/escrevendo no banco
- [ ] Healthcheck passando
- [ ] Logs e erros verificados

## 🗺️ Roadmap sugerido (2–4 semanas)

1. Infra/Config (env, Docker, dependências)
2. Schema + migrações + seeds
3. DatabaseService + repositórios/serviços
4. Trocar mocks por queries reais, rotas testadas
5. Testes de integração e performance
6. Observabilidade e endurecimento de segurança

—

Última atualização: 2025-08-19


