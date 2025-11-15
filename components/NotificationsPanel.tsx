import React from 'react';
import { Notification } from '../types';
import { BellIcon } from './Icon';

const timeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return `hace ${Math.floor(interval)} años`;
  interval = seconds / 2592000;
  if (interval > 1) return `hace ${Math.floor(interval)} meses`;
  interval = seconds / 86400;
  if (interval > 1) return `hace ${Math.floor(interval)} días`;
  interval = seconds / 3600;
  if (interval > 1) return `hace ${Math.floor(interval)} horas`;
  interval = seconds / 60;
  if (interval > 1) return `hace ${Math.floor(interval)} minutos`;
  return `hace ${Math.floor(seconds)} segundos`;
};

interface NotificationsPanelProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
  onMarkAllAsRead: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications, onNotificationClick, onMarkAllAsRead }) => {
  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex={-1}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notificaciones</h3>
          <button onClick={onMarkAllAsRead} className="text-sm font-medium text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300">
            Marcar todas como leídas
          </button>
        </div>
      </div>
      <div className="py-1 max-h-96 overflow-y-auto" role="none">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <button
              key={notification.id}
              onClick={() => onNotificationClick(notification)}
              className="w-full text-left block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              role="menuitem"
              tabIndex={-1}
            >
              <div className="flex items-start">
                {!notification.read && <div className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mr-3"></div>}
                <div className={notification.read ? 'pl-5' : ''}>
                    <p className={`font-medium ${!notification.read ? 'text-gray-800 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`}>{notification.message}</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">{timeAgo(notification.createdAt)}</p>
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center py-10 px-4">
            <BellIcon className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500" />
            <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">No tienes notificaciones</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Las actualizaciones importantes aparecerán aquí.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;
