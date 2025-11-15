
import React from 'react';
import { Proposal, ProposalStatus, Client } from '../types';
import { PlusIcon, FileTextIcon, ArchiveBoxIcon, ClockIcon } from './Icon';

interface ProposalListProps {
  proposals: Proposal[];
  clients: Client[];
  onSelectProposal: (proposal: Proposal) => void;
  onCreateProposal: () => void;
  showArchived: boolean;
  onToggleShowArchived: () => void;
}

const statusClasses: Record<ProposalStatus, string> = {
  'Borrador': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  'Enviado': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  'Aceptado': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'Rechazado': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  'Archivado': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
};

const ProposalCard: React.FC<{ proposal: Proposal; client?: Client; onSelect: () => void }> = ({ proposal, client, onSelect }) => (
  <div onClick={onSelect} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className="p-5">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 pr-4">{proposal.title}</h3>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[proposal.status]}`}>
          {proposal.status}
        </span>
      </div>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{client?.companyName || 'Cliente no encontrado'}</p>
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <div className="space-y-1">
            <p>Creado: {proposal.createdAt.toLocaleDateString('es-ES')}</p>
            <p className="flex items-center">
                <ClockIcon className="w-4 h-4 mr-1.5 text-gray-400 dark:text-gray-500" />
                Límite: <span className="font-semibold ml-1 dark:text-gray-300">{proposal.deadline.toLocaleDateString('es-ES')}</span>
            </p>
        </div>
        <div className="flex items-center">
            <FileTextIcon className="w-4 h-4 mr-1.5"/>
            <span>{proposal.documents.length} documento(s)</span>
        </div>
      </div>
    </div>
  </div>
);

const ProposalList: React.FC<ProposalListProps> = ({ proposals, clients, onSelectProposal, onCreateProposal, showArchived, onToggleShowArchived }) => {
  const clientsMap = new Map(clients.map(c => [c.id, c]));
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {showArchived ? 'Propuestas Archivadas' : 'Propuestas Activas'}
        </h2>
        <div className="flex items-center space-x-4">
            <button
              onClick={onToggleShowArchived}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ArchiveBoxIcon className="w-5 h-5 mr-2 -ml-1" />
              {showArchived ? 'Ver Activas' : 'Ver Archivadas'}
            </button>
            {!showArchived && (
              <button
                onClick={onCreateProposal}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                <PlusIcon className="w-5 h-5 mr-2 -ml-1" />
                Nueva Propuesta
              </button>
            )}
        </div>
      </div>
      
      {proposals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proposals.map(proposal => (
            <ProposalCard 
                key={proposal.id} 
                proposal={proposal} 
                client={clientsMap.get(proposal.clientId)}
                onSelect={() => onSelectProposal(proposal)} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <ArchiveBoxIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                {showArchived ? 'No hay propuestas archivadas' : 'No hay propuestas activas'}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {showArchived
                ? 'Cuando archives una propuesta, aparecerá aquí.'
                : '¡Crea tu primera propuesta para empezar!'}
            </p>
        </div>
      )}
    </div>
  );
};

export default ProposalList;
