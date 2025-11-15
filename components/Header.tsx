import React from 'react';
import { FileTextIcon, UserGroupIcon } from './Icon';

type View = 'proposals' | 'clients';

interface HeaderProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const navItemClasses = "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium";
  const activeClasses = "border-primary-500 text-gray-900";
  const inactiveClasses = "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700";

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <FileTextIcon className="h-8 w-8 text-primary-600" />
            <h1 className="ml-3 text-2xl font-bold text-gray-800 tracking-tight">
              Gestor de Propuestas
            </h1>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <button
              onClick={() => onNavigate('proposals')}
              className={`${navItemClasses} ${currentView === 'proposals' ? activeClasses : inactiveClasses}`}
            >
              <FileTextIcon className="-ml-0.5 mr-2 h-5 w-5" />
              Propuestas
            </button>
            <button
              onClick={() => onNavigate('clients')}
              className={`${navItemClasses} ${currentView === 'clients' ? activeClasses : inactiveClasses}`}
            >
              <UserGroupIcon className="-ml-0.5 mr-2 h-5 w-5" />
              Clientes
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;