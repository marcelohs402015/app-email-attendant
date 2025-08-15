import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { 
  PlusIcon, 
  CogIcon, 
  BellIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CpuChipIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { emailAPI } from '../services/api';
import { AutomationRule, PendingQuote, AutomationMetrics as MetricsType } from '../types/api';
import AutomationRuleModal from '../components/AutomationRuleModal';
import PendingQuoteCard from '../components/PendingQuoteCard';
import AutomationMetrics from '../components/AutomationMetrics';

export default function Automation() {
  const { t } = useTranslation();
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'rules' | 'pending'>('overview');

  // Fetch automation data
  const { data: rulesData, isLoading: rulesLoading } = useQuery({
    queryKey: ['automation-rules'],
    queryFn: () => emailAPI.getAutomationRules(),
  });

  const { data: pendingQuotesData, isLoading: pendingLoading } = useQuery({
    queryKey: ['pending-quotes'],
    queryFn: () => emailAPI.getPendingQuotes(),
  });

  const { data: metricsData, isLoading: metricsLoading } = useQuery({
    queryKey: ['automation-metrics'],
    queryFn: () => emailAPI.getAutomationMetrics(),
  });

  const rules = rulesData?.data || [];
  const pendingQuotes = pendingQuotesData?.data || [];
  const metrics = metricsData?.data;

  const handleCreateRule = () => {
    setSelectedRule(null);
    setShowRuleModal(true);
  };

  const handleEditRule = (rule: AutomationRule) => {
    setSelectedRule(rule);
    setShowRuleModal(true);
  };

  const tabs = [
    { key: 'overview', name: t('automation.dashboard.overview'), icon: ChartBarIcon },
    { key: 'rules', name: t('automation.rules.manageRules'), icon: CogIcon },
    { key: 'pending', name: t('automation.pending.title'), icon: ClockIcon },
  ];

  if (rulesLoading || pendingLoading || metricsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <CpuChipIcon className="h-8 w-8 text-primary-500 mr-3" />
                {t('automation.title')}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {t('automation.description')}
              </p>
            </div>
            <button
              onClick={handleCreateRule}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              {t('automation.rules.newRule')}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`${
                  activeTab === tab.key
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CogIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {t('automation.dashboard.activeRules')}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {metrics?.activeRules || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ClockIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {t('automation.dashboard.pendingQuotes')}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {pendingQuotes.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <EnvelopeIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {t('automation.dashboard.processedEmails')}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {metrics?.emailsProcessed || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChartBarIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {t('automation.dashboard.conversionRate')}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {metrics?.conversionRate ? `${metrics.conversionRate.toFixed(1)}%` : '0%'}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Automation Metrics Component */}
          {metrics && <AutomationMetrics metrics={metrics} />}

          {/* Recent Pending Quotes */}
          {pendingQuotes.length > 0 && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {t('automation.pending.title')} ({pendingQuotes.length})
                </h3>
                <button
                  onClick={() => setActiveTab('pending')}
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  View All →
                </button>
              </div>
              <div className="p-6 space-y-4">
                {pendingQuotes.slice(0, 3).map((quote) => (
                  <PendingQuoteCard key={quote.id} quote={quote} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {t('automation.rules.title')}
            </h3>
          </div>
          <div className="p-6">
            {rules.length === 0 ? (
              <div className="text-center py-12">
                <CogIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {t('automation.rules.noRulesFound')}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {t('automation.rules.createFirstRule')}
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleCreateRule}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    {t('automation.rules.createRule')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {rules.map((rule) => (
                  <div
                    key={rule.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h4 className="text-lg font-medium text-gray-900">
                            {rule.name}
                          </h4>
                          <div
                            className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              rule.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {rule.isActive ? 'Active' : 'Inactive'}
                          </div>
                        </div>
                        {rule.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {rule.description}
                          </p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-1">
                          {rule.keywords.map((keyword, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="ml-4 flex items-center space-x-2">
                        <button
                          onClick={() => handleEditRule(rule)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <CogIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'pending' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {t('automation.pending.title')}
              </h3>
              {pendingQuotes.length > 0 && (
                <div className="flex space-x-2">
                  <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                    <XCircleIcon className="h-4 w-4 mr-1" />
                    {t('automation.pending.rejectAll')}
                  </button>
                  <button className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700">
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    {t('automation.pending.approveAll')}
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="p-6">
            {pendingQuotes.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircleIcon className="mx-auto h-12 w-12 text-green-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {t('automation.pending.noPendingQuotes')}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {t('automation.pending.allCaughtUp')}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {pendingQuotes.map((quote) => (
                  <PendingQuoteCard key={quote.id} quote={quote} detailed />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rule Modal */}
      {showRuleModal && (
        <AutomationRuleModal
          rule={selectedRule}
          isOpen={showRuleModal}
          onClose={() => setShowRuleModal(false)}
        />
      )}
    </div>
  );
}