import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Proposal, Document, DocumentVersion, ProposalStatus, ModalState, Client, TeamMember, AssignedMember, Notification, ProposalHistoryEntry, Comment, User, Role } from './types';
import Header from './components/Header';
import ProposalList from './components/ProposalList';
import ProposalDetail from './components/ProposalDetail';
import ClientList from './components/ClientList';
import ClientDetail from './components/ClientDetail';
import TeamList from './components/TeamList';
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

const initialClients: Client[] = [
  { id: 'client-1', companyName: 'Innovatech Solutions', contactName: 'Ana Pérez', contactEmail: 'ana.perez@innovatech.com', contactPhone: '555-0101' },
  { id: 'client-2', companyName: 'Quantum Leap Inc.', contactName: 'Carlos García', contactEmail: 'c.garcia@quantumleap.io', contactPhone: '555-0102' },
  { id: 'client-3', companyName: 'Stellar Goods', contactName: 'Laura Martínez', contactEmail: 'laura.m@stellargoods.co', contactPhone: '555-0103' },
];

const initialTeamMembers: TeamMember[] = [
  { id: 'team-1', name: 'Juan Rodríguez', role: 'Diseñador UX/UI', alias: 'juanux', email: 'juan.r@example.com', roles: ['TeamMember'] },
  { id: 'team-2', name: 'Sofía López', role: 'Desarrolladora Frontend', alias: 'sofi', email: 'sofia.l@example.com', roles: ['TeamMember'] },
  { id: 'team-3', name: 'Miguel Hernández', role: 'Jefe de Proyecto', alias: 'mike', email: 'miguel.h@example.com', roles: ['Admin'] },
  { id: 'team-4', name: 'Valentina Gómez', role: 'Especialista en Marketing', alias: 'vale', email: 'valentina.g@example.com', roles: ['ProjectManager', 'TeamMember'] },
];

const initialProposals: Proposal[] = [
  {
    id: 'prop-1',
    title: 'Rediseño del Sitio Web Corporativo',
    clientId: 'client-1',
    leaderId: 'team-3',
    description: 'Propuesta completa para el rediseño del sitio web corporativo de Innovatech Solutions, incluyendo UX/UI y desarrollo frontend.',
    deadline: new Date(new Date().setDate(new Date().getDate() + 5)),
    alertDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    status: 'Enviado',
    createdAt: new Date(2023, 10, 15),
    documents: [
      {
        id: 'doc-1-1',
        name: 'Brief del Proyecto',
        createdAt: new Date(2023, 10, 15),
        versions: [
          { versionNumber: 2, fileName: 'Brief_v2.pdf', fileContent: '', createdAt: new Date(2023, 10, 18), notes: 'Actualizado con feedback del cliente.' },
          { versionNumber: 1, fileName: 'Brief_v1.pdf', fileContent: '', createdAt: new Date(2023, 10, 15), notes: 'Versión inicial.' },
        ],
      },
      {
        id: 'doc-1-2',
        name: 'Cotización Económica',
        createdAt: new Date(2023, 10, 16),
        versions: [
          { versionNumber: 1, fileName: 'Cotizacion.xlsx', fileContent: '', createdAt: new Date(2023, 10, 16), notes: 'Cotización inicial.' },
        ],
      },
    ],
    assignedTeam: [
      { memberId: 'team-1', assignedHours: 40 },
      { memberId: 'team-2', assignedHours: 80 },
    ],
    history: [
        { id: 'hist-1-1', authorId: 'team-2', type: 'status', description: 'Estado cambiado de "Borrador" a "Enviado".', timestamp: new Date(2023, 10, 17) },
        { id: 'hist-1-2', authorId: 'team-3', type: 'creation', description: 'Propuesta creada.', timestamp: new Date(2023, 10, 15) },
    ],
    comments: [
      { id: 'comment-1-1', authorId: 'team-3', text: 'Recordar revisar la cotización antes de enviarla al cliente.', createdAt: new Date(2023, 10, 16) }
    ],
  },
  {
    id: 'prop-2',
    title: 'Campaña de Marketing Digital Q1 2024',
    clientId: 'client-2',
    leaderId: 'team-4',
    description: 'Estrategia y ejecución de campaña de marketing digital para el primer trimestre de 2024.',
    deadline: new Date(2023, 11, 20),
    alertDate: new Date(2023, 11, 15),
    status: 'Aceptado',
    createdAt: new Date(2023, 11, 5),
    documents: [],
    assignedTeam: [
      { memberId: 'team-4', assignedHours: 60 },
    ],
    history: [
       { id: 'hist-2-1', authorId: 'team-4', type: 'creation', description: 'Propuesta creada.', timestamp: new Date(2023, 11, 5) },
    ],
    comments: [],
  },
  {
    id: 'prop-3',
    title: 'Desarrollo de App Móvil',
    clientId: 'client-3',
    leaderId: 'team-3',
    description: 'Desarrollo de una aplicación móvil nativa para iOS y Android para Stellar Goods.',
    deadline: new Date(new Date().setDate(new Date().getDate() + 15)),
    alertDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    status: 'Borrador',
    createdAt: new Date(),
    documents: [
       {
        id: 'doc-3-1',
        name: 'Requerimientos Funcionales',
        createdAt: new Date(),
        versions: [
          { versionNumber: 1, fileName: 'Requerimientos.docx', fileContent: '', createdAt: new Date(), notes: 'Documento inicial de requerimientos.' },
        ],
      },
    ],
    assignedTeam: [],
    history: [
       { id: 'hist-3-1', authorId: 'team-2', type: 'creation', description: 'Propuesta creada.', timestamp: new Date() },
    ],
    comments: [],
  },
];

