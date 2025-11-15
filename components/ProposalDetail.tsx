import React, { useState } from 'react';
import { Proposal, Document, ProposalStatus, Client, TeamMember } from '../types';
import { ArrowLeftIcon, PlusIcon, UploadIcon, HistoryIcon, DocumentIcon, ArchiveBoxIcon, ArrowUturnLeftIcon, DownloadIcon, ClockIcon, UserPlusIcon, TrashIcon, PencilIcon, CheckIcon, XIcon } from './Icon';

interface ProposalDetailProps {
  proposal: Proposal;
  clients: Client[];
  teamMembers: TeamMember[];
  onBack: () => void;
  onUploadNew: () => void;
  onUploadVersion: (documentId: string, documentName: string) => void;
  onViewHistory: (document: Document) => void;
  onUpdateStatus: (proposalId: string, status: ProposalStatus) => void;
  onAssignMember: (proposalId: string, memberId: string, hours: number) => void;
  onUnassignMember: (proposalId: string, memberId: string) => void;
  onUpdateAssignedHours: (proposalId: string, memberId: string, hours: number) => void;
}

const statusColors: Record<ProposalStatus, string> = {
  'Borrador': 'bg-gray-100 text-gray-800',
  'Enviado': 'bg-blue-100 text-blue-800',
  'Aceptado': 'bg-green-100 text-green-800',
  'Rechazado': 'bg-red-100 text-red-800',
  'Archivado': 'bg-purple-100 text-purple-800',
};

