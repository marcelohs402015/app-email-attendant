import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  ChevronDownIcon,
  CheckIcon 
} from '@heroicons/react/24/outline';

const ThemeSelector: React.FC = () => {
  const { currentTheme, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const getThemeColor = (themeType: string) => {
    switch (themeType) {
      case 'light':
        return 'bg-gradient-to-r from-blue-500 to-blue-600';
      case 'purple':
        return 'bg-gradient-to-r from-purple-500 to-purple-700';


      default:
        return 'bg-gradient-to-r from-purple-500 to-purple-700';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg backdrop-blur-sm border transition-all duration-200 hover:scale-105"
        style={{
          backgroundColor: currentTheme.type === 'light' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.15)',
          borderColor: currentTheme.type === 'light' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(255, 255, 255, 0.3)',
          color: currentTheme.type === 'light' ? '#1e40af' : 'white'
        }}
      >
        <div className={`w-4 h-4 rounded-full ${getThemeColor(currentTheme.type)}`}></div>
        <span className="text-sm font-medium">{currentTheme.name}</span>
        <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white backdrop-blur-sm border border-gray-200 rounded-lg shadow-xl z-50">
          <div className="py-2">
            {availableThemes.map((theme) => (
              <button
                key={theme.type}
                onClick={() => {
                  console.log('Clicking theme:', theme.name, theme.type);
                  setTheme(theme.type);
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${getThemeColor(theme.type)}`}></div>
                  <span>{theme.name}</span>
                </div>
                {currentTheme.type === theme.type && (
                  <CheckIcon className="w-4 h-4 text-white" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
