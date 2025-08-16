import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { CategoryService } from '../server/services/CategoryService.js';
import { CategoryRepository } from '../database/CategoryRepository.js';
import { CreateCategoryRequest, UpdateCategoryRequest } from '../types/email.js';

// Mock do CategoryRepository
const mockCategoryRepository = {
  createCategory: jest.fn(),
  getCategories: jest.fn(),
  getCategoryById: jest.fn(),
  getCategoryByName: jest.fn(),
  updateCategory: jest.fn(),
  deleteCategory: jest.fn(),
  getActiveCategories: jest.fn(),
  getCategoryStats: jest.fn()
} as jest.Mocked<CategoryRepository>;

describe('CategoryService', () => {
  let categoryService: CategoryService;

  beforeEach(() => {
    categoryService = new CategoryService(mockCategoryRepository);
    jest.clearAllMocks();
  });

  describe('createCategory', () => {
    it('should create a valid category', async () => {
      const categoryData: CreateCategoryRequest = {
        name: 'test_category',
        description: 'Test category description',
        keywords: ['test', 'keyword'],
        patterns: ['\\btest\\b'],
        domains: ['test.com'],
        color: '#3B82F6'
      };

      const expectedCategory = {
        id: 1,
        ...categoryData,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockCategoryRepository.getCategoryByName.mockResolvedValue(null);
      mockCategoryRepository.createCategory.mockResolvedValue(expectedCategory);

      const result = await categoryService.createCategory(categoryData);

      expect(result).toEqual(expectedCategory);
      expect(mockCategoryRepository.getCategoryByName).toHaveBeenCalledWith('test_category');
      expect(mockCategoryRepository.createCategory).toHaveBeenCalledWith(categoryData);
    });

    it('should throw error for invalid name format', async () => {
      const categoryData: CreateCategoryRequest = {
        name: 'Invalid-Name',
        description: 'Test description',
        keywords: [],
        patterns: [],
        domains: [],
        color: '#3B82F6'
      };

      await expect(categoryService.createCategory(categoryData))
        .rejects
        .toThrow('Category name must contain only lowercase letters, numbers, and underscores');
    });

    it('should throw error for invalid color format', async () => {
      const categoryData: CreateCategoryRequest = {
        name: 'test_category',
        description: 'Test description',
        keywords: [],
        patterns: [],
        domains: [],
        color: 'invalid-color'
      };

      await expect(categoryService.createCategory(categoryData))
        .rejects
        .toThrow('Color must be a valid hex color (e.g., #3B82F6)');
    });

    it('should throw error for duplicate category name', async () => {
      const categoryData: CreateCategoryRequest = {
        name: 'existing_category',
        description: 'Test description',
        keywords: [],
        patterns: [],
        domains: [],
        color: '#3B82F6'
      };

      const existingCategory = {
        id: 1,
        name: 'existing_category',
        description: 'Existing category',
        keywords: [],
        patterns: [],
        domains: [],
        color: '#EF4444',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockCategoryRepository.getCategoryByName.mockResolvedValue(existingCategory);

      await expect(categoryService.createCategory(categoryData))
        .rejects
        .toThrow("Category with name 'existing_category' already exists");
    });
  });

  describe('getCategories', () => {
    it('should return categories with pagination', async () => {
      const mockCategories = [
        {
          id: 1,
          name: 'category1',
          description: 'Category 1',
          keywords: [],
          patterns: [],
          domains: [],
          color: '#3B82F6',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      const expectedResult = {
        categories: mockCategories,
        total: 1
      };

      mockCategoryRepository.getCategories.mockResolvedValue(expectedResult);

      const result = await categoryService.getCategories({ active: true }, { page: 1, limit: 10 });

      expect(result).toEqual(expectedResult);
      expect(mockCategoryRepository.getCategories).toHaveBeenCalledWith(
        { active: true },
        { page: 1, limit: 10 }
      );
    });
  });

  describe('getCategoryById', () => {
    it('should return category by ID', async () => {
      const expectedCategory = {
        id: 1,
        name: 'test_category',
        description: 'Test category',
        keywords: [],
        patterns: [],
        domains: [],
        color: '#3B82F6',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockCategoryRepository.getCategoryById.mockResolvedValue(expectedCategory);

      const result = await categoryService.getCategoryById(1);

      expect(result).toEqual(expectedCategory);
      expect(mockCategoryRepository.getCategoryById).toHaveBeenCalledWith(1);
    });

    it('should return null for non-existent category', async () => {
      mockCategoryRepository.getCategoryById.mockResolvedValue(null);

      const result = await categoryService.getCategoryById(999);

      expect(result).toBeNull();
    });

    it('should throw error for invalid ID', async () => {
      await expect(categoryService.getCategoryById(0))
        .rejects
        .toThrow('Invalid category ID');

      await expect(categoryService.getCategoryById(-1))
        .rejects
        .toThrow('Invalid category ID');
    });
  });

  describe('updateCategory', () => {
    it('should update category successfully', async () => {
      const existingCategory = {
        id: 1,
        name: 'test_category',
        description: 'Old description',
        keywords: [],
        patterns: [],
        domains: [],
        color: '#3B82F6',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const updateData: UpdateCategoryRequest = {
        description: 'New description',
        color: '#10B981'
      };

      const updatedCategory = {
        ...existingCategory,
        description: 'New description',
        color: '#10B981',
        updatedAt: new Date()
      };

      mockCategoryRepository.getCategoryById.mockResolvedValue(existingCategory);
      mockCategoryRepository.updateCategory.mockResolvedValue(updatedCategory);

      const result = await categoryService.updateCategory(1, updateData);

      expect(result).toEqual(updatedCategory);
      expect(mockCategoryRepository.updateCategory).toHaveBeenCalledWith(1, updateData);
    });

    it('should return null for non-existent category', async () => {
      mockCategoryRepository.getCategoryById.mockResolvedValue(null);

      const result = await categoryService.updateCategory(999, { description: 'New description' });

      expect(result).toBeNull();
    });
  });

  describe('deleteCategory', () => {
    it('should delete category successfully', async () => {
      const existingCategory = {
        id: 1,
        name: 'test_category',
        description: 'Test category',
        keywords: [],
        patterns: [],
        domains: [],
        color: '#3B82F6',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockCategoryRepository.getCategoryById.mockResolvedValue(existingCategory);
      mockCategoryRepository.deleteCategory.mockResolvedValue(true);

      const result = await categoryService.deleteCategory(1);

      expect(result).toBe(true);
      expect(mockCategoryRepository.deleteCategory).toHaveBeenCalledWith(1);
    });

    it('should return false for non-existent category', async () => {
      mockCategoryRepository.getCategoryById.mockResolvedValue(null);

      const result = await categoryService.deleteCategory(999);

      expect(result).toBe(false);
    });
  });

  describe('validateCategoryName', () => {
    it('should return valid for unique name', async () => {
      mockCategoryRepository.getCategoryByName.mockResolvedValue(null);

      const result = await categoryService.validateCategoryName('valid_name');

      expect(result).toEqual({ valid: true });
    });

    it('should return invalid for existing name', async () => {
      const existingCategory = {
        id: 1,
        name: 'existing_name',
        description: 'Existing category',
        keywords: [],
        patterns: [],
        domains: [],
        color: '#3B82F6',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockCategoryRepository.getCategoryByName.mockResolvedValue(existingCategory);

      const result = await categoryService.validateCategoryName('existing_name');

      expect(result).toEqual({
        valid: false,
        message: "Category with name 'existing_name' already exists"
      });
    });

    it('should return invalid for invalid name format', async () => {
      const result = await categoryService.validateCategoryName('Invalid-Name');

      expect(result).toEqual({
        valid: false,
        message: 'Category name must contain only lowercase letters, numbers, and underscores'
      });
    });

    it('should return invalid for empty name', async () => {
      const result = await categoryService.validateCategoryName('');

      expect(result).toEqual({
        valid: false,
        message: 'Category name is required'
      });
    });
  });

  describe('getCategoriesForCategorization', () => {
    it('should return categories in categorization format', async () => {
      const mockCategories = [
        {
          id: 1,
          name: 'test_category',
          description: 'Test category',
          keywords: ['test', 'keyword'],
          patterns: ['\\btest\\b'],
          domains: ['test.com'],
          color: '#3B82F6',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      mockCategoryRepository.getActiveCategories.mockResolvedValue(mockCategories);

      const result = await categoryService.getCategoriesForCategorization();

      expect(result).toEqual({
        test_category: {
          keywords: ['test', 'keyword'],
          patterns: [/\\btest\\b/i],
          domains: ['test.com']
        }
      });
    });
  });
});
