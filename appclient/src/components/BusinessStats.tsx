import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '../contexts/ThemeContext';
import { emailAPI } from '../services/api';
import {
  CurrencyDollarIcon,
  UsersIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

export default function BusinessStats() {
  const { currentTheme } = useTheme();
  const { data: businessStats, isLoading, error } = useQuery({
    queryKey: ['businessStats'],
    queryFn: emailAPI.getBusinessStats,
  });

  const { data: revenueStats } = useQuery({
    queryKey: ['revenueStats'],
    queryFn: () => emailAPI.getRevenueStats('monthly'),
  });


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">Error loading business statistics</p>
      </div>
    );
  }

  const stats = businessStats?.data as any;
  
  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No statistics available</p>
        {error && <p className="text-red-500 text-sm mt-2">Erro: {String(error)}</p>}
      </div>
    );
  }

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <ChartBarIcon className={`h-8 w-8 ${
          currentTheme.type === 'purple' ? 'text-purple-400' : 'text-primary-600'
        }`} />
        <h2 className={`text-2xl font-bold ${
          currentTheme.type === 'purple' ? 'text-white' : 'text-gray-900'
        }`}>Business Statistics</h2>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`rounded-lg shadow p-6 ${
          currentTheme.type === 'purple' ? 'darkone-card' : 'bg-white'
        }`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${
                currentTheme.type === 'purple' ? 'text-gray-300' : 'text-gray-500'
              }`}>Total Revenue</p>
              <p className={`text-2xl font-semibold ${
                currentTheme.type === 'purple' ? 'text-white' : 'text-gray-900'
              }`}>
                {formatCurrency(stats.totalRevenue || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className={`rounded-lg shadow p-6 ${
          currentTheme.type === 'purple' ? 'darkone-card' : 'bg-white'
        }`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClipboardDocumentListIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${
                currentTheme.type === 'purple' ? 'text-gray-300' : 'text-gray-500'
              }`}>Quotations</p>
              <p className={`text-2xl font-semibold ${
                currentTheme.type === 'purple' ? 'text-white' : 'text-gray-900'
              }`}>{stats.quotationStats?.total || 0}</p>
              <p className={`text-xs ${
                currentTheme.type === 'purple' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {stats.quotationStats?.accepted || 0} aprovados
              </p>
            </div>
          </div>
        </div>

        <div className={`rounded-lg shadow p-6 ${
          currentTheme.type === 'purple' ? 'darkone-card' : 'bg-white'
        }`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarDaysIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${
                currentTheme.type === 'purple' ? 'text-gray-300' : 'text-gray-500'
              }`}>Appointments</p>
              <p className={`text-2xl font-semibold ${
                currentTheme.type === 'purple' ? 'text-white' : 'text-gray-900'
              }`}>{stats.appointmentStats?.total || 0}</p>
              <p className={`text-xs ${
                currentTheme.type === 'purple' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {stats.appointmentStats?.completed || 0} completed
              </p>
            </div>
          </div>
        </div>

        <div className={`rounded-lg shadow p-6 ${
          currentTheme.type === 'purple' ? 'darkone-card' : 'bg-white'
        }`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UsersIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${
                currentTheme.type === 'purple' ? 'text-gray-300' : 'text-gray-500'
              }`}>Customers</p>
              <p className={`text-2xl font-semibold ${
                currentTheme.type === 'purple' ? 'text-white' : 'text-gray-900'
              }`}>{stats.clientStats?.total || 0}</p>
              <p className={`text-xs ${
                currentTheme.type === 'purple' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {stats.clientStats?.withAppointments || 0} with appointments
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div 
          className={`rounded-lg shadow transition-all duration-300 ${
            currentTheme.type === 'purple' ? 'darkone-card' : 'bg-white'
          }`}
          style={{ backgroundColor: currentTheme.colors.background.card }}
        >
          <div 
            className="px-6 py-4 border-b transition-all duration-300"
            style={{ borderColor: currentTheme.colors.border.primary }}
          >
            <h3 
              className="text-lg font-semibold transition-colors duration-300"
              style={{ color: currentTheme.colors.text.primary }}
            >
              Performance by Category
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {(stats.categoryPerformance || []).map((category: any) => (
                <div 
                  key={category.id} 
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 ${
                    currentTheme.type === 'purple' ? 'darkone-glass' : ''
                  }`}
                  style={{
                    backgroundColor: currentTheme.colors.background.primary,
                    borderColor: currentTheme.colors.border.primary
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <div>
                      <p 
                        className="font-medium transition-colors duration-300"
                        style={{ color: currentTheme.colors.text.primary }}
                      >
                        {category.name}
                      </p>
                      <p 
                        className="text-sm transition-colors duration-300"
                        style={{ color: currentTheme.colors.text.muted }}
                      >
                        {category.servicesCount} services
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p 
                      className="font-medium transition-colors duration-300"
                      style={{ color: currentTheme.colors.text.primary }}
                    >
                      {formatCurrency(category.averagePrice || 0)}
                    </p>
                    <p 
                      className="text-sm transition-colors duration-300"
                      style={{ color: currentTheme.colors.text.muted }}
                    >
                      {category.quotationsCount || 0} quotations
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <div 
          className={`rounded-lg shadow transition-all duration-300 ${
            currentTheme.type === 'purple' ? 'darkone-card' : 'bg-white'
          }`}
          style={{ backgroundColor: currentTheme.colors.background.card }}
        >
          <div 
            className="px-6 py-4 border-b transition-all duration-300"
            style={{ borderColor: currentTheme.colors.border.primary }}
          >
            <h3 
              className="text-lg font-semibold transition-colors duration-300"
              style={{ color: currentTheme.colors.text.primary }}
            >
              Service Status
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {/* Quotation Status */}
              <div>
                <h4 
                  className="text-sm font-medium mb-2 transition-colors duration-300"
                  style={{ color: currentTheme.colors.text.primary }}
                >
                  Quotations
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div 
                    className="p-3 rounded-lg transition-all duration-300"
                    style={{ backgroundColor: currentTheme.colors.primary[600] }}
                  >
                    <p className="text-2xl font-semibold text-white">{stats.quotationStats?.pending || 0}</p>
                    <p className="text-sm text-blue-100">Pendants</p>
                  </div>
                  <div 
                    className="p-3 rounded-lg transition-all duration-300"
                    style={{ backgroundColor: currentTheme.colors.primary[600] }}
                  >
                    <p className="text-2xl font-semibold text-white">{stats.quotationStats?.accepted || 0}</p>
                    <p className="text-sm text-green-100">Accepted</p>
                  </div>
                </div>
              </div>

              {/* Appointment Status */}
              <div>
                <h4 
                  className="text-sm font-medium mb-2 transition-colors duration-300"
                  style={{ color: currentTheme.colors.text.primary }}
                >
                  Appointments
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div 
                    className="p-3 rounded-lg transition-all duration-300"
                    style={{ backgroundColor: currentTheme.colors.primary[600] }}
                  >
                    <p className="text-2xl font-semibold text-white">{stats.appointmentStats?.scheduled || 0}</p>
                    <p className="text-sm text-yellow-100">Scheduled</p>
                  </div>
                  <div 
                    className="p-3 rounded-lg transition-all duration-300"
                    style={{ backgroundColor: currentTheme.colors.primary[600] }}
                  >
                    <p className="text-2xl font-semibold text-white">{stats.appointmentStats?.completed || 0}</p>
                    <p className="text-sm text-purple-100">Completed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Trend */}
      {revenueStats?.data && Array.isArray(revenueStats.data) && (
        <div 
          className={`rounded-lg shadow transition-all duration-300 ${
            currentTheme.type === 'purple' ? 'darkone-card' : 'bg-white'
          }`}
          style={{ backgroundColor: currentTheme.colors.background.card }}
        >
          <div 
            className="px-6 py-4 border-b transition-all duration-300"
            style={{ borderColor: currentTheme.colors.border.primary }}
          >
            <h3 
              className="text-lg font-semibold transition-colors duration-300"
              style={{ color: currentTheme.colors.text.primary }}
            >
              Revenue Evolution (Last 6 Months)
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {revenueStats.data.map((item: any, index: number) => (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                    currentTheme.type === 'purple' ? 'darkone-glass' : 'bg-gray-50'
                  }`}
                  style={{ backgroundColor: currentTheme.colors.background.primary }}
                >
                  <div>
                    <p 
                      className="font-medium transition-colors duration-300"
                      style={{ color: currentTheme.colors.text.primary }}
                    >
                      {item.period}
                    </p>
                    <p 
                      className="text-sm transition-colors duration-300"
                      style={{ color: currentTheme.colors.text.muted }}
                    >
                      {item.quotations} quotations • {item.completed} completed
                    </p>
                  </div>
                  <p 
                    className="text-lg font-semibold transition-colors duration-300"
                    style={{ color: currentTheme.colors.text.primary }}
                  >
                    {formatCurrency(item.revenue)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Email Response Performance */}
      <div 
        className={`rounded-lg shadow transition-all duration-300 ${
          currentTheme.type === 'purple' ? 'darkone-card' : 'bg-white'
        }`}
        style={{ backgroundColor: currentTheme.colors.background.card }}
      >
        <div 
          className="px-6 py-4 border-b transition-all duration-300"
          style={{ borderColor: currentTheme.colors.border.primary }}
        >
          <h3 
            className="text-lg font-semibold transition-colors duration-300"
            style={{ color: currentTheme.colors.text.primary }}
          >
            Service Performance
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p 
                className="text-3xl font-bold transition-colors duration-300"
                style={{ color: currentTheme.colors.primary[600] }}
              >
                {stats.emailResponseTime?.totalEmails || 0}
              </p>
              <p 
                className="text-sm transition-colors duration-300"
                style={{ color: currentTheme.colors.text.muted }}
              >
                Total Emails
              </p>
            </div>
            <div className="text-center">
              <p 
                className="text-3xl font-bold transition-colors duration-300"
                style={{ color: currentTheme.colors.primary[600] }}
              >
                {stats.emailResponseTime?.respondedEmails || 0}
              </p>
              <p 
                className="text-sm transition-colors duration-300"
                style={{ color: currentTheme.colors.text.muted }}
              >
                Answered
              </p>
            </div>
            <div className="text-center">
              <p 
                className="text-3xl font-bold transition-colors duration-300"
                style={{ color: currentTheme.colors.primary[600] }}
              >
                {Math.round(stats.emailResponseTime?.responseRate || 0)}%
              </p>
              <p 
                className="text-sm transition-colors duration-300"
                style={{ color: currentTheme.colors.text.muted }}
              >
                Response Rate
              </p>
            </div>
          </div>
          
          <div className="mt-4">
            <div 
              className="rounded-full h-3 transition-all duration-300"
              style={{ backgroundColor: currentTheme.colors.border.primary }}
            >
              <div
                className="h-3 rounded-full transition-all duration-300"
                style={{
                  background: `linear-gradient(to right, ${currentTheme.colors.primary[500]}, ${currentTheme.colors.primary[600]})`,
                  width: `${stats.emailResponseTime?.responseRate || 0}%`
                }}
              />
            </div>
            <div 
              className="flex justify-between text-sm mt-1 transition-colors duration-300"
              style={{ color: currentTheme.colors.text.muted }}
            >
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}