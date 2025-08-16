import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import { AutomationMetrics as MetricsType } from '../types/api';

interface AutomationMetricsProps {
  metrics: MetricsType;
}

export default function AutomationMetrics({ metrics }: AutomationMetricsProps) {
  const { t } = useTranslation();
  const { currentTheme } = useTheme();

  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  // Calculate some trend data from period stats
  const currentPeriod = metrics.periodStats[metrics.periodStats.length - 1];
  const previousPeriod = metrics.periodStats[metrics.periodStats.length - 2];

  const trends = {
    processed: previousPeriod ? getPercentageChange(currentPeriod?.processed || 0, previousPeriod.processed) : 0,
    generated: previousPeriod ? getPercentageChange(currentPeriod?.generated || 0, previousPeriod.generated) : 0,
    approved: previousPeriod ? getPercentageChange(currentPeriod?.approved || 0, previousPeriod.approved) : 0,
  };

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
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
            className="text-lg font-medium flex items-center transition-colors duration-300"
            style={{ color: currentTheme.colors.text.primary }}
          >
            <ChartBarIcon 
              className="h-5 w-5 mr-2 transition-colors duration-300"
              style={{ color: currentTheme.colors.primary[600] }}
            />
            {t('automation.metrics.title')}
          </h3>
        </div>

        <div className="p-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
            <div className="text-center">
              <div 
                className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-lg transition-all duration-300"
                style={{ backgroundColor: currentTheme.colors.primary[600] }}
              >
                <EnvelopeIcon className="w-6 h-6 text-white" />
              </div>
              <p 
                className="text-2xl font-bold transition-colors duration-300"
                style={{ color: currentTheme.colors.text.primary }}
              >
                {metrics.emailsProcessed}
              </p>
              <p 
                className="text-sm transition-colors duration-300"
                style={{ color: currentTheme.colors.text.muted }}
              >
                {t('automation.metrics.emailsProcessed')}
              </p>
              {trends.processed !== 0 && (
                <div className={`flex items-center justify-center mt-1 text-xs ${
                  trends.processed > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  <ArrowTrendingUpIcon className={`w-3 h-3 mr-1 ${trends.processed < 0 ? 'transform rotate-180' : ''}`} />
                  {Math.abs(trends.processed).toFixed(1)}%
                </div>
              )}
            </div>

            <div className="text-center">
              <div 
                className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-lg transition-all duration-300"
                style={{ backgroundColor: currentTheme.colors.primary[600] }}
              >
                <ChartBarIcon className="w-6 h-6 text-white" />
              </div>
              <p 
                className="text-2xl font-bold transition-colors duration-300"
                style={{ color: currentTheme.colors.text.primary }}
              >
                {metrics.quotesGenerated}
              </p>
              <p 
                className="text-sm transition-colors duration-300"
                style={{ color: currentTheme.colors.text.muted }}
              >
                {t('automation.metrics.quotesGenerated')}
              </p>
              {trends.generated !== 0 && (
                <div className={`flex items-center justify-center mt-1 text-xs ${
                  trends.generated > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  <ArrowTrendingUpIcon className={`w-3 h-3 mr-1 ${trends.generated < 0 ? 'transform rotate-180' : ''}`} />
                  {Math.abs(trends.generated).toFixed(1)}%
                </div>
              )}
            </div>

            <div className="text-center">
              <div 
                className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-lg transition-all duration-300"
                style={{ backgroundColor: currentTheme.colors.primary[600] }}
              >
                <CheckCircleIcon className="w-6 h-6 text-white" />
              </div>
              <p 
                className="text-2xl font-bold transition-colors duration-300"
                style={{ color: currentTheme.colors.text.primary }}
              >
                {metrics.quotesApproved}
              </p>
              <p 
                className="text-sm transition-colors duration-300"
                style={{ color: currentTheme.colors.text.muted }}
              >
                {t('automation.metrics.quotesApproved')}
              </p>
              {trends.approved !== 0 && (
                <div className={`flex items-center justify-center mt-1 text-xs ${
                  trends.approved > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  <ArrowTrendingUpIcon className={`w-3 h-3 mr-1 ${trends.approved < 0 ? 'transform rotate-180' : ''}`} />
                  {Math.abs(trends.approved).toFixed(1)}%
                </div>
              )}
            </div>

            <div className="text-center">
              <div 
                className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-lg transition-all duration-300"
                style={{ backgroundColor: currentTheme.colors.primary[600] }}
              >
                <ClockIcon className="w-6 h-6 text-white" />
              </div>
              <p 
                className="text-2xl font-bold transition-colors duration-300"
                style={{ color: currentTheme.colors.text.primary }}
              >
                {metrics.responseTime < 60 ? 
                  `${metrics.responseTime}m` : 
                  `${(metrics.responseTime / 60).toFixed(1)}h`
                }
              </p>
              <p 
                className="text-sm transition-colors duration-300"
                style={{ color: currentTheme.colors.text.muted }}
              >
                {t('automation.metrics.responseTime')}
              </p>
            </div>

            <div className="text-center">
              <div 
                className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-lg transition-all duration-300"
                style={{ backgroundColor: currentTheme.colors.primary[600] }}
              >
                <ArrowTrendingUpIcon className="w-6 h-6 text-white" />
              </div>
              <p 
                className="text-2xl font-bold transition-colors duration-300"
                style={{ color: currentTheme.colors.text.primary }}
              >
                {metrics.conversionRate.toFixed(1)}%
              </p>
              <p 
                className="text-sm transition-colors duration-300"
                style={{ color: currentTheme.colors.text.muted }}
              >
                {t('automation.metrics.conversionRate')}
              </p>
            </div>
          </div>

          {/* Performance Bars */}
          <div className="space-y-4">
            <h4 
              className="text-sm font-medium transition-colors duration-300"
              style={{ color: currentTheme.colors.text.primary }}
            >
              {t('automation.metrics.performance')}
            </h4>
            
            <div className="space-y-3">
              {/* Approval Rate */}
              <div>
                <div className="flex justify-between text-sm">
                  <span 
                    className="transition-colors duration-300"
                    style={{ color: currentTheme.colors.text.muted }}
                  >
                    Approval Rate
                  </span>
                  <span 
                    className="font-medium transition-colors duration-300"
                    style={{ color: currentTheme.colors.text.primary }}
                  >
                    {metrics.quotesGenerated > 0 ? 
                      ((metrics.quotesApproved / metrics.quotesGenerated) * 100).toFixed(1) : 0
                    }%
                  </span>
                </div>
                <div 
                  className="w-full rounded-full h-2 transition-all duration-300"
                  style={{ backgroundColor: currentTheme.colors.border.primary }}
                >
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: currentTheme.colors.primary[600],
                      width: `${metrics.quotesGenerated > 0 ? 
                        (metrics.quotesApproved / metrics.quotesGenerated) * 100 : 0
                      }%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Processing Efficiency */}
              <div>
                <div className="flex justify-between text-sm">
                  <span 
                    className="transition-colors duration-300"
                    style={{ color: currentTheme.colors.text.muted }}
                  >
                    Processing Efficiency
                  </span>
                  <span 
                    className="font-medium transition-colors duration-300"
                    style={{ color: currentTheme.colors.text.primary }}
                  >
                    {metrics.emailsProcessed > 0 ? 
                      ((metrics.quotesGenerated / metrics.emailsProcessed) * 100).toFixed(1) : 0
                    }%
                  </span>
                </div>
                <div 
                  className="w-full rounded-full h-2 transition-all duration-300"
                  style={{ backgroundColor: currentTheme.colors.border.primary }}
                >
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: currentTheme.colors.primary[600],
                      width: `${metrics.emailsProcessed > 0 ? 
                        (metrics.quotesGenerated / metrics.emailsProcessed) * 100 : 0
                      }%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Average Confidence */}
              <div>
                <div className="flex justify-between text-sm">
                  <span 
                    className="transition-colors duration-300"
                    style={{ color: currentTheme.colors.text.muted }}
                  >
                    Average Confidence
                  </span>
                  <span 
                    className="font-medium transition-colors duration-300"
                    style={{ color: currentTheme.colors.text.primary }}
                  >
                    {metrics.averageConfidence.toFixed(1)}%
                  </span>
                </div>
                <div 
                  className="w-full rounded-full h-2 transition-all duration-300"
                  style={{ backgroundColor: currentTheme.colors.border.primary }}
                >
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: currentTheme.colors.primary[600],
                      width: `${metrics.averageConfidence}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Period Trends */}
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
            className="text-lg font-medium flex items-center transition-colors duration-300"
            style={{ color: currentTheme.colors.text.primary }}
          >
            <ArrowTrendingUpIcon 
              className="h-5 w-5 mr-2 transition-colors duration-300"
              style={{ color: currentTheme.colors.primary[600] }}
            />
            {t('automation.metrics.trends')}
          </h3>
        </div>

        <div className="p-6">
          {metrics.periodStats.length > 0 ? (
            <div className="space-y-4">
              {/* Period Stats Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y transition-all duration-300">
                  <thead 
                    className="transition-all duration-300"
                    style={{ backgroundColor: currentTheme.colors.background.primary }}
                  >
                    <tr>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300"
                        style={{ color: currentTheme.colors.text.muted }}
                      >
                        {t('automation.metrics.period')}
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300"
                        style={{ color: currentTheme.colors.text.muted }}
                      >
                        {t('automation.metrics.processed')}
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300"
                        style={{ color: currentTheme.colors.text.muted }}
                      >
                        {t('automation.metrics.generated')}
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300"
                        style={{ color: currentTheme.colors.text.muted }}
                      >
                        {t('automation.metrics.approved')}
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300"
                        style={{ color: currentTheme.colors.text.muted }}
                      >
                        {t('automation.metrics.sent')}
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300"
                        style={{ color: currentTheme.colors.text.muted }}
                      >
                        Conversion
                      </th>
                    </tr>
                  </thead>
                  <tbody 
                    className="divide-y transition-all duration-300"
                    style={{
                      backgroundColor: currentTheme.colors.background.card,
                      borderColor: currentTheme.colors.border.primary
                    }}
                  >
                    {metrics.periodStats.slice(-6).map((period, index) => {
                      const conversionRate = period.generated > 0 ? 
                        (period.approved / period.generated) * 100 : 0;
                      
                      return (
                        <tr 
                          key={index} 
                          className="transition-all duration-200"
                          style={{ 
                            backgroundColor: currentTheme.colors.background.card,
                            borderColor: currentTheme.colors.border.primary
                          }}
                        >
                          <td 
                            className="px-6 py-4 whitespace-nowrap text-sm font-medium transition-colors duration-300"
                            style={{ color: currentTheme.colors.text.primary }}
                          >
                            {period.period}
                          </td>
                          <td 
                            className="px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300"
                            style={{ color: currentTheme.colors.text.primary }}
                          >
                            {period.processed}
                          </td>
                          <td 
                            className="px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300"
                            style={{ color: currentTheme.colors.text.primary }}
                          >
                            {period.generated}
                          </td>
                          <td 
                            className="px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300"
                            style={{ color: currentTheme.colors.text.primary }}
                          >
                            {period.approved}
                          </td>
                          <td 
                            className="px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300"
                            style={{ color: currentTheme.colors.text.primary }}
                          >
                            {period.sent}
                          </td>
                          <td 
                            className="px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300"
                            style={{ color: currentTheme.colors.text.primary }}
                          >
                            <span 
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-300"
                              style={{
                                backgroundColor: currentTheme.colors.primary[600],
                                color: '#ffffff'
                              }}
                            >
                              {conversionRate.toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Simple Chart Visualization */}
              <div className="mt-6">
                <h4 
                  className="text-sm font-medium mb-4 transition-colors duration-300"
                  style={{ color: currentTheme.colors.text.primary }}
                >
                  Processing Volume Trend
                </h4>
                <div className="flex items-end space-x-2 h-32">
                  {metrics.periodStats.slice(-8).map((period, index) => {
                    const maxValue = Math.max(...metrics.periodStats.map(p => p.processed));
                    const height = maxValue > 0 ? (period.processed / maxValue) * 100 : 0;
                    
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full rounded-t relative transition-all duration-300" 
                          style={{ 
                            height: '120px',
                            backgroundColor: currentTheme.colors.border.primary
                          }}
                        >
                          <div 
                            className="absolute bottom-0 w-full rounded-t transition-all duration-300 flex items-end justify-center"
                            style={{ 
                              height: `${height}%`,
                              backgroundColor: currentTheme.colors.primary[600]
                            }}
                          >
                            <span className="text-xs text-white font-medium pb-1">
                              {period.processed}
                            </span>
                          </div>
                        </div>
                        <span 
                          className="text-xs mt-1 text-center transition-colors duration-300"
                          style={{ color: currentTheme.colors.text.muted }}
                        >
                          {period.period.split(' ')[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <ChartBarIcon 
                className="mx-auto h-12 w-12 transition-colors duration-300"
                style={{ color: currentTheme.colors.text.muted }}
              />
              <h3 
                className="mt-2 text-sm font-medium transition-colors duration-300"
                style={{ color: currentTheme.colors.text.primary }}
              >
                No trend data available
              </h3>
              <p 
                className="mt-1 text-sm transition-colors duration-300"
                style={{ color: currentTheme.colors.text.muted }}
              >
                Data will appear here as automation processes more emails
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}