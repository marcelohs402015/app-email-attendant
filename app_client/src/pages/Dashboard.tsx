import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { emailAPI } from '../services/api';
import BusinessStats from '../components/BusinessStats';
import { 
  EnvelopeIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ChartBarIcon,
  InboxIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [activeView, setActiveView] = useState<'emails' | 'business'>('emails');
  const { t } = useTranslation();

  const { data: statsData, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['categoryStats'],
    queryFn: emailAPI.getCategoryStats,
  });

  const { data: recentEmails, isLoading: emailsLoading } = useQuery({
    queryKey: ['recentEmails'],
    queryFn: () => emailAPI.getEmails({}, { page: 1, limit: 5, sortBy: 'date', sortOrder: 'DESC' }),
  });

  const handleSyncEmails = async () => {
    try {
      await emailAPI.syncEmails('in:inbox', 10);
      // Refresh data after sync
      window.location.reload();
    } catch (error) {
      console.error('Sync failed:', error);
      alert(t('dashboard.syncFailed'));
    }
  };

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const stats = statsData?.data || [];
  const totalEmails = stats.reduce((sum, stat) => sum + stat.count, 0);
  const totalResponded = stats.reduce((sum, stat) => sum + stat.responded_count, 0);
  const pendingResponse = totalEmails - totalResponded;

  const getCategoryLabel = (category: string) => {
    return t(`categories.${category}`) || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      reclamacao: 'bg-red-100 text-red-800',
      orcamento: 'bg-blue-100 text-blue-800',
      informacoes_produto: 'bg-green-100 text-green-800',
      suporte: 'bg-yellow-100 text-yellow-800',
      vendas: 'bg-purple-100 text-purple-800',
      sem_categoria: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>
        <div className="flex items-center space-x-4">
          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveView('emails')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'emails'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <InboxIcon className="h-4 w-4" />
              <span>{t('dashboard.emailsView')}</span>
            </button>
            <button
              onClick={() => setActiveView('business')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'business'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ChartBarIcon className="h-4 w-4" />
              <span>{t('dashboard.businessView')}</span>
            </button>
          </div>

          {/* Sync Button - only show in emails view */}
          {activeView === 'emails' && (
            <button
              onClick={handleSyncEmails}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200"
            >
              <ArrowPathIcon className="h-4 w-4" />
              <span>{t('dashboard.syncEmails')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Conditional Content Based on Active View */}
      {activeView === 'emails' ? (
        <>
          {/* Email Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <EnvelopeIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{t('dashboard.totalEmails')}</p>
                  <p className="text-2xl font-semibold text-gray-900">{totalEmails}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{t('dashboard.responded')}</p>
                  <p className="text-2xl font-semibold text-gray-900">{totalResponded}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ClockIcon className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{t('dashboard.pending')}</p>
                  <p className="text-2xl font-semibold text-gray-900">{pendingResponse}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{t('dashboard.responseRate')}</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {totalEmails > 0 ? Math.round((totalResponded / totalEmails) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Email Category Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">{t('dashboard.emailsByCategory')}</h2>
              </div>
              <div className="p-6">
                {stats.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">{t('dashboard.noEmailsFound')}</p>
                    <p className="text-sm text-gray-400 mt-2">
                      {t('dashboard.syncHint')}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {stats.map((stat) => (
                      <div key={stat.category} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(stat.category)}`}>
                            {getCategoryLabel(stat.category)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{stat.count} {t('dashboard.total')}</span>
                          <span>{stat.responded_count} {t('dashboard.responded_count')}</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full"
                              style={{
                                width: `${stat.count > 0 ? (stat.responded_count / stat.count) * 100 : 0}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Emails */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">{t('dashboard.recentEmails')}</h2>
              </div>
              <div className="p-6">
                {emailsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                  </div>
                ) : recentEmails?.data?.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">{t('dashboard.noRecentEmails')}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentEmails?.data?.slice(0, 5).map((email) => (
                      <div key={email.id} className="flex items-start space-x-3 p-3 rounded-md hover:bg-gray-50">
                        <div className="flex-shrink-0">
                          <div className={`w-3 h-3 rounded-full ${email.responded ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {email.subject}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {email.from}
                          </p>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(email.category)}`}>
                            {getCategoryLabel(email.category)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Business Statistics View */
        <BusinessStats />
      )}

      {statsError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {t('dashboard.loadingStats')}
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{t('dashboard.serverError')}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}