import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  WrenchScrewdriverIcon,
  XMarkIcon,
  CheckIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import emailAPI from '../services/api';
import { Service, ServiceCategory } from '../types/api';

interface ServiceFormData {
  name: string;
  description: string;
  category: string;
  defaultPrice: number;
  unit: string;
  estimatedDuration: number;
  materials: string[];
  isActive: boolean;
}

const Services: React.FC = () => {
  const { t } = useTranslation();
  const { currentTheme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [materialsInput, setMaterialsInput] = useState('');
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    description: '',
    category: '',
    defaultPrice: 0,
    unit: 'hora',
    estimatedDuration: 1,
    materials: [],
    isActive: true
  });

  const queryClient = useQueryClient();

  // Queries
  const { data: servicesResponse, isLoading: servicesLoading } = useQuery({
    queryKey: ['services', selectedCategory],
    queryFn: () => emailAPI.getServices(selectedCategory || undefined),
  });

  const { data: categoriesResponse } = useQuery({
    queryKey: ['serviceCategories'],
    queryFn: () => emailAPI.getServiceCategories(),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: emailAPI.createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Service>) =>
      emailAPI.updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: emailAPI.deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });

  const services = servicesResponse?.data || [];
  const categories = categoriesResponse?.data || [];

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      defaultPrice: 0,
      unit: 'hora',
      estimatedDuration: 1,
      materials: [],
      isActive: true
    });
    setMaterialsInput('');
    setEditingService(null);
    setIsModalOpen(false);
  };

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        description: service.description,
        category: service.category,
        defaultPrice: service.defaultPrice,
        unit: service.unit,
        estimatedDuration: service.estimatedDuration,
        materials: service.materials || [],
        isActive: service.isActive
      });
      setMaterialsInput((service.materials || []).join(', '));
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const materials = materialsInput
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    const serviceData = {
      ...formData,
      materials
    };

    if (editingService) {
      updateMutation.mutate({
        id: editingService.id,
        ...serviceData
      });
    } else {
      createMutation.mutate(serviceData);
    }
  };

  const handleDelete = (serviceId: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      deleteMutation.mutate(serviceId);
    }
  };

  const getCategoryInfo = (categoryId: string): ServiceCategory | undefined => {
    return categories.find(cat => cat.id === categoryId);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (servicesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 
            className="text-2xl font-bold transition-colors duration-300"
            style={{ color: currentTheme.colors.text.primary }}
          >
            {t('services.title')}
          </h1>
          <p 
            className="mt-1 transition-colors duration-300"
            style={{ color: currentTheme.colors.text.muted }}
          >
            {t('services.description')}
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors"
          style={{
            backgroundColor: currentTheme.colors.primary[600],
            color: 'white'
          }}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          {t('services.newService')}
        </button>
      </div>

      {/* Category Filter */}
      <div 
        className={`rounded-lg shadow-sm p-4 transition-all duration-300 ${
          currentTheme.type === 'purple' ? 'darkone-card' : 'bg-white'
        }`}
        style={{ backgroundColor: currentTheme.colors.background.card }}
      >
        <div className="flex items-center space-x-4">
          <label 
            className="text-sm font-medium transition-colors duration-300"
            style={{ color: currentTheme.colors.text.primary }}
          >
            {t('services.filterByCategory')}:
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-md transition-all duration-300"
            style={{
              backgroundColor: currentTheme.colors.background.primary,
              color: currentTheme.colors.text.primary,
              borderColor: currentTheme.colors.border.primary
            }}
          >
            <option value="">{t('services.allCategories')}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Services Grid */}
      <div 
        className={`shadow-sm rounded-lg overflow-hidden transition-all duration-300 ${
          currentTheme.type === 'purple' ? 'darkone-card' : 'bg-white'
        }`}
        style={{ backgroundColor: currentTheme.colors.background.card }}
      >
        <div className="px-4 py-5 sm:p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const categoryInfo = getCategoryInfo(service.category);
              return (
                <div
                  key={service.id}
                  className={`border rounded-lg p-4 hover:shadow-md transition-all duration-300 ${
                    currentTheme.type === 'purple' ? 'darkone-glass' : ''
                  }`}
                  style={{
                    backgroundColor: currentTheme.colors.background.primary,
                    borderColor: service.isActive 
                      ? currentTheme.colors.border.primary 
                      : currentTheme.colors.border.secondary
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <WrenchScrewdriverIcon 
                          className="h-5 w-5 mr-2 transition-colors duration-300"
                          style={{ color: currentTheme.colors.text.muted }}
                        />
                        <h3 
                          className="text-sm font-medium truncate transition-colors duration-300"
                          style={{ 
                            color: service.isActive 
                              ? currentTheme.colors.text.primary 
                              : currentTheme.colors.text.muted 
                          }}
                        >
                          {service.name}
                        </h3>
                      </div>
                      
                      {categoryInfo && (
                        <div className="flex items-center mt-2">
                          <TagIcon className="h-3 w-3 mr-1" style={{ color: categoryInfo.color }} />
                          <span
                            className="inline-block px-2 py-1 text-xs font-medium rounded-full"
                            style={{
                              backgroundColor: `${categoryInfo.color}20`,
                              color: categoryInfo.color
                            }}
                          >
                            {categoryInfo.name}
                          </span>
                        </div>
                      )}
                      
                      <p 
                        className="mt-2 text-xs line-clamp-2 transition-colors duration-300"
                        style={{ 
                          color: service.isActive 
                            ? currentTheme.colors.text.secondary 
                            : currentTheme.colors.text.muted 
                        }}
                      >
                        {service.description}
                      </p>
                      
                      <div 
                        className="mt-3 text-sm transition-colors duration-300"
                        style={{ 
                          color: service.isActive 
                            ? currentTheme.colors.text.secondary 
                            : currentTheme.colors.text.muted 
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {formatPrice(service.defaultPrice)}
                          </span>
                          <span className="text-xs">
                            por {service.unit}
                          </span>
                        </div>
                        <div className="text-xs mt-1">
                          {t('services.duration')}: {service.estimatedDuration}h
                        </div>
                      </div>
                      
                      {!service.isActive && (
                        <div className="mt-2">
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-200 text-gray-600 rounded-full">
                            {t('services.inactive')}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-1 ml-2">
                      <button
                        onClick={() => handleOpenModal(service)}
                        className={`p-1 transition-colors duration-200 ${
                          currentTheme.type === 'purple' ? 'darkone-hover-primary' : 'hover:text-primary-600'
                        }`}
                        style={{ 
                          color: currentTheme.colors.text.muted
                        }}
                        title="Editar"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className={`p-1 transition-colors duration-200 ${
                          currentTheme.type === 'purple' ? 'darkone-hover-red' : 'hover:text-red-600'
                        }`}
                        style={{ 
                          color: currentTheme.colors.text.muted
                        }}
                        title="Excluir"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {services.length === 0 && (
            <div className="text-center py-12">
              <WrenchScrewdriverIcon 
                className="mx-auto h-12 w-12 transition-colors duration-300"
                style={{ color: currentTheme.colors.text.muted }}
              />
              <h3 
                className="mt-2 text-sm font-medium transition-colors duration-300"
                style={{ color: currentTheme.colors.text.primary }}
              >
                {selectedCategory ? t('services.noServicesInCategory') : t('services.noServicesRegistered')}
              </h3>
              <p 
                className="mt-1 text-sm transition-colors duration-300"
                style={{ color: currentTheme.colors.text.muted }}
              >
                {t('services.createFirstHint')}
              </p>
              <div className="mt-6">
                <button
                  onClick={() => handleOpenModal()}
                  className="inline-flex items-center px-4 py-2 text-white text-sm font-medium rounded-md transition-all duration-200"
                  style={{ backgroundColor: currentTheme.colors.primary[600] }}
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  {t('services.createService')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div 
              className={`inline-block align-bottom rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6 ${
                currentTheme.type === 'purple' ? 'darkone-card' : 'bg-white'
              }`}
              style={{ backgroundColor: currentTheme.colors.background.card }}
            >
              <form onSubmit={handleSubmit}>
                <div className="flex items-center justify-between mb-4">
                  <h3 
                    className="text-lg font-medium transition-colors duration-300"
                    style={{ color: currentTheme.colors.text.primary }}
                  >
                    {editingService ? t('services.editService') : t('services.newService')}
                  </h3>
                  <button
                    type="button"
                    onClick={resetForm}
                    className={`transition-colors duration-200 ${
                      currentTheme.type === 'purple' ? 'darkone-hover-white' : 'hover:text-gray-600'
                    }`}
                    style={{ 
                      color: currentTheme.colors.text.muted
                    }}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label 
                      className="block text-sm font-medium mb-1 transition-colors duration-300"
                      style={{ color: currentTheme.colors.text.primary }}
                    >
                      {t('services.serviceName')}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      style={{
                        backgroundColor: currentTheme.colors.background.primary,
                        color: currentTheme.colors.text.primary,
                        borderColor: currentTheme.colors.border.primary
                      }}
                      placeholder={t('services.serviceNamePlaceholder')}
                    />
                  </div>

                  <div>
                    <label 
                      className="block text-sm font-medium mb-1 transition-colors duration-300"
                      style={{ color: currentTheme.colors.text.primary }}
                    >
                      {t('services.description')}
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      style={{
                        backgroundColor: currentTheme.colors.background.primary,
                        color: currentTheme.colors.text.primary,
                        borderColor: currentTheme.colors.border.primary
                      }}
                      placeholder={t('services.descriptionPlaceholder')}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label 
                        className="block text-sm font-medium mb-1 transition-colors duration-300"
                        style={{ color: currentTheme.colors.text.primary }}
                      >
                        {t('services.category')}
                      </label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                        style={{
                          backgroundColor: currentTheme.colors.background.primary,
                          color: currentTheme.colors.text.primary,
                          borderColor: currentTheme.colors.border.primary
                        }}
                      >
                        <option value="">{t('services.selectCategory')}</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label 
                        className="block text-sm font-medium mb-1 transition-colors duration-300"
                        style={{ color: currentTheme.colors.text.primary }}
                      >
                        {t('services.defaultPrice')} (R$)
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={formData.defaultPrice}
                        onChange={(e) => setFormData({ ...formData, defaultPrice: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                        style={{
                          backgroundColor: currentTheme.colors.background.primary,
                          color: currentTheme.colors.text.primary,
                          borderColor: currentTheme.colors.border.primary
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label 
                        className="block text-sm font-medium mb-1 transition-colors duration-300"
                        style={{ color: currentTheme.colors.text.primary }}
                      >
                        {t('services.unit')}
                      </label>
                      <select
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                        style={{
                          backgroundColor: currentTheme.colors.background.primary,
                          color: currentTheme.colors.text.primary,
                          borderColor: currentTheme.colors.border.primary
                        }}
                      >
                        <option value="hora">{t('services.units.hour')}</option>
                        <option value="dia">{t('services.units.day')}</option>
                        <option value="metro">{t('services.units.meter')}</option>
                        <option value="metro2">{t('services.units.meter2')}</option>
                        <option value="unidade">{t('services.units.unit')}</option>
                        <option value="projeto">{t('services.units.project')}</option>
                      </select>
                    </div>

                    <div>
                      <label 
                        className="block text-sm font-medium mb-1 transition-colors duration-300"
                        style={{ color: currentTheme.colors.text.primary }}
                      >
                        {t('services.estimatedDuration')} ({t('services.hours')})
                      </label>
                      <input
                        type="number"
                        required
                        min="0.5"
                        step="0.5"
                        value={formData.estimatedDuration}
                        onChange={(e) => setFormData({ ...formData, estimatedDuration: parseFloat(e.target.value) || 1 })}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                        style={{
                          backgroundColor: currentTheme.colors.background.primary,
                          color: currentTheme.colors.text.primary,
                          borderColor: currentTheme.colors.border.primary
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label 
                      className="block text-sm font-medium mb-1 transition-colors duration-300"
                      style={{ color: currentTheme.colors.text.primary }}
                    >
                      {t('services.requiredMaterials')}
                    </label>
                    <input
                      type="text"
                      value={materialsInput}
                      onChange={(e) => setMaterialsInput(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      style={{
                        backgroundColor: currentTheme.colors.background.primary,
                        color: currentTheme.colors.text.primary,
                        borderColor: currentTheme.colors.border.primary
                      }}
                      placeholder={t('services.materialsPlaceholder')}
                    />
                    <p 
                      className="mt-1 text-xs transition-colors duration-300"
                      style={{ color: currentTheme.colors.text.muted }}
                    >
                      {t('services.materialsHint')}
                    </p>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="isActive"
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label 
                      htmlFor="isActive" 
                      className="ml-2 text-sm transition-colors duration-300"
                      style={{ color: currentTheme.colors.text.primary }}
                    >
                      {t('services.activeService')}
                    </label>
                  </div>
                </div>

                <div 
                  className="flex justify-end space-x-3 mt-6 pt-4 border-t transition-all duration-300"
                  style={{ borderColor: currentTheme.colors.border.primary }}
                >
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-sm font-medium rounded-md transition-all duration-200"
                    style={{
                      backgroundColor: currentTheme.colors.background.primary,
                      color: currentTheme.colors.text.primary,
                      borderColor: currentTheme.colors.border.primary,
                      border: '1px solid'
                    }}
                  >
                    {t('buttons.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="inline-flex items-center px-4 py-2 text-white text-sm font-medium rounded-md disabled:opacity-50 transition-all duration-200"
                    style={{ backgroundColor: currentTheme.colors.primary[600] }}
                  >
                    {(createMutation.isPending || updateMutation.isPending) ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {t('buttons.saving')}
                      </>
                    ) : (
                      <>
                        <CheckIcon className="h-4 w-4 mr-2" />
                        {editingService ? t('buttons.update') : t('buttons.create')}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;