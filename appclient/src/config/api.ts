// API configuration
export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL === 'mock' 
    ? 'mock' 
    : process.env.REACT_APP_API_URL || 'http://localhost:3001',
  timeout: 10000,
};

export const API_ENDPOINTS = {
  emails: '/api/emails',
  templates: '/api/templates',
  services: '/api/services',
  quotations: '/api/quotations',
  clients: '/api/clients',
  appointments: '/api/appointments',
  stats: '/api/stats',
};