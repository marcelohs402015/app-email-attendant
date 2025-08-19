import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  EyeIcon, 
  CalendarIcon,
  UserIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { emailAPI } from '../services/api';
import { PendingQuote } from '../types/api';

interface PendingQuoteCardProps {
  quote: PendingQuote;
  detailed?: boolean;
}

export default function PendingQuoteCard({ quote, detailed = false }: PendingQuoteCardProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(detailed);
  const [notes, setNotes] = useState(quote.managerNotes || '');
  const [showNotesInput, setShowNotesInput] = useState(false);

  const approveMutation = useMutation({
    mutationFn: (data: { notes?: string }) => 
      emailAPI.approvePendingQuote(quote.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-quotes'] });
      queryClient.invalidateQueries({ queryKey: ['automation-metrics'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (data: { notes?: string }) => 
      emailAPI.rejectPendingQuote(quote.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-quotes'] });
      queryClient.invalidateQueries({ queryKey: ['automation-metrics'] });
    },
  });

  const handleApprove = () => {
    if (window.confirm(t('automation.pending.approvalConfirm'))) {
      approveMutation.mutate({ notes });
    }
  };

  const handleReject = () => {
    if (window.confirm(t('automation.pending.rejectionConfirm'))) {
      rejectMutation.mutate({ notes });
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-medium text-gray-900">
                {quote.email.subject}
              </h3>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                quote.status === 'approved' ? 'bg-green-100 text-green-800' :
                quote.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {t(`automation.status.${quote.status}`)}
              </span>
              {quote.aiAnalysis.extractedInfo.urgency && (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  getUrgencyColor(quote.aiAnalysis.extractedInfo.urgency)
                }`}>
                  {t(`automation.pending.urgencyLevels.${quote.aiAnalysis.extractedInfo.urgency}`)}
                </span>
              )}
            </div>
            
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <UserIcon className="h-4 w-4 mr-1" />
                {quote.email.from}
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {new Date(quote.processedAt).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <ChartBarIcon className={`h-4 w-4 mr-1 ${getConfidenceColor(quote.aiAnalysis.confidence)}`} />
                <span className={getConfidenceColor(quote.aiAnalysis.confidence)}>
                  {quote.aiAnalysis.confidence}% confidence
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {quote.status === 'pending' && (
              <>
                <button
                  onClick={handleReject}
                  disabled={rejectMutation.isPending}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 disabled:opacity-50"
                >
                  <XCircleIcon className="h-4 w-4 mr-1" />
                  {t('automation.pending.reject')}
                </button>
                <button
                  onClick={handleApprove}
                  disabled={approveMutation.isPending}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  {approveMutation.isPending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                  ) : (
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                  )}
                  {t('automation.pending.approve')}
                </button>
              </>
            )}
            
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-gray-400 hover:text-gray-600"
            >
              <EyeIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Content */}
      {expanded && (
        <div className="p-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI Analysis */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900 flex items-center">
                <ChartBarIcon className="h-4 w-4 mr-2" />
                {t('automation.pending.aiAnalysis')}
              </h4>
              
              <div className="bg-gray-50 rounded-lg p-3 space-y-3">
                {/* Detected Keywords */}
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">
                    {t('automation.pending.detectedKeywords')}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {quote.aiAnalysis.detectedKeywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Extracted Information */}
                {quote.aiAnalysis.extractedInfo && (
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-2">
                      {t('automation.pending.extractedInfo')}
                    </p>
                    <div className="space-y-1 text-xs">
                      {quote.aiAnalysis.extractedInfo.clientName && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Client:</span>
                          <span className="font-medium">{quote.aiAnalysis.extractedInfo.clientName}</span>
                        </div>
                      )}
                      {quote.aiAnalysis.extractedInfo.estimatedBudget && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Budget:</span>
                          <span className="font-medium">${quote.aiAnalysis.extractedInfo.estimatedBudget}</span>
                        </div>
                      )}
                      {quote.aiAnalysis.extractedInfo.preferredDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium">{quote.aiAnalysis.extractedInfo.preferredDate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Matched Services */}
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">
                    {t('automation.pending.matchedServices')}
                  </p>
                  <div className="space-y-1">
                    {quote.aiAnalysis.matchedServices.map((service, index) => (
                      <div key={index} className="flex justify-between text-xs">
                        <span className="text-gray-600">{service.serviceName}</span>
                        <span className="font-medium">{(service.relevanceScore * 100).toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Generated Quote */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900 flex items-center">
                <DocumentTextIcon className="h-4 w-4 mr-2" />
                {t('automation.pending.generatedQuote')}
              </h4>
              
              <div className="bg-gray-50 rounded-lg p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{quote.generatedQuote.clientName}</p>
                    <p className="text-sm text-gray-600">{quote.generatedQuote.clientEmail}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900 flex items-center">
                      <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                      {quote.generatedQuote.total.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t('automation.pending.validUntil')}: {new Date(quote.generatedQuote.validUntil).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-2">
                  <div className="space-y-1">
                    {quote.generatedQuote.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-xs">
                        <span className="text-gray-600">
                          {item.quantity}x Service
                        </span>
                        <span className="font-medium">${item.subtotal.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Original Email Snippet */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h5 className="text-sm font-medium text-blue-900 mb-2 flex items-center">
              <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
              Original Email
            </h5>
            <p className="text-sm text-blue-800">
              {quote.email.snippet}
            </p>
          </div>

          {/* Manager Notes */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-sm font-medium text-gray-900">
                {t('automation.pending.managerNotes')}
              </h5>
              {!showNotesInput && (
                <button
                  onClick={() => setShowNotesInput(true)}
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  Add Notes
                </button>
              )}
            </div>
            
            {showNotesInput || notes ? (
              <div className="space-y-2">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t('automation.pending.addNotes')}
                  rows={2}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
                {showNotesInput && (
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setShowNotesInput(false);
                        setNotes(quote.managerNotes || '');
                      }}
                      className="text-xs text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setShowNotesInput(false)}
                      className="text-xs text-primary-600 hover:text-primary-500"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No notes added</p>
            )}
          </div>

          {/* Rule Info */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Triggered by: {quote.rule.name}
                </p>
                <p className="text-xs text-gray-600">
                  {quote.rule.description || 'No description'}
                </p>
              </div>
              <div className="flex items-center space-x-1">
                {quote.rule.keywords.slice(0, 3).map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-800"
                  >
                    {keyword}
                  </span>
                ))}
                {quote.rule.keywords.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{quote.rule.keywords.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}