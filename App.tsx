import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Proposal, Document, DocumentVersion, ProposalStatus, ModalState, Client, TeamMember, AssignedMember, Notification, ProposalHistoryEntry, Comment, User, Role, View, Task } from './types';
import * as api from './api';
import Header from './components/Header';
import ProposalList from './components/ProposalList';
import ProposalDetail from './components/ProposalDetail';
import ClientList from './components/ClientList';
import ClientDetail from './components/ClientDetail';
import TeamList from './components/TeamList';
import Dashboard from './components/Dashboard';
import Modal from './components/Modal';
import CreateProposalForm from './components/CreateProposalForm';
import CreateClientForm from './components/CreateClientForm';
import CreateTeamMemberForm from './components/CreateTeamMemberForm';
import UploadDocumentForm from './components/UploadDocumentForm';
import DocumentHistory from './components/DocumentHistory';
import ConfirmationDialog from './components/ConfirmationDialog';
import EditClientForm from './components/EditClientForm';
import EditTeamMemberForm from './components/EditTeamMemberForm';
import LoginScreen from './components/LoginScreen';
import DocumentVersionsModal from './components/DocumentVersionsModal';
import Spinner from './components/Spinner';


const ITEMS_PER_PAGE = 6;

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [usersForLogin, setUsersForLogin] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [modalState, setModalState] = useState<ModalState>({ type: null });
  const [showArchived, setShowArchived] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [proposalViewMode, setProposalViewMode] = useState<'card' | 'gantt'>('card');
  
  // Pagination State
  const [proposalsCurrentPage, setProposalsCurrentPage] = useState(1);
  const [clientsCurrentPage, setClientsCurrentPage] = useState(1);
  const [teamCurrentPage, setTeamCurrentPage] = useState(1);
  const [clientDetailProposalsPage, setClientDetailProposalsPage] = useState(1);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Fetch users for login screen on initial mount
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const users = await api.getUsersForLogin();
        setUsersForLogin(users);
      } catch (error) {
        console.error("Failed to fetch users for login", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch all app data after a user logs in
  const fetchAllData = useCallback(async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const [proposalsData, clientsData, teamMembersData] = await Promise.all([
        api.getProposals(),
        api.getClients(),
        api.getTeamMembers(),
      ]);
      setProposals(proposalsData);
      setClients(clientsData);
      setTeamMembers(teamMembersData);
    } catch (error) {
      console.error("Failed to load app data", error);
      // Here you could set an error state to show a message
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setProposalsCurrentPage(1); // Reset page on new search
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const hasRole = useCallback((role: Role) => currentUser?.roles.includes(role) ?? false, [currentUser]);
  const canViewAllProposals = useMemo(() => hasRole('Admin') || hasRole('ProjectManager'), [hasRole]);
  
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedProposal(null);
    setSelectedClient(null);
    setCurrentView('dashboard');
    setProposals([]);
    setClients([]);
    setTeamMembers([]);
  };
  
  const addNotification = useCallback((message: string, proposalId: string) => {
    const newNotification: Notification = { id: `notif-${Date.now()}`, message, proposalId, read: false, createdAt: new Date() };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  useEffect(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const proposalsNeedingAlert = proposals.filter(p => {
        if (!p.alertDate || p.isArchived || p.status === 'Aceptado') return false;
        const alertDate = new Date(p.alertDate);
        const alertDay = new Date(alertDate.getFullYear(), alertDate.getMonth(), alertDate.getDate());
        return today >= alertDay;
    });

    proposalsNeedingAlert.forEach(p => {
      if (!notifications.some(n => n.proposalId === p.id && n.message.includes('alerta'))) {
        addNotification(`La fecha de alerta para "${p.title}" ha llegado.`, p.id);
      }
    });
  }, [proposals, notifications, addNotification]);

  const handleCreateProposal = async (title: string, clientId: string, description: string, deadline: Date, alertDate?: Date) => {
    if (!currentUser) return;
    try {
        await api.createProposal({ title, clientId, description, deadline, alertDate }, currentUser.id);
        await fetchAllData();
        setProposalsCurrentPage(1);
        setModalState({ type: null });
    } catch(e) {
        console.error("Failed to create proposal", e);
        alert('Error al crear la propuesta.');
    }
  };
  
  const handleCreateClient = async (companyName: string, contactName: string, contactEmail: string, contactPhone: string) => {
    try {
        await api.createClient({ companyName, contactName, contactEmail, contactPhone });
        const updatedClients = await api.getClients();
        setClients(updatedClients);
        setClientsCurrentPage(1);
        setModalState({ type: null });
    } catch(e) {
        console.error("Failed to create client", e);
        alert('Error al crear el cliente.');
    }
  };

  const handleUpdateClient = async (clientId: string, data: Omit<Client, 'id'>) => {
    try {
        await api.updateClient(clientId, data);
        const updatedClients = await api.getClients();
        setClients(updatedClients);
        setModalState({ type: null });
    } catch(e) {
        console.error("Failed to update client", e);
        alert('Error al actualizar el cliente.');
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
        await api.deleteClient(clientId);
        const updatedClients = await api.getClients();
        setClients(updatedClients);
    } catch(e) {
        console.error("Failed to delete client", e);
        alert(e instanceof Error ? e.message : 'Error al eliminar el cliente.');
    }
  };

  const handleCreateTeamMember = async (name: string, role: string, alias: string | undefined, email: string | undefined, roles: Role[]) => {
    try {
        await api.createTeamMember({ name, role, alias, email, roles: roles.length > 0 ? roles : ['TeamMember'] });
        const updatedTeam = await api.getTeamMembers();
        setTeamMembers(updatedTeam);
        setTeamCurrentPage(1);
        setModalState({ type: null });
    } catch(e) {
        console.error("Failed to create team member", e);
        alert('Error al crear el miembro del equipo.');
    }
  };

  const handleUpdateTeamMember = async (memberId: string, data: Omit<TeamMember, 'id'>) => {
    try {
        await api.updateTeamMember(memberId, data);
        const updatedTeam = await api.getTeamMembers();
        setTeamMembers(updatedTeam);
        setModalState({ type: null });
    } catch(e) {
        console.error("Failed to update team member", e);
        alert('Error al actualizar el miembro del equipo.');
    }
  };

  const handleDeleteTeamMember = async (memberId: string) => {
    try {
        await api.deleteTeamMember(memberId);
        const updatedTeam = await api.getTeamMembers();
        setTeamMembers(updatedTeam);
    } catch(e) {
        console.error("Failed to delete team member", e);
        alert(e instanceof Error ? e.message : 'Error al eliminar el miembro del equipo.');
    }
  };
  
  const handleImportTeamMembers = async (fileContent: string) => {
    try {
        const imported = await api.importTeamMembers(fileContent);
        if (imported.length > 0) {
            const updatedTeam = await api.getTeamMembers();
            setTeamMembers(updatedTeam);
            alert(`${imported.length} miembro(s) importado(s) correctamente.`);
        } else {
            alert('No se encontraron miembros válidos para importar. Asegúrese de que el formato sea: nombre,rol,alias,email');
        }
    } catch (error) {
        console.error("Error importing from CSV:", error);
        alert('Ocurrió un error al importar el archivo CSV.');
    }
  };

  const handleAddOrUpdateDocument = async (proposalId: string, documentData: { name: string; file: { name: string; content: string }; notes: string }, documentId?: string) => {
    if (!currentUser) return;
    try {
        const updatedProposal = await api.addOrUpdateDocument(proposalId, documentData, documentId, currentUser.id);
        setProposals(prev => prev.map(p => p.id === proposalId ? updatedProposal : p));
        setSelectedProposal(updatedProposal);
        setModalState({ type: null });
        const notifMsg = documentId
            ? `Se subió una nueva versión a "${documentData.name}" en la propuesta "${updatedProposal.title}".`
            : `Se añadió el documento "${documentData.name}" a la propuesta "${updatedProposal.title}".`;
        addNotification(notifMsg, proposalId);
    } catch(e) {
        console.error("Failed to add/update document", e);
        alert('Error al subir el documento.');
    }
  };
  
  const handleStatusChange = async (proposalId: string, newStatus: ProposalStatus) => {
    if (!currentUser) return;
    const originalProposal = proposals.find(p => p.id === proposalId);
    if (!originalProposal || originalProposal.status === newStatus) return;

    try {
        const updatedProposal = await api.updateProposalStatus(proposalId, newStatus, currentUser.id);
        setProposals(prev => prev.map(p => p.id === proposalId ? updatedProposal : p));
        if (selectedProposal?.id === proposalId) setSelectedProposal(updatedProposal);
        addNotification(`El estado de "${originalProposal.title}" cambió a ${newStatus}.`, proposalId);
    } catch(e) {
        console.error("Failed to update status", e);
        alert('Error al cambiar el estado.');
    }
  };

  const handleConfirmArchiveToggle = async (proposalId: string) => {
    if (!currentUser) return;
    const originalProposal = proposals.find(p => p.id === proposalId);
    if (!originalProposal) return;
    
    try {
        const isArchiving = !originalProposal.isArchived;
        await api.toggleArchiveProposal(proposalId, currentUser.id);
        await fetchAllData();
        addNotification(`La propuesta "${originalProposal.title}" fue ${isArchiving ? 'archivada' : 'desarchivada'}.`, proposalId);
        setSelectedProposal(null);
        if (!isArchiving) setShowArchived(false);
    } catch(e) {
        console.error("Failed to archive/unarchive proposal", e);
        alert('Error al archivar/desarchivar la propuesta.');
    }
  };
  
  const handleArchiveToggleRequest = (proposalId: string) => {
    const proposal = proposals.find(p => p.id === proposalId);
    if (!proposal) return;

    if (proposal.isArchived) {
      setModalState({ type: 'confirmAction', data: {
          title: 'Desarchivar Propuesta',
          message: `¿Estás seguro de que quieres desarchivar la propuesta "${proposal.title}"? Volverá a la lista de propuestas activas con el estado "Borrador".`,
          confirmText: 'Desarchivar',
          onConfirm: () => handleConfirmArchiveToggle(proposalId),
      }});
    } else {
      setModalState({ type: 'confirmAction', data: {
          title: 'Archivar Propuesta',
          message: `¿Estás seguro de que quieres archivar la propuesta "${proposal.title}"? No será visible en la lista principal.`,
          confirmText: 'Archivar',
          onConfirm: () => handleConfirmArchiveToggle(proposalId),
      }});
    }
  };

  const handleConfirmLeaderChange = async (proposalId: string, leaderId: string) => {
    if (!currentUser) return;
    try {
        const updatedProposal = await api.updateProposalLeader(proposalId, leaderId, currentUser.id);
        setProposals(prev => prev.map(p => p.id === proposalId ? updatedProposal : p));
        if (selectedProposal?.id === proposalId) setSelectedProposal(updatedProposal);
    } catch(e) {
        console.error("Failed to update leader", e);
        alert('Error al reasignar el líder.');
    }
  };

  const handleLeaderChangeRequest = (proposalId: string, newLeaderId: string) => {
    const proposal = proposals.find(p => p.id === proposalId);
    const newLeader = teamMembers.find(tm => tm.id === newLeaderId);

    if (!proposal || !newLeader || proposal.leaderId === newLeaderId) return;

    setModalState({ type: 'confirmAction', data: {
        title: 'Reasignar Líder de Propuesta',
        message: `¿Estás seguro de que quieres reasignar el líder de la propuesta a "${newLeader.name}"?`,
        confirmText: 'Reasignar',
        onConfirm: () => handleConfirmLeaderChange(proposalId, newLeaderId),
    }});
  };

  const handleAssignMember = async (proposalId: string, memberId: string, hours: number) => {
    if (!currentUser) return;
    try {
        const updatedProposal = await api.assignTeamMember(proposalId, memberId, hours, currentUser.id);
        setProposals(prev => prev.map(p => p.id === proposalId ? updatedProposal : p));
        if (selectedProposal?.id === proposalId) setSelectedProposal(updatedProposal);
    } catch(e) {
        console.error("Failed to assign member", e);
        alert('Error al asignar miembro.');
    }
  };

  const handleUnassignMember = async (proposalId: string, memberId: string) => {
      if (!currentUser) return;
      try {
        const updatedProposal = await api.unassignTeamMember(proposalId, memberId, currentUser.id);
        setProposals(prev => prev.map(p => p.id === proposalId ? updatedProposal : p));
        if (selectedProposal?.id === proposalId) setSelectedProposal(updatedProposal);
      } catch(e) {
        console.error("Failed to unassign member", e);
        alert('Error al quitar miembro.');
    }
  };
  
  const handleUpdateAssignedHours = async (proposalId: string, memberId: string, hours: number) => {
      if (!currentUser) return;
      try {
        const updatedProposal = await api.updateAssignedHours(proposalId, memberId, hours, currentUser.id);
        setProposals(prev => prev.map(p => p.id === proposalId ? updatedProposal : p));
        if (selectedProposal?.id === proposalId) setSelectedProposal(updatedProposal);
      } catch(e) {
        console.error("Failed to update hours", e);
        alert('Error al actualizar horas.');
    }
  };

  const handleUpdateProposalDetails = async (proposalId: string, details: { title: string; description: string; deadline: Date; alertDate?: Date }) => {
    if (!currentUser) return;
    try {
        const updatedProposal = await api.updateProposalDetails(proposalId, details, currentUser.id);
        setProposals(prev => prev.map(p => p.id === proposalId ? updatedProposal : p));
        if (selectedProposal?.id === proposalId) setSelectedProposal(updatedProposal);
        addNotification(`Se actualizaron los detalles de la propuesta "${details.title}".`, proposalId);
    } catch(e) {
        console.error("Failed to update proposal details", e);
        alert('Error al actualizar los detalles.');
    }
  };

  const handleAddComment = async (proposalId: string, text: string) => {
    if (!currentUser) return;
    try {
        const updatedProposal = await api.addComment(proposalId, text, currentUser.id);
        setProposals(prev => prev.map(p => p.id === proposalId ? updatedProposal : p));
        if (selectedProposal?.id === proposalId) setSelectedProposal(updatedProposal);
    } catch(e) {
        console.error("Failed to add comment", e);
        alert('Error al añadir el comentario.');
    }
  };

  const handleCreateTask = async (proposalId: string, taskData: Omit<Task, 'id' | 'createdAt' | 'createdBy' | 'status' | 'comments'>) => {
    if (!currentUser) return;
    try {
      const updatedProposal = await api.createTask(proposalId, taskData, currentUser.id);
      setProposals(prev => prev.map(p => (p.id === proposalId ? updatedProposal : p)));
      if (selectedProposal?.id === proposalId) setSelectedProposal(updatedProposal);
    } catch (e) {
      console.error("Failed to create task", e);
      alert('Error al crear la tarea.');
    }
  };
  
  const handleUpdateTask = async (proposalId: string, taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'createdBy'>>) => {
    if (!currentUser) return;
    try {
      const updatedProposal = await api.updateTask(proposalId, taskId, updates, currentUser.id);
      setProposals(prev => prev.map(p => (p.id === proposalId ? updatedProposal : p)));
      if (selectedProposal?.id === proposalId) setSelectedProposal(updatedProposal);
    } catch (e) {
      console.error("Failed to update task", e);
      alert('Error al actualizar la tarea.');
    }
  };

  const handleDeleteTask = async (proposalId: string, taskId: string) => {
    if (!currentUser) return;
    try {
      const updatedProposal = await api.deleteTask(proposalId, taskId, currentUser.id);
      setProposals(prev => prev.map(p => (p.id === proposalId ? updatedProposal : p)));
      if (selectedProposal?.id === proposalId) setSelectedProposal(updatedProposal);
    } catch (e) {
      console.error("Failed to delete task", e);
      alert('Error al eliminar la tarea.');
    }
  };

  const handleAddCommentToTask = async (proposalId: string, taskId: string, text: string) => {
    if (!currentUser) return;
    try {
        const updatedProposal = await api.addCommentToTask(proposalId, taskId, text, currentUser.id);
        setProposals(prev => prev.map(p => (p.id === proposalId ? updatedProposal : p)));
        if (selectedProposal?.id === proposalId) {
          setSelectedProposal(updatedProposal);
        }

        const task = updatedProposal.tasks.find(t => t.id === taskId);
        if (task?.assignedToId && task.assignedToId !== currentUser.id) {
            const assignee = teamMembers.find(tm => tm.id === task.assignedToId);
            if (assignee) {
                addNotification(`${currentUser.name} comentó en tu tarea "${task.title}" en la propuesta "${updatedProposal.title}".`, proposalId);
            }
        }
    } catch (e) {
        console.error("Failed to add comment to task", e);
        alert('Error al añadir el comentario a la tarea.');
    }
  };
  
  const handleMarkNotificationAsRead = (notificationId: string) => setNotifications(prev => prev.map(n => (n.id === notificationId ? { ...n, read: true } : n)));
  const handleMarkAllNotificationsAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  
  const handleNotificationClick = (notification: Notification) => {
    handleMarkNotificationAsRead(notification.id);
    const proposalToSelect = proposals.find(p => p.id === notification.proposalId);
    if (proposalToSelect) handleSelectProposal(proposalToSelect);
  };

  const handleSelectProposal = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setSelectedClient(null);
    setCurrentView('proposals');
  };

  const handleSelectProposalFromClient = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setCurrentView('proposals');
  };
  
  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    setClientDetailProposalsPage(1);
    setCurrentView('clients');
  };

  const handleBackFromProposalDetail = () => {
    const proposalClientId = selectedProposal?.clientId;
    setSelectedProposal(null);
    if (selectedClient && selectedClient.id === proposalClientId) {
      setCurrentView('clients');
    } else {
      setSelectedClient(null);
      setCurrentView('proposals');
    }
  };
  
  const handleBackToClientList = () => setSelectedClient(null);
  
  const handleToggleShowArchived = () => {
    setShowArchived(prev => !prev);
    setProposalsCurrentPage(1);
  }

  const handleNavigate = (view: View) => {
    if (view === 'clients' && !hasRole('Admin') && !hasRole('ProjectManager')) return;
    if (view === 'team' && !hasRole('Admin')) return;
    setCurrentView(view);
    setSelectedProposal(null);
    setSelectedClient(null);
  };
  
  const handleShowDocumentVersions = (data: { proposalTitle: string; date: Date; versions: DocumentVersion[] }) => setModalState({ type: 'viewDocumentVersions', data });

  const renderModalContent = () => {
    switch (modalState.type) {
      case 'createProposal':
        return <CreateProposalForm clients={clients} onSubmit={handleCreateProposal} onCancel={() => setModalState({ type: null })} />;
      case 'createClient':
        return <CreateClientForm onSubmit={handleCreateClient} onCancel={() => setModalState({ type: null })} />;
      case 'editClient':
        return <EditClientForm client={modalState.data.client} onSubmit={handleUpdateClient} onCancel={() => setModalState({ type: null })} />;
      case 'createTeamMember':
        return <CreateTeamMemberForm currentUser={currentUser} onSubmit={handleCreateTeamMember} onCancel={() => setModalState({ type: null })} />;
      case 'editTeamMember':
        return <EditTeamMemberForm currentUser={currentUser} member={modalState.data.member} onSubmit={handleUpdateTeamMember} onCancel={() => setModalState({ type: null })} />;
      case 'uploadDocument':
        return <UploadDocumentForm proposalId={modalState.data.proposalId} documentId={modalState.data.documentId} documentName={modalState.data.documentName} onSubmit={handleAddOrUpdateDocument} onCancel={() => setModalState({ type: null })} />;
      case 'viewHistory':
        return <DocumentHistory document={modalState.data.document} onCancel={() => setModalState({ type: null })} />;
      case 'viewDocumentVersions':
        return <DocumentVersionsModal data={modalState.data} onCancel={() => setModalState({ type: null })} />;
      case 'confirmAction':
        return <ConfirmationDialog title={modalState.data.title} message={modalState.data.message} confirmText={modalState.data.confirmText} onConfirm={() => { modalState.data.onConfirm(); setModalState({ type: null }); }} onCancel={() => setModalState({ type: null })} />;
      default: return null;
    }
  };
  
  const visibleProposals = useMemo(() => {
    const baseProposals = proposals.filter(p => showArchived ? p.isArchived : !p.isArchived);
    const userFilteredProposals = (canViewAllProposals || !currentUser) ? baseProposals : baseProposals.filter(p => p.leaderId === currentUser.id || p.assignedTeam.some(m => m.memberId === currentUser.id));

    if (!debouncedQuery) return userFilteredProposals;

    const lowercasedQuery = debouncedQuery.toLowerCase();
    const clientsMap = new Map(clients.map(c => [c.id, c]));
    
    return userFilteredProposals.filter(proposal => {
      const client = clientsMap.get(proposal.clientId);
      const titleMatch = proposal.title.toLowerCase().includes(lowercasedQuery);
      const clientMatch = client?.companyName.toLowerCase().includes(lowercasedQuery);
      return titleMatch || clientMatch;
    });
  }, [proposals, showArchived, currentUser, canViewAllProposals, debouncedQuery, clients]);

  const renderCurrentView = () => {
    if (isLoading) return <Spinner />;

    if (selectedProposal) {
      return (
         <ProposalDetail proposal={selectedProposal} currentUser={currentUser} clients={clients} teamMembers={teamMembers} onBack={handleBackFromProposalDetail} onUploadNew={() => setModalState({ type: 'uploadDocument', data: { proposalId: selectedProposal.id } })} onUploadVersion={(documentId, documentName) => setModalState({ type: 'uploadDocument', data: { proposalId: selectedProposal.id, documentId, documentName } })} onViewHistory={(document) => setModalState({ type: 'viewHistory', data: { document } })} onUpdateStatus={handleStatusChange} onArchiveToggleRequest={handleArchiveToggleRequest} onUpdateProposalLeader={handleLeaderChangeRequest} onUpdateProposalDetails={handleUpdateProposalDetails} onAssignMember={handleAssignMember} onUnassignMember={handleUnassignMember} onUpdateAssignedHours={handleUpdateAssignedHours} onAddComment={handleAddComment} onCreateTask={handleCreateTask} onUpdateTask={handleUpdateTask} onDeleteTask={handleDeleteTask} onAddCommentToTask={handleAddCommentToTask} />
      );
    }
    
    const proposalsTotalPages = Math.ceil(visibleProposals.length / ITEMS_PER_PAGE);
    const paginatedProposals = visibleProposals.slice((proposalsCurrentPage - 1) * ITEMS_PER_PAGE, proposalsCurrentPage * ITEMS_PER_PAGE);

    const clientsTotalPages = Math.ceil(clients.length / ITEMS_PER_PAGE);
    const paginatedClients = clients.slice((clientsCurrentPage - 1) * ITEMS_PER_PAGE, clientsCurrentPage * ITEMS_PER_PAGE);

    const teamTotalPages = Math.ceil(teamMembers.length / ITEMS_PER_PAGE);
    const paginatedTeamMembers = teamMembers.slice((teamCurrentPage - 1) * ITEMS_PER_PAGE, teamCurrentPage * ITEMS_PER_PAGE);

    switch (currentView) {
      case 'dashboard':
        return <Dashboard currentUser={currentUser} proposals={proposals} clients={clients} teamMembers={teamMembers} onSelectProposal={handleSelectProposal} onNavigate={handleNavigate} />;
      case 'proposals':
        return <ProposalList proposals={paginatedProposals} totalProposals={visibleProposals.length} clients={clients} teamMembers={teamMembers} currentUser={currentUser} onSelectProposal={handleSelectProposal} onCreateProposal={() => setModalState({ type: 'createProposal' })} showArchived={showArchived} onToggleShowArchived={handleToggleShowArchived} proposalViewMode={proposalViewMode} onSetProposalViewMode={setProposalViewMode} searchQuery={searchQuery} onSearchChange={setSearchQuery} currentPage={proposalsCurrentPage} totalPages={proposalsTotalPages} onPageChange={setProposalsCurrentPage} onShowDocumentVersions={handleShowDocumentVersions} />;
      case 'clients':
        if (selectedClient) {
          const clientProposals = proposals.filter(p => p.clientId === selectedClient.id && !p.isArchived);
          const clientProposalsTotalPages = Math.ceil(clientProposals.length / ITEMS_PER_PAGE);
          const paginatedClientProposals = clientProposals.slice((clientDetailProposalsPage - 1) * ITEMS_PER_PAGE, clientDetailProposalsPage * ITEMS_PER_PAGE);
          return <ClientDetail client={selectedClient} proposals={paginatedClientProposals} onBack={handleBackToClientList} onSelectProposal={handleSelectProposalFromClient} currentPage={clientDetailProposalsPage} totalPages={clientProposalsTotalPages} onPageChange={setClientDetailProposalsPage} />;
        }
        // FIX: Explicitly typed the 'client' parameter in the onEditClient and onDeleteClient callbacks to resolve a TypeScript error where the parameter was being inferred as 'unknown'.
        return <ClientList clients={paginatedClients} currentUser={currentUser} onSelectClient={handleSelectClient} onCreateClient={() => setModalState({ type: 'createClient' })} onEditClient={(client: Client) => setModalState({ type: 'editClient', data: { client } })} onDeleteClient={(client: Client) => setModalState({ type: 'confirmAction', data: { title: 'Eliminar Cliente', message: `¿Estás seguro de que quieres eliminar a "${client.companyName}"?`, confirmText: 'Eliminar', onConfirm: () => handleDeleteClient(client.id) }})} currentPage={clientsCurrentPage} totalPages={clientsTotalPages} onPageChange={setClientsCurrentPage} />;
      case 'team':
        return <TeamList teamMembers={paginatedTeamMembers} currentUser={currentUser} onCreateTeamMember={() => setModalState({ type: 'createTeamMember' })} onImportTeamMembers={handleImportTeamMembers} onEditTeamMember={(member) => setModalState({ type: 'editTeamMember', data: { member } })} onDeleteTeamMember={(member) => setModalState({ type: 'confirmAction', data: { title: 'Eliminar Miembro', message: `¿Estás seguro de que quieres eliminar a "${member.name}"?`, confirmText: 'Eliminar', onConfirm: () => handleDeleteTeamMember(member.id) }})} currentPage={teamCurrentPage} totalPages={teamTotalPages} onPageChange={setTeamCurrentPage} />;
      default: return null;
    }
  };

  if (!currentUser) {
    return <LoginScreen users={usersForLogin} onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200">
      <Header currentUser={currentUser} onLogout={handleLogout} currentView={currentView} onNavigate={handleNavigate} notifications={notifications} onNotificationClick={handleNotificationClick} onMarkAllAsRead={handleMarkAllNotificationsAsRead} />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {renderCurrentView()}
      </main>
      <Modal isOpen={!!modalState.type} onClose={() => setModalState({ type: null })}>
        {renderModalContent()}
      </Modal>
    </div>
  );
};

export default App;