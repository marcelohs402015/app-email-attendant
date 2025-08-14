import { google } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';
import { createLogger } from './utils/logger.js';

const logger = createLogger('GmailAPI');

class GmailAPI {
  constructor() {
    this.gmail = null;
    this.auth = null;
  }

  async authenticate() {
    try {
      const credentials = JSON.parse(
        await fs.readFile('config/credentials.json', 'utf8')
      );

      const { client_secret, client_id, redirect_uris } = credentials.web;
      const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
      );

      try {
        const token = JSON.parse(
          await fs.readFile('config/token.json', 'utf8')
        );
        oAuth2Client.setCredentials(token);
        
        oAuth2Client.on('tokens', async (tokens) => {
          if (tokens.refresh_token) {
            await fs.writeFile('config/token.json', JSON.stringify(tokens));
          }
        });
        
      } catch (error) {
        logger.warn('Token file not found, please run setup first');
        throw new Error('Authentication required. Run npm run setup first.');
      }

      this.auth = oAuth2Client;
      this.gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
      logger.info('Gmail API authenticated successfully');
      
      return true;
    } catch (error) {
      logger.error('Authentication failed:', error.message);
      throw error;
    }
  }

  async getEmails(query = '', maxResults = 50) {
    if (!this.gmail) {
      throw new Error('Gmail API not authenticated');
    }

    try {
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        q: query,
        maxResults: maxResults,
      });

      if (!response.data.messages) {
        return [];
      }

      const emails = await Promise.all(
        response.data.messages.map(async (message) => {
          const email = await this.gmail.users.messages.get({
            userId: 'me',
            id: message.id,
            format: 'full',
          });

          const headers = email.data.payload.headers;
          const subject = headers.find(h => h.name === 'Subject')?.value || '';
          const from = headers.find(h => h.name === 'From')?.value || '';
          const date = headers.find(h => h.name === 'Date')?.value || '';

          let body = '';
          if (email.data.payload.body?.data) {
            body = Buffer.from(email.data.payload.body.data, 'base64').toString();
          } else if (email.data.payload.parts) {
            for (const part of email.data.payload.parts) {
              if (part.mimeType === 'text/plain' && part.body?.data) {
                body = Buffer.from(part.body.data, 'base64').toString();
                break;
              }
            }
          }

          return {
            id: message.id,
            subject,
            from,
            date,
            body: body.substring(0, 1000), // Limit body size
            snippet: email.data.snippet,
          };
        })
      );

      logger.info(`Retrieved ${emails.length} emails`);
      return emails;
    } catch (error) {
      logger.error('Failed to get emails:', error.message);
      throw error;
    }
  }

  async addLabel(messageId, labelName) {
    if (!this.gmail) {
      throw new Error('Gmail API not authenticated');
    }

    try {
      // First, check if label exists
      const labels = await this.gmail.users.labels.list({ userId: 'me' });
      let labelId = labels.data.labels.find(label => label.name === labelName)?.id;

      // Create label if it doesn't exist
      if (!labelId) {
        const newLabel = await this.gmail.users.labels.create({
          userId: 'me',
          requestBody: {
            name: labelName,
            labelListVisibility: 'labelShow',
            messageListVisibility: 'show',
          },
        });
        labelId = newLabel.data.id;
        logger.info(`Created new label: ${labelName}`);
      }

      // Add label to message
      await this.gmail.users.messages.modify({
        userId: 'me',
        id: messageId,
        requestBody: {
          addLabelIds: [labelId],
        },
      });

      logger.info(`Added label "${labelName}" to message ${messageId}`);
    } catch (error) {
      logger.error(`Failed to add label: ${error.message}`);
      throw error;
    }
  }

  async removeLabel(messageId, labelName) {
    if (!this.gmail) {
      throw new Error('Gmail API not authenticated');
    }

    try {
      const labels = await this.gmail.users.labels.list({ userId: 'me' });
      const labelId = labels.data.labels.find(label => label.name === labelName)?.id;

      if (!labelId) {
        logger.warn(`Label "${labelName}" not found`);
        return;
      }

      await this.gmail.users.messages.modify({
        userId: 'me',
        id: messageId,
        requestBody: {
          removeLabelIds: [labelId],
        },
      });

      logger.info(`Removed label "${labelName}" from message ${messageId}`);
    } catch (error) {
      logger.error(`Failed to remove label: ${error.message}`);
      throw error;
    }
  }
}

export default GmailAPI;