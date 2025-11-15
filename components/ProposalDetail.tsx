import React from 'react';
import { Proposal, Document, ProposalStatus } from '../types';
import { ArrowLeftIcon, PlusIcon, UploadIcon, HistoryIcon, DocumentIcon, ArchiveBoxIcon, ArrowUturnLeftIcon } from './Icon';

interface ProposalDetailProps {
  proposal: Proposal;
  onBack: () => void;
  onUploadNew: () => void;
  onUploadVersion: (documentId: string, documentName: string) => void;
  onViewHistory: (document: Document) => void;
  onUpdateStatus: (proposalId: string, status: ProposalStatus) => void;
}

const statusColors: Record<ProposalStatus, string> = {
  'Borrador': 'bg-gray-100 text-gray-800',
  'Enviado': 'bg-blue-100 text-blue-800',
  'Aceptado': 'bg-green-100 text-green-800',
  'Rechazado': 'bg-red-100 text-red-800',
  'Archivado': 'bg-purple-100 text-purple-800',
};

const ProposalDetail: React.FC<ProposalDetailProps> = ({ proposal, onBack, onUploadNew, onUploadVersion, onViewHistory, onUpdateStatus }) => {
  const isArchived = proposal.status === 'Archivado';
  
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8">
      <div className="mb-6">
        <button onClick={onBack} className="flex items-center text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Volver a la lista
        </button>
      </div>

      <div className="md:flex justify-between items-start pb-6 border-b border-gray-200">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{proposal.title}</h2>
          <p className="mt-1 text-lg text-gray-600">{proposal.client}</p>
        </div>
        <div className="mt-4 md:mt-0 text-right">
          {isArchived ? (
            <div className="flex flex-col items-end">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[proposal.status]}`}>
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
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Estado de la Propuesta
              </label>
              <select
                id="status"
                name="status"
                value={proposal.status}
                onChange={(e) => onUpdateStatus(proposal.id, e.target.value as ProposalStatus)}
                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md font-medium ${statusColors[proposal.status]}`}
              >
                <option value="Borrador">Borrador</option>
                <option value="Enviado">Enviado</option>
                <option value="Aceptado">Aceptado</option>
                <option value="Rechazado">Rechazado</option>
                <option value="Archivado">Archivado</option>
              </select>
            </div>
          )}
          <p className="mt-2 text-sm text-gray-500">Creado: {proposal.createdAt.toLocaleDateString('es-ES')}</p>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Documentos</h3>
          {!isArchived && (
            <button onClick={onUploadNew} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <PlusIcon className="w-5 h-5 mr-2 -ml-1" />
              Añadir Documento
            </button>
          )}
        </div>
        <div className="flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Nombre del Documento</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Última Versión</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Última Modificación</th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0"><span className="sr-only">Acciones</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {proposal.documents.map((doc) => (
                                <tr key={doc.id}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0 flex items-center">
                                        <DocumentIcon className="w-5 h-5 mr-3 text-gray-400"/>
                                        {doc.name}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        <span className="font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded">v{doc.versions[0]?.versionNumber || 'N/A'}</span>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{doc.versions[0]?.createdAt.toLocaleString('es-ES') || 'N/A'}</td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                        {!isArchived ? (
                                            <div className="flex items-center justify-end space-x-3">
                                                <button onClick={() => onUploadVersion(doc.id, doc.name)} className="text-primary-600 hover:text-primary-900 flex items-center" title="Subir nueva versión">
                                                    <UploadIcon className="w-5 h-5 mr-1" />
                                                    Nueva Versión
                                                </button>
                                                <button onClick={() => onViewHistory(doc)} className="text-indigo-600 hover:text-indigo-900 flex items-center" title="Ver historial de versiones">
                                                    <HistoryIcon className="w-5 h-5 mr-1" />
                                                    Historial
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end">
                                                <button onClick={() => onViewHistory(doc)} className="text-indigo-600 hover:text-indigo-900 flex items-center" title="Ver historial de versiones">
                                                    <HistoryIcon className="w-5 h-5 mr-1" />
                                                    Ver Historial
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                             {proposal.documents.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-10 text-gray-500">
                                        No hay documentos para esta propuesta.
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
  );
};

export default ProposalDetail;