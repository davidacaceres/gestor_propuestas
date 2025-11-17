import React from 'react';
import { Client, ClientListProps } from '../types';
import { PlusIcon, UserGroupIcon, ChevronRightIcon, PencilIcon, TrashIcon } from './Icon';
import Pagination from './Pagination';

const ClientList: React.FC<ClientListProps> = ({ 
  clients, 
  currentUser, 
  onCreateClient, 
  onSelectClient, 
  onEditClient, 
  onDeleteClient,
  currentPage,
  totalPages,
  onPageChange
}) => {
  const hasRole = (role: 'Admin' | 'ProjectManager' | 'TeamMember') => currentUser?.roles.includes(role) ?? false;
  const canManageClients = hasRole('Admin') || hasRole('ProjectManager');

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Clientes</h2>
        {canManageClients && (
          <button
            onClick={onCreateClient}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2 -ml-1" />
            Nuevo Cliente
          </button>
        )}
      </div>

      {clients.length > 0 ? (
        <>
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
              {clients.map((client) => (
                <li key={client.id}>
                  <div className="px-4 py-4 sm:px-6 flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => onSelectClient(client)}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold text-primary-600 dark:text-primary-400 truncate">{client.companyName}</p>
                        <ChevronRightIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <UserGroupIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                            {client.contactName}
                          </p>
                        </div>
                      </div>
                    </div>
                    {canManageClients && (
                      <div className="ml-4 flex-shrink-0 flex items-center space-x-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditClient(client);
                          }}
                          className="text-gray-400 hover:text-primary-600 dark:text-gray-500 dark:hover:text-primary-400 transition-colors"
                          title="Editar Cliente"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteClient(client);
                          }}
                          className="text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                          title="Eliminar Cliente"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
          )}
        </>
      ) : (
        <div className="text-center py-16 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No hay clientes</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                ¡Crea tu primer cliente para empezar a asociarlo a propuestas!
            </p>
        </div>
      )}
    </div>
  );
};

export default ClientList;
