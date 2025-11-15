
import React from 'react';
import { FileTextIcon } from './Icon';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <FileTextIcon className="h-8 w-8 text-primary-600" />
            <h1 className="ml-3 text-2xl font-bold text-gray-800 tracking-tight">
              Gestor de Propuestas
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
