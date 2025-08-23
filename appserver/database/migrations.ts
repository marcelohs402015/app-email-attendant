import { Database } from './Database.js';
import { createLogger } from '../shared/logger.js';

const logger = createLogger('DBMigrations');

export async function runMigrations(database: Database): Promise<void> {
  logger.info('Running database migrations...');

  const createEmailsTable = `
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
  `;

  const createTemplatesTable = `
    CREATE TABLE IF NOT EXISTS email_templates (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      subject VARCHAR(500) NOT NULL,
      body TEXT NOT NULL,
      category VARCHAR(100),
      variables JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createCategoriesTable = `
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      description TEXT,
      keywords JSONB NOT NULL DEFAULT '[]',
      patterns JSONB NOT NULL DEFAULT '[]',
      domains JSONB NOT NULL DEFAULT '[]',
      color VARCHAR(7) NOT NULL DEFAULT '#3B82F6',
      active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createServicesTable = `
    CREATE TABLE IF NOT EXISTS services (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      category VARCHAR(100) NOT NULL,
      price DECIMAL(10,2) NOT NULL DEFAULT 0,
      unit VARCHAR(50) NOT NULL DEFAULT 'hour',
      estimated_time VARCHAR(100),
      materials JSONB DEFAULT '[]',
      active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createClientsTable = `
    CREATE TABLE IF NOT EXISTS clients (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      address TEXT,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createQuotationsTable = `
    CREATE TABLE IF NOT EXISTS quotations (
      id VARCHAR(255) PRIMARY KEY,
      client_email VARCHAR(255) NOT NULL,
      client_name VARCHAR(255) NOT NULL,
      client_phone VARCHAR(50),
      client_address TEXT,
      services JSONB NOT NULL DEFAULT '[]',
      subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
      discount DECIMAL(10,2) NOT NULL DEFAULT 0,
      total DECIMAL(10,2) NOT NULL DEFAULT 0,
      status VARCHAR(50) NOT NULL DEFAULT 'draft',
      valid_until DATE,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createAppointmentsTable = `
    CREATE TABLE IF NOT EXISTS appointments (
      id VARCHAR(255) PRIMARY KEY,
      client_id VARCHAR(255) NOT NULL,
      client_name VARCHAR(255) NOT NULL,
      service_ids JSONB DEFAULT '[]',
      service_names JSONB DEFAULT '[]',
      date DATE NOT NULL,
      time TIME NOT NULL,
      duration INTEGER DEFAULT 120,
      address TEXT,
      notes TEXT,
      status VARCHAR(50) NOT NULL DEFAULT 'scheduled',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createAutomationRulesTable = `
    CREATE TABLE IF NOT EXISTS automation_rules (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      keywords JSONB NOT NULL DEFAULT '[]',
      service_ids JSONB NOT NULL DEFAULT '[]',
      is_active BOOLEAN DEFAULT TRUE,
      conditions JSONB NOT NULL DEFAULT '{}',
      actions JSONB NOT NULL DEFAULT '{}',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createPendingQuotesTable = `
    CREATE TABLE IF NOT EXISTS pending_quotes (
      id VARCHAR(255) PRIMARY KEY,
      email_id INTEGER NOT NULL,
      automation_rule_id VARCHAR(255),
      generated_quote JSONB NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'pending',
      manager_notes TEXT,
      confidence DECIMAL(3,2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createIndexes = `
    CREATE INDEX IF NOT EXISTS idx_emails_gmail_id ON emails(gmail_id);
    CREATE INDEX IF NOT EXISTS idx_emails_category ON emails(category);
    CREATE INDEX IF NOT EXISTS idx_emails_date ON emails(date);
    CREATE INDEX IF NOT EXISTS idx_emails_processed ON emails(processed);
    CREATE INDEX IF NOT EXISTS idx_templates_category ON email_templates(category);
    CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
    CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(active);
    CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
    CREATE INDEX IF NOT EXISTS idx_services_active ON services(active);
    CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
    CREATE INDEX IF NOT EXISTS idx_quotations_client_email ON quotations(client_email);
    CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);
    CREATE INDEX IF NOT EXISTS idx_appointments_client_id ON appointments(client_id);
    CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
    CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
    CREATE INDEX IF NOT EXISTS idx_automation_rules_active ON automation_rules(is_active);
    CREATE INDEX IF NOT EXISTS idx_pending_quotes_status ON pending_quotes(status);
    CREATE INDEX IF NOT EXISTS idx_pending_quotes_email_id ON pending_quotes(email_id);
  `;

  const createTriggers = `
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ language 'plpgsql';

    DROP TRIGGER IF EXISTS update_emails_updated_at ON emails;
    CREATE TRIGGER update_emails_updated_at
      BEFORE UPDATE ON emails
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_templates_updated_at ON email_templates;
    CREATE TRIGGER update_templates_updated_at
      BEFORE UPDATE ON email_templates
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
    CREATE TRIGGER update_categories_updated_at
      BEFORE UPDATE ON categories
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_services_updated_at ON services;
    CREATE TRIGGER update_services_updated_at
      BEFORE UPDATE ON services
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
    CREATE TRIGGER update_clients_updated_at
      BEFORE UPDATE ON clients
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_quotations_updated_at ON quotations;
    CREATE TRIGGER update_quotations_updated_at
      BEFORE UPDATE ON quotations
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
    CREATE TRIGGER update_appointments_updated_at
      BEFORE UPDATE ON appointments
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_automation_rules_updated_at ON automation_rules;
    CREATE TRIGGER update_automation_rules_updated_at
      BEFORE UPDATE ON automation_rules
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_pending_quotes_updated_at ON pending_quotes;
    CREATE TRIGGER update_pending_quotes_updated_at
      BEFORE UPDATE ON pending_quotes
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  `;

  try {
    await database.query(createEmailsTable);
    await database.query(createTemplatesTable);
    await database.query(createCategoriesTable);
    await database.query(createServicesTable);
    await database.query(createClientsTable);
    await database.query(createQuotationsTable);
    await database.query(createAppointmentsTable);
    await database.query(createAutomationRulesTable);
    await database.query(createPendingQuotesTable);
    await database.query(createIndexes);
    await database.query(createTriggers);
    logger.info('Migrations completed');
  } catch (error) {
    logger.error('Migrations failed', (error as Error).message);
    throw error;
  }
}


