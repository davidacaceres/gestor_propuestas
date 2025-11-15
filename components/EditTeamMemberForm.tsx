import React, { useState } from 'react';
import { TeamMember } from '../types';
import { PencilIcon } from './Icon';

interface EditTeamMemberFormProps {
  member: TeamMember;
  onSubmit: (memberId: string, data: Omit<TeamMember, 'id'>) => void;
  onCancel: () => void;
}

const EditTeamMemberForm: React.FC<EditTeamMemberFormProps> = ({ member, onSubmit, onCancel }) => {
  const [name, setName] = useState(member.name);
  const [role, setRole] = useState(member.role);
  const [alias, setAlias] = useState(member.alias || '');
  const [email, setEmail] = useState(member.email || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && role.trim()) {
      onSubmit(member.id, { 
        name: name.trim(), 
        role: role.trim(), 
        alias: alias.trim() || undefined, 
        email: email.trim() || undefined 
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Editar Miembro del Equipo</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="memberName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre Completo</label>
          <input type="text" id="memberName" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required />
        </div>
        <div>
          <label htmlFor="memberRole" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rol / Cargo</label>
          <input type="text" id="memberRole" value={role} onChange={e => setRole(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Ej: Desarrollador, Diseñador" required />
        </div>
         <div>
          <label htmlFor="memberAlias" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Alias (Opcional)</label>
          <input type="text" id="memberAlias" value={alias} onChange={e => setAlias(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Ej: juanux" />
        </div>
         <div>
          <label htmlFor="memberEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo Electrónico</label>
          <input type="email" id="memberEmail" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="ejemplo@correo.com" />
        </div>
      </div>
      <div className="mt-8 flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500">Cancelar</button>
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center">
          <PencilIcon className="w-5 h-5 mr-2" />
          Guardar Cambios
        </button>
      </div>
    </form>
  );
};

export default EditTeamMemberForm;