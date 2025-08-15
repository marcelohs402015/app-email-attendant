import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import { AutomationMetrics as MetricsType } from '../types/api';

interface AutomationMetricsProps {
  metrics: MetricsType;
}

export default function AutomationMetrics({ metrics }: AutomationMetricsProps) {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState('all');

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
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-2" />
            {t('automation.metrics.title')}
          </h3>
        </div>

        <div className="p-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-lg">
                <EnvelopeIcon className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{metrics.emailsProcessed}</p>
              <p className="text-sm text-gray-600">{t('automation.metrics.emailsProcessed')}</p>
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
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-yellow-100 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{metrics.quotesGenerated}</p>
              <p className="text-sm text-gray-600">{t('automation.metrics.quotesGenerated')}</p>
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
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-green-100 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{metrics.quotesApproved}</p>
              <p className="text-sm text-gray-600">{t('automation.metrics.quotesApproved')}</p>
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
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-lg">
                <ClockIcon className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {metrics.responseTime < 60 ? 
                  `${metrics.responseTime}m` : 
                  `${(metrics.responseTime / 60).toFixed(1)}h`
                }
              </p>
              <p className="text-sm text-gray-600">{t('automation.metrics.responseTime')}</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-indigo-100 rounded-lg">
                <ArrowTrendingUpIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{metrics.conversionRate.toFixed(1)}%</p>
              <p className="text-sm text-gray-600">{t('automation.metrics.conversionRate')}</p>
            </div>
          </div>

          {/* Performance Bars */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">{t('automation.metrics.performance')}</h4>
            
            <div className="space-y-3">
              {/* Approval Rate */}
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Approval Rate</span>
                  <span className="font-medium">
                    {metrics.quotesGenerated > 0 ? 
                      ((metrics.quotesApproved / metrics.quotesGenerated) * 100).toFixed(1) : 0
                    }%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
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
                  <span className="text-gray-600">Processing Efficiency</span>
                  <span className="font-medium">
                    {metrics.emailsProcessed > 0 ? 
                      ((metrics.quotesGenerated / metrics.emailsProcessed) * 100).toFixed(1) : 0
                    }%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
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
                  <span className="text-gray-600">Average Confidence</span>
                  <span className="font-medium">{metrics.averageConfidence.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      metrics.averageConfidence >= 80 ? 'bg-green-600' :
                      metrics.averageConfidence >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${metrics.averageConfidence}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Period Trends */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <ArrowTrendingUpIcon className="h-5 w-5 mr-2" />
            {t('automation.metrics.trends')}
          </h3>
        </div>

        <div className="p-6">
          {metrics.periodStats.length > 0 ? (
            <div className="space-y-4">
              {/* Period Stats Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('automation.metrics.period')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('automation.metrics.processed')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('automation.metrics.generated')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('automation.metrics.approved')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('automation.metrics.sent')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Conversion
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {metrics.periodStats.slice(-6).map((period, index) => {
                      const conversionRate = period.generated > 0 ? 
                        (period.approved / period.generated) * 100 : 0;
                      
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {period.period}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {period.processed}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {period.generated}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {period.approved}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {period.sent}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              conversionRate >= 80 ? 'bg-green-100 text-green-800' :
                              conversionRate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
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
                <h4 className="text-sm font-medium text-gray-900 mb-4">Processing Volume Trend</h4>
                <div className="flex items-end space-x-2 h-32">
                  {metrics.periodStats.slice(-8).map((period, index) => {
                    const maxValue = Math.max(...metrics.periodStats.map(p => p.processed));
                    const height = maxValue > 0 ? (period.processed / maxValue) * 100 : 0;
                    
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div className="w-full bg-gray-200 rounded-t relative" style={{ height: '120px' }}>
                          <div className="absolute bottom-0 w-full bg-blue-500 rounded-t transition-all duration-300 flex items-end justify-center"
                               style={{ height: `${height}%` }}>
                            <span className="text-xs text-white font-medium pb-1">
                              {period.processed}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-600 mt-1 text-center">
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
              <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No trend data available</h3>
              <p className="mt-1 text-sm text-gray-500">
                Data will appear here as automation processes more emails
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}