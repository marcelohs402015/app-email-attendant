import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import inquirer from 'inquirer';
import fs from 'fs/promises';
import { createLogger } from './shared/logger.js';
import { Database } from './database/Database.js';
import { DatabaseConfig } from './types/database.js';

const logger = createLogger('Setup');

interface GmailCredentials {
  web?: {
    client_id: string;
    client_secret: string;
    redirect_uris: string[];
  };
  installed?: {
    client_id: string;
    client_secret: string;
    redirect_uris: string[];
  };
}

class Setup {
  private oauth2Client: OAuth2Client | null = null;

  async run(): Promise<void> {
    console.log('\n🚀 Email Attendant Setup');
    console.log('========================\n');

    try {
      // Setup database
      await this.setupDatabase();
      
      // Check if credentials file exists
      await this.checkCredentials();
      
      // Authenticate with Gmail API
      await this.authenticate();
      
      // Create config files
      await this.createConfigFiles();
      
      console.log('\n✅ Setup completed successfully!');
      console.log('You can now run:');
      console.log('  npm run dev    - Start development server');
      console.log('  npm run build  - Build for production');
      console.log('  npm start      - Start production server');
      
    } catch (error) {
      logger.error('Setup failed:', (error as Error).message);
      console.error('\n❌ Setup failed:', (error as Error).message);
      process.exit(1);
    }
  }

  async setupDatabase(): Promise<void> {
    console.log('🗄️  Setting up database...');
    
    const dbQuestions = [
      {
        type: 'input',
        name: 'host',
        message: 'Database host:',
        default: 'localhost'
      },
      {
        type: 'input',
        name: 'port',
        message: 'Database port:',
        default: '5432',
        validate: (input: string) => {
          const port = parseInt(input);
          return !isNaN(port) && port > 0 && port <= 65535 ? true : 'Please enter a valid port number';
        }
      },
      {
        type: 'input',
        name: 'database',
        message: 'Database name:',
        default: 'email_attendant'
      },
      {
        type: 'input',
        name: 'user',
        message: 'Database user:',
        default: 'postgres'
      },
      {
        type: 'password',
        name: 'password',
        message: 'Database password:',
        mask: '*'
      }
    ];

    const dbConfig = await inquirer.prompt(dbQuestions) as {
      host: string;
      port: string;
      database: string;
      user: string;
      password: string;
    };

    const databaseConfig: DatabaseConfig = {
      host: dbConfig.host,
      port: parseInt(dbConfig.port),
      database: dbConfig.database,
      user: dbConfig.user,
      password: dbConfig.password,
      ssl: false
    };

    try {
      const database = new Database(databaseConfig);
      await database.createTables();
      await database.insertDefaultTemplates();
      await database.close();
      
      console.log('✅ Database setup completed!');
      
      // Save database config to .env
      const envContent = `# Email Attendant Configuration

# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=${databaseConfig.host}
DB_PORT=${databaseConfig.port}
DB_NAME=${databaseConfig.database}
DB_USER=${databaseConfig.user}
DB_PASSWORD=${databaseConfig.password}
DB_SSL=false

# Client Configuration
CLIENT_URL=http://localhost:3000

# Logging
LOG_LEVEL=info

# Gmail API Configuration
# These will be set up during the setup process
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=

# Application settings
MAX_EMAILS_PER_RUN=100
CATEGORIZATION_CONFIDENCE_THRESHOLD=0.3
AUTO_LABEL=true
DRY_RUN=false
`;

      await fs.writeFile('.env', envContent);
      logger.info('Database configuration saved to .env');
      
    } catch (error) {
      throw new Error(`Database setup failed: ${(error as Error).message}`);
    }
  }

  async checkCredentials(): Promise<void> {
    try {
      await fs.access('config/credentials.json');
      logger.info('Credentials file found');
    } catch (error) {
      console.log('\n📋 Gmail API Setup Required');
      console.log('===========================');
      console.log('1. Go to Google Cloud Console: https://console.cloud.google.com/');
      console.log('2. Create a new project or select existing one');
      console.log('3. Enable Gmail API');
      console.log('4. Create OAuth 2.0 credentials (Desktop application)');
      console.log('5. Download the credentials JSON file');
      console.log('6. Save it as config/credentials.json');
      console.log('\nPress Enter after you have completed these steps...');
      
      await inquirer.prompt([{
        type: 'input',
        name: 'continue',
        message: 'Press Enter to continue'
      }]);

      // Check again
      try {
        await fs.access('config/credentials.json');
      } catch (error) {
        throw new Error('Credentials file not found. Please follow the setup instructions.');
      }
    }
  }

  async authenticate(): Promise<void> {
    console.log('\n🔐 Authenticating with Gmail API...');
    
    const credentialsData = await fs.readFile('config/credentials.json', 'utf8');
    const credentials: GmailCredentials = JSON.parse(credentialsData);

    const authConfig = credentials.web || credentials.installed;
    if (!authConfig) {
      throw new Error('Invalid credentials file format');
    }

    const { client_secret, client_id, redirect_uris } = authConfig;
    this.oauth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    // Generate auth URL
    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.labels',
        'https://www.googleapis.com/auth/gmail.modify',
        'https://www.googleapis.com/auth/gmail.send'
      ],
    });

    console.log('\n🌐 Please visit this URL to authorize the application:');
    console.log(authUrl);

    const { code } = await inquirer.prompt([{
      type: 'input',
      name: 'code',
      message: 'Enter the authorization code:'
    }]) as { code: string };

    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);

    // Save tokens
    await fs.writeFile('config/token.json', JSON.stringify(tokens, null, 2));
    logger.info('Authentication tokens saved');
    
    console.log('✅ Authentication successful!');
  }

  async createConfigFiles(): Promise<void> {
    console.log('\n⚙️  Creating configuration files...');

    // Create .gitignore if it doesn't exist
    try {
      await fs.access('.gitignore');
    } catch (error) {
      const gitignoreContent = `# Dependencies
node_modules/

# Environment variables
.env

# Logs
logs/
*.log

# Gmail API credentials and tokens
config/credentials.json
config/token.json

# OS generated files
.DS_Store
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo

# Build output
dist/
build/

# Client build
client/dist/
client/build/`;
      
      await fs.writeFile('.gitignore', gitignoreContent);
      logger.info('Created .gitignore');
    }

    console.log('✅ Configuration files created!');
  }
}

// Run setup if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const setup = new Setup();
  setup.run();
}

export default Setup;