const ProposalDetail: React.FC<ProposalDetailProps> = ({ proposal, clients, teamMembers, onBack, onUploadNew, onUploadVersion, onViewHistory, onUpdateStatus, onAssignMember, onUnassignMember, onUpdateAssignedHours }) => {
  const isArchived = proposal.status === 'Archivado';
  const client = clients.find(c => c.id === proposal.clientId);
  const teamMembersMap = new Map(teamMembers.map(tm => [tm.id, tm]));
  
  const totalAssignedHours = proposal.assignedTeam.reduce((sum, member) => sum + member.assignedHours, 0);

  const availableMembersToAssign = teamMembers.filter(
    tm => !proposal.assignedTeam.some(am => am.memberId === tm.id)
  );

  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [assignedHours, setAssignedHours] = useState('');
  
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [currentHours, setCurrentHours] = useState('');


  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hours = parseInt(assignedHours, 10);
    if (selectedMemberId && !isNaN(hours) && hours > 0) {
      onAssignMember(proposal.id, selectedMemberId, hours);
      setSelectedMemberId('');
      setAssignedHours('');
    }
  };
  
  const handleEditHours = (memberId: string, hours: number) => {
    setEditingMemberId(memberId);
    setCurrentHours(hours.toString());
  };

  const handleSaveHours = (memberId: string) => {
    const hours = parseInt(currentHours, 10);
    if (!isNaN(hours) && hours >= 0) {
      onUpdateAssignedHours(proposal.id, memberId, hours);
    }
    setEditingMemberId(null);
  };
  
  const handleCancelEdit = () => {
    setEditingMemberId(null);
  };


  const handleDownloadLatestVersion = (doc: Document) => {
    const latestVersion = doc.versions[0];
    if (!latestVersion || !latestVersion.fileContent) {
        alert('El contenido del archivo no está disponible para descargar.');
        return;
    }
    const link = document.createElement('a');
    link.href = latestVersion.fileContent;
    link.download = latestVersion.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="bg-white shadow-lg rounded-lg">
      <div className="p-6 sm:p-8">
        <div className="mb-6">
          <button onClick={onBack} className="flex items-center text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Volver a la lista
          </button>
        </div>

        <div className="md:flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{proposal.title}</h2>
            <p className="mt-4 text-sm text-gray-700 max-w-2xl">{proposal.description}</p>
          </div>
          <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0">
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
            <div className="mt-3 text-sm text-gray-500 space-y-1 text-right">
              <p>Creado: {proposal.createdAt.toLocaleDateString('es-ES')}</p>
              <p className="flex items-center justify-end">
                  <ClockIcon className="w-4 h-4 mr-1.5" />
                  <span>Fecha límite: <span className="font-semibold">{proposal.deadline.toLocaleDateString('es-ES')}</span></span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {client && (
        <div className="border-t border-gray-200 bg-gray-50 px-6 sm:px-8 py-4">
            <h3 className="text-base font-semibold leading-6 text-gray-900">Información del Cliente</h3>
            <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-3">
                <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Empresa</dt>
                    <dd className="mt-1 text-sm text-gray-900">{client.companyName}</dd>
                </div>
                <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Contacto</dt>
                    <dd className="mt-1 text-sm text-gray-900">{client.contactName}</dd>
                    <dd className="mt-1 text-sm text-gray-500">{client.contactEmail}</dd>
                </div>
                <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
                    <dd className="mt-1 text-sm text-gray-900">{client.contactPhone}</dd>
                </div>
            </dl>
        </div>
      )}

      <div className="border-t border-gray-200 p-6 sm:p-8">
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Equipo Asignado</h3>
                <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                    Total Horas: {totalAssignedHours}
                </span>
            </div>
            <div className="space-y-4">
                {proposal.assignedTeam.map(({ memberId, assignedHours }) => {
                    const member = teamMembersMap.get(memberId);
                    const isEditing = editingMemberId === memberId;
                    return member ? (
                        <div key={memberId} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                            <div>
                                <p className="font-semibold text-gray-900">{member.name}</p>
                                <p className="text-sm text-gray-500">{member.role}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                               {isEditing ? (
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="number"
                                            value={currentHours}
                                            onChange={(e) => setCurrentHours(e.target.value)}
                                            className="w-20 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                            min="0"
                                            autoFocus
                                        />
                                        <button onClick={() => handleSaveHours(memberId)} className="text-green-600 hover:text-green-800"><CheckIcon className="w-5 h-5"/></button>
                                        <button onClick={handleCancelEdit} className="text-red-500 hover:text-red-700"><XIcon className="w-5 h-5"/></button>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-sm text-gray-700">{assignedHours} horas</p>
                                        {!isArchived && (
                                            <div className="flex items-center space-x-4">
                                                <button onClick={() => handleEditHours(memberId, assignedHours)} className="text-gray-500 hover:text-primary-700" title={`Editar horas de ${member.name}`}>
                                                    <PencilIcon className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => onUnassignMember(proposal.id, memberId)} className="text-red-500 hover:text-red-700" title={`Quitar a ${member.name}`}>
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    ) : null;
                })}

                {proposal.assignedTeam.length === 0 && (
                    <p className="text-center py-4 text-gray-500">No hay miembros asignados a esta propuesta.</p>
                )}

                {!isArchived && availableMembersToAssign.length > 0 && (
                    <form onSubmit={handleAssignSubmit} className="mt-6 pt-6 border-t border-gray-200 sm:flex items-end gap-4 space-y-4 sm:space-y-0">
                        <div className="flex-grow">
                            <label htmlFor="team-member" className="block text-sm font-medium text-gray-700">Asignar nuevo miembro</label>
                            <select
                                id="team-member"
                                value={selectedMemberId}
                                onChange={e => setSelectedMemberId(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                                required
                            >
                                <option value="" disabled>Selecciona una persona...</option>
                                {availableMembersToAssign.map(tm => (
                                    <option key={tm.id} value={tm.id}>{tm.name} ({tm.role})</option>
                                ))}
                            </select>
                        </div>
                        <div className="sm:w-32">
                            <label htmlFor="hours" className="block text-sm font-medium text-gray-700">Horas</label>
                            <input
                                type="number"
                                id="hours"
                                value={assignedHours}
                                onChange={e => setAssignedHours(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Ej: 40"
                                min="1"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                            <UserPlusIcon className="w-5 h-5 mr-2 -ml-1" />
                            Asignar
                        </button>
                    </form>
                )}
            </div>
        </div>

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
                                            <div className="flex items-center justify-end space-x-4">
                                                <button onClick={() => handleDownloadLatestVersion(doc)} className="text-gray-600 hover:text-gray-900 flex items-center" title="Descargar última versión">
                                                    <DownloadIcon className="w-5 h-5 mr-1" />
                                                    Descargar
                                                </button>
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
                                            <div className="flex justify-end space-x-4">
                                                <button onClick={() => handleDownloadLatestVersion(doc)} className="text-gray-600 hover:text-gray-900 flex items-center" title="Descargar última versión">
                                                    <DownloadIcon className="w-5 h-5 mr-1" />
                                                    Descargar
                                                </button>
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