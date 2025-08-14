import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { emailAPI } from '../services/api';
import { Quotation } from '../types/api';
import {
  XMarkIcon,
  PaperAirplaneIcon,
  AtSymbolIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';

interface EmailQuotationModalProps {
  quotation: Quotation | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EmailQuotationModal({ quotation, isOpen, onClose }: EmailQuotationModalProps) {
  const { t } = useTranslation();
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();

  const sendMutation = useMutation({
    mutationFn: ({ quotationId, email }: { quotationId: string; email: string }) =>
      emailAPI.sendQuotation(quotationId, email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      alert(t('quotations.sentSuccess'));
      onClose();
      resetForm();
    },
    onError: () => {
      alert(t('quotations.sendError'));
    },
  });

  const resetForm = () => {
    setRecipientEmail('');
    setSubject('');
    setMessage('');
  };

  React.useEffect(() => {
    if (quotation && isOpen) {
      setRecipientEmail(quotation.clientEmail || '');
      setSubject(t('quotations.emailSubject', {clientName: quotation.clientName}));
      setMessage(t('quotations.emailTemplate', {
        clientName: quotation.clientName,
        total: new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD' 
        }).format(quotation.total),
        validUntil: quotation.validUntil ? 
          format(parseISO(quotation.validUntil), 'dd/MM/yyyy', { locale: enUS }) : 
          t('quotations.defaultValidDays')
      }));
    }
  }, [quotation, isOpen]);

  const handleSend = () => {
    if (!quotation || !recipientEmail.trim()) {
      alert(t('quotations.fillRecipientEmail'));
      return;
    }

    if (!recipientEmail.includes('@')) {
      alert(t('quotations.validEmailRequired'));
      return;
    }

    sendMutation.mutate({
      quotationId: quotation.id,
      email: recipientEmail.trim()
    });
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  if (!isOpen || !quotation) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{t('quotations.sendByEmail')}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Quotation Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              {t('quotations.summary')}
            </h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>{t('quotations.client')}:</strong> {quotation.clientName}</p>
              <p><strong>{t('quotations.total')}:</strong> {formatCurrency(quotation.total)}</p>
              <p><strong>{t('quotations.items')}:</strong> {quotation.items.length} {t('quotations.services')}</p>
              {quotation.validUntil && (
                <p><strong>{t('quotations.validUntil')}:</strong> {
                  format(parseISO(quotation.validUntil), 'dd/MM/yyyy', { locale: enUS })
                }</p>
              )}
            </div>
          </div>

          {/* Email Form */}
          <div className="space-y-4">
            {/* Recipient Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <AtSymbolIcon className="h-4 w-4 inline mr-1" />
                {t('quotations.recipientEmail')} *
              </label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder={t('quotations.emailPlaceholder')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('quotations.subject')} *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t('quotations.subjectPlaceholder')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('quotations.message')} *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={8}
                placeholder={t('quotations.messagePlaceholder')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-800">
                💡 <strong>{t('quotations.tip')}:</strong> {t('quotations.tipText')}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            {t('buttons.cancel')}
          </button>
          <button
            onClick={handleSend}
            disabled={sendMutation.isPending || !recipientEmail.trim() || !subject.trim() || !message.trim()}
            className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sendMutation.isPending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <PaperAirplaneIcon className="h-4 w-4" />
            )}
            <span>
              {sendMutation.isPending ? t('buttons.sending') : t('quotations.sendQuotation')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}