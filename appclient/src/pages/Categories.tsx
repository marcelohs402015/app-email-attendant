import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  TagIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { categoryAPI } from '../services/api';
import EmptyState from '../components/EmptyState';
import { Category } from '../types/api';

interface CategoryFormData {
  name: string;
  description: string;
  keywords: string[];
  patterns: string[];
  domains: string[];
  color: string;
  isActive: boolean;
}

const Categories: React.FC = () => {
  const { t } = useTranslation();
  const { currentTheme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [keywordsInput, setKeywordsInput] = useState('');
  const [patternsInput, setPatternsInput] = useState('');
  const [domainsInput, setDomainsInput] = useState('');
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    keywords: [],
    patterns: [],
    domains: [],
    color: '#3B82F6',
    isActive: true
  });

  const queryClient = useQueryClient();

  // Queries
  const { data: categoriesResponse, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryAPI.getCategories(),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: categoryAPI.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Partial<Category>) =>
      categoryAPI.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: categoryAPI.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const categories = categoriesResponse?.data || [];

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      keywords: [],
      patterns: [],
      domains: [],
      color: '#3B82F6',
      isActive: true
    });
    setKeywordsInput('');
    setPatternsInput('');
    setDomainsInput('');
    setEditingCategory(null);
    setIsModalOpen(false);
  };

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
        keywords: category.keywords,
        patterns: category.patterns,
        domains: category.domains,
        color: category.color,
        isActive: category.active
      });
      setKeywordsInput(category.keywords.join(', '));
      setPatternsInput(category.patterns.join(', '));
      setDomainsInput(category.domains.join(', '));
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const categoryData = {
      ...formData,
      keywords: keywordsInput.split(',').map(k => k.trim()).filter(k => k),
      patterns: patternsInput.split(',').map(p => p.trim()).filter(p => p),
      domains: domainsInput.split(',').map(d => d.trim()).filter(d => d)
    };

    if (editingCategory) {
      updateMutation.mutate({
        id: editingCategory.id,
        ...categoryData
      });
    } else {
      createMutation.mutate(categoryData as any);
    }
  };

  const handleDelete = (categoryId: number) => {
    if (window.confirm(t('categories.confirmDelete') || 'Are you sure you want to delete this category?')) {
      deleteMutation.mutate(categoryId);
    }
  };

  const handleToggleStatus = (categoryId: number, currentStatus: boolean) => {
    updateMutation.mutate({
      id: categoryId,
      active: !currentStatus
    });
  };

  if (categoriesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" 
          style={{ borderColor: currentTheme.colors.primary[600] }}></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 
            className="text-2xl font-bold transition-colors duration-300"
            style={{ color: currentTheme.colors.text.primary }}
          >
            {t('categories.title') || 'Categories'}
          </h1>
          <p 
            className="text-sm transition-colors duration-300"
            style={{ color: currentTheme.colors.text.muted }}
          >
            {t('categories.subtitle') || 'Manage email categories for automatic classification'}
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200"
          style={{
            backgroundColor: currentTheme.colors.primary[600],
            color: 'white'
          }}
        >
          <PlusIcon className="h-5 w-5" />
          <span>{t('categories.newCategory') || 'New Category'}</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {categories.map((category) => (
          <div
            key={category.id}
            className={`rounded-lg shadow-sm p-6 transition-all duration-300 ${
              currentTheme.type === 'purple' ? 'darkone-card' : 'bg-white'
            }`}
            style={{ backgroundColor: currentTheme.colors.background.card }}
          >
            {/* Category Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <div>
                  <h3 
                    className="font-semibold transition-colors duration-300"
                    style={{ color: currentTheme.colors.text.primary }}
                  >
                    {category.name}
                  </h3>
                  <p 
                    className="text-sm transition-colors duration-300"
                    style={{ color: currentTheme.colors.text.muted }}
                  >
                    {category.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleToggleStatus(category.id, category.active)}
                  className="p-1 rounded transition-colors duration-200"
                  style={{ color: currentTheme.colors.text.muted }}
                >
                  {category.active ? (
                    <EyeIcon className="h-4 w-4" />
                  ) : (
                    <EyeSlashIcon className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => handleOpenModal(category)}
                  className="p-1 rounded transition-colors duration-200"
                  style={{ color: currentTheme.colors.text.muted }}
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-1 rounded transition-colors duration-200 hover:text-red-500"
                  style={{ color: currentTheme.colors.text.muted }}
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Category Details */}
            <div className="space-y-3">
              <div>
                <span 
                  className="text-xs font-medium transition-colors duration-300"
                  style={{ color: currentTheme.colors.text.muted }}
                >
                  Keywords:
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {category.keywords.slice(0, 3).map((keyword, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs rounded-full"
                      style={{
                        backgroundColor: currentTheme.colors.primary[100],
                        color: currentTheme.colors.primary[700]
                      }}
                    >
                      {keyword}
                    </span>
                  ))}
                  {category.keywords.length > 3 && (
                    <span 
                      className="text-xs transition-colors duration-300"
                      style={{ color: currentTheme.colors.text.muted }}
                    >
                      +{category.keywords.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div>
                <span 
                  className="text-xs font-medium transition-colors duration-300"
                  style={{ color: currentTheme.colors.text.muted }}
                >
                  Patterns:
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {category.patterns.slice(0, 2).map((pattern, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs rounded-full"
                      style={{
                        backgroundColor: currentTheme.colors.background.primary,
                        color: currentTheme.colors.text.secondary
                      }}
                    >
                      {pattern}
                    </span>
                  ))}
                  {category.patterns.length > 2 && (
                    <span 
                      className="text-xs transition-colors duration-300"
                      style={{ color: currentTheme.colors.text.muted }}
                    >
                      +{category.patterns.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t"
                style={{ borderColor: currentTheme.colors.border.primary }}
              >
                <span 
                  className="text-xs transition-colors duration-300"
                  style={{ color: currentTheme.colors.text.muted }}
                >
                  Created: {new Date(category.created_at).toLocaleDateString()}
                </span>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    category.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {category.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {categories.length === 0 && (
        <EmptyState
          title="Nenhuma Categoria Cadastrada"
          description="Não há categorias cadastradas para classificação automática de emails. Comece criando sua primeira categoria."
          actionLabel="Nova Categoria"
          onAction={() => handleOpenModal()}
          icon="settings"
          steps={[
            'Clique em "Nova Categoria"',
            'Defina nome e descrição da categoria',
            'Adicione palavras-chave para identificação',
            'Configure padrões regex se necessário',
            'Salve para começar a usar'
          ]}
        />
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div 
            className="w-full max-w-2xl mx-4 rounded-lg shadow-xl transition-all duration-300"
            style={{ backgroundColor: currentTheme.colors.background.card }}
          >
            <div className="flex items-center justify-between p-6 border-b"
              style={{ borderColor: currentTheme.colors.border.primary }}
            >
              <h2 
                className="text-lg font-semibold transition-colors duration-300"
                style={{ color: currentTheme.colors.text.primary }}
              >
                {editingCategory ? t('categories.editCategory') || 'Edit Category' : t('categories.newCategory') || 'New Category'}
              </h2>
              <button
                onClick={resetForm}
                className="p-1 rounded transition-colors duration-200"
                style={{ color: currentTheme.colors.text.muted }}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label 
                    className="block text-sm font-medium mb-2 transition-colors duration-300"
                    style={{ color: currentTheme.colors.text.primary }}
                  >
                    {t('categories.name') || 'Name'}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md transition-all duration-300"
                    style={{
                      backgroundColor: currentTheme.colors.background.primary,
                      color: currentTheme.colors.text.primary,
                      borderColor: currentTheme.colors.border.primary
                    }}
                    placeholder={t('categories.namePlaceholder') || 'e.g., complaints'}
                    required
                  />
                </div>

                <div>
                  <label 
                    className="block text-sm font-medium mb-2 transition-colors duration-300"
                    style={{ color: currentTheme.colors.text.primary }}
                  >
                    {t('categories.color') || 'Color'}
                  </label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full h-10 border rounded-md transition-all duration-300"
                    style={{ borderColor: currentTheme.colors.border.primary }}
                  />
                </div>
              </div>

              <div>
                <label 
                  className="block text-sm font-medium mb-2 transition-colors duration-300"
                  style={{ color: currentTheme.colors.text.primary }}
                >
                  {t('categories.description') || 'Description'}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md transition-all duration-300"
                  style={{
                    backgroundColor: currentTheme.colors.background.primary,
                    color: currentTheme.colors.text.primary,
                    borderColor: currentTheme.colors.border.primary
                  }}
                  placeholder={t('categories.descriptionPlaceholder') || 'Describe what this category is for...'}
                  required
                />
              </div>

              <div>
                <label 
                  className="block text-sm font-medium mb-2 transition-colors duration-300"
                  style={{ color: currentTheme.colors.text.primary }}
                >
                  {t('categories.keywords') || 'Keywords (comma-separated)'}
                </label>
                <input
                  type="text"
                  value={keywordsInput}
                  onChange={(e) => setKeywordsInput(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md transition-all duration-300"
                  style={{
                    backgroundColor: currentTheme.colors.background.primary,
                    color: currentTheme.colors.text.primary,
                    borderColor: currentTheme.colors.border.primary
                  }}
                  placeholder={t('categories.keywordsPlaceholder') || 'e.g., complaint, problem, issue'}
                />
              </div>

              <div>
                <label 
                  className="block text-sm font-medium mb-2 transition-colors duration-300"
                  style={{ color: currentTheme.colors.text.primary }}
                >
                  {t('categories.patterns') || 'Patterns (comma-separated)'}
                </label>
                <input
                  type="text"
                  value={patternsInput}
                  onChange={(e) => setPatternsInput(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md transition-all duration-300"
                  style={{
                    backgroundColor: currentTheme.colors.background.primary,
                    color: currentTheme.colors.text.primary,
                    borderColor: currentTheme.colors.border.primary
                  }}
                  placeholder={t('categories.patternsPlaceholder') || 'e.g., \\b(problem|issue)\\b'}
                />
              </div>

              <div>
                <label 
                  className="block text-sm font-medium mb-2 transition-colors duration-300"
                  style={{ color: currentTheme.colors.text.primary }}
                >
                  {t('categories.domains') || 'Domains (comma-separated)'}
                </label>
                <input
                  type="text"
                  value={domainsInput}
                  onChange={(e) => setDomainsInput(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md transition-all duration-300"
                  style={{
                    backgroundColor: currentTheme.colors.background.primary,
                    color: currentTheme.colors.text.primary,
                    borderColor: currentTheme.colors.border.primary
                  }}
                  placeholder={t('categories.domainsPlaceholder') || 'e.g., support@company.com'}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 rounded transition-all duration-300"
                  style={{
                    backgroundColor: currentTheme.colors.background.primary,
                    borderColor: currentTheme.colors.border.primary
                  }}
                />
                <label 
                  htmlFor="isActive"
                  className="ml-2 text-sm transition-colors duration-300"
                  style={{ color: currentTheme.colors.text.primary }}
                >
                  {t('categories.isActive') || 'Active'}
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t"
                style={{ borderColor: currentTheme.colors.border.primary }}
              >
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border rounded-md font-medium transition-all duration-200"
                  style={{
                    backgroundColor: currentTheme.colors.background.primary,
                    color: currentTheme.colors.text.primary,
                    borderColor: currentTheme.colors.border.primary
                  }}
                >
                  {t('buttons.cancel') || 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md font-medium transition-all duration-200"
                  style={{
                    backgroundColor: currentTheme.colors.primary[600],
                    color: 'white'
                  }}
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>{t('buttons.saving') || 'Saving...'}</span>
                    </div>
                  ) : (
                    <span>{editingCategory ? t('buttons.update') || 'Update' : t('buttons.create') || 'Create'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
