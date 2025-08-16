import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTheme } from '../contexts/ThemeContext';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  DocumentTextIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import emailAPI from '../services/api';
import { EmailTemplate } from '../types/api';
import { categoryLabels } from '../data/mockData';

interface TemplateFormData {
  name: string;
  subject: string;
  body: string;
  category: string;
}

const Settings: React.FC = () => {
  const { currentTheme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [formData, setFormData] = useState<TemplateFormData>({
    name: '',
    subject: '',
    body: '',
    category: ''
  });

  const queryClient = useQueryClient();

  const { data: templatesResponse, isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: () => emailAPI.getTemplates(),
  });

  const createMutation = useMutation({
    mutationFn: emailAPI.createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<EmailTemplate>) => 
      emailAPI.updateTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: emailAPI.deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });

  const resetForm = () => {
    setFormData({ name: '', subject: '', body: '', category: '' });
    setEditingTemplate(null);
    setIsModalOpen(false);
  };

  const handleOpenModal = (template?: EmailTemplate) => {
    if (template) {
      setEditingTemplate(template);
      setFormData({
        name: template.name,
        subject: template.subject,
        body: template.body,
        category: template.category || ''
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTemplate) {
      updateMutation.mutate({
        id: editingTemplate.id,
        ...formData
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      deleteMutation.mutate(templateId);
    }
  };

  const templates = templatesResponse?.data || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" 
          style={{ borderColor: currentTheme.colors.primary[600] }}></div>
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
            Settings
          </h1>
          <p 
            className="mt-1 text-sm transition-colors duration-300"
            style={{ color: currentTheme.colors.text.muted }}
          >
            Gerencie seus templates de resposta de email
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 text-white text-sm font-medium rounded-md transition-colors duration-200"
          style={{ backgroundColor: currentTheme.colors.primary[600] }}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Novo Template
        </button>
      </div>

      {/* Templates List */}
      <div 
        className={`shadow-sm rounded-lg overflow-hidden transition-all duration-300 ${
          currentTheme.type === 'purple' ? 'darkone-card' : 'bg-white'
        }`}
        style={{ backgroundColor: currentTheme.colors.background.card }}
      >
        <div className="px-4 py-5 sm:p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <div
                key={template.id}
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
                    <div className="flex items-center">
                      <DocumentTextIcon 
                        className="h-5 w-5 mr-2 transition-colors duration-300"
                        style={{ color: currentTheme.colors.text.muted }}
                      />
                      <h3 
                        className="text-sm font-medium truncate transition-colors duration-300"
                        style={{ color: currentTheme.colors.text.primary }}
                      >
                        {template.name}
                      </h3>
                    </div>
                    {template.category && (
                      <span 
                        className="inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: currentTheme.colors.primary[600],
                          color: '#ffffff'
                        }}
                      >
                        {categoryLabels[template.category as keyof typeof categoryLabels]}
                      </span>
                    )}
                    <p 
                      className="mt-2 text-xs line-clamp-2 transition-colors duration-300"
                      style={{ color: currentTheme.colors.text.muted }}
                    >
                      {template.body.substring(0, 100)}...
                    </p>
                  </div>
                  <div className="flex space-x-1 ml-2">
                    <button
                      onClick={() => handleOpenModal(template)}
                      className={`p-1 transition-colors duration-200 ${
                        currentTheme.type === 'purple' ? 'darkone-hover-primary' : 'hover:text-primary-600'
                      }`}
                      style={{ color: currentTheme.colors.text.muted }}
                      title="Editar"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(template.id)}
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
          </div>

          {templates.length === 0 && (
            <div className="text-center py-12">
              <DocumentTextIcon 
                className="mx-auto h-12 w-12 transition-colors duration-300"
                style={{ color: currentTheme.colors.text.muted }}
              />
              <h3 
                className="mt-2 text-sm font-medium transition-colors duration-300"
                style={{ color: currentTheme.colors.text.primary }}
              >
                Nenhum template
              </h3>
              <p 
                className="mt-1 text-sm transition-colors duration-300"
                style={{ color: currentTheme.colors.text.muted }}
              >
                Comece criando seu primeiro template de resposta.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => handleOpenModal()}
                  className="inline-flex items-center px-4 py-2 text-white text-sm font-medium rounded-md transition-colors duration-200"
                  style={{ backgroundColor: currentTheme.colors.primary[600] }}
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Criar Template
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

            <div 
              className={`inline-block align-bottom rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6 ${
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
                    {editingTemplate ? 'Editar Template' : 'Novo Template'}
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
                      Nome do Template
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      style={{
                        backgroundColor: currentTheme.colors.background.primary,
                        color: currentTheme.colors.text.primary,
                        borderColor: currentTheme.colors.border.primary
                      }}
                      placeholder="Ex: Complaint Response"
                    />
                  </div>

                  <div>
                    <label 
                      className="block text-sm font-medium mb-1 transition-colors duration-300"
                      style={{ color: currentTheme.colors.text.primary }}
                    >
                      Categoria
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      style={{
                        backgroundColor: currentTheme.colors.background.primary,
                        color: currentTheme.colors.text.primary,
                        borderColor: currentTheme.colors.border.primary
                      }}
                    >
                      <option value="">Selecione uma categoria</option>
                      {Object.entries(categoryLabels).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label 
                      className="block text-sm font-medium mb-1 transition-colors duration-300"
                      style={{ color: currentTheme.colors.text.primary }}
                    >
                      Assunto
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      style={{
                        backgroundColor: currentTheme.colors.background.primary,
                        color: currentTheme.colors.text.primary,
                        borderColor: currentTheme.colors.border.primary
                      }}
                      placeholder="Ex: Re: {subject}"
                    />
                    <p 
                      className="mt-1 text-xs transition-colors duration-300"
                      style={{ color: currentTheme.colors.text.muted }}
                    >
                      Use ${'{'}subject{'}'} para incluir o assunto original
                    </p>
                  </div>

                  <div>
                    <label 
                      className="block text-sm font-medium mb-1 transition-colors duration-300"
                      style={{ color: currentTheme.colors.text.primary }}
                    >
                      Corpo da Mensagem
                    </label>
                    <textarea
                      required
                      rows={8}
                      value={formData.body}
                      onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      style={{
                        backgroundColor: currentTheme.colors.background.primary,
                        color: currentTheme.colors.text.primary,
                        borderColor: currentTheme.colors.border.primary
                      }}
                      placeholder="Enter the response content..."
                    />
                    <p 
                      className="mt-1 text-xs transition-colors duration-300"
                      style={{ color: currentTheme.colors.text.muted }}
                    >
                      Use variables like ${'{'}subject{'}'}, ${'{'}protocol{'}'}, etc.
                    </p>
                  </div>
                </div>

                <div 
                  className="flex justify-end space-x-3 mt-6 pt-4 border-t transition-all duration-300"
                  style={{ borderColor: currentTheme.colors.border.primary }}
                >
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-sm font-medium border rounded-md transition-all duration-200"
                    style={{
                      backgroundColor: currentTheme.colors.background.primary,
                      color: currentTheme.colors.text.primary,
                      borderColor: currentTheme.colors.border.primary
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="inline-flex items-center px-4 py-2 text-white text-sm font-medium rounded-md transition-colors duration-200 disabled:opacity-50"
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
                        {editingTemplate ? 'Atualizar' : 'Criar'}
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

export default Settings;