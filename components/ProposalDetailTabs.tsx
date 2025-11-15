import React, { useState } from 'react';
import { Proposal, Document, ProposalStatus, Client, TeamMember, ProposalHistoryEntryType, Comment } from '../types';
import { PlusIcon, UploadIcon, HistoryIcon, DocumentIcon, DownloadIcon, UserPlusIcon, TrashIcon, PencilIcon, CheckIcon, XIcon, TagIcon, PlusCircleIcon, UserGroupIcon, ChatBubbleLeftRightIcon } from './Icon';

interface ProposalDetailTabsProps {
  proposal: Proposal;
  teamMembers: TeamMember[];
  onUploadNew: () => void;
  onUploadVersion: (documentId: string, documentName: string) => void;
  onViewHistory: (document: Document) => void;
  onAssignMember: (proposalId: string, memberId: string, hours: number) => void;
  onUnassignMember: (proposalId: string, memberId: string) => void;
  onUpdateAssignedHours: (proposalId: string, memberId: string, hours: number) => void;
  onAddComment: (proposalId: string, authorId: string, text: string) => void;
}

type Tab = 'documents' | 'team' | 'comments' | 'history';

const historyTypeMap: Record<ProposalHistoryEntryType, { icon: React.FC<{className?: string}>; color: string }> = {
  creation: { icon: PlusCircleIcon, color: 'text-green-500' },
  status: { icon: TagIcon, color: 'text-blue-500' },
  document: { icon: DocumentIcon, color: 'text-indigo-500' },
  team: { icon: UserGroupIcon, color: 'text-purple-500' },
  general: { icon: PencilIcon, color: 'text-amber-500' },
};

