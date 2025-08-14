import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UsersIcon,
  XMarkIcon,
  CheckIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import emailAPI from '../services/api';
import { Client } from '../types/api';

interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}

const Clients: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });

  const queryClient = useQueryClient();

  const { data: clientsResponse, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: () => emailAPI.getClients(),
  });

  const createMutation = useMutation({
    mutationFn: emailAPI.createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Client>) => 
      emailAPI.updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: emailAPI.deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      notes: ''
    });
    setEditingClient(null);
    setIsModalOpen(false);
  };

  const handleOpenModal = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name,
        email: client.email,
        phone: client.phone || '',
        address: client.address || '',
        notes: client.notes || ''
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingClient) {
      updateMutation.mutate({
        id: editingClient.id,
        ...formData,
        isActive: true
      });
    } else {
      createMutation.mutate({
        ...formData,
        isActive: true
      });
    }
  };

  const handleDelete = (clientId: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      deleteMutation.mutate(clientId);
    }
  };

  const clients = clientsResponse?.data || [];
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
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
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your customers
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Novo Cliente
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">
            Buscar cliente:
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Digite o nome ou email..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Clients List */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <UsersIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <h3 className="text-sm font-medium text-gray-900">
                        {client.name}
                      </h3>
                    </div>
                    
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center text-xs text-gray-600">
                        <EnvelopeIcon className="h-3 w-3 mr-2 text-gray-400" />
                        <span className="truncate">{client.email}</span>
                      </div>
                      
                      {client.phone && (
                        <div className="flex items-center text-xs text-gray-600">
                          <PhoneIcon className="h-3 w-3 mr-2 text-gray-400" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                      
                      {client.address && (
                        <div className="flex items-start text-xs text-gray-600">
                          <MapPinIcon className="h-3 w-3 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                          <span className="line-clamp-2">{client.address}</span>
                        </div>
                      )}
                      
                      {client.notes && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                          <span className="font-medium">Notes:</span>
                          <p className="mt-1 line-clamp-2">{client.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-1 ml-2">
                    <button
                      onClick={() => handleOpenModal(client)}
                      className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                      title="Editar"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Excluir"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredClients.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum cliente encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                Tente buscar com outros termos.
              </p>
            </div>
          )}

          {clients.length === 0 && (
            <div className="text-center py-12">
              <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum cliente</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comece criando seu primeiro cliente.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => handleOpenModal()}
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Criar Cliente
                </button>
              </div>
            </div>
          )}
        </div>
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
                    {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
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
                      Nome *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Nome do cliente"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="email@exemplo.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      rows={2}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Client's complete address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Notes about the client..."
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
                        {editingClient ? 'Atualizar' : 'Criar'}
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

export default Clients;