import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
  XMarkIcon,
  CheckIcon,
  PaperAirplaneIcon,
  EyeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import emailAPI from '../services/api';
import EmailQuotationModal from '../components/EmailQuotationModal';
import { Quotation, QuotationItem } from '../types/api';
import { format, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';

interface QuotationFormData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  items: QuotationItem[];
  discount: number;
  notes: string;
  validUntil: string;
}

const Quotations: React.FC = () => {
  const { t } = useTranslation();
  const { currentTheme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(null);
  const [previewQuotation, setPreviewQuotation] = useState<Quotation | null>(null);
  const [emailingQuotation, setEmailingQuotation] = useState<Quotation | null>(null);
  const [selectedService, setSelectedService] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [itemNotes, setItemNotes] = useState<string>('');
  const [formData, setFormData] = useState<QuotationFormData>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    items: [],
    discount: 0,
    notes: '',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
  });

  const queryClient = useQueryClient();

  // Queries
  const { data: quotationsResponse, isLoading: quotationsLoading } = useQuery({
    queryKey: ['quotations'],
    queryFn: () => emailAPI.getQuotations(),
  });

  const { data: servicesResponse } = useQuery({
    queryKey: ['services'],
    queryFn: () => emailAPI.getServices(),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: emailAPI.createQuotation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Quotation>) =>
      emailAPI.updateQuotation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: emailAPI.deleteQuotation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
    },
  });

  const sendMutation = useMutation({
    mutationFn: ({ quotationId, email }: { quotationId: string; email: string }) =>
      emailAPI.sendQuotation(quotationId, email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      alert('Quotation sent successfully!');
    },
    onError: () => {
      alert('Error sending quotation. Please try again.');
    },
  });

  const quotations = quotationsResponse?.data || [];
  const services = servicesResponse?.data || [];

  const resetForm = () => {
    setFormData({
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      clientAddress: '',
      items: [],
      discount: 0,
      notes: '',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    setSelectedService('');
    setQuantity(1);
    setUnitPrice(0);
    setItemNotes('');
    setEditingQuotation(null);
    setIsModalOpen(false);
  };

  const handleOpenModal = (quotation?: Quotation) => {
    if (quotation) {
      setEditingQuotation(quotation);
      setFormData({
        clientName: quotation.clientName,
        clientEmail: quotation.clientEmail,
        clientPhone: quotation.clientPhone || '',
        clientAddress: quotation.clientAddress || '',
        items: quotation.items,
        discount: quotation.discount || 0,
        notes: quotation.notes || '',
        validUntil: quotation.validUntil.split('T')[0]
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setUnitPrice(service.defaultPrice);
    }
  };

  const handleAddItem = () => {
    if (!selectedService || quantity <= 0 || unitPrice <= 0) return;

    const service = services.find(s => s.id === selectedService);
    if (!service) return;

    const newItem: QuotationItem = {
      serviceId: selectedService,
      quantity,
      unitPrice,
      subtotal: quantity * unitPrice,
      notes: itemNotes || undefined
    };

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));

    // Reset item form
    setSelectedService('');
    setQuantity(1);
    setUnitPrice(0);
    setItemNotes('');
  };

  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal - (formData.discount || 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.items.length === 0) {
      alert('Add at least one item to the quotation');
      return;
    }

    const quotationData = {
      ...formData,
      subtotal: calculateSubtotal(),
      total: calculateTotal(),
      status: 'draft' as const,
      validUntil: new Date(formData.validUntil + 'T23:59:59Z').toISOString()
    };

    if (editingQuotation) {
      updateMutation.mutate({
        id: editingQuotation.id,
        ...quotationData
      });
    } else {
      createMutation.mutate(quotationData);
    }
  };

  const handleDelete = (quotationId: string) => {
    if (window.confirm('Are you sure you want to delete this quotation?')) {
      deleteMutation.mutate(quotationId);
    }
  };

  const handleSend = (quotation: Quotation) => {
    setEmailingQuotation(quotation);
    setIsEmailModalOpen(true);
  };

  const handlePreview = (quotation: Quotation) => {
    setPreviewQuotation(quotation);
    setIsPreviewOpen(true);
  };

  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service?.name || 'Service not found';
  };

  const getStatusInfo = (status: string) => {
    const statusMap = {
      draft: { label: t('quotations.status.draft'), color: 'bg-gray-100 text-gray-800' },
      sent: { label: t('quotations.status.sent'), color: 'bg-blue-100 text-blue-800' },
      accepted: { label: t('quotations.status.accepted'), color: 'bg-green-100 text-green-800' },
      rejected: { label: t('quotations.status.rejected'), color: 'bg-red-100 text-red-800' },
      completed: { label: t('quotations.status.completed'), color: 'bg-purple-100 text-purple-800' }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.draft;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (quotationsLoading) {
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
            {t('quotations.title')}
          </h1>
          <p 
            className="mt-1 text-sm transition-colors duration-300"
            style={{ color: currentTheme.colors.text.muted }}
          >
            {t('quotations.manageDescription')}
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 text-white text-sm font-medium rounded-md transition-colors"
          style={{ backgroundColor: currentTheme.colors.primary[600] }}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          {t('quotations.newQuotation')}
        </button>
      </div>

      {/* Quotations List */}
      <div 
        className={`shadow-sm rounded-lg overflow-hidden transition-all duration-300 ${
          currentTheme.type === 'purple' ? 'darkone-card' : 'bg-white'
        }`}
        style={{ backgroundColor: currentTheme.colors.background.card }}
      >
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-4">
            {quotations.map((quotation) => {
              const statusInfo = getStatusInfo(quotation.status);
              return (
                <div
                  key={quotation.id}
                  className={`border rounded-lg p-4 hover:shadow-md transition-all duration-300 ${
                    currentTheme.type === 'purple' ? 'darkone-glass' : ''
                  }`}
                  style={{
                    backgroundColor: currentTheme.colors.background.primary,
                    borderColor: currentTheme.colors.border.primary
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <DocumentTextIcon 
                          className="h-5 w-5 transition-colors duration-300"
                          style={{ color: currentTheme.colors.text.muted }}
                        />
                        <h3 
                          className="text-lg font-medium transition-colors duration-300"
                          style={{ color: currentTheme.colors.text.primary }}
                        >
                          {quotation.clientName}
                        </h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      
                      <div 
                        className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm transition-colors duration-300"
                        style={{ color: currentTheme.colors.text.secondary }}
                      >
                        <div>
                          <strong>{t('quotations.email')}:</strong> {quotation.clientEmail}
                        </div>
                        <div>
                          <strong>{t('quotations.total')}:</strong> {formatPrice(quotation.total)}
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {t('quotations.validUntil')}: {format(parseISO(quotation.validUntil), 'dd/MM/yyyy', { locale: enUS })}
                        </div>
                      </div>
                      
                      <div 
                        className="mt-2 text-sm transition-colors duration-300"
                        style={{ color: currentTheme.colors.text.muted }}
                      >
                        {quotation.items.length} {quotation.items.length === 1 ? t('quotations.item') : t('quotations.items')}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handlePreview(quotation)}
                        className={`p-2 transition-colors duration-200 ${
                          currentTheme.type === 'purple' ? 'darkone-hover-primary' : 'hover:text-blue-600'
                        }`}
                        style={{ color: currentTheme.colors.text.muted }}
                        title={t('buttons.view')}
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleOpenModal(quotation)}
                        className={`p-2 transition-colors duration-200 ${
                          currentTheme.type === 'purple' ? 'darkone-hover-primary' : 'hover:text-primary-600'
                        }`}
                        style={{ color: currentTheme.colors.text.muted }}
                        title={t('buttons.edit')}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      {quotation.status === 'draft' && (
                        <button
                          onClick={() => handleSend(quotation)}
                          disabled={sendMutation.isPending}
                          className="p-2 transition-colors duration-200 hover:text-green-600 disabled:opacity-50"
                          style={{ color: currentTheme.colors.text.muted }}
                          title={t('buttons.sendByEmail')}
                        >
                          <PaperAirplaneIcon className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(quotation.id)}
                        className={`p-2 transition-colors duration-200 ${
                          currentTheme.type === 'purple' ? 'darkone-hover-red' : 'hover:text-red-600'
                        }`}
                        style={{ color: currentTheme.colors.text.muted }}
                        title={t('buttons.delete')}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {quotations.length === 0 && (
            <div className="text-center py-12">
              <DocumentTextIcon 
                className="mx-auto h-12 w-12 transition-colors duration-300"
                style={{ color: currentTheme.colors.text.muted }}
              />
              <h3 
                className="mt-2 text-sm font-medium transition-colors duration-300"
                style={{ color: currentTheme.colors.text.primary }}
              >
                {t('quotations.noQuotationsCreated')}
              </h3>
              <p 
                className="mt-1 text-sm transition-colors duration-300"
                style={{ color: currentTheme.colors.text.muted }}
              >
                {t('quotations.createFirstQuotation')}
              </p>
              <div className="mt-6">
                <button
                  onClick={() => handleOpenModal()}
                  className="inline-flex items-center px-4 py-2 text-white text-sm font-medium rounded-md transition-all duration-200"
                  style={{ backgroundColor: currentTheme.colors.primary[600] }}
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  {t('quotations.createQuotation')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div 
              className={`inline-block align-bottom rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6 ${
                currentTheme.type === 'purple' ? 'darkone-card' : 'bg-white'
              }`}
              style={{ backgroundColor: currentTheme.colors.background.card }}
            >
              <form onSubmit={handleSubmit}>
                <div className="flex items-center justify-between mb-6">
                  <h3 
                    className="text-lg font-medium transition-colors duration-300"
                    style={{ color: currentTheme.colors.text.primary }}
                  >
                    {editingQuotation ? t('quotations.editQuotation') : t('quotations.newQuotation')}
                  </h3>
                  <button
                    type="button"
                    onClick={resetForm}
                    className={`transition-colors duration-200 ${
                      currentTheme.type === 'purple' ? 'darkone-hover-white' : 'hover:text-gray-600'
                    }`}
                    style={{ color: currentTheme.colors.text.muted }}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {/* Cliente Info */}
                  <div 
                    className={`border rounded-lg p-4 transition-all duration-300 ${
                      currentTheme.type === 'purple' ? 'darkone-glass' : ''
                    }`}
                    style={{
                      backgroundColor: currentTheme.colors.background.primary,
                      borderColor: currentTheme.colors.border.primary
                    }}
                  >
                    <h4 
                      className="text-md font-medium mb-4 transition-colors duration-300"
                      style={{ color: currentTheme.colors.text.primary }}
                    >
                      {t('quotations.clientInfo')}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label 
                          className="block text-sm font-medium mb-1 transition-colors duration-300"
                          style={{ color: currentTheme.colors.text.primary }}
                        >
                          {t('quotations.clientName')}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.clientName}
                          onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                          style={{
                            backgroundColor: currentTheme.colors.background.primary,
                            color: currentTheme.colors.text.primary,
                            borderColor: currentTheme.colors.border.primary
                          }}
                        />
                      </div>
                      <div>
                        <label 
                          className="block text-sm font-medium mb-1 transition-colors duration-300"
                          style={{ color: currentTheme.colors.text.primary }}
                        >
                          {t('quotations.email')}
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.clientEmail}
                          onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                          style={{
                            backgroundColor: currentTheme.colors.background.primary,
                            color: currentTheme.colors.text.primary,
                            borderColor: currentTheme.colors.border.primary
                          }}
                        />
                      </div>
                      <div>
                        <label 
                          className="block text-sm font-medium mb-1 transition-colors duration-300"
                          style={{ color: currentTheme.colors.text.primary }}
                        >
                          {t('quotations.phone')}
                        </label>
                        <input
                          type="tel"
                          value={formData.clientPhone}
                          onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                          style={{
                            backgroundColor: currentTheme.colors.background.primary,
                            color: currentTheme.colors.text.primary,
                            borderColor: currentTheme.colors.border.primary
                          }}
                        />
                      </div>
                      <div>
                        <label 
                          className="block text-sm font-medium mb-1 transition-colors duration-300"
                          style={{ color: currentTheme.colors.text.primary }}
                        >
                          {t('quotations.validUntil')}
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.validUntil}
                          onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                          style={{
                            backgroundColor: currentTheme.colors.background.primary,
                            color: currentTheme.colors.text.primary,
                            borderColor: currentTheme.colors.border.primary
                          }}
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label 
                        className="block text-sm font-medium mb-1 transition-colors duration-300"
                        style={{ color: currentTheme.colors.text.primary }}
                      >
                        {t('quotations.address')}
                      </label>
                      <textarea
                        rows={2}
                        value={formData.clientAddress}
                        onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                        style={{
                          backgroundColor: currentTheme.colors.background.primary,
                          color: currentTheme.colors.text.primary,
                          borderColor: currentTheme.colors.border.primary
                        }}
                        placeholder={t('quotations.addressPlaceholder')}
                      />
                    </div>
                  </div>

                  {/* Add Items */}
                  <div 
                    className={`border rounded-lg p-4 transition-all duration-300 ${
                      currentTheme.type === 'purple' ? 'darkone-glass' : ''
                    }`}
                    style={{
                      backgroundColor: currentTheme.colors.background.primary,
                      borderColor: currentTheme.colors.border.primary
                    }}
                  >
                    <h4 
                      className="text-md font-medium mb-4 transition-colors duration-300"
                      style={{ color: currentTheme.colors.text.primary }}
                    >
                      {t('services.addServices')}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                      <div className="md:col-span-2">
                        <label 
                          className="block text-sm font-medium mb-1 transition-colors duration-300"
                          style={{ color: currentTheme.colors.text.primary }}
                        >
                          {t('quotations.service')}
                        </label>
                        <select
                          value={selectedService}
                          onChange={(e) => handleServiceSelect(e.target.value)}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                          style={{
                            backgroundColor: currentTheme.colors.background.primary,
                            color: currentTheme.colors.text.primary,
                            borderColor: currentTheme.colors.border.primary
                          }}
                        >
                          <option value="">{t('quotations.selectService')}</option>
                          {services.filter(s => s.isActive).map((service) => (
                            <option key={service.id} value={service.id}>
                              {service.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label 
                          className="block text-sm font-medium mb-1 transition-colors duration-300"
                          style={{ color: currentTheme.colors.text.primary }}
                        >
                          {t('quotations.quantity')}
                        </label>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                          style={{
                            backgroundColor: currentTheme.colors.background.primary,
                            color: currentTheme.colors.text.primary,
                            borderColor: currentTheme.colors.border.primary
                          }}
                        />
                      </div>
                      <div>
                        <label 
                          className="block text-sm font-medium mb-1 transition-colors duration-300"
                          style={{ color: currentTheme.colors.text.primary }}
                        >
                          {t('quotations.unitPrice')} (R$)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={unitPrice}
                          onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                          style={{
                            backgroundColor: currentTheme.colors.background.primary,
                            color: currentTheme.colors.text.primary,
                            borderColor: currentTheme.colors.border.primary
                          }}
                        />
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={handleAddItem}
                          disabled={!selectedService || quantity <= 0 || unitPrice <= 0}
                          className="w-full px-4 py-2 text-white text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                          style={{ backgroundColor: currentTheme.colors.primary[600] }}
                        >
                          {t('buttons.add')}
                        </button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <input
                        type="text"
                        value={itemNotes}
                        onChange={(e) => setItemNotes(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                        style={{
                          backgroundColor: currentTheme.colors.background.primary,
                          color: currentTheme.colors.text.primary,
                          borderColor: currentTheme.colors.border.primary
                        }}
                        placeholder="Notes about this item (optional)"
                      />
                    </div>
                  </div>

                  {/* Items List */}
                  {formData.items.length > 0 && (
                    <div 
                      className={`border rounded-lg p-4 transition-all duration-300 ${
                        currentTheme.type === 'purple' ? 'darkone-glass' : ''
                      }`}
                      style={{
                        backgroundColor: currentTheme.colors.background.primary,
                        borderColor: currentTheme.colors.border.primary
                      }}
                    >
                      <h4 
                        className="text-md font-medium mb-4 transition-colors duration-300"
                        style={{ color: currentTheme.colors.text.primary }}
                      >
                        Quotation Items
                      </h4>
                                              <div className="space-y-2">
                          {formData.items.map((item, index) => (
                            <div 
                              key={index} 
                              className={`flex items-center justify-between p-3 rounded-md transition-all duration-300 ${
                                currentTheme.type === 'purple' ? 'darkone-glass' : 'bg-gray-50'
                              }`}
                              style={{
                                backgroundColor: currentTheme.type === 'purple' 
                                  ? 'rgba(255, 255, 255, 0.05)' 
                                  : undefined
                              }}
                            >
                              <div className="flex-1">
                                <div 
                                  className="text-sm font-medium transition-colors duration-300"
                                  style={{ color: currentTheme.colors.text.primary }}
                                >
                                  {getServiceName(item.serviceId)}
                                </div>
                                <div 
                                  className="text-xs transition-colors duration-300"
                                  style={{ color: currentTheme.colors.text.muted }}
                                >
                                  {item.quantity} x {formatPrice(item.unitPrice)} = {formatPrice(item.subtotal)}
                                  {item.notes && <span className="block mt-1">{item.notes}</span>}
                                </div>
                              </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              className="ml-2 p-1 text-red-400 hover:text-red-600"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal:</span>
                          <span>{formatPrice(calculateSubtotal())}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>Desconto (R$):</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.discount}
                            onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                            className="w-24 px-2 py-1 border border-gray-300 rounded text-right"
                          />
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t pt-2">
                          <span>Total:</span>
                          <span>{formatPrice(calculateTotal())}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <label 
                      className="block text-sm font-medium mb-1 transition-colors duration-300"
                      style={{ color: currentTheme.colors.text.primary }}
                    >
                      Notes
                    </label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      style={{
                        backgroundColor: currentTheme.colors.background.primary,
                        color: currentTheme.colors.text.primary,
                        borderColor: currentTheme.colors.border.primary
                      }}
                      placeholder="General notes about the quotation..."
                    />
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
                        Salvando...
                      </>
                    ) : (
                      <>
                        <CheckIcon className="h-4 w-4 mr-2" />
                        {editingQuotation ? t('buttons.update') : t('buttons.create')} {t('navigation.quotations')}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {isPreviewOpen && previewQuotation && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg px-6 pt-6 pb-6 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Quotation Preview</h3>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
                <div className="text-center border-b pb-4">
                  <h2 className="text-xl font-bold text-gray-900">ORÇAMENTO</h2>
                  <p className="text-sm text-gray-600">#{previewQuotation.id.toUpperCase()}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Cliente:</h4>
                    <p className="text-sm text-gray-600">{previewQuotation.clientName}</p>
                    <p className="text-sm text-gray-600">{previewQuotation.clientEmail}</p>
                    {previewQuotation.clientPhone && (
                      <p className="text-sm text-gray-600">{previewQuotation.clientPhone}</p>
                    )}
                    {previewQuotation.clientAddress && (
                      <p className="text-sm text-gray-600 mt-2">{previewQuotation.clientAddress}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Valid Until:</h4>
                    <p className="text-sm text-gray-600">
                      {format(parseISO(previewQuotation.validUntil), 'dd/MM/yyyy', { locale: enUS })}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Services:</h4>
                  <div className="space-y-2">
                    {previewQuotation.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-start p-3 bg-gray-50 rounded">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {getServiceName(item.serviceId)}
                          </p>
                          {item.notes && (
                            <p className="text-xs text-gray-500 mt-1">{item.notes}</p>
                          )}
                          <p className="text-xs text-gray-600 mt-1">
                            {item.quantity} x {formatPrice(item.unitPrice)}
                          </p>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatPrice(item.subtotal)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{formatPrice(previewQuotation.subtotal)}</span>
                  </div>
                  {previewQuotation.discount && previewQuotation.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Desconto:</span>
                      <span>- {formatPrice(previewQuotation.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>{formatPrice(previewQuotation.total)}</span>
                  </div>
                </div>

                {previewQuotation.notes && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Notes:</h4>
                    <p className="text-sm text-gray-600">{previewQuotation.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Fechar
                </button>
                {previewQuotation.status === 'draft' && (
                  <button
                    onClick={() => {
                      setIsPreviewOpen(false);
                      handleSend(previewQuotation);
                    }}
                    disabled={sendMutation.isPending}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                    {t('buttons.sendByEmail')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Quotation Modal */}
      <EmailQuotationModal
        quotation={emailingQuotation}
        isOpen={isEmailModalOpen}
        onClose={() => {
          setIsEmailModalOpen(false);
          setEmailingQuotation(null);
        }}
      />
    </div>
  );
};

export default Quotations;