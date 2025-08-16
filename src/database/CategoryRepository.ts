import { Database } from './Database.js';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../types/email.js';
import { FilterOptions, PaginationOptions } from '../types/database.js';
import { createLogger } from '../shared/logger.js';
import { Logger } from 'winston';

export class CategoryRepository {
  private db: Database;
  private logger: Logger;

  constructor(database: Database) {
    this.db = database;
    this.logger = createLogger('CategoryRepository');
  }

  async createCategory(categoryData: CreateCategoryRequest): Promise<Category> {
    const query = `
      INSERT INTO categories (name, description, keywords, patterns, domains, color)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, description, keywords, patterns, domains, color, active, created_at, updated_at
    `;

    try {
      const result = await this.db.query<Category>(query, [
        categoryData.name,
        categoryData.description,
        JSON.stringify(categoryData.keywords),
        JSON.stringify(categoryData.patterns),
        JSON.stringify(categoryData.domains),
        categoryData.color
      ]);

      this.logger.info(`Category created with ID: ${result.rows[0].id}`);
      return result.rows[0];
    } catch (error) {
      this.logger.error('Failed to create category:', (error as Error).message);
      throw error;
    }
  }

  async getCategories(filters: FilterOptions = {}, pagination: PaginationOptions = { page: 1, limit: 50 }): Promise<{ categories: Category[], total: number }> {
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (filters.active !== undefined) {
      conditions.push(`active = $${paramIndex++}`);
      params.push(filters.active);
    }

    if (filters.name) {
      conditions.push(`name ILIKE $${paramIndex++}`);
      params.push(`%${filters.name}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sortBy = pagination.sortBy || 'name';
    const sortOrder = pagination.sortOrder || 'ASC';
    const offset = (pagination.page - 1) * pagination.limit;

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM categories ${whereClause}`;
    const countResult = await this.db.query<{ total: string }>(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    // Get paginated results
    const query = `
      SELECT id, name, description, keywords, patterns, domains, color, active, created_at, updated_at
      FROM categories 
      ${whereClause}
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    try {
      const result = await this.db.query<Category>(query, [...params, pagination.limit, offset]);
      
      this.logger.debug(`Retrieved ${result.rows.length} categories`);
      return {
        categories: result.rows,
        total
      };
    } catch (error) {
      this.logger.error('Failed to get categories:', (error as Error).message);
      throw error;
    }
  }

  async getCategoryById(id: number): Promise<Category | null> {
    const query = `
      SELECT id, name, description, keywords, patterns, domains, color, active, created_at, updated_at
      FROM categories 
      WHERE id = $1
    `;

    try {
      const result = await this.db.query<Category>(query, [id]);
      
      if (result.rows.length === 0) {
        this.logger.debug(`Category with ID ${id} not found`);
        return null;
      }

      this.logger.debug(`Retrieved category with ID: ${id}`);
      return result.rows[0];
    } catch (error) {
      this.logger.error('Failed to get category by ID:', (error as Error).message);
      throw error;
    }
  }

  async getCategoryByName(name: string): Promise<Category | null> {
    const query = `
      SELECT id, name, description, keywords, patterns, domains, color, active, created_at, updated_at
      FROM categories 
      WHERE name = $1
    `;

    try {
      const result = await this.db.query<Category>(query, [name]);
      
      if (result.rows.length === 0) {
        this.logger.debug(`Category with name ${name} not found`);
        return null;
      }

      this.logger.debug(`Retrieved category with name: ${name}`);
      return result.rows[0];
    } catch (error) {
      this.logger.error('Failed to get category by name:', (error as Error).message);
      throw error;
    }
  }

  async updateCategory(id: number, updateData: UpdateCategoryRequest): Promise<Category | null> {
    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (updateData.name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      params.push(updateData.name);
    }

    if (updateData.description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      params.push(updateData.description);
    }

    if (updateData.keywords !== undefined) {
      updates.push(`keywords = $${paramIndex++}`);
      params.push(JSON.stringify(updateData.keywords));
    }

    if (updateData.patterns !== undefined) {
      updates.push(`patterns = $${paramIndex++}`);
      params.push(JSON.stringify(updateData.patterns));
    }

    if (updateData.domains !== undefined) {
      updates.push(`domains = $${paramIndex++}`);
      params.push(JSON.stringify(updateData.domains));
    }

    if (updateData.color !== undefined) {
      updates.push(`color = $${paramIndex++}`);
      params.push(updateData.color);
    }

    if (updateData.active !== undefined) {
      updates.push(`active = $${paramIndex++}`);
      params.push(updateData.active);
    }

    if (updates.length === 0) {
      this.logger.warn('No fields to update for category');
      return this.getCategoryById(id);
    }

    params.push(id);
    const query = `
      UPDATE categories 
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex}
      RETURNING id, name, description, keywords, patterns, domains, color, active, created_at, updated_at
    `;

    try {
      const result = await this.db.query<Category>(query, params);
      
      if (result.rows.length === 0) {
        this.logger.warn(`Category with ID ${id} not found for update`);
        return null;
      }

      this.logger.info(`Category with ID ${id} updated successfully`);
      return result.rows[0];
    } catch (error) {
      this.logger.error('Failed to update category:', (error as Error).message);
      throw error;
    }
  }

  async deleteCategory(id: number): Promise<boolean> {
    const query = `
      DELETE FROM categories 
      WHERE id = $1
      RETURNING id
    `;

    try {
      const result = await this.db.query<{ id: number }>(query, [id]);
      
      if (result.rows.length === 0) {
        this.logger.warn(`Category with ID ${id} not found for deletion`);
        return false;
      }

      this.logger.info(`Category with ID ${id} deleted successfully`);
      return true;
    } catch (error) {
      this.logger.error('Failed to delete category:', (error as Error).message);
      throw error;
    }
  }

  async getActiveCategories(): Promise<Category[]> {
    const query = `
      SELECT id, name, description, keywords, patterns, domains, color, active, created_at, updated_at
      FROM categories 
      WHERE active = true
      ORDER BY name ASC
    `;

    try {
      const result = await this.db.query<Category>(query);
      
      this.logger.debug(`Retrieved ${result.rows.length} active categories`);
      return result.rows;
    } catch (error) {
      this.logger.error('Failed to get active categories:', (error as Error).message);
      throw error;
    }
  }

  async getCategoryStats(): Promise<{ categoryId: number; categoryName: string; emailCount: number }[]> {
    const query = `
      SELECT 
        c.id as category_id,
        c.name as category_name,
        COUNT(e.id) as email_count
      FROM categories c
      LEFT JOIN emails e ON c.name = e.category
      WHERE c.active = true
      GROUP BY c.id, c.name
      ORDER BY email_count DESC
    `;

    try {
      const result = await this.db.query<{ category_id: number; category_name: string; email_count: string }>(query);
      
      this.logger.debug(`Retrieved category statistics for ${result.rows.length} categories`);
      return result.rows.map(row => ({
        categoryId: row.category_id,
        categoryName: row.category_name,
        emailCount: parseInt(row.email_count)
      }));
    } catch (error) {
      this.logger.error('Failed to get category statistics:', (error as Error).message);
      throw error;
    }
  }
}
