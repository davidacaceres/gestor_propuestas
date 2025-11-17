import React, { useState } from 'react';
import { Client } from '../types';
import { PlusIcon } from './Icon';

interface CreateProposalFormProps {
  clients: Client[];
  onSubmit: (title: string, clientId: string, description: string, deadline: Date, alertDate?: Date) => void;
  onCancel: () => void;
}

const CreateProposalForm: React.FC<CreateProposalFormProps> = ({ clients, onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [clientId, setClientId] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [alertDate, setAlertDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (title.trim() && clientId && description.trim() && deadline) {
      // El valor del input "YYYY-MM-DD" se interpreta por defecto como medianoche UTC.
      // Al añadir T00:00:00 se asegura que se cree como medianoche en la zona horaria local del usuario.
      const deadlineDate = new Date(deadline + 'T00:00:00');
      const alertDateObj = alertDate ? new Date(alertDate + 'T00:00:00') : undefined;
      
      if (alertDateObj && alertDateObj >= deadlineDate) {
        setError('La fecha de alerta debe ser anterior a la fecha límite.');
        return;
      }
      
      onSubmit(title, clientId, description, deadlineDate, alertDateObj);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Nueva Propuesta</h2>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título de la Propuesta</label>
          <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required />
        </div>
        <div>
          <label htmlFor="client" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cliente</label>
          <select id="client" value={clientId} onChange={e => setClientId(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
            <option value="" disabled>Selecciona un cliente</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.companyName}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
          <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required></textarea>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha Límite</label>
                <input type="date" id="deadline" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
            </div>
            <div>
                <label htmlFor="alertDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha de Alerta (Opcional)</label>
                <input type="date" id="alertDate" value={alertDate} onChange={e => setAlertDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500">Cancelar</button>
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center">
          <PlusIcon className="w-5 h-5 mr-2" />
          Crear Propuesta
        </button>
      </div>
    </form>
  );
};

export default CreateProposalForm;