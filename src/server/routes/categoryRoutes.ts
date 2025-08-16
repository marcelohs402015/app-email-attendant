import { Router, Request, Response } from 'express';
import { CategoryService } from '../services/CategoryService.js';
import { CategoryRepository } from '../../database/CategoryRepository.js';
import { Database } from '../../database/Database.js';
import { createLogger } from '../../shared/logger.js';
import { CreateCategoryRequest, UpdateCategoryRequest } from '../../types/email.js';

const logger = createLogger('CategoryRoutes');

export function createCategoryRoutes(database: Database): Router {
  const router = Router();
  const categoryRepository = new CategoryRepository(database);
  const categoryService = new CategoryService(categoryRepository);

  // Get categories with filters and pagination
  router.get('/categories', async (req: Request, res: Response) => {
    try {
      const filters: any = {};
      const pagination: any = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 50,
        sortBy: req.query.sortBy as string || 'name',
        sortOrder: req.query.sortOrder as string || 'ASC'
      };

      if (req.query.active !== undefined) {
        filters.active = req.query.active === 'true';
      }

      if (req.query.name) {
        filters.name = req.query.name as string;
      }

      const result = await categoryService.getCategories(filters, pagination);
      
      return res.json({
        success: true,
        data: result.categories,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total: result.total,
          pages: Math.ceil(result.total / pagination.limit)
        }
      });
    } catch (error) {
      logger.error('Failed to get categories:', (error as Error).message);
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve categories'
      });
    }
  });

  // Get specific category by ID
  router.get('/categories/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid category ID'
        });
      }

      const category = await categoryService.getCategoryById(id);
      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Category not found'
        });
      }

      return res.json({
        success: true,
        data: category
      });
    } catch (error) {
      logger.error('Failed to get category:', (error as Error).message);
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve category'
      });
    }
  });

  // Create new category
  router.post('/categories', async (req: Request, res: Response) => {
    try {
      const categoryData: CreateCategoryRequest = req.body;

      // Validate required fields
      if (!categoryData.name || !categoryData.description) {
        return res.status(400).json({
          success: false,
          error: 'Name and description are required'
        });
      }

      const category = await categoryService.createCategory(categoryData);
      
      return res.status(201).json({
        success: true,
        data: category,
        message: 'Category created successfully'
      });
    } catch (error) {
      logger.error('Failed to create category:', (error as Error).message);
      
      if ((error as Error).message.includes('already exists')) {
        return res.status(409).json({
          success: false,
          error: (error as Error).message
        });
      }

      if ((error as Error).message.includes('must contain only') || 
          (error as Error).message.includes('must be a valid')) {
        return res.status(400).json({
          success: false,
          error: (error as Error).message
        });
      }

      return res.status(500).json({
        success: false,
        error: 'Failed to create category'
      });
    }
  });

  // Update category
  router.put('/categories/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid category ID'
        });
      }

      const updateData: UpdateCategoryRequest = req.body;
      const updatedCategory = await categoryService.updateCategory(id, updateData);
      
      if (!updatedCategory) {
        return res.status(404).json({
          success: false,
          error: 'Category not found'
        });
      }

      return res.json({
        success: true,
        data: updatedCategory,
        message: 'Category updated successfully'
      });
    } catch (error) {
      logger.error('Failed to update category:', (error as Error).message);
      
      if ((error as Error).message.includes('already exists')) {
        return res.status(409).json({
          success: false,
          error: (error as Error).message
        });
      }

      if ((error as Error).message.includes('must contain only') || 
          (error as Error).message.includes('must be a valid')) {
        return res.status(400).json({
          success: false,
          error: (error as Error).message
        });
      }

      return res.status(500).json({
        success: false,
        error: 'Failed to update category'
      });
    }
  });

  // Delete category
  router.delete('/categories/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid category ID'
        });
      }

      const deleted = await categoryService.deleteCategory(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Category not found'
        });
      }

      return res.json({
        success: true,
        message: 'Category deleted successfully'
      });
    } catch (error) {
      logger.error('Failed to delete category:', (error as Error).message);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete category'
      });
    }
  });

  // Get active categories (for dropdowns, etc.)
  router.get('/categories/active/list', async (req: Request, res: Response) => {
    try {
      const categories = await categoryService.getActiveCategories();
      
      return res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      logger.error('Failed to get active categories:', (error as Error).message);
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve active categories'
      });
    }
  });

  // Get category statistics
  router.get('/categories/stats/summary', async (req: Request, res: Response) => {
    try {
      const stats = await categoryService.getCategoryStats();
      
      return res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      logger.error('Failed to get category statistics:', (error as Error).message);
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve category statistics'
      });
    }
  });

  // Validate category name
  router.post('/categories/validate-name', async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      
      if (!name) {
        return res.status(400).json({
          success: false,
          error: 'Category name is required'
        });
      }

      const validation = await categoryService.validateCategoryName(name);
      
      return res.json({
        success: true,
        data: validation
      });
    } catch (error) {
      logger.error('Failed to validate category name:', (error as Error).message);
      return res.status(500).json({
        success: false,
        error: 'Failed to validate category name'
      });
    }
  });

  // Toggle category active status
  router.patch('/categories/:id/toggle', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid category ID'
        });
      }

      const category = await categoryService.getCategoryById(id);
      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Category not found'
        });
      }

      const updatedCategory = await categoryService.updateCategory(id, {
        active: !category.active
      });

      return res.json({
        success: true,
        data: updatedCategory,
        message: `Category ${updatedCategory?.active ? 'activated' : 'deactivated'} successfully`
      });
    } catch (error) {
      logger.error('Failed to toggle category status:', (error as Error).message);
      return res.status(500).json({
        success: false,
        error: 'Failed to toggle category status'
      });
    }
  });

  return router;
}
