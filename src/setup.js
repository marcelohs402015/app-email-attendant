import { google } from 'googleapis';
import inquirer from 'inquirer';
import fs from 'fs/promises';
import path from 'path';
import { createLogger } from './utils/logger.js';

const logger = createLogger('Setup');

class Setup {
  constructor() {
    this.oauth2Client = null;
  }

  async run() {
    console.log('\n🚀 Gmail Email Categorization System Setup');
    console.log('==========================================\n');

    try {
      // Check if credentials file exists
      await this.checkCredentials();
      
      // Authenticate with Gmail API
      await this.authenticate();
      
      // Create config files
      await this.createConfigFiles();
      
      console.log('\n✅ Setup completed successfully!');
      console.log('You can now run: npm start');
      
    } catch (error) {
      logger.error('Setup failed:', error.message);
      console.error('\n❌ Setup failed:', error.message);
      process.exit(1);
    }
  }

  async checkCredentials() {
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

  async authenticate() {
    console.log('\n🔐 Authenticating with Gmail API...');
    
    const credentials = JSON.parse(
      await fs.readFile('config/credentials.json', 'utf8')
    );

    const { client_secret, client_id, redirect_uris } = credentials.web || credentials.installed;
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
        'https://www.googleapis.com/auth/gmail.modify'
      ],
    });

    console.log('\n🌐 Please visit this URL to authorize the application:');
    console.log(authUrl);

    const { code } = await inquirer.prompt([{
      type: 'input',
      name: 'code',
      message: 'Enter the authorization code:'
    }]);

    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);

    // Save tokens
    await fs.writeFile('config/token.json', JSON.stringify(tokens, null, 2));
    logger.info('Authentication tokens saved');
    
    console.log('✅ Authentication successful!');
  }

  async createConfigFiles() {
    console.log('\n⚙️  Creating configuration files...');

    // Copy config.json.example to config.json if it doesn't exist
    try {
      await fs.access('config/config.json');
    } catch (error) {
      const exampleConfig = await fs.readFile('config/config.json.example', 'utf8');
      await fs.writeFile('config/config.json', exampleConfig);
      logger.info('Created config/config.json from example');
    }

    // Copy .env.example to .env if it doesn't exist
    try {
      await fs.access('.env');
    } catch (error) {
      const exampleEnv = await fs.readFile('.env.example', 'utf8');
      await fs.writeFile('.env', exampleEnv);
      logger.info('Created .env from example');
    }

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
build/`;
      
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