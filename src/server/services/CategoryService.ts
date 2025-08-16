import { CategoryRepository } from '../../database/CategoryRepository.js';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../../types/email.js';
import { FilterOptions, PaginationOptions } from '../../types/database.js';
import { createLogger } from '../../shared/logger.js';
import { Logger } from 'winston';

export class CategoryService {
  private categoryRepository: CategoryRepository;
  private logger: Logger;

  constructor(categoryRepository: CategoryRepository) {
    this.categoryRepository = categoryRepository;
    this.logger = createLogger('CategoryService');
  }

  async createCategory(categoryData: CreateCategoryRequest): Promise<Category> {
    try {
      // Validate required fields
      if (!categoryData.name || !categoryData.description) {
        throw new Error('Name and description are required');
      }

      // Validate name format (only lowercase letters, numbers, and underscores)
      if (!/^[a-z0-9_]+$/.test(categoryData.name)) {
        throw new Error('Category name must contain only lowercase letters, numbers, and underscores');
      }

      // Check if category name already exists
      const existingCategory = await this.categoryRepository.getCategoryByName(categoryData.name);
      if (existingCategory) {
        throw new Error(`Category with name '${categoryData.name}' already exists`);
      }

      // Validate color format
      if (!/^#[0-9A-F]{6}$/i.test(categoryData.color)) {
        throw new Error('Color must be a valid hex color (e.g., #3B82F6)');
      }

      // Validate arrays
      if (!Array.isArray(categoryData.keywords)) {
        throw new Error('Keywords must be an array');
      }

      if (!Array.isArray(categoryData.patterns)) {
        throw new Error('Patterns must be an array');
      }

      if (!Array.isArray(categoryData.domains)) {
        throw new Error('Domains must be an array');
      }

      this.logger.info(`Creating new category: ${categoryData.name}`);
      const category = await this.categoryRepository.createCategory(categoryData);
      
      this.logger.info(`Category created successfully with ID: ${category.id}`);
      return category;
    } catch (error) {
      this.logger.error('Failed to create category:', (error as Error).message);
      throw error;
    }
  }

  async getCategories(filters: FilterOptions = {}, pagination: PaginationOptions = {}): Promise<{ categories: Category[], total: number }> {
    try {
      this.logger.debug('Retrieving categories with filters:', filters);
      const result = await this.categoryRepository.getCategories(filters, pagination);
      
      this.logger.info(`Retrieved ${result.categories.length} categories out of ${result.total} total`);
      return result;
    } catch (error) {
      this.logger.error('Failed to get categories:', (error as Error).message);
      throw error;
    }
  }

  async getCategoryById(id: number): Promise<Category | null> {
    try {
      if (!id || id <= 0) {
        throw new Error('Invalid category ID');
      }

      this.logger.debug(`Retrieving category with ID: ${id}`);
      const category = await this.categoryRepository.getCategoryById(id);
      
      if (!category) {
        this.logger.warn(`Category with ID ${id} not found`);
        return null;
      }

      this.logger.debug(`Retrieved category: ${category.name}`);
      return category;
    } catch (error) {
      this.logger.error('Failed to get category by ID:', (error as Error).message);
      throw error;
    }
  }

