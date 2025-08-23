import React from 'react';
import { Plus, BarChart3, Mail, Users, Calendar, Settings, FileText, Zap } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  icon?: 'chart' | 'mail' | 'users' | 'calendar' | 'settings' | 'document' | 'automation' | 'plus';
  steps?: string[];
}

const iconMap = {
  chart: BarChart3,
  mail: Mail,
  users: Users,
  calendar: Calendar,
  settings: Settings,
  document: FileText,
  automation: Zap,
  plus: Plus
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon = 'chart',
  steps = []
}) => {
  const IconComponent = iconMap[icon];

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {/* Icon */}
      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
          <IconComponent className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
        {description}
      </p>

      {/* Action Button */}
      <button
        onClick={onAction}
        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
      >
        <Plus className="w-4 h-4 mr-2" />
        {actionLabel}
      </button>

      {/* Steps (if provided) */}
      {steps.length > 0 && (
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 max-w-md">
          <div className="flex items-center mb-3">
            <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center mr-2">
              <span className="text-xs font-bold text-yellow-900">💡</span>
            </div>
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Como começar:
            </span>
          </div>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            {steps.map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
