import React, { useState } from 'react';
import { User } from '../types';
import { FileTextIcon } from './Icon';

interface LoginScreenProps {
  users: User[];
  onLogin: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ users, onLogin }) => {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.id === selectedUserId);
    if (user) {
      onLogin(user);
    } else {
      setError('Por favor, selecciona un usuario para continuar.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <FileTextIcon className="mx-auto h-12 w-12 text-primary-600" />
            <h1 className="mt-4 text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
              Gestor de Propuestas
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Selecciona tu perfil para iniciar sesión
            </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="user-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Usuario
              </label>
              <select
                id="user-select"
                value={selectedUserId}
                onChange={(e) => {
                    setSelectedUserId(e.target.value);
                    setError('');
                }}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="" disabled>Selecciona tu nombre...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            
            {error && (
              <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Ingresar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;