  async updateCategory(id: number, updateData: UpdateCategoryRequest): Promise<Category | null> {
    try {
      if (!id || id <= 0) {
        throw new Error('Invalid category ID');
      }

      // Check if category exists
      const existingCategory = await this.categoryRepository.getCategoryById(id);
      if (!existingCategory) {
        this.logger.warn(`Category with ID ${id} not found for update`);
        return null;
      }

      // Validate name format if provided
      if (updateData.name && !/^[a-z0-9_]+$/.test(updateData.name)) {
        throw new Error('Category name must contain only lowercase letters, numbers, and underscores');
      }

      // Check if new name conflicts with existing category
      if (updateData.name && updateData.name !== existingCategory.name) {
        const nameConflict = await this.categoryRepository.getCategoryByName(updateData.name);
        if (nameConflict) {
          throw new Error(`Category with name '${updateData.name}' already exists`);
        }
      }

      // Validate color format if provided
      if (updateData.color && !/^#[0-9A-F]{6}$/i.test(updateData.color)) {
        throw new Error('Color must be a valid hex color (e.g., #3B82F6)');
      }

      // Validate arrays if provided
      if (updateData.keywords && !Array.isArray(updateData.keywords)) {
        throw new Error('Keywords must be an array');
      }

      if (updateData.patterns && !Array.isArray(updateData.patterns)) {
        throw new Error('Patterns must be an array');
      }

      if (updateData.domains && !Array.isArray(updateData.domains)) {
        throw new Error('Domains must be an array');
      }

      this.logger.info(`Updating category with ID: ${id}`);
      const updatedCategory = await this.categoryRepository.updateCategory(id, updateData);
      
      if (updatedCategory) {
        this.logger.info(`Category updated successfully: ${updatedCategory.name}`);
      }
      
      return updatedCategory;
    } catch (error) {
      this.logger.error('Failed to update category:', (error as Error).message);
      throw error;
    }
  }

  async deleteCategory(id: number): Promise<boolean> {
    try {
      if (!id || id <= 0) {
        throw new Error('Invalid category ID');
      }

      // Check if category exists
      const existingCategory = await this.categoryRepository.getCategoryById(id);
      if (!existingCategory) {
        this.logger.warn(`Category with ID ${id} not found for deletion`);
        return false;
      }

      this.logger.info(`Deleting category: ${existingCategory.name} (ID: ${id})`);
      const deleted = await this.categoryRepository.deleteCategory(id);
      
      if (deleted) {
        this.logger.info(`Category deleted successfully: ${existingCategory.name}`);
      }
      
      return deleted;
    } catch (error) {
      this.logger.error('Failed to delete category:', (error as Error).message);
      throw error;
    }
  }

  async getActiveCategories(): Promise<Category[]> {
    try {
      this.logger.debug('Retrieving active categories');
      const categories = await this.categoryRepository.getActiveCategories();
      
      this.logger.info(`Retrieved ${categories.length} active categories`);
      return categories;
    } catch (error) {
      this.logger.error('Failed to get active categories:', (error as Error).message);
      throw error;
    }
  }

  async getCategoryStats(): Promise<{ categoryId: number; categoryName: string; emailCount: number }[]> {
    try {
      this.logger.debug('Retrieving category statistics');
      const stats = await this.categoryRepository.getCategoryStats();
      
      this.logger.info(`Retrieved statistics for ${stats.length} categories`);
      return stats;
    } catch (error) {
      this.logger.error('Failed to get category statistics:', (error as Error).message);
      throw error;
    }
  }

  async validateCategoryName(name: string): Promise<{ valid: boolean; message?: string }> {
    try {
      if (!name) {
        return { valid: false, message: 'Category name is required' };
      }

      if (!/^[a-z0-9_]+$/.test(name)) {
        return { 
          valid: false, 
          message: 'Category name must contain only lowercase letters, numbers, and underscores' 
        };
      }

      const existingCategory = await this.categoryRepository.getCategoryByName(name);
      if (existingCategory) {
        return { 
          valid: false, 
          message: `Category with name '${name}' already exists` 
        };
      }

      return { valid: true };
    } catch (error) {
      this.logger.error('Failed to validate category name:', (error as Error).message);
      return { valid: false, message: 'Error validating category name' };
    }
  }

  async getCategoriesForCategorization(): Promise<{ [key: string]: { keywords: string[]; patterns: RegExp[]; domains: string[] } }> {
    try {
      const categories = await this.categoryRepository.getActiveCategories();
      
      const categorizationCategories: { [key: string]: { keywords: string[]; patterns: RegExp[]; domains: string[] } } = {};
      
      categories.forEach(category => {
        categorizationCategories[category.name] = {
          keywords: category.keywords,
          patterns: category.patterns.map(pattern => new RegExp(pattern, 'i')),
          domains: category.domains
        };
      });

      this.logger.debug(`Prepared ${Object.keys(categorizationCategories).length} categories for categorization`);
      return categorizationCategories;
    } catch (error) {
      this.logger.error('Failed to get categories for categorization:', (error as Error).message);
      throw error;
    }
  }
}
