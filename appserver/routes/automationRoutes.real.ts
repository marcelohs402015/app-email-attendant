import { Router, Request, Response } from 'express';
import { Database } from '../database/Database.js';
import { createLogger } from '../shared/logger.js';

const logger = createLogger('AutomationRoutesReal');

export function createAutomationRoutesReal(db: Database): Router {
  const router = Router();

  // Get automation rules
  router.get('/automation/rules', async (req: Request, res: Response) => {
    try {
      let query = 'SELECT * FROM automation_rules WHERE 1=1';
      const params: any[] = [];
      let paramIndex = 1;

      if (req.query.active !== undefined) {
        query += ` AND is_active = $${paramIndex++}`;
        params.push(req.query.active === 'true');
      }

      query += ' ORDER BY name ASC';

      const result = await db.query(query, params);
      return res.json({ success: true, data: (result as any).rows });
    } catch (error) {
      logger.error('Failed to get automation rules', (error as Error).message);
      return res.status(500).json({ success: false, error: 'Failed to retrieve automation rules' });
    }
  });

  // Get automation rule by ID
  router.get('/automation/rules/:id', async (req: Request, res: Response) => {
    try {
      const result = await db.query('SELECT * FROM automation_rules WHERE id = $1', [req.params.id]);
      if ((result as any).rowCount === 0) {
        return res.status(404).json({ success: false, error: 'Automation rule not found' });
      }
      return res.json({ success: true, data: (result as any).rows[0] });
    } catch (error) {
      logger.error('Failed to get automation rule', (error as Error).message);
      return res.status(500).json({ success: false, error: 'Failed to retrieve automation rule' });
    }
  });

  // Create automation rule
  router.post('/automation/rules', async (req: Request, res: Response) => {
    try {
      const { 
        name, 
        description = '', 
        keywords = [], 
        serviceIds = [], 
        isActive = true, 
        conditions = {}, 
        actions = {} 
      } = req.body;
      
      if (!name || !keywords.length || !serviceIds.length) {
        return res.status(400).json({ success: false, error: 'Name, keywords, and serviceIds are required' });
      }

      const id = `rule_${Date.now()}`;
      const result = await db.query(
        'INSERT INTO automation_rules (id, name, description, keywords, service_ids, is_active, conditions, actions) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [id, name, description, JSON.stringify(keywords), JSON.stringify(serviceIds), isActive, JSON.stringify(conditions), JSON.stringify(actions)]
      );

      return res.status(201).json({ success: true, data: (result as any).rows[0], message: 'Automation rule created successfully' });
    } catch (error) {
      logger.error('Failed to create automation rule', (error as Error).message);
      return res.status(500).json({ success: false, error: 'Failed to create automation rule' });
    }
  });

  // Update automation rule
  router.put('/automation/rules/:id', async (req: Request, res: Response) => {
    try {
      const { name, description, keywords, serviceIds, isActive, conditions, actions } = req.body;
      
      const fields: string[] = [];
      const values: any[] = [];
      let idx = 1;

      if (name !== undefined) { fields.push(`name = $${idx++}`); values.push(name); }
      if (description !== undefined) { fields.push(`description = $${idx++}`); values.push(description); }
      if (keywords !== undefined) { fields.push(`keywords = $${idx++}`); values.push(JSON.stringify(keywords)); }
      if (serviceIds !== undefined) { fields.push(`service_ids = $${idx++}`); values.push(JSON.stringify(serviceIds)); }
      if (isActive !== undefined) { fields.push(`is_active = $${idx++}`); values.push(isActive); }
      if (conditions !== undefined) { fields.push(`conditions = $${idx++}`); values.push(JSON.stringify(conditions)); }
      if (actions !== undefined) { fields.push(`actions = $${idx++}`); values.push(JSON.stringify(actions)); }

      if (fields.length === 0) {
        return res.json({ success: true, message: 'No changes to update' });
      }

      values.push(req.params.id);
      const result = await db.query(
        `UPDATE automation_rules SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${idx} RETURNING *`,
        values
      );

      if ((result as any).rowCount === 0) {
        return res.status(404).json({ success: false, error: 'Automation rule not found' });
      }

      return res.json({ success: true, data: (result as any).rows[0], message: 'Automation rule updated successfully' });
    } catch (error) {
      logger.error('Failed to update automation rule', (error as Error).message);
      return res.status(500).json({ success: false, error: 'Failed to update automation rule' });
    }
  });

  // Delete automation rule
  router.delete('/automation/rules/:id', async (req: Request, res: Response) => {
    try {
      const result = await db.query('DELETE FROM automation_rules WHERE id = $1', [req.params.id]);
      if ((result as any).rowCount === 0) {
        return res.status(404).json({ success: false, error: 'Automation rule not found' });
      }
      return res.json({ success: true, message: 'Automation rule deleted successfully' });
    } catch (error) {
      logger.error('Failed to delete automation rule', (error as Error).message);
      return res.status(500).json({ success: false, error: 'Failed to delete automation rule' });
    }
  });

  // Get pending quotes
  router.get('/automation/pending-quotes', async (req: Request, res: Response) => {
    try {
      let query = 'SELECT * FROM pending_quotes WHERE 1=1';
      const params: any[] = [];
      let paramIndex = 1;

      if (req.query.status) {
        query += ` AND status = $${paramIndex++}`;
        params.push(req.query.status);
      }

      query += ' ORDER BY created_at DESC';

      const result = await db.query(query, params);
      return res.json({ success: true, data: (result as any).rows });
    } catch (error) {
      logger.error('Failed to get pending quotes', (error as Error).message);
      return res.status(500).json({ success: false, error: 'Failed to retrieve pending quotes' });
    }
  });

  // Approve pending quote
  router.post('/automation/pending-quotes/:id/approve', async (req: Request, res: Response) => {
    try {
      const { managerNotes = '' } = req.body;
      
      const result = await db.query(
        'UPDATE pending_quotes SET status = $1, manager_notes = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
        ['approved', managerNotes, req.params.id]
      );

      if ((result as any).rowCount === 0) {
        return res.status(404).json({ success: false, error: 'Pending quote not found' });
      }

      logger.info(`Pending quote ${req.params.id} approved`);

      return res.json({ success: true, message: 'Quote approved and sent successfully' });
    } catch (error) {
      logger.error('Failed to approve pending quote', (error as Error).message);
      return res.status(500).json({ success: false, error: 'Failed to approve pending quote' });
    }
  });

  // Reject pending quote
  router.delete('/automation/pending-quotes/:id/reject', async (req: Request, res: Response) => {
    try {
      const { managerNotes = '' } = req.body;
      
      const result = await db.query(
        'UPDATE pending_quotes SET status = $1, manager_notes = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
        ['rejected', managerNotes, req.params.id]
      );

      if ((result as any).rowCount === 0) {
        return res.status(404).json({ success: false, error: 'Pending quote not found' });
      }

      logger.info(`Pending quote ${req.params.id} rejected`);

      return res.json({ success: true, message: 'Quote rejected successfully' });
    } catch (error) {
      logger.error('Failed to reject pending quote', (error as Error).message);
      return res.status(500).json({ success: false, error: 'Failed to reject pending quote' });
    }
  });

  // Get automation metrics
  router.get('/automation/metrics', async (req: Request, res: Response) => {
    try {
      const rulesResult = await db.query('SELECT COUNT(*) as total, SUM(CASE WHEN is_active THEN 1 ELSE 0 END) as active FROM automation_rules');
      const quotesResult = await db.query('SELECT status, COUNT(*) as count FROM pending_quotes GROUP BY status');
      
      const totalRules = parseInt((rulesResult as any).rows[0].total) || 0;
      const activeRules = parseInt((rulesResult as any).rows[0].active) || 0;
      
      const quotesStats = (quotesResult as any).rows.reduce((acc: any, row: any) => {
        acc[row.status] = parseInt(row.count);
        return acc;
      }, {});

      const totalGenerated = Object.values(quotesStats).reduce((sum: any, count: any) => sum + count, 0) as number;
      const approved = quotesStats.approved || 0;
      const conversionRate = totalGenerated > 0 ? (approved / totalGenerated) * 100 : 0;

      const metrics = {
        totalRules,
        activeRules,
        totalGenerated,
        pendingReview: quotesStats.pending || 0,
        approved,
        rejected: quotesStats.rejected || 0,
        conversionRate: Math.round(conversionRate * 100) / 100
      };

      return res.json({ success: true, data: metrics });
    } catch (error) {
      logger.error('Failed to get automation metrics', (error as Error).message);
      return res.status(500).json({ success: false, error: 'Failed to retrieve automation metrics' });
    }
  });

  return router;
}
