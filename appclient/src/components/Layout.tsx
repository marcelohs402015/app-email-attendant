import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  HomeIcon, 
  EnvelopeIcon, 
  ChartBarIcon,
  Cog6ToothIcon,
  WrenchScrewdriverIcon,
  DocumentTextIcon,
  UsersIcon,
  CalendarDaysIcon,
  CpuChipIcon,
  Bars3Icon,
  ChevronLeftIcon,
} from '@heroicons/react/24/outline';

const getNavigation = (t: any) => [
  { name: t('navigation.dashboard'), href: '/', icon: HomeIcon },
  { name: t('navigation.emails'), href: '/emails', icon: EnvelopeIcon },
  { name: t('navigation.services'), href: '/services', icon: WrenchScrewdriverIcon },
  { name: t('navigation.quotations'), href: '/quotations', icon: DocumentTextIcon },
  { name: t('navigation.clients'), href: '/clients', icon: UsersIcon },
  { name: t('navigation.calendar'), href: '/calendar', icon: CalendarDaysIcon },
  { name: t('navigation.automation'), href: '/automation', icon: CpuChipIcon },
  { name: t('navigation.statistics'), href: '/stats', icon: ChartBarIcon },
  { name: t('navigation.settings'), href: '/settings', icon: Cog6ToothIcon },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Layout() {
  const location = useLocation();
  const { t } = useTranslation();
  const navigation = getNavigation(t);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={classNames(
        "flex flex-col bg-white shadow-lg transition-all duration-300 ease-in-out relative z-10",
        isCollapsed ? "w-16" : "w-64"
      )}>
        {/* Logo and Toggle */}
        <div className="flex items-center justify-between h-16 px-4 bg-primary-600">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              {/* Handyman Icon */}
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  {/* Hammer */}
                  <path d="M16.5 3.5c.8 0 1.5.7 1.5 1.5v.5l3 3v2l-3-3H17v13c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5V7h-1l-3 3V8l3-3V4.5c0-.8.7-1.5 1.5-1.5z"/>
                  {/* Screwdriver */}
                  <path d="M2 17l4-4 1.5 1.5L3 19l4 1-1-4 4.5-4.5L12 13l3-3-1.5-1.5L16 6l2 2-2.5 2.5L14 12l-1.5-1.5L8 15l4 1-1 4-4-1 4.5-4.5z"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-white leading-tight">Handyman</h1>
                <h2 className="text-sm text-blue-100 leading-tight">Manager</h2>
              </div>
            </div>
          )}
          
          {/* Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={classNames(
              "flex items-center justify-center p-2 rounded-md text-white hover:bg-primary-700 transition-colors duration-200",
              isCollapsed ? "mx-auto" : ""
            )}
            title={isCollapsed ? t('sidebar.expand') || 'Expand sidebar' : t('sidebar.collapse') || 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <Bars3Icon className="w-5 h-5" />
            ) : (
              <ChevronLeftIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className={classNames(
          "flex-1 py-6 space-y-2",
          isCollapsed ? "px-2" : "px-4"
        )}>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={classNames(
                  isActive
                    ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'group flex items-center text-sm font-medium rounded-md transition-all duration-150',
                  isCollapsed 
                    ? 'px-2 py-3 justify-center' 
                    : 'px-3 py-2'
                )}
                title={isCollapsed ? item.name : ''}
              >
                <item.icon
                  className={classNames(
                    isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500',
                    'h-5 w-5 flex-shrink-0 transition-colors duration-150',
                    isCollapsed ? '' : 'mr-3'
                  )}
                  aria-hidden="true"
                />
                {!isCollapsed && (
                  <span className="transition-opacity duration-300">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>


        {/* Footer */}
        {!isCollapsed && (
          <div className="px-4 py-4 text-xs text-gray-500 border-t border-gray-200 transition-opacity duration-300">
            <p>{t('app.name')} {t('app.version')}</p>
            <p>{t('app.description')}</p>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              {navigation.find(item => item.href === location.pathname)?.name || t('navigation.dashboard')}
            </h1>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}