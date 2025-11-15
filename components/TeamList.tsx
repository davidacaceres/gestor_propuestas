import React, { useRef } from 'react';
import { TeamMember } from '../types';
import { PlusIcon, UsersIcon, ArrowDownTrayIcon, PencilIcon, TrashIcon } from './Icon';

interface TeamListProps {
  teamMembers: TeamMember[];
  onCreateTeamMember: () => void;
  onImportTeamMembers: (fileContent: string) => void;
  onEditTeamMember: (member: TeamMember) => void;
  onDeleteTeamMember: (member: TeamMember) => void;
}

const TeamList: React.FC<TeamListProps> = ({ teamMembers, onCreateTeamMember, onImportTeamMembers, onEditTeamMember, onDeleteTeamMember }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        onImportTeamMembers(text);
      };
      reader.readAsText(file);
      event.target.value = ''; // Reset input to allow re-uploading the same file
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Miembros del Equipo</h2>
        <div className="flex items-center space-x-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".csv"
            />
            <button
              onClick={handleImportClick}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ArrowDownTrayIcon className="w-5 h-5 mr-2 -ml-1" />
              Importar desde CSV
            </button>
            <button
              onClick={onCreateTeamMember}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <PlusIcon className="w-5 h-5 mr-2 -ml-1" />
              Nuevo Miembro
            </button>
        </div>
      </div>

      {teamMembers.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
            {teamMembers.map((member) => (
              <li key={member.id}>
                <div className="px-4 py-4 sm:px-6 flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-semibold text-primary-600 dark:text-primary-400 truncate">
                      {member.name}
                      {member.alias && <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">({member.alias})</span>}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate" title={member.role}>{member.role}</p>
                     {member.email && (
                        <div className="mt-1">
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate" title={member.email}>{member.email}</p>
                        </div>
                    )}
                  </div>
                  <div className="ml-4 flex-shrink-0 flex items-center space-x-4">
                    <button
                      onClick={() => onEditTeamMember(member)}
                      className="text-gray-400 hover:text-primary-600 dark:text-gray-500 dark:hover:text-primary-400 transition-colors"
                      title="Editar Miembro"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDeleteTeamMember(member)}
                      className="text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                      title="Eliminar Miembro"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <UsersIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No hay miembros en el equipo</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                ¡Añade tu primer miembro para empezar a asignarlo a propuestas!
            </p>
        </div>
      )}
    </div>
  );
};

export default TeamList;