import React, { useState, useEffect, useRef } from 'react';
import { FileTextIcon, UserGroupIcon, BellIcon, UsersIcon, UserIcon, HomeIcon } from './Icon';
import { Notification, User, Role, View } from '../types';
import NotificationsPanel from './NotificationsPanel';

interface HeaderProps {
  currentUser: User;
  onLogout: () => void;
  currentView: View;
  onNavigate: (view: View) => void;
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
  onMarkAllAsRead: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout, currentView, onNavigate, notifications, onNotificationClick, onMarkAllAsRead }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const panelRef = useRef<HTMLDivElement>(null);
  
  const hasRole = (role: Role) => currentUser.roles.includes(role);
  const canSeeClients = hasRole('Admin') || hasRole('ProjectManager');
  const canSeeTeam = hasRole('Admin');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleNotificationClickAndClose = (notification: Notification) => {
    onNotificationClick(notification);
    setIsPanelOpen(false);
  };
  
  const navItemClasses = "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium";
  const activeClasses = "border-primary-500 text-gray-900 dark:text-white";
  const inactiveClasses = "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:text-gray-300";

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm dark:border-b dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <FileTextIcon className="h-8 w-8 text-primary-600" />
            <h1 className="ml-3 text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
              Gestor de Propuestas
            </h1>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <button
                onClick={() => onNavigate('dashboard')}
                className={`${navItemClasses} ${currentView === 'dashboard' ? activeClasses : inactiveClasses}`}
              >
                <HomeIcon className="-ml-0.5 mr-2 h-5 w-5" />
                Dashboard
              </button>
              <button
                onClick={() => onNavigate('proposals')}
                className={`${navItemClasses} ${currentView === 'proposals' ? activeClasses : inactiveClasses}`}
              >
                <FileTextIcon className="-ml-0.5 mr-2 h-5 w-5" />
                Propuestas
              </button>
              {canSeeClients && (
                <button
                  onClick={() => onNavigate('clients')}
                  className={`${navItemClasses} ${currentView === 'clients' ? activeClasses : inactiveClasses}`}
                >
                  <UserGroupIcon className="-ml-0.5 mr-2 h-5 w-5" />
                  Clientes
                </button>
              )}
              {canSeeTeam && (
                <button
                  onClick={() => onNavigate('team')}
                  className={`${navItemClasses} ${currentView === 'team' ? activeClasses : inactiveClasses}`}
                >
                  <UsersIcon className="-ml-0.5 mr-2 h-5 w-5" />
                  Equipo
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
             <div className="relative" ref={panelRef}>
                <button 
                  onClick={() => setIsPanelOpen(prev => !prev)}
                  className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <BellIcon className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {isPanelOpen && (
                   <NotificationsPanel
                     notifications={notifications}
                     onNotificationClick={handleNotificationClickAndClose}
                     onMarkAllAsRead={onMarkAllAsRead}
                   />
                )}
             </div>
             <div className="h-8 w-px bg-gray-200 dark:bg-gray-600 hidden sm:block"></div>
             <div className="flex items-center">
                <div className="flex items-center mr-3">
                    <UserIcon className="h-6 w-6 text-gray-500 dark:text-gray-400"/>
                    <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">{currentUser.name}</span>
                </div>
                <button 
                    onClick={onLogout}
                    className="text-sm font-medium text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                >
                    Cerrar Sesión
                </button>
             </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;