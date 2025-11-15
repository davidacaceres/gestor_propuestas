import React from 'react';
import { Client, Proposal, ProposalStatus } from '../types';
import { ArrowLeftIcon } from './Icon';

interface ClientDetailProps {
  client: Client;
  proposals: Proposal[];
  onBack: () => void;
  onSelectProposal: (proposal: Proposal) => void;
}

const statusColors: Record<ProposalStatus, string> = {
  'Borrador': 'bg-gray-100 text-gray-800',
  'Enviado': 'bg-blue-100 text-blue-800',
  'Aceptado': 'bg-green-100 text-green-800',
  'Rechazado': 'bg-red-100 text-red-800',
  'Archivado': 'bg-purple-100 text-purple-800',
};

const ClientDetail: React.FC<ClientDetailProps> = ({ client, proposals, onBack, onSelectProposal }) => {
  return (
    <div>
      <div className="mb-6">
        <button onClick={onBack} className="flex items-center text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Volver a la lista de clientes
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-900">{client.companyName}</h2>
        <dl className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Contacto</dt>
            <dd className="mt-1 text-sm text-gray-900">{client.contactName}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-gray-900">{client.contactEmail}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
            <dd className="mt-1 text-sm text-gray-900">{client.contactPhone}</dd>
          </div>
        </dl>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Propuestas Asociadas</h3>
        <div className="flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Título de la Propuesta</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Estado</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Fecha Límite</th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Ver</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {proposals.map((proposal) => (
                                    <tr key={proposal.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{proposal.title}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[proposal.status]}`}>
                                              {proposal.status}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{proposal.deadline.toLocaleDateString('es-ES')}</td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            <a href="#" onClick={(e) => { e.preventDefault(); onSelectProposal(proposal); }} className="text-primary-600 hover:text-primary-900">Ver Propuesta</a>
                                        </td>
                                    </tr>
                                ))}
                                {proposals.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center py-10 text-gray-500">
                                            Este cliente no tiene propuestas asociadas.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;
