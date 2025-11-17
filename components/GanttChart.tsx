import React, { useState, useMemo } from 'react';
import { Proposal, Client, TeamMember, ProposalStatus, DocumentVersion } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, FireIcon, FlagIcon, DocumentIcon } from './Icon';

interface GanttChartProps {
  proposals: Proposal[];
  clients: Client[];
  teamMembers: TeamMember[];
  onSelectProposal: (proposal: Proposal) => void;
  onShowDocumentVersions: (data: { proposalTitle: string, date: Date, versions: DocumentVersion[] }) => void;
}

const statusClasses: Record<ProposalStatus, string> = {
    'Borrador': 'bg-gray-400 dark:bg-gray-600',
    'Enviado': 'bg-blue-500 dark:bg-blue-600',
    'Aceptado': 'bg-green-500 dark:bg-green-600',
    'Rechazado': 'bg-red-500 dark:bg-red-600',
};

const GanttChart: React.FC<GanttChartProps> = ({ proposals, clients, onSelectProposal, onShowDocumentVersions }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const clientsMap = useMemo(() => new Map(clients.map(c => [c.id, c])), [clients]);

    const { year, month, daysInMonth, monthName } = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const monthName = currentDate.toLocaleString('es-ES', { month: 'long' });
        return { year, month, daysInMonth, monthName };
    }, [currentDate]);

    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const visibleProposals = useMemo(() => {
        const monthStart = new Date(year, month, 1);
        const monthEnd = new Date(year, month, daysInMonth, 23, 59, 59);

        return proposals
            .filter(p => {
                const pStart = new Date(p.createdAt);
                const pEnd = new Date(p.deadline);
                return pStart <= monthEnd && pEnd >= monthStart;
            })
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }, [proposals, year, month, daysInMonth]);

    const getBarMetrics = (proposal: Proposal) => {
        const pStart = new Date(proposal.createdAt);
        const pEnd = new Date(proposal.deadline);
        const monthStart = new Date(year, month, 1);
        const monthEnd = new Date(year, month, daysInMonth);

        const startDay = pStart < monthStart ? 1 : pStart.getDate();
        const endDay = pEnd > monthEnd ? daysInMonth : pEnd.getDate();
        
        const gridColumnStart = startDay;
        const gridColumnEnd = endDay + 1;

        return { gridColumnStart, gridColumnEnd };
    };
    
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
                <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <ChevronLeftIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                </button>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 capitalize">{monthName} {year}</h3>
                <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <ChevronRightIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                </button>
            </div>

            <div className="overflow-x-auto">
                <div className="grid gap-y-2 min-w-[800px]" style={{ gridTemplateColumns: `minmax(200px, 1fr) repeat(${daysInMonth}, minmax(30px, 1fr))` }}>
                    <div className="sticky left-0 bg-white dark:bg-gray-800 z-10 font-semibold text-sm text-gray-600 dark:text-gray-300 border-r border-b border-gray-200 dark:border-gray-700 pr-2 py-2">Propuesta</div>
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                        <div key={day} className="text-center font-medium text-xs text-gray-500 dark:text-gray-400 py-2 border-r border-b border-gray-200 dark:border-gray-700 last:border-r-0">
                            {day}
                        </div>
                    ))}
                    
                    {visibleProposals.map((proposal, index) => {
                        const { gridColumnStart, gridColumnEnd } = getBarMetrics(proposal);
                        const barSpanDays = gridColumnEnd - gridColumnStart;

                        const pEnd = new Date(proposal.deadline);
                        const deadlineDay = (pEnd.getFullYear() === year && pEnd.getMonth() === month) ? pEnd.getDate() : null;

                        const pAlert = proposal.alertDate ? new Date(proposal.alertDate) : null;
                        const alertDay = (pAlert && pAlert.getFullYear() === year && pAlert.getMonth() === month) ? pAlert.getDate() : null;

                        const documentMilestonesByDay = useMemo(() => {
                            const milestones = new Map<number, DocumentVersion[]>();
                            proposal.documents.forEach(doc => {
                                doc.versions.forEach(version => {
                                    const versionDate = new Date(version.createdAt);
                                    if (versionDate.getFullYear() === year && versionDate.getMonth() === month) {
                                        const day = versionDate.getDate();
                                        if (!milestones.has(day)) {
                                            milestones.set(day, []);
                                        }
                                        const versionWithDocName = { ...version, name: doc.name };
                                        milestones.get(day)!.push(versionWithDocName);
                                    }
                                });
                            });
                            return milestones;
                        }, [proposal.documents, year, month]);

                        return (
                            <React.Fragment key={proposal.id}>
                                <div
                                    onClick={() => onSelectProposal(proposal)}
                                    title={`${proposal.title}\nCliente: ${clientsMap.get(proposal.clientId)?.companyName || 'N/A'}`}
                                    className={`sticky left-0 z-10 text-sm font-medium text-gray-800 dark:text-gray-200 truncate pr-2 py-2 border-r border-gray-200 dark:border-gray-700 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'}`}
                                >
                                    {proposal.title}
                                </div>
                                <div 
                                    className={`col-start-2 col-span-full grid items-center ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'}`}
                                    style={{ gridTemplateColumns: `repeat(${daysInMonth}, minmax(30px, 1fr))`}}
                                >
                                    <div
                                        style={{ gridColumn: `${gridColumnStart} / span ${barSpanDays}` }}
                                        className={`relative h-6 rounded ${statusClasses[proposal.status]} opacity-80 hover:opacity-100 transition-opacity grid items-center`}
                                        title={`Del ${new Date(proposal.createdAt).toLocaleDateString()} al ${new Date(proposal.deadline).toLocaleDateString()}`}
                                    >
                                        <div 
                                            style={{ 
                                                gridTemplateColumns: `repeat(${barSpanDays}, 1fr)` 
                                            }} 
                                            className="w-full h-full grid"
                                        >
                                            {Array.from({ length: barSpanDays }).map((_, index) => {
                                                const currentDay = gridColumnStart + index;
                                                const isAlertDay = alertDay === currentDay;
                                                const isDeadlineDay = deadlineDay === currentDay;
                                                const docUpdates = documentMilestonesByDay.get(currentDay);

                                                if (!isAlertDay && !isDeadlineDay && !docUpdates) return <div key={currentDay}></div>;

                                                return (
                                                    <div key={currentDay} className="h-full flex justify-center items-center gap-x-0.5 z-10">
                                                        {isAlertDay && (
                                                            <div title={`Fecha de Alerta: ${pAlert?.toLocaleDateString()}`}>
                                                                <FireIcon className="h-5 w-5 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)]" />
                                                            </div>
                                                        )}
                                                        {isDeadlineDay && (
                                                            <div title={`Fecha Límite: ${pEnd.toLocaleDateString()}`}>
                                                                <FlagIcon className="h-5 w-5 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)]" />
                                                            </div>
                                                        )}
                                                        {docUpdates && (
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    onShowDocumentVersions({
                                                                        proposalTitle: proposal.title,
                                                                        date: new Date(year, month, currentDay),
                                                                        versions: docUpdates
                                                                    })
                                                                }}
                                                                // FIX: Cast `d` to `any` to access the dynamically added `name` property. This is consistent with other parts of the codebase.
                                                                title={`Nuevas Versiones (${docUpdates.length}) el ${currentDay}/${month+1}/${year}\n${docUpdates.map(d => `- ${(d as any).name} (v${d.versionNumber})`).join('\n')}`}
                                                                className="flex items-center justify-center"
                                                            >
                                                                <DocumentIcon className="h-5 w-5 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)]" />
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        )
                    })}

                    {visibleProposals.length === 0 && (
                        <div className="col-start-1 col-span-full text-center py-10 text-gray-500 dark:text-gray-400">
                            No hay propuestas activas para este mes.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GanttChart;