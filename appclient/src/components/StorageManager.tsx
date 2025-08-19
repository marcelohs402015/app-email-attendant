import React, { useState, useEffect } from 'react';
import { localStorageService, LocalStorageData } from '../services/localStorage';

interface StorageManagerProps {
  onDataChange?: () => void;
}

export const StorageManager: React.FC<StorageManagerProps> = ({ onDataChange }) => {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    updateStats();
  }, []);

  const updateStats = () => {
    const currentStats = localStorageService.getStats();
    setStats(currentStats);
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorageService.clearAll();
      updateStats();
      onDataChange?.();
    }
  };

  const exportData = () => {
    const data = localStorageService.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `handyman-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as LocalStorageData;
        localStorageService.importData(data);
        updateStats();
        onDataChange?.();
        alert('Data imported successfully!');
      } catch (error) {
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const totalItems = Object.values(stats).reduce((sum, count) => sum + count, 0);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-200"
        title="Storage Manager"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
        </svg>
      </button>

      {/* Storage Panel */}
      {isVisible && (
        <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 w-80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Storage Manager
            </h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Statistics */}
          <div className="mb-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Total Items: <span className="font-semibold text-blue-600">{totalItems}</span>
            </div>
            <div className="space-y-1">
              {Object.entries(stats).map(([key, count]) => (
                <div key={key} className="flex justify-between text-xs">
                  <span className="capitalize text-gray-600 dark:text-gray-400">
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={exportData}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-3 rounded-md transition-colors duration-200"
            >
              Export Data
            </button>
            
            <label className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded-md transition-colors duration-200 cursor-pointer flex items-center justify-center">
              Import Data
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </label>
            
            <button
              onClick={clearAllData}
              className="w-full bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-3 rounded-md transition-colors duration-200"
            >
              Clear All Data
            </button>
          </div>

          {/* Info */}
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Data is stored locally in your browser
          </div>
        </div>
      )}
    </div>
  );
};
