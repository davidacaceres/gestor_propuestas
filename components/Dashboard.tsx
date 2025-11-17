import React, { useMemo } from 'react';
import { Proposal, Client, TeamMember, User, View, ProposalHistoryEntry } from '../types';
import { FileTextIcon, ClockIcon, CheckIcon, UserGroupIcon, ExclamationTriangleIcon, HistoryIcon } from './Icon';

interface DashboardProps {
  currentUser: User | null;
  proposals: Proposal[];
  clients: Client[];
  teamMembers: TeamMember[];
  onSelectProposal: (proposal: Proposal) => void;
  onNavigate: (view: View) => void;
}

const KPICard: React.FC<{ title: string; value: string | number; icon: React.FC<{ className?: string }>; color: string }> = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
    <div className="ml-4">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ currentUser, proposals, clients, teamMembers, onSelectProposal, onNavigate }) => {

  const teamMembersMap = useMemo(() => new Map(teamMembers.map(tm => [tm.id, tm])), [teamMembers]);

  const stats = useMemo(() => {
    const activeProposals = proposals.filter(p => !p.isArchived);
    const proposalsNeedingAttention = activeProposals.filter(p => p.status === 'Borrador').length;
    const now = new Date();
    const upcomingDeadlines = activeProposals.filter(p => {
        const deadline = new Date(p.deadline);
        const diffDays = (deadline.getTime() - now.getTime()) / (1000 * 3600 * 24);
        return diffDays >= 0 && diffDays <= 7;
    }).length;

    return {
      activeProposals: activeProposals.length,
      proposalsNeedingAttention,
      upcomingDeadlines,
      totalClients: clients.length,
    };
  }, [proposals, clients]);
  
  const nextDeadlines = useMemo(() => {
    const now = new Date();
    return proposals
      .filter(p => !p.isArchived && new Date(p.deadline) >= now)
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 5);
  }, [proposals]);

  const recentActivity = useMemo(() => {
      const allHistory: (ProposalHistoryEntry & {proposalTitle: string, proposalId: string})[] = [];
      proposals.forEach(p => {
          (p.history || []).forEach(h => {
              allHistory.push({ ...h, proposalTitle: p.title, proposalId: p.id });
          })
      });
      return allHistory.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);
  }, [proposals]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        ¡Hola, {currentUser?.name}!
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        Aquí tienes un resumen de la actividad de tus propuestas.
      </p>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard title="Propuestas Activas" value={stats.activeProposals} icon={FileTextIcon} color="bg-blue-500" />
        <KPICard title="Requieren Atención" value={stats.proposalsNeedingAttention} icon={ExclamationTriangleIcon} color="bg-amber-500" />
        <KPICard title="Vencen esta semana" value={stats.upcomingDeadlines} icon={ClockIcon} color="bg-red-500" />
        <KPICard title="Total de Clientes" value={stats.totalClients} icon={UserGroupIcon} color="bg-green-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Deadlines */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <ClockIcon className="w-6 h-6 mr-3 text-primary-600" />
            Próximos Vencimientos
          </h2>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {nextDeadlines.length > 0 ? nextDeadlines.map(p => {
                const deadline = new Date(p.deadline);
                const now = new Date();
                const diffTime = deadline.getTime() - now.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return (
                    <li key={p.id} className="py-3">
                        <button onClick={() => onSelectProposal(p)} className="w-full text-left group">
                            <div className="flex justify-between items-center">
                                <p className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-primary-600 dark:group-hover:text-primary-400">{p.title}</p>
                                <p className={`text-sm font-bold ${diffDays <= 3 ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}>
                                    {diffDays > 0 ? `en ${diffDays} día(s)` : 'Hoy'}
                                </p>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {deadline.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </button>
                    </li>
                )
            }) : <p className="text-center py-8 text-gray-500 dark:text-gray-400">No hay vencimientos próximos.</p>}
          </ul>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
             <HistoryIcon className="w-6 h-6 mr-3 text-primary-600" />
            Actividad Reciente
          </h2>
          <ul className="space-y-4">
            {recentActivity.length > 0 ? recentActivity.map(item => {
              const author = teamMembersMap.get(item.authorId);
              return (
                <li key={item.id}>
                    <button onClick={() => {
                        const proposal = proposals.find(p => p.id === item.proposalId);
                        if(proposal) onSelectProposal(proposal);
                    }} className="w-full text-left group">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-bold text-gray-800 dark:text-gray-100">{author?.name || 'Sistema'}</span> {item.description.includes('creada') ? 'creó la propuesta' : 'actualizó la propuesta'} <span className="font-bold text-primary-600 dark:text-primary-400 group-hover:underline">{item.proposalTitle}</span>.
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {new Date(item.timestamp).toLocaleString('es-ES')}
                        </p>
                    </button>
                </li>
              )
            }) : <p className="text-center py-8 text-gray-500 dark:text-gray-400">No hay actividad reciente.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;