type View = 'proposals' | 'clients' | 'team';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>(initialProposals);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [modalState, setModalState] = useState<ModalState>({ type: null });
  const [showArchived, setShowArchived] = useState(false);
  const [currentView, setCurrentView] = useState<View>('proposals');

  // Permissions helpers
  const hasRole = useCallback((role: Role) => currentUser?.roles.includes(role) ?? false, [currentUser]);
  const canViewAllProposals = useMemo(() => hasRole('Admin') || hasRole('ProjectManager'), [hasRole]);
  
  const users: User[] = teamMembers.map(tm => ({ id: tm.id, name: tm.name, roles: tm.roles }));

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedProposal(null);
    setSelectedClient(null);
    setCurrentView('proposals');
  };

  const addNotification = useCallback((message: string, proposalId: string) => {
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      message,
      proposalId,
      read: false,
      createdAt: new Date(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  useEffect(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const proposalsNeedingAlert = proposals.filter(p => {
        if (!p.alertDate || p.status === 'Archivado' || p.status === 'Aceptado') {
            return false;
        }
        const alertDate = new Date(p.alertDate);
        const alertDay = new Date(alertDate.getFullYear(), alertDate.getMonth(), alertDate.getDate());
        return today >= alertDay;
    });

    proposalsNeedingAlert.forEach(p => {
      const notificationExists = notifications.some(
        n => n.proposalId === p.id && n.message.includes('alerta')
      );
      if (!notificationExists) {
        addNotification(`La fecha de alerta para "${p.title}" ha llegado.`, p.id);
      }
    });
  }, [proposals, notifications, addNotification]);

  const handleCreateProposal = (title: string, clientId: string, description: string, deadline: Date, alertDate?: Date) => {
    if (!currentUser) return;
    const newProposal: Proposal = {
      id: `prop-${Date.now()}`,
      title,
      clientId,
      description,
      deadline,
      alertDate,
      status: 'Borrador',
      createdAt: new Date(),
      documents: [],
      assignedTeam: [],
      history: [
        {
          id: `hist-${Date.now()}`,
          authorId: currentUser.id,
          type: 'creation',
          description: 'Propuesta creada.',
          timestamp: new Date(),
        }
      ],
      comments: [],
    };
    setProposals(prev => [newProposal, ...prev]);
    setModalState({ type: null });
  };
  
  const handleCreateClient = (companyName: string, contactName: string, contactEmail: string, contactPhone: string) => {
    const newClient: Client = {
      id: `client-${Date.now()}`,
      companyName,
      contactName,
      contactEmail,
      contactPhone,
    };
    setClients(prev => [newClient, ...prev]);
    setModalState({ type: null });
  };

  const handleUpdateClient = (clientId: string, data: Omit<Client, 'id'>) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, ...data } : c));
    setModalState({ type: null });
  };

  const handleDeleteClient = (clientId: string) => {
    if (!hasRole('Admin')) {
        const isClientInUse = proposals.some(p => p.clientId === clientId);
        if (isClientInUse) {
        alert('No se puede eliminar este cliente porque está asociado a una o más propuestas.');
        return;
        }
    }
    setClients(prev => prev.filter(c => c.id !== clientId));
  };

  const handleCreateTeamMember = (name: string, role: string, alias: string | undefined, email: string | undefined, roles: Role[]) => {
    const newMember: TeamMember = {
      id: `team-${Date.now()}`,
      name,
      role,
      alias,
      email,
      roles: roles.length > 0 ? roles : ['TeamMember'],
    };
    setTeamMembers(prev => [newMember, ...prev]);
    setModalState({ type: null });
  };

  const handleUpdateTeamMember = (memberId: string, data: Omit<TeamMember, 'id'>) => {
    setTeamMembers(prev => prev.map(tm => tm.id === memberId ? { ...tm, ...data } : tm));
    setModalState({ type: null });
  };

  const handleDeleteTeamMember = (memberId: string) => {
    if (!hasRole('Admin')) {
        const isMemberInUse = proposals.some(
            p => p.leaderId === memberId || p.assignedTeam.some(at => at.memberId === memberId)
        );
        if (isMemberInUse) {
            alert('No se puede eliminar este miembro porque está asignado como líder o participante en una o más propuestas.');
            return;
        }
    }
    setTeamMembers(prev => prev.filter(tm => tm.id !== memberId));
  };
  
  const handleImportTeamMembers = (fileContent: string) => {
    try {
        const lines = fileContent.trim().split('\n');
        const newMembers: TeamMember[] = lines.map((line, index): TeamMember | null => {
            const [name, role, alias, email] = line.split(',').map(field => field ? field.trim() : '');
            if (!name || !role) {
                console.warn(`Skipping invalid line in CSV: ${index + 1} - ${line}`);
                return null;
            }
            return {
                id: `team-import-${Date.now()}-${index}`,
                name,
                role,
                alias: alias || undefined,
                email: email || undefined,
                roles: ['TeamMember'], // Default role for imported users
            };
        }).filter((member): member is TeamMember => member !== null);

        if (newMembers.length > 0) {
            setTeamMembers(prev => [...prev, ...newMembers]);
            alert(`${newMembers.length} miembro(s) importado(s) correctamente.`);
        } else {
            alert('No se encontraron miembros válidos para importar. Asegúrese de que el formato sea: nombre,rol,alias,email');
        }
    } catch (error) {
        console.error("Error importing from CSV:", error);
        alert('Ocurrió un error al importar el archivo CSV. Por favor, revisa el formato y el contenido.');
    }
  };

  const handleAddOrUpdateDocument = (proposalId: string, documentData: { name: string; file: { name: string; content: string }; notes: string }, documentId?: string) => {
    if (!currentUser) return;
    let proposalTitle = '';
    
    setProposals(prevProposals => {
        const updatedProposals = prevProposals.map(p => {
            if (p.id === proposalId) {
                proposalTitle = p.title;
                const newVersion: DocumentVersion = {
                    versionNumber: 1,
                    fileName: documentData.file.name,
                    fileContent: documentData.file.content,
                    createdAt: new Date(),
                    notes: documentData.notes,
                };

                let updatedDocuments: Document[];
                let historyDescription = '';

                if (documentId) { // Update
                    updatedDocuments = p.documents.map(d => {
                        if (d.id === documentId) {
                            const latestVersionNumber = d.versions[0]?.versionNumber || 0;
                            newVersion.versionNumber = latestVersionNumber + 1;
                            return { ...d, versions: [newVersion, ...d.versions] };
                        }
                        return d;
                    });
                    historyDescription = `Nueva versión subida para el documento: "${documentData.name}".`;
                } else { // Add new
                    const newDocument: Document = {
                        id: `doc-${Date.now()}`,
                        name: documentData.name,
                        createdAt: new Date(),
                        versions: [newVersion],
                    };
                    updatedDocuments = [...p.documents, newDocument];
                    historyDescription = `Nuevo documento añadido: "${documentData.name}".`;
                }
                
                const newEntry: ProposalHistoryEntry = {
                    id: `hist-${Date.now()}`,
                    authorId: currentUser.id,
                    type: 'document',
                    description: historyDescription,
                    timestamp: new Date(),
                };

                return { ...p, documents: updatedDocuments, history: [newEntry, ...(p.history || [])] };
            }
            return p;
        });
        
        const updatedSelectedProposal = updatedProposals.find(p => p.id === proposalId) || null;
        setSelectedProposal(updatedSelectedProposal);
        setModalState({ type: null });

        const notifMsg = documentId
            ? `Se subió una nueva versión a "${documentData.name}" en la propuesta "${proposalTitle}".`
            : `Se añadió el documento "${documentData.name}" a la propuesta "${proposalTitle}".`;
        addNotification(notifMsg, proposalId);
        
        return updatedProposals;
    });
  };
  
  const handleConfirmStatusChange = (proposalId: string, status: ProposalStatus) => {
      if (!currentUser) return;
      const originalProposal = proposals.find(p => p.id === proposalId);
      if (!originalProposal) return;
      
      if (originalProposal.status === status) return;

      const wasArchived = originalProposal.status === 'Archivado';
      const isNowArchived = status === 'Archivado';
      
      const isArchiving = !wasArchived && isNowArchived;
      const isUnarchiving = wasArchived && !isNowArchived;

      setProposals(prevProposals => {
          const updatedProposals = prevProposals.map(p => {
              if (p.id === proposalId) {
                  const newEntry: ProposalHistoryEntry = {
                      id: `hist-${Date.now()}`,
                      authorId: currentUser.id,
                      type: 'status',
                      description: `Estado cambiado de "${originalProposal.status}" a "${status}".`,
                      timestamp: new Date(),
                  };
                  return { ...p, status, history: [newEntry, ...(p.history || [])] };
              }
              return p;
          });
          
          addNotification(`El estado de "${originalProposal.title}" cambió a ${status}.`, proposalId);

          if (isArchiving) {
              setSelectedProposal(null);
          } else if (isUnarchiving) {
              setShowArchived(false);
              setSelectedProposal(null);
          } else {
              if (selectedProposal && selectedProposal.id === proposalId) {
                  const updatedProposal = updatedProposals.find(up => up.id === proposalId);
                  setSelectedProposal(updatedProposal || null);
              }
          }
          
          return updatedProposals;
      });
  };


  const handleStatusChangeRequest = (proposalId: string, newStatus: ProposalStatus) => {
    const proposal = proposals.find(p => p.id === proposalId);
    if (!proposal || proposal.status === newStatus) return;

    const isArchiving = proposal.status !== 'Archivado' && newStatus === 'Archivado';
    const isUnarchiving = proposal.status === 'Archivado' && newStatus !== 'Archivado';

    if (isArchiving) {
      setModalState({
        type: 'confirmAction',
        data: {
          title: 'Archivar Propuesta',
          message: `¿Estás seguro de que quieres archivar la propuesta "${proposal.title}"? No será visible en la lista principal.`,
          confirmText: 'Archivar',
          onConfirm: () => handleConfirmStatusChange(proposalId, newStatus),
        }
      });
    } else if (isUnarchiving) {
      setModalState({
        type: 'confirmAction',
        data: {
          title: 'Desarchivar Propuesta',
          message: `¿Estás seguro de que quieres desarchivar la propuesta "${proposal.title}"? Volverá a la lista de propuestas activas con el estado "Borrador".`,
          confirmText: 'Desarchivar',
          onConfirm: () => handleConfirmStatusChange(proposalId, 'Borrador'),
        }
      });
    } else {
      handleConfirmStatusChange(proposalId, newStatus);
    }
  };

  const handleConfirmLeaderChange = (proposalId: string, leaderId: string) => {
    if (!currentUser) return;
    const leader = teamMembers.find(tm => tm.id === leaderId);
    if (!leader) return;

    setProposals(prevProposals => {
        const updatedProposals = prevProposals.map(p => {
            if (p.id === proposalId) {
                const oldLeaderId = p.leaderId;
                const oldLeader = oldLeaderId ? teamMembers.find(tm => tm.id === oldLeaderId) : null;
                
                const description = oldLeader
                    ? `Líder cambiado de "${oldLeader.name}" a "${leader.name}".`
                    : `"${leader.name}" fue asignado como líder.`;

                const newEntry: ProposalHistoryEntry = {
                    id: `hist-${Date.now()}`,
                    authorId: currentUser.id,
                    type: 'team',
                    description,
                    timestamp: new Date(),
                };
                return { ...p, leaderId, history: [newEntry, ...(p.history || [])] };
            }
            return p;
        });

        if (selectedProposal && selectedProposal.id === proposalId) {
            setSelectedProposal(updatedProposals.find(p => p.id === proposalId) || null);
        }
        
        return updatedProposals;
    });
  };

  const handleLeaderChangeRequest = (proposalId: string, newLeaderId: string) => {
    const proposal = proposals.find(p => p.id === proposalId);
    const newLeader = teamMembers.find(tm => tm.id === newLeaderId);

    if (!proposal || !newLeader || proposal.leaderId === newLeaderId) {
      return;
    }

    setModalState({
      type: 'confirmAction',
      data: {
        title: 'Reasignar Líder de Propuesta',
        message: `¿Estás seguro de que quieres reasignar el líder de la propuesta a "${newLeader.name}"?`,
        confirmText: 'Reasignar',
        onConfirm: () => handleConfirmLeaderChange(proposalId, newLeaderId),
      }
    });
  };

  const handleAssignMember = (proposalId: string, memberId: string, hours: number) => {
    if (!currentUser) return;
    const member = teamMembers.find(tm => tm.id === memberId);
    if (!member) return;

    setProposals(prevProposals => {
        const updatedProposals = prevProposals.map(p => {
            if (p.id === proposalId) {
                if (p.assignedTeam.some(m => m.memberId === memberId)) {
                    return p;
                }
                const newAssignment: AssignedMember = { memberId, assignedHours: hours };
                const newEntry: ProposalHistoryEntry = {
                    id: `hist-${Date.now()}`,
                    authorId: currentUser.id,
                    type: 'team',
                    description: `"${member.name}" fue asignado al equipo con ${hours} horas.`,
                    timestamp: new Date(),
                };
                return { ...p, assignedTeam: [...p.assignedTeam, newAssignment], history: [newEntry, ...(p.history || [])] };
            }
            return p;
        });

        if (selectedProposal && selectedProposal.id === proposalId) {
            setSelectedProposal(updatedProposals.find(p => p.id === proposalId) || null);
        }
        
        return updatedProposals;
    });
  };

  const handleUnassignMember = (proposalId: string, memberId: string) => {
      if (!currentUser) return;
      const member = teamMembers.find(tm => tm.id === memberId);
      if (!member) return;
      
      setProposals(prevProposals => {
          const updatedProposals = prevProposals.map(p => {
              if (p.id === proposalId) {
                  const newEntry: ProposalHistoryEntry = {
                      id: `hist-${Date.now()}`,
                      authorId: currentUser.id,
                      type: 'team',
                      description: `"${member.name}" fue quitado del equipo.`,
                      timestamp: new Date(),
                  };
                  return {
                      ...p,
                      assignedTeam: p.assignedTeam.filter(m => m.memberId !== memberId),
                      history: [newEntry, ...(p.history || [])]
                  };
              }
              return p;
          });

          if (selectedProposal && selectedProposal.id === proposalId) {
              setSelectedProposal(updatedProposals.find(p => p.id === proposalId) || null);
          }
          
          return updatedProposals;
      });
  };
  
  const handleUpdateAssignedHours = (proposalId: string, memberId: string, hours: number) => {
      if (!currentUser) return;
      const member = teamMembers.find(tm => tm.id === memberId);
      if (!member) return;

      setProposals(prevProposals => {
          const updatedProposals = prevProposals.map(p => {
              if (p.id === proposalId) {
                  const oldAssignment = p.assignedTeam.find(m => m.memberId === memberId);
                  const oldHours = oldAssignment ? oldAssignment.assignedHours : '?';
                  const newEntry: ProposalHistoryEntry = {
                      id: `hist-${Date.now()}`,
                      authorId: currentUser.id,
                      type: 'team',
                      description: `Horas de "${member.name}" actualizadas de ${oldHours} a ${hours}.`,
                      timestamp: new Date(),
                  };
                  const updatedTeam = p.assignedTeam.map(m =>
                      m.memberId === memberId ? { ...m, assignedHours: hours } : m
                  );
                  return { ...p, assignedTeam: updatedTeam, history: [newEntry, ...(p.history || [])] };
              }
              return p;
          });

          if (selectedProposal && selectedProposal.id === proposalId) {
              setSelectedProposal(updatedProposals.find(p => p.id === proposalId) || null);
          }
          
          return updatedProposals;
      });
  };

  const handleUpdateProposalDetails = (
    proposalId: string,
    details: { title: string; description: string; deadline: Date; alertDate?: Date }
  ) => {
    if (!currentUser) return;
    setProposals(prevProposals => {
      const originalProposal = prevProposals.find(p => p.id === proposalId);
      if (!originalProposal) return prevProposals;

      const changes: string[] = [];
      if (originalProposal.title !== details.title) changes.push('título');
      if (originalProposal.description !== details.description) changes.push('descripción');
      if (new Date(originalProposal.deadline).getTime() !== new Date(details.deadline).getTime()) changes.push('fecha límite');
      
      const oldAlertDate = originalProposal.alertDate ? new Date(originalProposal.alertDate).getTime() : undefined;
      const newAlertDate = details.alertDate ? new Date(details.alertDate).getTime() : undefined;
      if (oldAlertDate !== newAlertDate) changes.push('fecha de alerta');
      
      const description = changes.length > 0
        ? `Se actualizó: ${changes.join(', ')}.`
        : 'Se guardaron los detalles de la propuesta sin cambios.';

      const updatedProposals = prevProposals.map(p => {
        if (p.id === proposalId) {
          const newEntry: ProposalHistoryEntry = {
            id: `hist-${Date.now()}`,
            authorId: currentUser.id,
            type: 'general',
            description,
            timestamp: new Date(),
          };
          return { 
            ...p,
            title: details.title,
            description: details.description,
            deadline: details.deadline,
            alertDate: details.alertDate,
            history: [newEntry, ...(p.history || [])] 
          };
        }
        return p;
      });
  
      if (selectedProposal && selectedProposal.id === proposalId) {
        setSelectedProposal(updatedProposals.find(p => p.id === proposalId) || null);
      }
  
      addNotification(`Se actualizaron los detalles de la propuesta "${details.title}".`, proposalId);
  
      return updatedProposals;
    });
  };

  const handleAddComment = (proposalId: string, text: string) => {
    if (!currentUser) return;
    setProposals(prevProposals => {
        const updatedProposals = prevProposals.map(p => {
            if (p.id === proposalId) {
                const newComment: Comment = {
                    id: `comment-${Date.now()}`,
                    authorId: currentUser.id,
                    text,
                    createdAt: new Date(),
                };
                const newComments = [newComment, ...(p.comments || [])];
                return { ...p, comments: newComments };
            }
            return p;
        });

        if (selectedProposal && selectedProposal.id === proposalId) {
            setSelectedProposal(updatedProposals.find(p => p.id === proposalId) || null);
        }
        
        return updatedProposals;
    });
  };
  
  const handleMarkNotificationAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };
  
  const handleNotificationClick = (notification: Notification) => {
    handleMarkNotificationAsRead(notification.id);
    const proposalToSelect = proposals.find(p => p.id === notification.proposalId);
    if (proposalToSelect) {
      handleSelectProposal(proposalToSelect);
    }
  };

  const handleSelectProposal = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setSelectedClient(null); // Clear client context to ensure back button goes to proposal list
    setCurrentView('proposals');
  };

  const handleSelectProposalFromClient = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    // Do not clear selectedClient, it's our navigation context
    setCurrentView('proposals'); // Switch view to render ProposalDetail
  };
  
  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    setCurrentView('clients');
  };

  const handleBackFromProposalDetail = () => {
    const proposalClientId = selectedProposal?.clientId;
    setSelectedProposal(null);

    // If there's a client context and it matches the proposal's client, go back to that client's detail view
    if (selectedClient && selectedClient.id === proposalClientId) {
      setCurrentView('clients');
    } else {
      // Otherwise, default to the main proposal list
      setSelectedClient(null);
      setCurrentView('proposals');
    }
  };
  
  const handleBackToClientList = () => {
    setSelectedClient(null);
  };
  
  const handleToggleShowArchived = () => {
    setShowArchived(prev => !prev);
  }

  const handleNavigate = (view: View) => {
    if (view === 'clients' && !hasRole('Admin') && !hasRole('ProjectManager')) return;
    if (view === 'team' && !hasRole('Admin')) return;
    
    setCurrentView(view);
    setSelectedProposal(null);
    setSelectedClient(null);
  };

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
        return (
          <UploadDocumentForm
            proposalId={modalState.data.proposalId}
            documentId={modalState.data.documentId}
            documentName={modalState.data.documentName}
            onSubmit={handleAddOrUpdateDocument}
            onCancel={() => setModalState({ type: null })}
          />
        );
      case 'viewHistory':
        return <DocumentHistory document={modalState.data.document} onCancel={() => setModalState({ type: null })} />;
      case 'confirmAction':
        return (
          <ConfirmationDialog
            title={modalState.data.title}
            message={modalState.data.message}
            confirmText={modalState.data.confirmText}
            onConfirm={() => {
                modalState.data.onConfirm();
                setModalState({ type: null });
            }}
            onCancel={() => setModalState({ type: null })}
          />
        );
      default:
        return null;
    }
  };

  const visibleProposals = useMemo(() => {
    const filteredByArchive = proposals.filter(p => 
        showArchived ? p.status === 'Archivado' : p.status !== 'Archivado'
    );

    if (canViewAllProposals || !currentUser) {
        return filteredByArchive;
    }

    return filteredByArchive.filter(p => 
        p.leaderId === currentUser.id || 
        p.assignedTeam.some(m => m.memberId === currentUser.id)
    );
  }, [proposals, showArchived, currentUser, canViewAllProposals]);


  const renderCurrentView = () => {
    // A selected proposal always has rendering priority
    if (selectedProposal) {
      return (
         <ProposalDetail
            proposal={selectedProposal}
            currentUser={currentUser}
            clients={clients}
            teamMembers={teamMembers}
            onBack={handleBackFromProposalDetail}
            onUploadNew={() => setModalState({ type: 'uploadDocument', data: { proposalId: selectedProposal.id } })}
            onUploadVersion={(documentId, documentName) => setModalState({ type: 'uploadDocument', data: { proposalId: selectedProposal.id, documentId, documentName } })}
            onViewHistory={(document) => setModalState({ type: 'viewHistory', data: { document } })}
            onUpdateStatus={handleStatusChangeRequest}
            onUpdateProposalLeader={handleLeaderChangeRequest}
            onUpdateProposalDetails={handleUpdateProposalDetails}
            onAssignMember={handleAssignMember}
            onUnassignMember={handleUnassignMember}
            onUpdateAssignedHours={handleUpdateAssignedHours}
            onAddComment={handleAddComment}
          />
      );
    }

    switch (currentView) {
      case 'proposals':
        return (
          <ProposalList
            proposals={visibleProposals}
            clients={clients}
            teamMembers={teamMembers}
            currentUser={currentUser}
            onSelectProposal={handleSelectProposal}
            onCreateProposal={() => setModalState({ type: 'createProposal' })}
            showArchived={showArchived}
            onToggleShowArchived={handleToggleShowArchived}
          />
        );
      case 'clients':
        if (selectedClient) {
          const clientProposals = proposals.filter(p => p.clientId === selectedClient.id);
          return (
            <ClientDetail 
              client={selectedClient}
              proposals={clientProposals}
              onBack={handleBackToClientList}
              onSelectProposal={handleSelectProposalFromClient}
            />
          );
        }
        return (
          <ClientList 
            clients={clients}
            currentUser={currentUser}
            onSelectClient={handleSelectClient}
            onCreateClient={() => setModalState({ type: 'createClient' })} 
            onEditClient={(client) => setModalState({ type: 'editClient', data: { client } })}
            onDeleteClient={(client) => setModalState({ type: 'confirmAction', data: {
              title: 'Eliminar Cliente',
              message: `¿Estás seguro de que quieres eliminar a "${client.companyName}"? ${hasRole('Admin') ? 'Esta acción no se puede deshacer.' : ''}`,
              confirmText: 'Eliminar',
              onConfirm: () => handleDeleteClient(client.id)
            }})}
          />
        );
      case 'team':
        return (
          <TeamList
            teamMembers={teamMembers}
            currentUser={currentUser}
            onCreateTeamMember={() => setModalState({ type: 'createTeamMember' })}
            onImportTeamMembers={handleImportTeamMembers}
            onEditTeamMember={(member) => setModalState({ type: 'editTeamMember', data: { member } })}
            onDeleteTeamMember={(member) => setModalState({ type: 'confirmAction', data: {
              title: 'Eliminar Miembro',
              message: `¿Estás seguro de que quieres eliminar a "${member.name}"? ${hasRole('Admin') ? 'Esta acción no se puede deshacer.' : ''}`,
              confirmText: 'Eliminar',
              onConfirm: () => handleDeleteTeamMember(member.id)
            }})}
          />
        );
      default:
        return null;
    }
  };

  if (!currentUser) {
    return <LoginScreen users={users} onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200">
      <Header 
        currentUser={currentUser}
        onLogout={handleLogout}
        currentView={currentView} 
        onNavigate={handleNavigate} 
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
      />
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