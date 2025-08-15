import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { emailAPI } from '../services/api';
import { AutomationRule } from '../types/api';

interface AutomationRuleModalProps {
  rule?: AutomationRule | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AutomationRuleModal({ rule, isOpen, onClose }: AutomationRuleModalProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    keywords: [] as string[],
    serviceIds: [] as string[],
    isActive: true,
    conditions: {
      minConfidence: 70,
      emailCategories: [] as string[],
      senderDomain: '',
      requireAllKeywords: false,
    },
    actions: {
      generateQuote: true,
      autoSend: false,
      notifyManager: true,
    },
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch services and categories
  const { data: servicesData } = useQuery({
    queryKey: ['services'],
    queryFn: () => emailAPI.getServices(),
  });

  const services = servicesData?.data || [];

  // Initialize form with rule data
  useEffect(() => {
    if (rule) {
      setFormData({
        name: rule.name,
        description: rule.description || '',
        keywords: rule.keywords,
        serviceIds: rule.serviceIds,
        isActive: rule.isActive,
        conditions: rule.conditions,
        actions: rule.actions,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        keywords: [],
        serviceIds: [],
        isActive: true,
        conditions: {
          minConfidence: 70,
          emailCategories: [] as string[],
          senderDomain: '',
          requireAllKeywords: false,
        },
        actions: {
          generateQuote: true,
          autoSend: false,
          notifyManager: true,
        },
      });
    }
    setErrors({});
  }, [rule, isOpen]);

  const createMutation = useMutation({
    mutationFn: (data: Omit<AutomationRule, 'id' | 'createdAt' | 'updatedAt'>) => 
      emailAPI.createAutomationRule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation-rules'] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AutomationRule> }) =>
      emailAPI.updateAutomationRule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation-rules'] });
      onClose();
    },
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Rule name is required';
    }

    if (formData.keywords.length === 0) {
      newErrors.keywords = 'At least one keyword is required';
    }

    if (formData.serviceIds.length === 0) {
      newErrors.services = 'At least one service must be selected';
    }

    if (formData.conditions.minConfidence < 10 || formData.conditions.minConfidence > 100) {
      newErrors.confidence = 'Confidence must be between 10 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (rule) {
      updateMutation.mutate({ 
        id: rule.id, 
        data: formData 
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleKeywordAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const keyword = keywordInput.trim().toLowerCase();
      if (keyword && !formData.keywords.includes(keyword)) {
        setFormData(prev => ({
          ...prev,
          keywords: [...prev.keywords, keyword]
        }));
        setKeywordInput('');
      }
    }
  };

  const handleKeywordRemove = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(serviceId)
        ? prev.serviceIds.filter(id => id !== serviceId)
        : [...prev.serviceIds, serviceId]
    }));
  };

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        emailCategories: prev.conditions.emailCategories?.includes(category)
          ? prev.conditions.emailCategories.filter(c => c !== category)
          : [...(prev.conditions.emailCategories || []), category]
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {rule ? t('automation.rules.editRule') : t('automation.rules.createRule')}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900">Basic Information</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('automation.rules.ruleName')} *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={t('automation.rules.ruleNamePlaceholder')}
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                      errors.name ? 'border-red-300' : ''
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('automation.rules.description')}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder={t('automation.rules.descriptionPlaceholder')}
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('automation.rules.keywords')} *
                  </label>
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={handleKeywordAdd}
                    placeholder={t('automation.rules.keywordsPlaceholder')}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {t('automation.rules.keywordsHint')}
                  </p>
                  {formData.keywords.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {formData.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {keyword}
                          <button
                            type="button"
                            onClick={() => handleKeywordRemove(keyword)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  {errors.keywords && (
                    <p className="mt-1 text-sm text-red-600">{errors.keywords}</p>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    {t('automation.rules.isActive')}
                  </label>
                </div>
              </div>

              {/* Services */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900">
                  {t('automation.rules.services')} *
                </h4>
                
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3 space-y-2">
                  {services.map((service) => (
                    <label key={service.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.serviceIds.includes(service.id)}
                        onChange={() => handleServiceToggle(service.id)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-900">
                        {service.name} - ${service.defaultPrice}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.services && (
                  <p className="mt-1 text-sm text-red-600">{errors.services}</p>
                )}
              </div>
            </div>

            {/* Conditions */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900">
                {t('automation.rules.conditions')}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('automation.rules.minConfidence')} (%)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={formData.conditions.minConfidence}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      conditions: { ...prev.conditions, minConfidence: parseInt(e.target.value) }
                    }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                  {errors.confidence && (
                    <p className="mt-1 text-sm text-red-600">{errors.confidence}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('automation.rules.senderDomain')}
                  </label>
                  <input
                    type="text"
                    value={formData.conditions.senderDomain}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      conditions: { ...prev.conditions, senderDomain: e.target.value }
                    }))}
                    placeholder="@gmail.com"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <input
                    type="checkbox"
                    id="requireAllKeywords"
                    checked={formData.conditions.requireAllKeywords}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      conditions: { ...prev.conditions, requireAllKeywords: e.target.checked }
                    }))}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requireAllKeywords" className="ml-2 block text-sm text-gray-900">
                    {t('automation.rules.requireAllKeywords')}
                  </label>
                </div>
              </div>

              {/* Email Categories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('automation.rules.emailCategories')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {['complaint', 'quote', 'product_info', 'support', 'sales'].map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.conditions.emailCategories?.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-1 text-sm text-gray-900 capitalize">
                        {category.replace('_', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900">
                {t('automation.rules.actions')}
              </h4>
              
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.actions.generateQuote}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      actions: { ...prev.actions, generateQuote: e.target.checked }
                    }))}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-900">
                    {t('automation.rules.generateQuote')}
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.actions.autoSend}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      actions: { ...prev.actions, autoSend: e.target.checked }
                    }))}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-900">
                    {t('automation.rules.autoSend')}
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.actions.notifyManager}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      actions: { ...prev.actions, notifyManager: e.target.checked }
                    }))}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-900">
                    {t('automation.rules.notifyManager')}
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t('buttons.saving')}
                  </div>
                ) : (
                  rule ? t('common.save') : t('common.create')
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}