const ProposalDetailTabs: React.FC<ProposalDetailTabsProps> = ({ proposal, teamMembers, onUploadNew, onUploadVersion, onViewHistory, onAssignMember, onUnassignMember, onUpdateAssignedHours, onAddComment }) => {
    const [activeTab, setActiveTab] = useState<Tab>('documents');
    const isArchived = proposal.status === 'Archivado';
    const teamMembersMap = new Map(teamMembers.map(tm => [tm.id, tm]));
    const totalAssignedHours = proposal.assignedTeam.reduce((sum, member) => sum + member.assignedHours, 0);

    const availableMembersToAssign = teamMembers.filter(
        tm => !proposal.assignedTeam.some(am => am.memberId === tm.id)
    );

    const [selectedMemberId, setSelectedMemberId] = useState('');
    const [assignedHours, setAssignedHours] = useState('');
    
    const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
    const [currentHours, setCurrentHours] = useState('');

    const [commentAuthorId, setCommentAuthorId] = useState('');
    const [commentText, setCommentText] = useState('');

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

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentAuthorId && commentText.trim()) {
        onAddComment(proposal.id, commentAuthorId, commentText.trim());
        setCommentAuthorId('');
        setCommentText('');
        }
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

    const tabs: { id: Tab; name: string; icon: React.FC<{className?: string}> }[] = [
        { id: 'documents', name: 'Documentos', icon: DocumentIcon },
        { id: 'team', name: 'Equipo', icon: UserGroupIcon },
        { id: 'comments', name: 'Comentarios', icon: ChatBubbleLeftRightIcon },
        { id: 'history', name: 'Historial', icon: HistoryIcon },
    ];

    const TabButton = ({ tab, currentTab, onClick }: { tab: { id: Tab, name: string, icon: React.FC<{className?: string}> }, currentTab: Tab, onClick: (tab: Tab) => void }) => {
        const isActive = tab.id === currentTab;
        const Icon = tab.icon;
        return (
            <button
                onClick={() => onClick(tab.id)}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
                    isActive
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
                }`}
            >
                <Icon className="w-5 h-5 mr-2" />
                {tab.name}
            </button>
        );
    };

    return (
        <div>
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 sm:px-8">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    {tabs.map(tab => <TabButton key={tab.id} tab={tab} currentTab={activeTab} onClick={setActiveTab} />)}
                </nav>
            </div>
            
            <div className="p-6 sm:p-8">
                {activeTab === 'documents' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Documentos</h3>
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
                                    <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                                        <thead>
                                            <tr>
                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 sm:pl-0">Nombre del Documento</th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">Última Versión</th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">Última Modificación</th>
                                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0"><span className="sr-only">Acciones</span></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {proposal.documents.map((doc) => (
                                                <tr key={doc.id}>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-100 sm:pl-0 flex items-center">
                                                        <DocumentIcon className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500"/>
                                                        {doc.name}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="font-mono bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded">v{doc.versions[0]?.versionNumber || 'N/A'}</span>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{doc.versions[0]?.createdAt.toLocaleString('es-ES') || 'N/A'}</td>
                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                                        {!isArchived ? (
                                                            <div className="flex items-center justify-end space-x-4">
                                                                <button onClick={() => handleDownloadLatestVersion(doc)} className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white flex items-center" title="Descargar última versión">
                                                                    <DownloadIcon className="w-5 h-5 mr-1" />
                                                                    Descargar
                                                                </button>
                                                                <button onClick={() => onUploadVersion(doc.id, doc.name)} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 flex items-center" title="Subir nueva versión">
                                                                    <UploadIcon className="w-5 h-5 mr-1" />
                                                                    Nueva Versión
                                                                </button>
                                                                <button onClick={() => onViewHistory(doc)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center" title="Ver historial de versiones">
                                                                    <HistoryIcon className="w-5 h-5 mr-1" />
                                                                    Historial
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex justify-end space-x-4">
                                                                <button onClick={() => handleDownloadLatestVersion(doc)} className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white flex items-center" title="Descargar última versión">
                                                                    <DownloadIcon className="w-5 h-5 mr-1" />
                                                                    Descargar
                                                                </button>
                                                                <button onClick={() => onViewHistory(doc)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center" title="Ver historial de versiones">
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
                                                    <td colSpan={4} className="text-center py-10 text-gray-500 dark:text-gray-400">
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
                )}

                {activeTab === 'team' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Equipo Asignado</h3>
                            <span className="text-sm font-semibold text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-3 py-1 rounded-full">
                                Total Horas: {totalAssignedHours}
                            </span>
                        </div>
                        <div className="space-y-4">
                            {proposal.assignedTeam.map(({ memberId, assignedHours }) => {
                                const member = teamMembersMap.get(memberId);
                                const isEditing = editingMemberId === memberId;
                                return member ? (
                                    <div key={memberId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md border dark:border-gray-700">
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-gray-100">{member.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                        {isEditing ? (
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="number"
                                                        value={currentHours}
                                                        onChange={(e) => setCurrentHours(e.target.value)}
                                                        className="w-20 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                                                        min="0"
                                                        autoFocus
                                                    />
                                                    <button onClick={() => handleSaveHours(memberId)} className="text-green-600 hover:text-green-800"><CheckIcon className="w-5 h-5"/></button>
                                                    <button onClick={handleCancelEdit} className="text-red-500 hover:text-red-700"><XIcon className="w-5 h-5"/></button>
                                                </div>
                                            ) : (
                                                <>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">{assignedHours} horas</p>
                                                    {!isArchived && (
                                                        <div className="flex items-center space-x-4">
                                                            <button onClick={() => handleEditHours(memberId, assignedHours)} className="text-gray-500 hover:text-primary-700 dark:hover:text-primary-400" title={`Editar horas de ${member.name}`}>
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
                                <p className="text-center py-4 text-gray-500 dark:text-gray-400">No hay miembros asignados a esta propuesta.</p>
                            )}

                            {!isArchived && availableMembersToAssign.length > 0 && (
                                <form onSubmit={handleAssignSubmit} className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 sm:flex items-end gap-4 space-y-4 sm:space-y-0">
                                    <div className="flex-grow">
                                        <label htmlFor="team-member" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Asignar nuevo miembro</label>
                                        <select
                                            id="team-member"
                                            value={selectedMemberId}
                                            onChange={e => setSelectedMemberId(e.target.value)}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            required
                                        >
                                            <option value="" disabled>Selecciona una persona...</option>
                                            {availableMembersToAssign.map(tm => (
                                                <option key={tm.id} value={tm.id}>{tm.name} ({tm.role})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="sm:w-32">
                                        <label htmlFor="hours" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Horas</label>
                                        <input
                                            type="number"
                                            id="hours"
                                            value={assignedHours}
                                            onChange={e => setAssignedHours(e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                )}

                {activeTab === 'comments' && (
                     <div>
                        <div className="flex items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Comentarios</h3>
                        </div>
                        
                        {!isArchived && (
                            <form onSubmit={handleCommentSubmit} className="mb-8">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="sm:col-span-1">
                                        <label htmlFor="comment-author" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Autor</label>
                                        <select
                                            id="comment-author"
                                            value={commentAuthorId}
                                            onChange={e => setCommentAuthorId(e.target.value)}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            required
                                        >
                                            <option value="" disabled>Selecciona tu nombre</option>
                                            {teamMembers.map(tm => (
                                                <option key={tm.id} value={tm.id}>{tm.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="comment-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Comentario</label>
                                        <textarea
                                            id="comment-text"
                                            rows={3}
                                            value={commentText}
                                            onChange={e => setCommentText(e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            placeholder="Escribe tu comentario aquí..."
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mt-3 flex justify-end">
                                    <button type="submit" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                        Publicar Comentario
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className="space-y-6">
                            {(proposal.comments || []).map(comment => {
                                const author = teamMembersMap.get(comment.authorId);
                                return (
                                    <div key={comment.id} className="flex items-start space-x-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                            <UserGroupIcon className="w-6 h-6 text-gray-500 dark:text-gray-300"/>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-baseline justify-between">
                                                <p className="font-semibold text-gray-900 dark:text-gray-100">{author?.name || 'Usuario Desconocido'}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{comment.createdAt.toLocaleString('es-ES')}</p>
                                            </div>
                                            <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{comment.text}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {(!proposal.comments || proposal.comments.length === 0) && (
                                <p className="text-center py-6 text-gray-500 dark:text-gray-400">No hay comentarios todavía.</p>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                     <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Historial de Actividad</h3>
                        <div className="flow-root">
                            <ul role="list" className="-mb-8">
                                {proposal.history?.map((entry, entryIdx) => {
                                    const { icon: IconComponent, color } = historyTypeMap[entry.type];
                                    return (
                                    <li key={entry.id}>
                                        <div className="relative pb-8">
                                        {entryIdx !== proposal.history.length - 1 ? (
                                            <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
                                        ) : null}
                                        <div className="relative flex space-x-4">
                                            <div>
                                            <span className={`h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center ring-8 ring-white dark:ring-gray-800`}>
                                                <IconComponent className={`h-5 w-5 ${color}`} aria-hidden="true" />
                                            </span>
                                            </div>
                                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                            <div>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">{entry.description}</p>
                                            </div>
                                            <div className="whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                                                <time dateTime={entry.timestamp.toISOString()}>{entry.timestamp.toLocaleString('es-ES')}</time>
                                            </div>
                                            </div>
                                        </div>
                                        </div>
                                    </li>
                                    )
                                })}
                                {(!proposal.history || proposal.history.length === 0) && (
                                    <p className="text-center py-4 text-gray-500 dark:text-gray-400">No hay actividad registrada.</p>
                                )}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProposalDetailTabs;