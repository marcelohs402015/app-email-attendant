import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
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
import emailAPI from '../services/api';
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
    
    const selectedClient = clients.find(c => c.id === formData.clientId);
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
      createMutation.mutate(appointmentData);
    }
  };

  const handleDelete = (appointmentId: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      deleteMutation.mutate(appointmentId);
    }
  };

  const handleStatusChange = (appointmentId: string, newStatus: Appointment['status']) => {
    updateMutation.mutate({
      id: appointmentId,
      status: newStatus
    });
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
    return appointments.filter(apt => apt.date === dateString);
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
          <h1 className="text-2xl font-bold text-gray-900">{t('calendar.title')}</h1>
          <p className="mt-1 text-sm text-gray-600">
            {t('calendar.description')}
          </p>
        </div>
        <div className="flex space-x-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              {t('calendar.week')}
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'day' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              {t('calendar.day')}
            </button>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            {t('calendar.newAppointment')}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => viewMode === 'week' ? navigateWeek('prev') : navigateDay('prev')}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">
            {viewMode === 'week' 
              ? format(currentDate, "'Week of' MMMM d", { locale: enUS })
              : format(currentDate, "EEEE, MMMM d, yyyy", { locale: enUS })
            }
          </h2>
          <button
            onClick={() => viewMode === 'week' ? navigateWeek('next') : navigateDay('next')}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
        <button
          onClick={() => setCurrentDate(new Date())}
          className="px-3 py-1 text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          Hoje
        </button>
      </div>

      {/* Calendar View */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {viewMode === 'week' ? (
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {getWeekDays().map((day, index) => {
              const dayAppointments = getAppointmentsForDate(day);
              const isToday = isSameDay(day, new Date());
              
              return (
                <div key={index} className="bg-white min-h-[200px]">
                  <div className={`p-2 text-center border-b ${
                    isToday ? 'bg-primary-50 text-primary-700' : 'text-gray-900'
                  }`}>
                    <div className="text-xs font-medium">
                      {format(day, 'EEE', { locale: enUS })}
                    </div>
                    <div className={`text-sm font-bold ${isToday ? 'bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto mt-1' : ''}`}>
                      {format(day, 'd')}
                    </div>
                  </div>
                  <div className="p-2 space-y-1">
                    {dayAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="text-xs p-2 rounded bg-primary-50 border border-primary-200 cursor-pointer hover:bg-primary-100"
                        onClick={() => handleOpenModal(appointment)}
                      >
                        <div className="font-medium text-primary-800 truncate">
                          {appointment.startTime} - {appointment.title}
                        </div>
                        <div className="text-primary-600 truncate">
                          {appointment.client.name}
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => handleOpenModal(undefined, day)}
                      className="w-full text-xs text-gray-400 hover:text-primary-600 py-1 border-2 border-dashed border-gray-200 hover:border-primary-300 rounded transition-colors"
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
              {getAppointmentsForDate(currentDate).map((appointment) => (
                <div
                  key={appointment.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {appointment.startTime} - {appointment.endTime}
                        </div>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                          {getStatusLabel(appointment.status)}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-medium text-gray-900 mt-2">
                        {appointment.title}
                      </h3>
                      
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <UserIcon className="h-4 w-4 mr-1" />
                        {appointment.client.name}
                      </div>
                      
                      {appointment.location && (
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          {appointment.location}
                        </div>
                      )}
                      
                      {appointment.description && (
                        <p className="text-sm text-gray-600 mt-2">
                          {appointment.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {appointment.status === 'scheduled' && (
                        <button
                          onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                          className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                        >
                          Confirmar
                        </button>
                      )}
                      {appointment.status === 'confirmed' && (
                        <button
                          onClick={() => handleStatusChange(appointment.id, 'completed')}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                        >
                          Concluir
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenModal(appointment)}
                        className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                        title="Editar"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(appointment.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
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
                  <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No appointments for this day.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => handleOpenModal(undefined, currentDate)}
                      className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700"
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

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <form onSubmit={handleSubmit}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingAppointment ? 'Edit Appointment' : 'New Appointment'}
                  </h3>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cliente *
                    </label>
                    <select
                      required
                      value={formData.clientId}
                      onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Selecione um cliente</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Appointment title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time *
                      </label>
                      <input
                        type="time"
                        required
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Time *
                      </label>
                      <input
                        type="time"
                        required
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Local
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Address or service location"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Service or appointment description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Internal notes"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 disabled:opacity-50"
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