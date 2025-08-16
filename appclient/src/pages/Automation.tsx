import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '../contexts/ThemeContext';
import { 
  PlusIcon, 
  CogIcon, 
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CpuChipIcon,
  EnvelopeIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { emailAPI } from '../services/api';
import { AutomationRule } from '../types/api';
import AutomationRuleModal from '../components/AutomationRuleModal';
import PendingQuoteCard from '../components/PendingQuoteCard';
import AutomationMetrics from '../components/AutomationMetrics';

export default function Automation() {
  const { t } = useTranslation();
  const { currentTheme } = useTheme();
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
      <div 
        className={`shadow rounded-lg transition-all duration-300 ${
          currentTheme.type === 'purple' ? 'darkone-card' : 'bg-white'
        }`}
        style={{ backgroundColor: currentTheme.colors.background.card }}
      >
        <div 
          className="px-6 py-4 border-b transition-all duration-300"
          style={{ borderColor: currentTheme.colors.border.primary }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 
                className="text-2xl font-bold flex items-center transition-colors duration-300"
                style={{ color: currentTheme.colors.text.primary }}
              >
                <CpuChipIcon 
                  className="h-8 w-8 mr-3 transition-colors duration-300"
                  style={{ color: currentTheme.colors.primary[600] }}
                />
                {t('automation.title')}
              </h1>
              <p 
                className="text-sm mt-1 transition-colors duration-300"
                style={{ color: currentTheme.colors.text.muted }}
              >
                {t('automation.description')}
              </p>
            </div>
            <button
              onClick={handleCreateRule}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
              style={{ backgroundColor: currentTheme.colors.primary[600] }}
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
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-all duration-200 ${
                  activeTab === tab.key ? '' : ''
                }`}
                style={{
                  borderColor: activeTab === tab.key 
                    ? currentTheme.colors.primary[600] 
                    : 'transparent',
                  color: activeTab === tab.key 
                    ? currentTheme.colors.primary[600] 
                    : currentTheme.colors.text.muted
                }}
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
            <div 
              className={`overflow-hidden shadow rounded-lg transition-all duration-300 ${
                currentTheme.type === 'purple' ? 'darkone-card' : 'bg-white'
              }`}
              style={{ backgroundColor: currentTheme.colors.background.card }}
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CogIcon 
                      className="h-6 w-6 transition-colors duration-300"
                      style={{ color: currentTheme.colors.primary[600] }}
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt 
                        className="text-sm font-medium truncate transition-colors duration-300"
                        style={{ color: currentTheme.colors.text.muted }}
                      >
                        {t('automation.dashboard.activeRules')}
                      </dt>
                      <dd 
                        className="text-lg font-medium transition-colors duration-300"
                        style={{ color: currentTheme.colors.text.primary }}
                      >
                        {metrics?.activeRules || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div 
              className={`overflow-hidden shadow rounded-lg transition-all duration-300 ${
                currentTheme.type === 'purple' ? 'darkone-card' : 'bg-white'
              }`}
              style={{ backgroundColor: currentTheme.colors.background.card }}
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ClockIcon 
                      className="h-6 w-6 transition-colors duration-300"
                      style={{ color: currentTheme.colors.primary[600] }}
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt 
                        className="text-sm font-medium truncate transition-colors duration-300"
                        style={{ color: currentTheme.colors.text.muted }}
                      >
                        {t('automation.dashboard.pendingQuotes')}
                      </dt>
                      <dd 
                        className="text-lg font-medium transition-colors duration-300"
                        style={{ color: currentTheme.colors.text.primary }}
                      >
                        {pendingQuotes.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div 
              className={`overflow-hidden shadow rounded-lg transition-all duration-300 ${
                currentTheme.type === 'purple' ? 'darkone-card' : 'bg-white'
              }`}
              style={{ backgroundColor: currentTheme.colors.background.card }}
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <EnvelopeIcon 
                      className="h-6 w-6 transition-colors duration-300"
                      style={{ color: currentTheme.colors.primary[600] }}
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt 
                        className="text-sm font-medium truncate transition-colors duration-300"
                        style={{ color: currentTheme.colors.text.muted }}
                      >
                        {t('automation.dashboard.processedEmails')}
                      </dt>
                      <dd 
                        className="text-lg font-medium transition-colors duration-300"
                        style={{ color: currentTheme.colors.text.primary }}
                      >
                        {metrics?.emailsProcessed || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div 
              className={`overflow-hidden shadow rounded-lg transition-all duration-300 ${
                currentTheme.type === 'purple' ? 'darkone-card' : 'bg-white'
              }`}
              style={{ backgroundColor: currentTheme.colors.background.card }}
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChartBarIcon 
                      className="h-6 w-6 transition-colors duration-300"
                      style={{ color: currentTheme.colors.primary[600] }}
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt 
                        className="text-sm font-medium truncate transition-colors duration-300"
                        style={{ color: currentTheme.colors.text.muted }}
                      >
                        {t('automation.dashboard.conversionRate')}
                      </dt>
                      <dd 
                        className="text-lg font-medium transition-colors duration-300"
                        style={{ color: currentTheme.colors.text.primary }}
                      >
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
            <div 
              className={`shadow rounded-lg transition-all duration-300 ${
                currentTheme.type === 'purple' ? 'darkone-card' : 'bg-white'
              }`}
              style={{ backgroundColor: currentTheme.colors.background.card }}
            >
              <div 
                className="px-6 py-4 border-b flex items-center justify-between transition-all duration-300"
                style={{ borderColor: currentTheme.colors.border.primary }}
              >
                <h3 
                  className="text-lg font-medium transition-colors duration-300"
                  style={{ color: currentTheme.colors.text.primary }}
                >
                  {t('automation.pending.title')} ({pendingQuotes.length})
                </h3>
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`text-sm transition-colors duration-200 ${
                    currentTheme.type === 'purple' ? 'darkone-hover-primary' : 'hover:text-primary-500'
                  }`}
                  style={{ color: currentTheme.colors.primary[600] }}
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
        <div 
          className={`shadow rounded-lg transition-all duration-300 ${
            currentTheme.type === 'purple' ? 'darkone-card' : 'bg-white'
          }`}
          style={{ backgroundColor: currentTheme.colors.background.card }}
        >
          <div 
            className="px-6 py-4 border-b transition-all duration-300"
            style={{ borderColor: currentTheme.colors.border.primary }}
          >
                          <h3 
                className="text-lg font-medium transition-colors duration-300"
                style={{ color: currentTheme.colors.text.primary }}
              >
                {t('automation.rules.title')}
              </h3>
          </div>
          <div className="p-6">
            {rules.length === 0 ? (
              <div className="text-center py-12">
                <CogIcon 
                  className="mx-auto h-12 w-12 transition-colors duration-300"
                  style={{ color: currentTheme.colors.text.muted }}
                />
                <h3 
                  className="mt-2 text-sm font-medium transition-colors duration-300"
                  style={{ color: currentTheme.colors.text.primary }}
                >
                  {t('automation.rules.noRulesFound')}
                </h3>
                <p 
                  className="mt-1 text-sm transition-colors duration-300"
                  style={{ color: currentTheme.colors.text.muted }}
                >
                  {t('automation.rules.createFirstRule')}
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleCreateRule}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white transition-all duration-200"
                    style={{ backgroundColor: currentTheme.colors.primary[600] }}
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
                    className={`border rounded-lg p-4 hover:shadow-md transition-all duration-300 ${
                      currentTheme.type === 'purple' ? 'darkone-glass' : ''
                    }`}
                    style={{
                      backgroundColor: currentTheme.colors.background.primary,
                      borderColor: currentTheme.colors.border.primary
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h4 
                            className="text-lg font-medium transition-colors duration-300"
                            style={{ color: currentTheme.colors.text.primary }}
                          >
                            {rule.name}
                          </h4>
                          <div
                            className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-300"
                            style={{
                              backgroundColor: rule.isActive 
                                ? currentTheme.colors.primary[600] 
                                : currentTheme.colors.background.card,
                              color: rule.isActive 
                                ? '#ffffff' 
                                : currentTheme.colors.text.muted
                            }}
                          >
                            {rule.isActive ? 'Active' : 'Inactive'}
                          </div>
                        </div>
                        {rule.description && (
                          <p 
                            className="text-sm mt-1 transition-colors duration-300"
                            style={{ color: currentTheme.colors.text.muted }}
                          >
                            {rule.description}
                          </p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-1">
                          {rule.keywords.map((keyword, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium transition-all duration-300"
                              style={{
                                backgroundColor: currentTheme.colors.primary[600],
                                color: '#ffffff'
                              }}
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="ml-4 flex items-center space-x-2">
                        <button
                          onClick={() => handleEditRule(rule)}
                          className={`transition-colors duration-200 ${
                            currentTheme.type === 'purple' ? 'darkone-hover-primary' : 'hover:text-gray-600'
                          }`}
                          style={{ color: currentTheme.colors.text.muted }}
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
        <div 
          className={`shadow rounded-lg transition-all duration-300 ${
            currentTheme.type === 'purple' ? 'darkone-card' : 'bg-white'
          }`}
          style={{ backgroundColor: currentTheme.colors.background.card }}
        >
          <div 
            className="px-6 py-4 border-b transition-all duration-300"
            style={{ borderColor: currentTheme.colors.border.primary }}
          >
            <div className="flex items-center justify-between">
              <h3 
                className="text-lg font-medium transition-colors duration-300"
                style={{ color: currentTheme.colors.text.primary }}
              >
                {t('automation.pending.title')}
              </h3>
              {pendingQuotes.length > 0 && (
                <div className="flex space-x-2">
                  <button 
                    className="inline-flex items-center px-3 py-1.5 border shadow-sm text-xs font-medium rounded transition-all duration-200"
                    style={{
                      backgroundColor: currentTheme.colors.background.primary,
                      color: currentTheme.colors.text.primary,
                      borderColor: currentTheme.colors.border.primary
                    }}
                  >
                    <XCircleIcon className="h-4 w-4 mr-1" />
                    {t('automation.pending.rejectAll')}
                  </button>
                  <button 
                    className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white transition-all duration-200"
                    style={{ backgroundColor: currentTheme.colors.primary[600] }}
                  >
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
                <CheckCircleIcon 
                  className="mx-auto h-12 w-12 transition-colors duration-300"
                  style={{ color: currentTheme.colors.primary[600] }}
                />
                <h3 
                  className="mt-2 text-sm font-medium transition-colors duration-300"
                  style={{ color: currentTheme.colors.text.primary }}
                >
                  {t('automation.pending.noPendingQuotes')}
                </h3>
                <p 
                  className="mt-1 text-sm transition-colors duration-300"
                  style={{ color: currentTheme.colors.text.muted }}
                >
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