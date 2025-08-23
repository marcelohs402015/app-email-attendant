import { Router, Request, Response } from 'express';
import { Database } from '../database/Database.js';
import { createLogger } from '../shared/logger.js';

const logger = createLogger('TemplatesRoutesReal');

export function createTemplatesRoutesReal(db: Database): Router {
  const router = Router();

  // Get templates with filters
  router.get('/templates', async (req: Request, res: Response) => {
    try {
      let query = 'SELECT * FROM email_templates WHERE 1=1';
      const params: any[] = [];
      let paramIndex = 1;

      if (req.query.category) {
        query += ` AND category = $${paramIndex++}`;
        params.push(req.query.category);
      }

      query += ' ORDER BY name ASC';

      const result = await db.query(query, params);
      return res.json({ success: true, data: (result as any).rows });
    } catch (error) {
      logger.error('Failed to get templates', (error as Error).message);
      return res.status(500).json({ success: false, error: 'Failed to retrieve templates' });
    }
  });

  // Get template by ID
  router.get('/templates/:id', async (req: Request, res: Response) => {
    try {
      const result = await db.query('SELECT * FROM email_templates WHERE id = $1', [parseInt(req.params.id)]);
      if ((result as any).rowCount === 0) {
        return res.status(404).json({ success: false, error: 'Template not found' });
      }
      return res.json({ success: true, data: (result as any).rows[0] });
    } catch (error) {
      logger.error('Failed to get template', (error as Error).message);
      return res.status(500).json({ success: false, error: 'Failed to retrieve template' });
    }
  });

  // Create template
  router.post('/templates', async (req: Request, res: Response) => {
    try {
      const { name, subject, body, category = null, variables = [] } = req.body;
      
      if (!name || !subject || !body) {
        return res.status(400).json({ success: false, error: 'Name, subject, and body are required' });
      }

      const result = await db.query(
        'INSERT INTO email_templates (name, subject, body, category, variables) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, subject, body, category, JSON.stringify(variables)]
      );

      return res.status(201).json({ success: true, data: (result as any).rows[0], message: 'Template created successfully' });
    } catch (error) {
      logger.error('Failed to create template', (error as Error).message);
      return res.status(500).json({ success: false, error: 'Failed to create template' });
    }
  });

  // Update template
  router.put('/templates/:id', async (req: Request, res: Response) => {
    try {
      const { name, subject, body, category, variables } = req.body;
      
      const fields: string[] = [];
      const values: any[] = [];
      let idx = 1;

      if (name !== undefined) { fields.push(`name = $${idx++}`); values.push(name); }
      if (subject !== undefined) { fields.push(`subject = $${idx++}`); values.push(subject); }
      if (body !== undefined) { fields.push(`body = $${idx++}`); values.push(body); }
      if (category !== undefined) { fields.push(`category = $${idx++}`); values.push(category); }
      if (variables !== undefined) { fields.push(`variables = $${idx++}`); values.push(JSON.stringify(variables)); }

      if (fields.length === 0) {
        return res.json({ success: true, message: 'No changes to update' });
      }

      values.push(parseInt(req.params.id));
      const result = await db.query(
        `UPDATE email_templates SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${idx} RETURNING *`,
        values
      );

      if ((result as any).rowCount === 0) {
        return res.status(404).json({ success: false, error: 'Template not found' });
      }

      return res.json({ success: true, data: (result as any).rows[0], message: 'Template updated successfully' });
    } catch (error) {
      logger.error('Failed to update template', (error as Error).message);
      return res.status(500).json({ success: false, error: 'Failed to update template' });
    }
  });

  // Delete template
  router.delete('/templates/:id', async (req: Request, res: Response) => {
    try {
      const result = await db.query('DELETE FROM email_templates WHERE id = $1', [parseInt(req.params.id)]);
      if ((result as any).rowCount === 0) {
        return res.status(404).json({ success: false, error: 'Template not found' });
      }
      return res.json({ success: true, message: 'Template deleted successfully' });
    } catch (error) {
      logger.error('Failed to delete template', (error as Error).message);
      return res.status(500).json({ success: false, error: 'Failed to delete template' });
    }
  });

  return router;
}
