import { Router, Request, Response } from 'express';
import { Database } from '../database/Database.js';
import { createLogger } from '../shared/logger.js';

const logger = createLogger('AppointmentsRoutesReal');

export function createAppointmentsRoutesReal(db: Database): Router {
  const router = Router();

  // Get appointments with filters
  router.get('/appointments', async (req: Request, res: Response) => {
    try {
      let query = 'SELECT * FROM appointments WHERE 1=1';
      const params: any[] = [];
      let paramIndex = 1;

      if (req.query.status) {
        query += ` AND status = $${paramIndex++}`;
        params.push(req.query.status);
      }

      if (req.query.client_id) {
        query += ` AND client_id = $${paramIndex++}`;
        params.push(req.query.client_id);
      }

      if (req.query.date) {
        query += ` AND date = $${paramIndex++}`;
        params.push(req.query.date);
      }

      query += ' ORDER BY date DESC, time DESC';

      const result = await db.query(query, params);
      return res.json({ success: true, data: (result as any).rows });
    } catch (error) {
      logger.error('Failed to get appointments', (error as Error).message);
      return res.status(500).json({ success: false, error: 'Failed to retrieve appointments' });
    }
  });

  // Get appointment by ID
  router.get('/appointments/:id', async (req: Request, res: Response) => {
    try {
      const result = await db.query('SELECT * FROM appointments WHERE id = $1', [req.params.id]);
      if ((result as any).rowCount === 0) {
        return res.status(404).json({ success: false, error: 'Appointment not found' });
      }
      return res.json({ success: true, data: (result as any).rows[0] });
    } catch (error) {
      logger.error('Failed to get appointment', (error as Error).message);
      return res.status(500).json({ success: false, error: 'Failed to retrieve appointment' });
    }
  });

  // Create appointment
  router.post('/appointments', async (req: Request, res: Response) => {
    try {
      const { 
        clientId, 
        clientName, 
        serviceIds = [], 
        serviceNames = [], 
        date, 
        time, 
        duration = 120, 
        address = '', 
        notes = '', 
        status = 'scheduled' 
      } = req.body;
      
      if (!clientId || !clientName || !date || !time) {
        return res.status(400).json({ success: false, error: 'Client ID, name, date, and time are required' });
      }

      const id = `appt_${Date.now()}`;
      const result = await db.query(
        'INSERT INTO appointments (id, client_id, client_name, service_ids, service_names, date, time, duration, address, notes, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
        [id, clientId, clientName, JSON.stringify(serviceIds), JSON.stringify(serviceNames), date, time, duration, address, notes, status]
      );

      return res.status(201).json({ success: true, data: (result as any).rows[0], message: 'Appointment created successfully' });
    } catch (error) {
      logger.error('Failed to create appointment', (error as Error).message);
      return res.status(500).json({ success: false, error: 'Failed to create appointment' });
    }
  });

  // Update appointment
  router.put('/appointments/:id', async (req: Request, res: Response) => {
    try {
      const { clientId, clientName, serviceIds, serviceNames, date, time, duration, address, notes, status } = req.body;
      
      const fields: string[] = [];
      const values: any[] = [];
      let idx = 1;

      if (clientId !== undefined) { fields.push(`client_id = $${idx++}`); values.push(clientId); }
      if (clientName !== undefined) { fields.push(`client_name = $${idx++}`); values.push(clientName); }
      if (serviceIds !== undefined) { fields.push(`service_ids = $${idx++}`); values.push(JSON.stringify(serviceIds)); }
      if (serviceNames !== undefined) { fields.push(`service_names = $${idx++}`); values.push(JSON.stringify(serviceNames)); }
      if (date !== undefined) { fields.push(`date = $${idx++}`); values.push(date); }
      if (time !== undefined) { fields.push(`time = $${idx++}`); values.push(time); }
      if (duration !== undefined) { fields.push(`duration = $${idx++}`); values.push(duration); }
      if (address !== undefined) { fields.push(`address = $${idx++}`); values.push(address); }
      if (notes !== undefined) { fields.push(`notes = $${idx++}`); values.push(notes); }
      if (status !== undefined) { fields.push(`status = $${idx++}`); values.push(status); }

      if (fields.length === 0) {
        return res.json({ success: true, message: 'No changes to update' });
      }

      values.push(req.params.id);
      const result = await db.query(
        `UPDATE appointments SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${idx} RETURNING *`,
        values
      );

      if ((result as any).rowCount === 0) {
        return res.status(404).json({ success: false, error: 'Appointment not found' });
      }

      return res.json({ success: true, data: (result as any).rows[0], message: 'Appointment updated successfully' });
    } catch (error) {
      logger.error('Failed to update appointment', (error as Error).message);
      return res.status(500).json({ success: false, error: 'Failed to update appointment' });
    }
  });

  // Delete appointment
  router.delete('/appointments/:id', async (req: Request, res: Response) => {
    try {
      const result = await db.query('DELETE FROM appointments WHERE id = $1', [req.params.id]);
      if ((result as any).rowCount === 0) {
        return res.status(404).json({ success: false, error: 'Appointment not found' });
      }
      return res.json({ success: true, message: 'Appointment deleted successfully' });
    } catch (error) {
      logger.error('Failed to delete appointment', (error as Error).message);
      return res.status(500).json({ success: false, error: 'Failed to delete appointment' });
    }
  });

  return router;
}
