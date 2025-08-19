import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CalendarDaysIcon,
  XMarkIcon,
  CheckIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { emailAPI } from '../services/api';
import { Appointment } from '../types/api';
import { format, addDays, subDays, isSameDay, startOfWeek, addWeeks, subWeeks } from 'date-fns';
import { enUS } from 'date-fns/locale';

interface AppointmentFormData {
  clientId: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  notes: string;
}

const Calendar: React.FC = () => {
  const { t } = useTranslation();
  const { currentTheme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [selectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [formData, setFormData] = useState<AppointmentFormData>({
    clientId: '',
    title: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '10:00',
    location: '',
    notes: ''
  });

  const queryClient = useQueryClient();

  const { data: appointmentsResponse, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => emailAPI.getAppointments(),
  });

  const { data: clientsResponse } = useQuery({
    queryKey: ['clients'],
    queryFn: () => emailAPI.getClients(),
  });

  const createMutation = useMutation({
    mutationFn: emailAPI.createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Appointment>) => 
      emailAPI.updateAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: emailAPI.deleteAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  const appointments = appointmentsResponse?.data || [];
  const clients = clientsResponse?.data || [];

  const resetForm = () => {
    setFormData({
      clientId: '',
      title: '',
      description: '',
      date: format(selectedDate, 'yyyy-MM-dd'),
      startTime: '09:00',
      endTime: '10:00',
      location: '',
      notes: ''
    });
    setEditingAppointment(null);
    setIsModalOpen(false);
  };

  const handleOpenModal = (appointment?: Appointment, date?: Date) => {
    if (appointment) {
      setEditingAppointment(appointment);
      setFormData({
        clientId: appointment.clientId,
        title: appointment.title,
        description: appointment.description || '',
        date: appointment.date,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        location: appointment.location || '',
        notes: appointment.notes || ''
      });
    } else {
      resetForm();
      if (date) {
        setFormData(prev => ({ ...prev, date: format(date, 'yyyy-MM-dd') }));
      }
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedClient = clients.find((c: any) => c.id === formData.clientId);
    if (!selectedClient) return;

    const appointmentData = {
      ...formData,
      client: selectedClient,
      status: 'scheduled' as const
    };

    if (editingAppointment) {
      updateMutation.mutate({
        id: editingAppointment.id,
        ...appointmentData
      });
    } else {
      createMutation.mutate(appointmentData as any);
    }
  };

  const handleDelete = (appointmentId: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      deleteMutation.mutate(appointmentId as any);
    }
  };

  const handleStatusChange = (appointmentId: string, newStatus: Appointment['status']) => {
    updateMutation.mutate({
      id: appointmentId,
      status: newStatus
    });
  };

  // Removed unused getStatusColor function

  const getStatusLabel = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled': return t('calendar.status.scheduled');
      case 'confirmed': return t('calendar.status.confirmed');
      case 'in_progress': return t('calendar.status.in_progress');
      case 'completed': return t('calendar.status.completed');
      case 'cancelled': return t('calendar.status.cancelled');
      default: return status;
    }
  };

  const getWeekDays = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return appointments.filter((apt: any) => apt.date === dateString);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(direction === 'prev' ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1));
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    setCurrentDate(direction === 'prev' ? subDays(currentDate, 1) : addDays(currentDate, 1));
  };

  if (appointmentsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 
            className="text-2xl font-bold transition-colors duration-300"
            style={{ color: currentTheme.colors.text.primary }}
          >
            {t('calendar.title')}
          </h1>
          <p 
            className="mt-1 text-sm transition-colors duration-300"
            style={{ color: currentTheme.colors.text.muted }}
          >
            {t('calendar.description')}
          </p>
        </div>
        <div className="flex space-x-2">
          <div 
            className="flex rounded-lg p-1 transition-all duration-300"
            style={{ backgroundColor: currentTheme.colors.background.primary }}
          >
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
                viewMode === 'week' ? 'shadow-sm' : ''
              }`}
              style={{
                backgroundColor: viewMode === 'week' 
                  ? currentTheme.colors.background.card 
                  : 'transparent',
                color: viewMode === 'week' 
                  ? currentTheme.colors.text.primary 
                  : currentTheme.colors.text.muted
              }}
            >
              {t('calendar.week')}
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
                viewMode === 'day' ? 'shadow-sm' : ''
              }`}
              style={{
                backgroundColor: viewMode === 'day' 
                  ? currentTheme.colors.background.card 
                  : 'transparent',
                color: viewMode === 'day' 
                  ? currentTheme.colors.text.primary 
                  : currentTheme.colors.text.muted
              }}
            >
              {t('calendar.day')}
            </button>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center px-4 py-2 text-white text-sm font-medium rounded-md transition-all duration-200"
            style={{ backgroundColor: currentTheme.colors.primary[600] }}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            {t('calendar.newAppointment')}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div 
        className={`flex items-center justify-between rounded-lg shadow-sm p-4 transition-all duration-300 ${
          currentTheme.type === 'purple' ? 'darkone-card' : 'bg-white'
        }`}
        style={{ backgroundColor: currentTheme.colors.background.card }}
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={() => viewMode === 'week' ? navigateWeek('prev') : navigateDay('prev')}
            className={`p-2 transition-colors duration-200 ${
              currentTheme.type === 'purple' ? 'darkone-hover-white' : 'hover:text-gray-600'
            }`}
            style={{ color: currentTheme.colors.text.muted }}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <h2 
            className="text-lg font-semibold transition-colors duration-300"
            style={{ color: currentTheme.colors.text.primary }}
          >
            {viewMode === 'week' 
              ? format(currentDate, "'Week of' MMMM d", { locale: enUS })
              : format(currentDate, "EEEE, MMMM d, yyyy", { locale: enUS })
            }
          </h2>
          <button
            onClick={() => viewMode === 'week' ? navigateWeek('next') : navigateDay('next')}
            className={`p-2 transition-colors duration-200 ${
              currentTheme.type === 'purple' ? 'darkone-hover-white' : 'hover:text-gray-600'
            }`}
            style={{ color: currentTheme.colors.text.muted }}
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
        <button
          onClick={() => setCurrentDate(new Date())}
          className={`px-3 py-1 text-sm font-medium transition-colors duration-200 ${
            currentTheme.type === 'purple' ? 'darkone-hover-primary' : 'hover:text-primary-700'
          }`}
          style={{ color: currentTheme.colors.primary[600] }}
        >
          Hoje
        </button>
      </div>

      {/* Calendar View */}
      <div 
        className={`shadow-sm rounded-lg overflow-hidden transition-all duration-300 ${
          currentTheme.type === 'purple' ? 'darkone-card' : 'bg-white'
        }`}
        style={{ backgroundColor: currentTheme.colors.background.card }}
      >
        {viewMode === 'week' ? (
          <div 
            className="grid grid-cols-7 gap-px transition-all duration-300"
            style={{ backgroundColor: currentTheme.colors.border.primary }}
          >
            {getWeekDays().map((day, index) => {
              const dayAppointments = getAppointmentsForDate(day);
              const isToday = isSameDay(day, new Date());
              
              return (
                <div 
                  key={index} 
                  className="min-h-[200px] transition-all duration-300"
                  style={{ backgroundColor: currentTheme.colors.background.primary }}
                >
                  <div 
                    className={`p-2 text-center border-b transition-all duration-300 ${
                      isToday ? '' : ''
                    }`}
                    style={{
                      backgroundColor: isToday 
                        ? currentTheme.colors.primary[600] 
                        : currentTheme.colors.background.primary,
                      color: isToday 
                        ? '#ffffff' 
                        : currentTheme.colors.text.primary,
                      borderColor: currentTheme.colors.border.primary
                    }}
                  >
                    <div className="text-xs font-medium">
                      {format(day, 'EEE', { locale: enUS })}
                    </div>
                    <div 
                      className={`text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mx-auto mt-1 transition-all duration-300 ${
                        isToday ? '' : ''
                      }`}
                      style={{
                        backgroundColor: isToday 
                          ? '#ffffff' 
                          : 'transparent',
                        color: isToday 
                          ? currentTheme.colors.primary[600] 
                          : currentTheme.colors.text.primary
                      }}
                    >
                      {format(day, 'd')}
                    </div>
                  </div>
                  <div className="p-2 space-y-1">
                    {dayAppointments.map((appointment: any) => (
                      <div
                        key={appointment.id}
                        className="text-xs p-2 rounded cursor-pointer transition-all duration-200"
                        style={{
                          backgroundColor: currentTheme.colors.primary[600],
                          borderColor: currentTheme.colors.primary[600],
                          border: '1px solid'
                        }}
                        onClick={() => handleOpenModal(appointment)}
                      >
                        <div 
                          className="font-medium truncate transition-colors duration-300"
                          style={{ color: '#ffffff' }}
                        >
                          {appointment.startTime} - {appointment.title}
                        </div>
                        <div 
                          className="truncate transition-colors duration-300"
                          style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                        >
                          {appointment.client.name}
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => handleOpenModal(undefined, day)}
                      className={`w-full text-xs py-1 border-2 border-dashed rounded transition-all duration-200 ${
                        currentTheme.type === 'purple' ? 'darkone-hover-primary' : 'hover:text-primary-600'
                      }`}
                      style={{
                        color: currentTheme.colors.text.muted,
                        borderColor: currentTheme.colors.border.primary
                      }}
                    >
                      + Adicionar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6">
            <div className="space-y-4">
              {getAppointmentsForDate(currentDate).map((appointment: any) => (
                <div
                  key={appointment.id}
                  className={`border rounded-lg p-4 hover:shadow-md transition-all duration-300 ${
                    currentTheme.type === 'purple' ? 'darkone-glass' : ''
                  }`}
                  style={{
                    backgroundColor: currentTheme.colors.background.primary,
                    borderColor: currentTheme.colors.border.primary
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="flex items-center text-sm transition-colors duration-300"
                          style={{ color: currentTheme.colors.text.muted }}
                        >
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {appointment.startTime} - {appointment.endTime}
                        </div>
                        <span 
                          className="inline-block px-2 py-1 text-xs font-medium rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: currentTheme.colors.primary[600],
                            color: '#ffffff'
                          }}
                        >
                          {getStatusLabel(appointment.status)}
                        </span>
                      </div>
                      
                      <h3 
                        className="text-lg font-medium mt-2 transition-colors duration-300"
                        style={{ color: currentTheme.colors.text.primary }}
                      >
                        {appointment.title}
                      </h3>
                      
                      <div 
                        className="flex items-center text-sm mt-1 transition-colors duration-300"
                        style={{ color: currentTheme.colors.text.muted }}
                      >
                        <UserIcon className="h-4 w-4 mr-1" />
                        {appointment.client.name}
                      </div>
                      
                      {appointment.location && (
                        <div 
                          className="flex items-center text-sm mt-1 transition-colors duration-300"
                          style={{ color: currentTheme.colors.text.muted }}
                        >
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          {appointment.location}
                        </div>
                      )}
                      
                      {appointment.description && (
                        <p 
                          className="text-sm mt-2 transition-colors duration-300"
                          style={{ color: currentTheme.colors.text.muted }}
                        >
                          {appointment.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {appointment.status === 'scheduled' && (
                        <button
                          onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                          className="px-2 py-1 text-xs rounded transition-all duration-200"
                          style={{
                            backgroundColor: currentTheme.colors.primary[600],
                            color: '#ffffff'
                          }}
                        >
                          Confirmar
                        </button>
                      )}
                      {appointment.status === 'confirmed' && (
                        <button
                          onClick={() => handleStatusChange(appointment.id, 'completed')}
                          className="px-2 py-1 text-xs rounded transition-all duration-200"
                          style={{
                            backgroundColor: currentTheme.colors.background.primary,
                            color: currentTheme.colors.text.primary,
                            borderColor: currentTheme.colors.border.primary,
                            border: '1px solid'
                          }}
                        >
                          Concluir
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenModal(appointment)}
                        className={`p-1 transition-colors duration-200 ${
                          currentTheme.type === 'purple' ? 'darkone-hover-primary' : 'hover:text-primary-600'
                        }`}
                        style={{ color: currentTheme.colors.text.muted }}
                        title="Editar"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(appointment.id)}
                        className={`p-1 transition-colors duration-200 ${
                          currentTheme.type === 'purple' ? 'darkone-hover-red' : 'hover:text-red-600'
                        }`}
                        style={{ color: currentTheme.colors.text.muted }}
                        title="Excluir"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {getAppointmentsForDate(currentDate).length === 0 && (
                <div className="text-center py-12">
                  <CalendarDaysIcon 
                    className="mx-auto h-12 w-12 transition-colors duration-300"
                    style={{ color: currentTheme.colors.text.muted }}
                  />
                  <h3 
                    className="mt-2 text-sm font-medium transition-colors duration-300"
                    style={{ color: currentTheme.colors.text.primary }}
                  >
                    No appointments
                  </h3>
                  <p 
                    className="mt-1 text-sm transition-colors duration-300"
                    style={{ color: currentTheme.colors.text.muted }}
                  >
                    No appointments for this day.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => handleOpenModal(undefined, currentDate)}
                      className="inline-flex items-center px-4 py-2 text-white text-sm font-medium rounded-md transition-all duration-200"
                      style={{ backgroundColor: currentTheme.colors.primary[600] }}
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Criar Agendamento
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div 
              className={`inline-block align-bottom rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 ${
                currentTheme.type === 'purple' ? 'darkone-card' : 'bg-white'
              }`}
              style={{ backgroundColor: currentTheme.colors.background.card }}
            >
              <form onSubmit={handleSubmit}>
                <div className="flex items-center justify-between mb-4">
                  <h3 
                    className="text-lg font-medium transition-colors duration-300"
                    style={{ color: currentTheme.colors.text.primary }}
                  >
                    {editingAppointment ? 'Edit Appointment' : 'New Appointment'}
                  </h3>
                  <button
                    type="button"
                    onClick={resetForm}
                    className={`transition-colors duration-200 ${
                      currentTheme.type === 'purple' ? 'darkone-hover-white' : 'hover:text-gray-600'
                    }`}
                    style={{ color: currentTheme.colors.text.muted }}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label 
                      className="block text-sm font-medium mb-1 transition-colors duration-300"
                      style={{ color: currentTheme.colors.text.primary }}
                    >
                      Cliente *
                    </label>
                    <select
                      required
                      value={formData.clientId}
                      onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      style={{
                        backgroundColor: currentTheme.colors.background.primary,
                        color: currentTheme.colors.text.primary,
                        borderColor: currentTheme.colors.border.primary
                      }}
                    >
                      <option value="">Selecione um cliente</option>
                      {clients.map((client: any) => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label 
                      className="block text-sm font-medium mb-1 transition-colors duration-300"
                      style={{ color: currentTheme.colors.text.primary }}
                    >
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      style={{
                        backgroundColor: currentTheme.colors.background.primary,
                        color: currentTheme.colors.text.primary,
                        borderColor: currentTheme.colors.border.primary
                      }}
                      placeholder="Appointment title"
                    />
                  </div>

                  <div>
                    <label 
                      className="block text-sm font-medium mb-1 transition-colors duration-300"
                      style={{ color: currentTheme.colors.text.primary }}
                    >
                      Data *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      style={{
                        backgroundColor: currentTheme.colors.background.primary,
                        color: currentTheme.colors.text.primary,
                        borderColor: currentTheme.colors.border.primary
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label 
                        className="block text-sm font-medium mb-1 transition-colors duration-300"
                        style={{ color: currentTheme.colors.text.primary }}
                      >
                        Start Time *
                      </label>
                      <input
                        type="time"
                        required
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                        style={{
                          backgroundColor: currentTheme.colors.background.primary,
                          color: currentTheme.colors.text.primary,
                          borderColor: currentTheme.colors.border.primary
                        }}
                      />
                    </div>

                    <div>
                      <label 
                        className="block text-sm font-medium mb-1 transition-colors duration-300"
                        style={{ color: currentTheme.colors.text.primary }}
                      >
                        End Time *
                      </label>
                      <input
                        type="time"
                        required
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                        style={{
                          backgroundColor: currentTheme.colors.background.primary,
                          color: currentTheme.colors.text.primary,
                          borderColor: currentTheme.colors.border.primary
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label 
                      className="block text-sm font-medium mb-1 transition-colors duration-300"
                      style={{ color: currentTheme.colors.text.primary }}
                    >
                      Local
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      style={{
                        backgroundColor: currentTheme.colors.background.primary,
                        color: currentTheme.colors.text.primary,
                        borderColor: currentTheme.colors.border.primary
                      }}
                      placeholder="Address or service location"
                    />
                  </div>

                  <div>
                    <label 
                      className="block text-sm font-medium mb-1 transition-colors duration-300"
                      style={{ color: currentTheme.colors.text.primary }}
                    >
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      style={{
                        backgroundColor: currentTheme.colors.background.primary,
                        color: currentTheme.colors.text.primary,
                        borderColor: currentTheme.colors.border.primary
                      }}
                      placeholder="Service or appointment description"
                    />
                  </div>

                  <div>
                    <label 
                      className="block text-sm font-medium mb-1 transition-colors duration-300"
                      style={{ color: currentTheme.colors.text.primary }}
                    >
                      Notes
                    </label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      style={{
                        backgroundColor: currentTheme.colors.background.primary,
                        color: currentTheme.colors.text.primary,
                        borderColor: currentTheme.colors.border.primary
                      }}
                      placeholder="Internal notes"
                    />
                  </div>
                </div>

                <div 
                  className="flex justify-end space-x-3 mt-6 pt-4 border-t transition-all duration-300"
                  style={{ borderColor: currentTheme.colors.border.primary }}
                >
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-sm font-medium rounded-md transition-all duration-200"
                    style={{
                      backgroundColor: currentTheme.colors.background.primary,
                      color: currentTheme.colors.text.primary,
                      borderColor: currentTheme.colors.border.primary,
                      border: '1px solid'
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="inline-flex items-center px-4 py-2 text-white text-sm font-medium rounded-md disabled:opacity-50 transition-all duration-200"
                    style={{ backgroundColor: currentTheme.colors.primary[600] }}
                  >
                    {(createMutation.isPending || updateMutation.isPending) ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <CheckIcon className="h-4 w-4 mr-2" />
                        {editingAppointment ? 'Atualizar' : 'Criar'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;