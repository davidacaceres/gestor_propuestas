import React, { useState } from 'react';
import { Proposal, Client, TeamMember, ProposalStatus, Document } from '../types';
import { ArrowLeftIcon, ClockIcon, ArchiveBoxIcon, ArrowUturnLeftIcon } from './Icon';
import ProposalDetailTabs from './ProposalDetailTabs';

interface ProposalDetailProps {
  proposal: Proposal;
  clients: Client[];
  teamMembers: TeamMember[];
  onBack: () => void;
  onUploadNew: () => void;
  onUploadVersion: (documentId: string, documentName: string) => void;
  onViewHistory: (document: Document) => void;
  onUpdateStatus: (proposalId: string, status: ProposalStatus) => void;
  onUpdateProposalLeader: (proposalId: string, leaderId: string) => void;
  onAssignMember: (proposalId: string, memberId: string, hours: number) => void;
  onUnassignMember: (proposalId: string, memberId: string) => void;
  onUpdateAssignedHours: (proposalId: string, memberId: string, hours: number) => void;
  onAddComment: (proposalId: string, authorId: string, text: string) => void;
}

const statusClasses: Record<ProposalStatus, string> = {
  'Borrador': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  'Enviado': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  'Aceptado': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'Rechazado': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  'Archivado': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
};

const ProposalDetail: React.FC<ProposalDetailProps> = (props) => {
  const { proposal, clients, teamMembers, onBack, onUpdateStatus, onUpdateProposalLeader } = props;
  const isArchived = proposal.status === 'Archivado';
  const client = clients.find(c => c.id === proposal.clientId);
  const leader = proposal.leaderId ? teamMembers.find(tm => tm.id === proposal.leaderId) : null;

  return (
    <div>
       <div className="mb-6">
          <button onClick={onBack} className="flex items-center text-sm font-medium text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Volver
          </button>
        </div>
      
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        {/* Header/Summary Section */}
        <div className="p-6 sm:p-8 border-b border-gray-200 dark:border-gray-700">
          <div className="md:flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{proposal.title}</h2>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
                Cliente: <span className="font-semibold text-gray-800 dark:text-gray-200">{client?.companyName || 'N/A'}</span>
              </p>
              <p className="mt-4 text-sm text-gray-700 dark:text-gray-300 max-w-2xl">{proposal.description}</p>
            </div>
            <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0">
              {isArchived ? (
                <div className="flex flex-col items-end">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusClasses[proposal.status]}`}>
                    <ArchiveBoxIcon className="w-5 h-5 mr-2" />
                    Archivado
                  </span>
                  <button
                    onClick={() => onUpdateStatus(proposal.id, 'Borrador')}
                    className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <ArrowUturnLeftIcon className="w-5 h-5 mr-2 -ml-1" />
                    Desarchivar
                  </button>
                </div>
              ) : (
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Estado de la Propuesta
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={proposal.status}
                    onChange={(e) => onUpdateStatus(proposal.id, e.target.value as ProposalStatus)}
                    className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md font-medium dark:border-gray-600 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 ${statusClasses[proposal.status]}`}
                  >
                    <option value="Borrador">Borrador</option>
                    <option value="Enviado">Enviado</option>
                    <option value="Aceptado">Aceptado</option>
                    <option value="Rechazado">Rechazado</option>
                    <option value="Archivado">Archivado</option>
                  </select>
                </div>
              )}
               <div className="mt-4">
                  <label htmlFor="leader" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Líder de la Propuesta</label>
                  {isArchived ? (
                      <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{leader?.name || 'No asignado'}</p>
                  ) : (
                      <select
                          id="leader"
                          name="leader"
                          value={proposal.leaderId || ''}
                          onChange={(e) => onUpdateProposalLeader(proposal.id, e.target.value)}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                          <option value="" disabled>Selecciona un líder</option>
                          {teamMembers.map(member => (
                              <option key={member.id} value={member.id}>{member.name}</option>
                          ))}
                      </select>
                  )}
              </div>
              <div className="mt-3 text-sm text-gray-500 dark:text-gray-400 space-y-1 text-right">
                <p>Creado: {proposal.createdAt.toLocaleDateString('es-ES')}</p>
                <p className="flex items-center justify-end">
                  <ClockIcon className="w-4 h-4 mr-1.5" />
                  <span>Fecha límite: <span className="font-semibold dark:text-gray-300">{proposal.deadline.toLocaleDateString('es-ES')}</span></span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <ProposalDetailTabs {...props} />
      </div>
    </div>
  );
};

export default ProposalDetail;