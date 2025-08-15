import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { emailAPI } from '../services/api';
import BusinessStats from '../components/BusinessStats';
import { 
  EnvelopeIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  ChartBarIcon,
  InboxIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [activeView, setActiveView] = useState<'emails' | 'business'>('emails');
  const { t } = useTranslation();
  const { currentTheme } = useTheme();

  const { data: statsData, isLoading: statsLoading } = useQuery({
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" 
          style={{ borderColor: currentTheme.colors.primary[600] }}></div>
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
      complaint: 'bg-red-500/20 text-red-400',
      quote: 'bg-blue-500/20 text-blue-400',
      product_info: 'bg-green-500/20 text-green-400',
      support: 'bg-yellow-500/20 text-yellow-400',
      sales: 'bg-purple-500/20 text-purple-400',
      sem_categoria: 'bg-gray-500/20 text-gray-400'
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="mb-8">
        <h1 
          className="text-3xl font-bold mb-2 transition-colors duration-300"
          style={{ color: currentTheme.colors.text.primary }}
        >
          Welcome back, Marcelo Hernandes!
        </h1>
        <p 
          className="text-lg transition-colors duration-300"
          style={{ color: currentTheme.colors.text.muted }}
        >
          Track your sales activity, leads and deals here.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          {/* View Toggle */}
          <div 
            className="flex rounded-lg p-1 transition-all duration-300"
            style={{ backgroundColor: currentTheme.colors.background.card }}
          >
            <button
              onClick={() => setActiveView('emails')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeView === 'emails'
                  ? 'shadow-sm'
                  : 'hover:bg-white/5'
              }`}
              style={{
                backgroundColor: activeView === 'emails' ? currentTheme.colors.primary[500] : 'transparent',
                color: activeView === 'emails' ? 'white' : currentTheme.colors.text.secondary
              }}
            >
              <InboxIcon className="h-4 w-4" />
              <span>{t('dashboard.emailsView')}</span>
            </button>
            <button
              onClick={() => setActiveView('business')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeView === 'business'
                  ? 'shadow-sm'
                  : 'hover:bg-white/5'
              }`}
              style={{
                backgroundColor: activeView === 'business' ? currentTheme.colors.primary[500] : 'transparent',
                color: activeView === 'business' ? 'white' : currentTheme.colors.text.secondary
              }}
            >
              <ChartBarIcon className="h-4 w-4" />
              <span>{t('dashboard.businessView')}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10"
            style={{ 
              backgroundColor: currentTheme.colors.background.card,
              color: currentTheme.colors.text.primary,
              borderColor: currentTheme.colors.border.primary
            }}>
            Filters
          </button>
          <button className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10"
            style={{ 
              backgroundColor: currentTheme.colors.background.card,
              color: currentTheme.colors.text.primary,
              borderColor: currentTheme.colors.border.primary
            }}>
            Export
          </button>
        </div>
      </div>

      {activeView === 'emails' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Email Statistics Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Emails */}
            <div 
              className="p-6 rounded-xl transition-all duration-300 hover:shadow-lg"
              style={{ backgroundColor: currentTheme.colors.background.card }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p 
                    className="text-sm font-medium transition-colors duration-300"
                    style={{ color: currentTheme.colors.text.muted }}
                  >
                    Total Emails
                  </p>
                  <p 
                    className="text-2xl font-bold mt-1 transition-colors duration-300"
                    style={{ color: currentTheme.colors.text.primary }}
                  >
                    {totalEmails.toLocaleString()}
                  </p>
                </div>
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: currentTheme.colors.primary[500] + '20' }}
                >
                  <EnvelopeIcon className="w-6 h-6" style={{ color: currentTheme.colors.primary[500] }} />
                </div>
              </div>
                             <div className="mt-4 flex items-center text-sm">
                 <ArrowTrendingUpIcon className="w-4 h-4 mr-1" style={{ color: currentTheme.colors.primary[500] }} />
                 <span style={{ color: currentTheme.colors.primary[500] }}>+40% this month</span>
               </div>
            </div>

            {/* Responded Emails */}
            <div 
              className="p-6 rounded-xl transition-all duration-300 hover:shadow-lg"
              style={{ backgroundColor: currentTheme.colors.background.card }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p 
                    className="text-sm font-medium transition-colors duration-300"
                    style={{ color: currentTheme.colors.text.muted }}
                  >
                    Responded
                  </p>
                  <p 
                    className="text-2xl font-bold mt-1 transition-colors duration-300"
                    style={{ color: currentTheme.colors.text.primary }}
                  >
                    {totalResponded.toLocaleString()}
                  </p>
                </div>
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: '#22c55e20' }}
                >
                  <CheckCircleIcon className="w-6 h-6" style={{ color: '#22c55e' }} />
                </div>
              </div>
                             <div className="mt-4 flex items-center text-sm">
                 <ArrowTrendingUpIcon className="w-4 h-4 mr-1" style={{ color: '#22c55e' }} />
                 <span style={{ color: '#22c55e' }}>+25% this month</span>
               </div>
            </div>

            {/* Pending Response */}
            <div 
              className="p-6 rounded-xl transition-all duration-300 hover:shadow-lg"
              style={{ backgroundColor: currentTheme.colors.background.card }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p 
                    className="text-sm font-medium transition-colors duration-300"
                    style={{ color: currentTheme.colors.text.muted }}
                  >
                    Pending
                  </p>
                  <p 
                    className="text-2xl font-bold mt-1 transition-colors duration-300"
                    style={{ color: currentTheme.colors.text.primary }}
                  >
                    {pendingResponse.toLocaleString()}
                  </p>
                </div>
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: '#f59e0b20' }}
                >
                  <ClockIcon className="w-6 h-6" style={{ color: '#f59e0b' }} />
                </div>
              </div>
                             <div className="mt-4 flex items-center text-sm">
                 <ArrowTrendingUpIcon className="w-4 h-4 mr-1" style={{ color: '#f59e0b' }} />
                 <span style={{ color: '#f59e0b' }}>+12% this month</span>
               </div>
            </div>

            {/* Response Rate */}
            <div 
              className="p-6 rounded-xl transition-all duration-300 hover:shadow-lg"
              style={{ backgroundColor: currentTheme.colors.background.card }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p 
                    className="text-sm font-medium transition-colors duration-300"
                    style={{ color: currentTheme.colors.text.muted }}
                  >
                    Response Rate
                  </p>
                  <p 
                    className="text-2xl font-bold mt-1 transition-colors duration-300"
                    style={{ color: currentTheme.colors.text.primary }}
                  >
                    {totalEmails > 0 ? Math.round((totalResponded / totalEmails) * 100) : 0}%
                  </p>
                </div>
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: '#8b5cf620' }}
                >
                  <ChartBarIcon className="w-6 h-6" style={{ color: '#8b5cf6' }} />
                </div>
              </div>
                             <div className="mt-4 flex items-center text-sm">
                 <ArrowTrendingUpIcon className="w-4 h-4 mr-1" style={{ color: '#8b5cf6' }} />
                 <span style={{ color: '#8b5cf6' }}>+8% this month</span>
               </div>
            </div>
          </div>

          {/* Target Progress Card */}
          <div 
            className="p-6 rounded-xl transition-all duration-300 hover:shadow-lg"
            style={{ backgroundColor: currentTheme.colors.primary[600] }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Your target is incomplete</h3>
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="white"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.48)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">48%</span>
                </div>
              </div>
              <p className="text-white/80 text-sm">
                You have completed 48% of the given target, you can also check your status. Click here
              </p>
            </div>
          </div>
        </div>
      ) : (
        <BusinessStats />
      )}

      {/* Recent Emails Section */}
      <div 
        className="p-6 rounded-xl transition-all duration-300"
        style={{ backgroundColor: currentTheme.colors.background.card }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 
            className="text-xl font-semibold transition-colors duration-300"
            style={{ color: currentTheme.colors.text.primary }}
          >
            Recent Emails
          </h2>
          <button
            onClick={handleSyncEmails}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10"
            style={{ 
              backgroundColor: currentTheme.colors.primary[500],
              color: 'white'
            }}
          >
            <ArrowPathIcon className="w-4 h-4" />
            <span>{t('dashboard.syncEmails')}</span>
          </button>
        </div>

        {emailsLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" 
              style={{ borderColor: currentTheme.colors.primary[600] }}></div>
          </div>
        ) : recentEmails?.data && recentEmails.data.length > 0 ? (
          <div className="space-y-4">
            {recentEmails.data.map((email: any) => (
              <div 
                key={email.id}
                className="flex items-center justify-between p-4 rounded-lg transition-all duration-200 hover:bg-white/5"
                style={{ borderColor: currentTheme.colors.border.secondary }}
              >
                <div className="flex items-center space-x-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(email.category)}`}>
                    {getCategoryLabel(email.category)}
                  </div>
                  <div>
                    <p 
                      className="font-medium transition-colors duration-300"
                      style={{ color: currentTheme.colors.text.primary }}
                    >
                      {email.subject}
                    </p>
                    <p 
                      className="text-sm transition-colors duration-300"
                      style={{ color: currentTheme.colors.text.muted }}
                    >
                      {email.from}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p 
                    className="text-sm transition-colors duration-300"
                    style={{ color: currentTheme.colors.text.muted }}
                  >
                    {new Date(email.date).toLocaleDateString()}
                  </p>
                  <p 
                    className="text-xs transition-colors duration-300"
                    style={{ color: currentTheme.colors.text.muted }}
                  >
                    {email.responded ? 'Responded' : 'Pending'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p 
              className="transition-colors duration-300"
              style={{ color: currentTheme.colors.text.muted }}
            >
              {t('dashboard.noRecentEmails')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}