import { Router, Request, Response } from 'express';
import { ChatService } from '../services/ChatService.js';
import { logger } from '../utils/logger.js';

const router = Router();
const chatService = new ChatService();

/**
 * Chat Routes - v2.0
 * 
 * Provides RESTful API endpoints for the AI Chat system:
 * - Session management
 * - Message processing
 * - Chat history
 */

/**
 * POST /api/chat/sessions
 * Create a new chat session
 */
router.post('/sessions', async (req: Request, res: Response) => {
  try {
    const session = await chatService.createSession();
    
    logger.info(`Created new chat session: ${session.id}`);
    
    res.status(201).json({
      success: true,
      data: session,
      message: 'Chat session created successfully'
    });
  } catch (error) {
    logger.error('Error creating chat session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create chat session',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/chat/sessions
 * List all chat sessions
 */
router.get('/sessions', async (req: Request, res: Response) => {
  try {
    const sessions = await chatService.listSessions();
    
    res.json({
      success: true,
      data: sessions,
      message: 'Sessions retrieved successfully'
    });
  } catch (error) {
    logger.error('Error retrieving chat sessions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve chat sessions',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/chat/sessions/:sessionId
 * Get specific chat session by ID
 */
router.get('/sessions/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const session = await chatService.getSession(sessionId);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
        message: `Chat session ${sessionId} does not exist`
      });
    }
    
    res.json({
      success: true,
      data: session,
      message: 'Session retrieved successfully'
    });
  } catch (error) {
    logger.error('Error retrieving chat session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve chat session',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/chat/sessions/:sessionId/messages
 * Send a message to the chat session
 */
router.post('/sessions/:sessionId/messages', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { message } = req.body;

    // Validate request body
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid message',
        message: 'Message content is required and must be a non-empty string'
      });
    }

    // Check if session exists
    const session = await chatService.getSession(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
        message: `Chat session ${sessionId} does not exist`
      });
    }

    // Process the message
    const response = await chatService.processMessage(sessionId, message.trim());
    
    logger.info(`Processed message in session ${sessionId}: ${message.substring(0, 50)}...`);
    
    res.json({
      success: true,
      data: response,
      message: 'Message processed successfully'
    });
  } catch (error) {
    logger.error('Error processing chat message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process message',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/chat/sessions/:sessionId/status
 * Update session status (active, completed, archived)
 */
router.put('/sessions/:sessionId/status', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['active', 'completed', 'archived'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status',
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Check if session exists
    const session = await chatService.getSession(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
        message: `Chat session ${sessionId} does not exist`
      });
    }

    // Update session status (mock implementation)
    session.status = status;
    session.updatedAt = new Date().toISOString();
    
    logger.info(`Updated session ${sessionId} status to: ${status}`);
    
    res.json({
      success: true,
      data: session,
      message: `Session status updated to ${status}`
    });
  } catch (error) {
    logger.error('Error updating session status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update session status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * DELETE /api/chat/sessions/:sessionId
 * Archive a chat session
 */
router.delete('/sessions/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    
    // Check if session exists
    const session = await chatService.getSession(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
        message: `Chat session ${sessionId} does not exist`
      });
    }

    // Archive session instead of deleting (mock implementation)
    session.status = 'archived';
    session.updatedAt = new Date().toISOString();
    
    logger.info(`Archived chat session: ${sessionId}`);
    
    res.json({
      success: true,
      data: { sessionId, status: 'archived' },
      message: 'Session archived successfully'
    });
  } catch (error) {
    logger.error('Error archiving chat session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to archive session',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/chat/health
 * Health check endpoint for chat service
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      service: 'ChatService',
      version: '2.0.0',
      status: 'healthy',
      timestamp: new Date().toISOString()
    },
    message: 'Chat service is healthy'
  });
});

export default router;
