import React from 'react';
import { Client } from '../types';
import { PlusIcon, UserGroupIcon, ChevronRightIcon } from './Icon';

interface ClientListProps {
  clients: Client[];
  onCreateClient: () => void;
  onSelectClient: (client: Client) => void;
}

const ClientList: React.FC<ClientListProps> = ({ clients, onCreateClient, onSelectClient }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Clientes</h2>
        <button
          onClick={onCreateClient}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2 -ml-1" />
          Nuevo Cliente
        </button>
      </div>

      {clients.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {clients.map((client) => (
              <li key={client.id}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectClient(client);
                  }}
                  className="block hover:bg-gray-50 transition-colors"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold text-primary-600 truncate">{client.companyName}</p>
                      <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <UserGroupIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          {client.contactName}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path d="M2.5 3A1.5 1.5 0 001 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.175a.5.5 0 01.652.652L12.49 12.51a.5.5 0 01-.652.652L8.662 9.988a.5.5 0 00-.652-.652L4.835 12.49a.5.5 0 01-.652-.652l2.825-3.175a.5.5 0 00-.652-.652L3.175 11.598a.5.5 0 01-.652-.652l3.175-2.825a.5.5 0 00-.652-.652L1.032 9.24a.5.5 0 01-.652-.652V4.5A1.5 1.5 0 012.5 3h15A1.5 1.5 0 0119 4.5v8.379a.5.5 0 01-.652.652l-3.175-1.428a.5.5 0 00-.652.652l1.428 3.175a.5.5 0 01-.652.652l-3.175-1.428a.5.5 0 00-.652.652l1.428 3.175a.5.5 0 01-.652.652L11.51 16.33a.5.5 0 01-.652-.652l1.428-3.175a.5.5 0 00-.652-.652L8.51 15.025a.5.5 0 01-.652-.652l3.175-1.428a.5.5 0 00-.652-.652l-3.175 2.825a.5.5 0 01-.652-.652l2.825-3.175a.5.5 0 00-.652-.652L3.835 15.025a.5.5 0 01-.652-.652L6.358 11.2a.5.5 0 00-.652-.652L2.532 13.72a.5.5 0 01-.652-.652l.032-.076A1.5 1.5 0 002.5 14H1a1.5 1.5 0 01-1.5-1.5v-8A1.5 1.5 0 011 3h1.5z" />
                            <path d="M17.5 3A1.5 1.5 0 0016 4.5v1.085a.5.5 0 00.652.652l.015-.007a.5.5 0 01.652.652l-.007.015a.5.5 0 00.652.652l.015-.007a.5.5 0 01.652.652l-.007.015a.5.5 0 00.652.652l.015-.007a.5.5 0 01.652.652l-.007.015a.5.5 0 00.652.652l.015-.007a.5.5 0 01.652.652l-.007.015a.5.5 0 00.652.652l.015-.007a.5.5 0 01.652.652l-.007.015a.5.5 0 00.652.652l.015-.007a.5.5 0 01.652.652l-.007.015a.5.5 0 00.652.652l.015-.007a.5.5 0 01.652.652l-.007.015a.5.5 0 00.652.652V4.5A1.5 1.5 0 0017.5 3z" />
                          </svg>
                          {client.contactEmail}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5h-1.528a1.5 1.5 0 01-1.491-1.298l-.427-1.707a.978.978 0 00-.869-.693H10.5a.978.978 0 00-.869.693l-.427 1.707A1.5 1.5 0 017.713 18H6.5A1.5 1.5 0 015 16.5v-1.528a1.5 1.5 0 011.298-1.491l1.707-.427a.978.978 0 00.693-.869V10.5a.978.978 0 00-.693-.869l-1.707-.427A1.5 1.5 0 015 7.713V6.5A1.5 1.5 0 016.5 5h1.528a1.5 1.5 0 011.491 1.298l.427 1.707a.978.978 0 00.869.693H11.5a.978.978 0 00.869-.693l.427-1.707A1.5 1.5 0 0114.287 5H15.5A1.5 1.5 0 0117 6.5v1.528a1.5 1.5 0 01-1.298 1.491l-1.707.427a.978.978 0 00-.693.869V11.5a.978.978 0 00.693.869l1.707.427A1.5 1.5 0 0117 14.287V15.5a1.5 1.5 0 01-1.5 1.5H3.5A1.5 1.5 0 012 16.5v-13z" clipRule="evenodd" />
                          </svg>
                          {client.contactPhone}
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md border border-gray-200">
            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No hay clientes</h3>
            <p className="mt-1 text-sm text-gray-500">
                ¡Crea tu primer cliente para empezar a asociarlo a propuestas!
            </p>
        </div>
      )}
    </div>
  );
};

export default ClientList;
