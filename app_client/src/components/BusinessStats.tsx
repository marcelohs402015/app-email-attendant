import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { emailAPI } from '../services/api';
import {
  CurrencyDollarIcon,
  UsersIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

export default function BusinessStats() {
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

  const stats = businessStats?.data;
  
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
        <ChartBarIcon className="h-8 w-8 text-primary-600" />
        <h2 className="text-2xl font-bold text-gray-900">Business Statistics</h2>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(stats.totalRevenue || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClipboardDocumentListIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Quotations</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.quotationStats?.total || 0}</p>
              <p className="text-xs text-gray-500">
                {stats.quotationStats?.accepted || 0} aprovados
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarDaysIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Appointments</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.appointmentStats?.total || 0}</p>
              <p className="text-xs text-gray-500">
                {stats.appointmentStats?.completed || 0} completed
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UsersIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Customers</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.clientStats?.total || 0}</p>
              <p className="text-xs text-gray-500">
                {stats.clientStats?.withAppointments || 0} with appointments
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Performance by Category</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {(stats.categoryPerformance || []).map((category: any) => (
                <div key={category.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <div>
                      <p className="font-medium text-gray-900">{category.name}</p>
                      <p className="text-sm text-gray-500">
                        {category.servicesCount} services
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {formatCurrency(category.averagePrice || 0)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {category.quotationsCount || 0} quotations
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Service Status</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {/* Quotation Status */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Quotations</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-2xl font-semibold text-blue-600">{stats.quotationStats?.pending || 0}</p>
                    <p className="text-sm text-blue-700">Pendants</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-2xl font-semibold text-green-600">{stats.quotationStats?.accepted || 0}</p>
                    <p className="text-sm text-green-700">Accepted</p>
                  </div>
                </div>
              </div>

              {/* Appointment Status */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Appointments</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-2xl font-semibold text-yellow-600">{stats.appointmentStats?.scheduled || 0}</p>
                    <p className="text-sm text-yellow-700">Scheduled</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-2xl font-semibold text-purple-600">{stats.appointmentStats?.completed || 0}</p>
                    <p className="text-sm text-purple-700">Completed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Trend */}
      {revenueStats?.data && Array.isArray(revenueStats.data) && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Evolution (Last 6 Months)</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {revenueStats.data.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.period}</p>
                    <p className="text-sm text-gray-500">{item.quotations} quotations • {item.completed} completed</p>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(item.revenue)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Email Response Performance */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Service Performance</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.emailResponseTime?.totalEmails || 0}</p>
              <p className="text-sm text-gray-500">Total Emails</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{stats.emailResponseTime?.respondedEmails || 0}</p>
              <p className="text-sm text-gray-500">Answered</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">
                {Math.round(stats.emailResponseTime?.responseRate || 0)}%
              </p>
              <p className="text-sm text-gray-500">Response Rate</p>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full"
                style={{
                  width: `${stats.emailResponseTime?.responseRate || 0}%`
                }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}