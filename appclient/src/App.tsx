import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import EmailList from './pages/EmailList';
import EmailDetail from './pages/EmailDetail';
import Services from './pages/Services';
import Categories from './pages/Categories';
import Quotations from './pages/Quotations';
import Clients from './pages/Clients';
import Calendar from './pages/Calendar';
import Stats from './pages/Stats';
import Settings from './pages/Settings';
import Automation from './pages/Automation';
import Chat from './pages/Chat';
import { StorageManager } from './components/StorageManager';
import './i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const handleDataChange = () => {
    // Invalidate all queries to refresh data
    queryClient.invalidateQueries();
  };

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="emails" element={<EmailList />} />
              <Route path="emails/:id" element={<EmailDetail />} />
              <Route path="categories" element={<Categories />} />
              <Route path="services" element={<Services />} />
              <Route path="quotations" element={<Quotations />} />
              <Route path="clients" element={<Clients />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="automation" element={<Automation />} />
              <Route path="chat" element={<Chat />} />
              <Route path="stats" element={<Stats />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
          <StorageManager onDataChange={handleDataChange} />
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
