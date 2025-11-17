import { Proposal, Client, TeamMember, User, Role, ProposalStatus, Document, DocumentVersion, AssignedMember, ProposalHistoryEntry, Comment, Task } from './types';

// --- MOCK DATABASE ---

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
  ...Array.from({ length: 15 }, (_, i) => {
    const isArchived = i === 3 || i === 7;
    const status = (['Borrador', 'Enviado', 'Aceptado', 'Rechazado'] as ProposalStatus[])[i % 4];
    return {
      id: `prop-${i + 1}`,
      title: `Propuesta de Expansión ${i + 1}`,
      clientId: initialClients[i % initialClients.length].id,
      leaderId: initialTeamMembers[i % initialTeamMembers.length].id,
      description: `Descripción detallada para la propuesta de expansión #${i + 1}.`,
      deadline: new Date(new Date().setDate(new Date().getDate() + (i * 2) + 5)),
      alertDate: new Date(new Date().setDate(new Date().getDate() + i + 2)),
      status: isArchived && status === 'Borrador' ? 'Rechazado' : status,
      isArchived,
      createdAt: new Date(2023, 10, 15 - i),
      documents: i < 5 ? [
        {
          id: `doc-${i + 1}-1`,
          name: `Contrato Inicial ${i+1}.pdf`,
          createdAt: new Date(new Date().setDate(new Date().getDate() - 10 + i)),
          versions: [
            {
              versionNumber: 1,
              fileName: `Contrato_v1_${i+1}.pdf`,
              fileContent: 'data:application/pdf;base64,',
              createdAt: new Date(new Date().setDate(new Date().getDate() - 10 + i)),
              notes: 'Versión inicial'
            }
          ]
        }
      ] : [],
      assignedTeam: [],
      history: [],
      comments: [],
      tasks: [],
    }
  }),
];


let db = {
  clients: initialClients,
  teamMembers: initialTeamMembers,
  proposals: initialProposals,
};

// Function to simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const deepCopy = <T>(data: T): T => JSON.parse(JSON.stringify(data));

/**
 * @module API
 * Este módulo simula un backend para la aplicación de Gestión de Propuestas.
 * Todas las funciones son asíncronas y devuelven Promesas para imitar las solicitudes de red reales.
 * Los datos se almacenan en memoria y se restablecerán al actualizar la página.
 */

// --- AUTH & USERS ---

/**
 * Obtiene la lista de usuarios para la pantalla de inicio de sesión.
 * @returns {Promise<User[]>} Una promesa que se resuelve en un array de usuarios.
 */
export const getUsersForLogin = async (): Promise<User[]> => {
    await delay(150);
    const users = db.teamMembers.map(tm => ({ id: tm.id, name: tm.name, roles: tm.roles }));
    return deepCopy(users);
};

// --- PROPOSALS ---

/**
 * Obtiene todas las propuestas.
 * @returns {Promise<Proposal[]>} Una promesa que se resuelve en un array de propuestas.
 */
export const getProposals = async (): Promise<Proposal[]> => {
    await delay(300);
    return deepCopy(db.proposals);
};

/**
 * Crea una nueva propuesta.
 * @param {object} data - Datos para la nueva propuesta.
 * @param {string} data.title - Título de la propuesta.
 * @param {string} data.clientId - ID del cliente asociado.
 * @param {string} data.description - Descripción de la propuesta.
 * @param {Date} data.deadline - Fecha límite.
 * @param {Date} [data.alertDate] - Fecha de alerta opcional.
 * @param {string} authorId - ID del usuario que crea la propuesta.
 * @returns {Promise<Proposal>} Una promesa que se resuelve con la propuesta recién creada.
 */
export const createProposal = async (data: { title: string; clientId: string; description: string; deadline: Date; alertDate?: Date }, authorId: string): Promise<Proposal> => {
    await delay(400);
    const newProposal: Proposal = {
      id: `prop-${Date.now()}`,
      title: data.title,
      clientId: data.clientId,
      description: data.description,
      deadline: data.deadline,
      alertDate: data.alertDate,
      status: 'Borrador',
      isArchived: false,
      createdAt: new Date(),
      documents: [],
      assignedTeam: [],
      history: [{ id: `hist-${Date.now()}`, authorId, type: 'creation', description: 'Propuesta creada.', timestamp: new Date() }],
      comments: [],
      tasks: [],
    };
    db.proposals.unshift(newProposal);
    return deepCopy(newProposal);
};

/**
 * Actualiza los detalles principales de una propuesta.
 * @param {string} proposalId - ID de la propuesta a actualizar.
 * @param {object} details - Detalles a actualizar.
 * @param {string} authorId - ID del usuario que realiza la actualización.
 * @returns {Promise<Proposal>} La propuesta actualizada.
 */
export const updateProposalDetails = async (proposalId: string, details: { title: string; description: string; deadline: Date; alertDate?: Date }, authorId: string): Promise<Proposal> => {
    await delay(300);
    const proposalIndex = db.proposals.findIndex(p => p.id === proposalId);
    if (proposalIndex === -1) throw new Error("Proposal not found");
    
    const originalProposal = db.proposals[proposalIndex];
    const changes: string[] = [];
    if (originalProposal.title !== details.title) changes.push('título');
    if (originalProposal.description !== details.description) changes.push('descripción');
    if (new Date(originalProposal.deadline).getTime() !== new Date(details.deadline).getTime()) changes.push('fecha límite');
    const oldAlertDate = originalProposal.alertDate ? new Date(originalProposal.alertDate).getTime() : undefined;
    const newAlertDate = details.alertDate ? new Date(details.alertDate).getTime() : undefined;
    if (oldAlertDate !== newAlertDate) changes.push('fecha de alerta');
    
    const description = changes.length > 0 ? `Se actualizó: ${changes.join(', ')}.` : 'Se guardaron los detalles sin cambios.';

    const newEntry: ProposalHistoryEntry = { id: `hist-${Date.now()}`, authorId, type: 'general', description, timestamp: new Date() };

    db.proposals[proposalIndex] = { ...originalProposal, ...details, history: [newEntry, ...originalProposal.history] };
    return deepCopy(db.proposals[proposalIndex]);
};

/**
 * Cambia el estado de una propuesta.
 * @param {string} proposalId - ID de la propuesta.
 * @param {ProposalStatus} newStatus - Nuevo estado.
 * @param {string} authorId - ID del usuario.
 * @returns {Promise<Proposal>} La propuesta actualizada.
 */
export const updateProposalStatus = async (proposalId: string, newStatus: ProposalStatus, authorId: string): Promise<Proposal> => {
    await delay(250);
    const proposalIndex = db.proposals.findIndex(p => p.id === proposalId);
    if (proposalIndex === -1) throw new Error("Proposal not found");

    const originalStatus = db.proposals[proposalIndex].status;
    const newEntry: ProposalHistoryEntry = { id: `hist-${Date.now()}`, authorId, type: 'status', description: `Estado cambiado de "${originalStatus}" a "${newStatus}".`, timestamp: new Date() };
    
    db.proposals[proposalIndex].status = newStatus;
    db.proposals[proposalIndex].history.unshift(newEntry);
    return deepCopy(db.proposals[proposalIndex]);
};

/**
 * Archiva o desarchiva una propuesta.
 * @param {string} proposalId - ID de la propuesta.
 * @param {string} authorId - ID del usuario.
 * @returns {Promise<Proposal>} La propuesta actualizada.
 */
export const toggleArchiveProposal = async (proposalId: string, authorId: string): Promise<Proposal> => {
    await delay(300);
    const proposalIndex = db.proposals.findIndex(p => p.id === proposalId);
    if (proposalIndex === -1) throw new Error("Proposal not found");
    
    const isArchiving = !db.proposals[proposalIndex].isArchived;
    const description = isArchiving ? 'Propuesta archivada.' : 'Propuesta desarchivada.';
    const newEntry: ProposalHistoryEntry = { id: `hist-${Date.now()}`, authorId, type: 'archive', description, timestamp: new Date() };

    db.proposals[proposalIndex].isArchived = isArchiving;
    if (!isArchiving) db.proposals[proposalIndex].status = 'Borrador';
    db.proposals[proposalIndex].history.unshift(newEntry);
    
    return deepCopy(db.proposals[proposalIndex]);
};

/**
 * Cambia el líder de una propuesta.
 * @param {string} proposalId - ID de la propuesta.
 * @param {string} leaderId - ID del nuevo líder.
 * @param {string} authorId - ID del usuario.
 * @returns {Promise<Proposal>} La propuesta actualizada.
 */
export const updateProposalLeader = async (proposalId: string, leaderId: string, authorId: string): Promise<Proposal> => {
    await delay(250);
    const proposalIndex = db.proposals.findIndex(p => p.id === proposalId);
    if (proposalIndex === -1) throw new Error("Proposal not found");

    const oldLeaderId = db.proposals[proposalIndex].leaderId;
    const oldLeader = oldLeaderId ? db.teamMembers.find(tm => tm.id === oldLeaderId) : null;
    const newLeader = db.teamMembers.find(tm => tm.id === leaderId);
    if (!newLeader) throw new Error("New leader not found");
    
    const description = oldLeader ? `Líder cambiado de "${oldLeader.name}" a "${newLeader.name}".` : `"${newLeader.name}" fue asignado como líder.`;
    const newEntry: ProposalHistoryEntry = { id: `hist-${Date.now()}`, authorId, type: 'team', description, timestamp: new Date() };

    db.proposals[proposalIndex].leaderId = leaderId;
    db.proposals[proposalIndex].history.unshift(newEntry);
    return deepCopy(db.proposals[proposalIndex]);
};

/**
 * Añade o actualiza un documento en una propuesta.
 * @param {string} proposalId - ID de la propuesta.
 * @param {object} documentData - Datos del documento.
 * @param {string} [documentId] - ID del documento si es una nueva versión.
 * @param {string} authorId - ID del usuario.
 * @returns {Promise<Proposal>} La propuesta actualizada.
 */
export const addOrUpdateDocument = async (proposalId: string, documentData: { name: string; file: { name: string; content: string }; notes: string }, documentId: string | undefined, authorId: string): Promise<Proposal> => {
    await delay(500);
    const proposalIndex = db.proposals.findIndex(p => p.id === proposalId);
    if (proposalIndex === -1) throw new Error("Proposal not found");
    
    const proposal = db.proposals[proposalIndex];
    const newVersion: DocumentVersion = {
        versionNumber: 1,
        fileName: documentData.file.name,
        fileContent: documentData.file.content,
        createdAt: new Date(),
        notes: documentData.notes,
    };
    let historyDescription = '';

    if (documentId) { // Update
        const docIndex = proposal.documents.findIndex(d => d.id === documentId);
        if (docIndex === -1) throw new Error("Document not found");
        const latestVersionNumber = proposal.documents[docIndex].versions[0]?.versionNumber || 0;
        newVersion.versionNumber = latestVersionNumber + 1;
        proposal.documents[docIndex].versions.unshift(newVersion);
        historyDescription = `Nueva versión subida para el documento: "${documentData.name}".`;
    } else { // Add new
        const newDocument: Document = { id: `doc-${Date.now()}`, name: documentData.name, createdAt: new Date(), versions: [newVersion] };
        proposal.documents.push(newDocument);
        historyDescription = `Nuevo documento añadido: "${documentData.name}".`;
    }

    const newEntry: ProposalHistoryEntry = { id: `hist-${Date.now()}`, authorId, type: 'document', description: historyDescription, timestamp: new Date() };
    proposal.history.unshift(newEntry);
    
    db.proposals[proposalIndex] = proposal;
    return deepCopy(proposal);
};

/**
 * Asigna un miembro del equipo a una propuesta.
 * @param {string} proposalId - ID de la propuesta.
 * @param {string} memberId - ID del miembro a asignar.
 * @param {number} hours - Horas asignadas.
 * @param {string} authorId - ID del usuario.
 * @returns {Promise<Proposal>} La propuesta actualizada.
 */
export const assignTeamMember = async (proposalId: string, memberId: string, hours: number, authorId: string): Promise<Proposal> => {
    await delay(300);
    const proposalIndex = db.proposals.findIndex(p => p.id === proposalId);
    if (proposalIndex === -1) throw new Error("Proposal not found");
    
    const member = db.teamMembers.find(tm => tm.id === memberId);
    if (!member) throw new Error("Team member not found");

    const proposal = db.proposals[proposalIndex];
    if (proposal.assignedTeam.some(m => m.memberId === memberId)) return proposal; // Already assigned

    const newAssignment: AssignedMember = { memberId, assignedHours: hours };
    const newEntry: ProposalHistoryEntry = { id: `hist-${Date.now()}`, authorId, type: 'team', description: `"${member.name}" fue asignado al equipo con ${hours} horas.`, timestamp: new Date() };
    
    proposal.assignedTeam.push(newAssignment);
    proposal.history.unshift(newEntry);
    
    db.proposals[proposalIndex] = proposal;
    return deepCopy(proposal);
};

/**
 * Desasigna un miembro del equipo de una propuesta.
 * @param {string} proposalId - ID de la propuesta.
 * @param {string} memberId - ID del miembro a desasignar.
 * @param {string} authorId - ID del usuario.
 * @returns {Promise<Proposal>} La propuesta actualizada.
 */
export const unassignTeamMember = async (proposalId: string, memberId: string, authorId: string): Promise<Proposal> => {
    await delay(300);
    const proposalIndex = db.proposals.findIndex(p => p.id === proposalId);
    if (proposalIndex === -1) throw new Error("Proposal not found");

    const member = db.teamMembers.find(tm => tm.id === memberId);
    if (!member) throw new Error("Team member not found");
    
    const proposal = db.proposals[proposalIndex];
    const newEntry: ProposalHistoryEntry = { id: `hist-${Date.now()}`, authorId, type: 'team', description: `"${member.name}" fue quitado del equipo.`, timestamp: new Date() };

    proposal.assignedTeam = proposal.assignedTeam.filter(m => m.memberId !== memberId);
    proposal.history.unshift(newEntry);

    db.proposals[proposalIndex] = proposal;
    return deepCopy(proposal);
};

/**
 * Actualiza las horas asignadas de un miembro en una propuesta.
 * @param {string} proposalId - ID de la propuesta.
 * @param {string} memberId - ID del miembro.
 * @param {number} hours - Nuevas horas.
 * @param {string} authorId - ID del usuario.
 * @returns {Promise<Proposal>} La propuesta actualizada.
 */
export const updateAssignedHours = async (proposalId: string, memberId: string, hours: number, authorId: string): Promise<Proposal> => {
    await delay(250);
    const proposalIndex = db.proposals.findIndex(p => p.id === proposalId);
    if (proposalIndex === -1) throw new Error("Proposal not found");
    
    const member = db.teamMembers.find(tm => tm.id === memberId);
    if (!member) throw new Error("Team member not found");
    
    const proposal = db.proposals[proposalIndex];
    const assignmentIndex = proposal.assignedTeam.findIndex(m => m.memberId === memberId);
    if (assignmentIndex === -1) throw new Error("Member not assigned to proposal");
    
    const oldHours = proposal.assignedTeam[assignmentIndex].assignedHours;
    const newEntry: ProposalHistoryEntry = { id: `hist-${Date.now()}`, authorId, type: 'team', description: `Horas de "${member.name}" actualizadas de ${oldHours} a ${hours}.`, timestamp: new Date() };

    proposal.assignedTeam[assignmentIndex].assignedHours = hours;
    proposal.history.unshift(newEntry);

    db.proposals[proposalIndex] = proposal;
    return deepCopy(proposal);
};

/**
 * Añade un comentario a una propuesta.
 * @param {string} proposalId - ID de la propuesta.
 * @param {string} text - Contenido del comentario.
 * @param {string} authorId - ID del autor.
 * @returns {Promise<Proposal>} La propuesta actualizada.
 */
export const addComment = async (proposalId: string, text: string, authorId: string): Promise<Proposal> => {
    await delay(200);
    const proposalIndex = db.proposals.findIndex(p => p.id === proposalId);
    if (proposalIndex === -1) throw new Error("Proposal not found");
    
    const proposal = db.proposals[proposalIndex];
    const newComment: Comment = { id: `comment-${Date.now()}`, authorId, text, createdAt: new Date() };
    
    if (!proposal.comments) proposal.comments = [];
    proposal.comments.unshift(newComment);

    db.proposals[proposalIndex] = proposal;
    return deepCopy(proposal);
};


// --- TASKS ---

/**
 * Crea una nueva tarea en una propuesta.
 * @param {string} proposalId - ID de la propuesta.
 * @param {object} taskData - Datos de la nueva tarea (incluye title, y opcionalmente description, assignedToId, dueDate).
 * @param {string} authorId - ID del usuario que crea la tarea.
 * @returns {Promise<Proposal>} La propuesta actualizada con la nueva tarea.
 */
export const createTask = async (proposalId: string, taskData: Omit<Task, 'id' | 'createdAt' | 'createdBy' | 'status'>, authorId: string): Promise<Proposal> => {
    await delay(300);
    const proposalIndex = db.proposals.findIndex(p => p.id === proposalId);
    if (proposalIndex === -1) throw new Error("Proposal not found");

    const proposal = db.proposals[proposalIndex];
    const newTask: Task = {
        id: `task-${Date.now()}`,
        ...taskData,
        status: 'Pendiente',
        createdAt: new Date(),
        createdBy: authorId,
    };

    proposal.tasks.push(newTask);
    
    const historyEntry: ProposalHistoryEntry = {
        id: `hist-${Date.now()}`,
        authorId,
        type: 'task',
        description: `Nueva tarea creada: "${newTask.title}".`,
        timestamp: new Date(),
    };
    proposal.history.unshift(historyEntry);
    
    return deepCopy(proposal);
};

/**
 * Actualiza una tarea existente en una propuesta.
 * @param {string} proposalId - ID de la propuesta.
 * @param {string} taskId - ID de la tarea a actualizar.
 * @param {object} updates - Campos de la tarea a actualizar (p. ej. title, description, status).
 * @param {string} authorId - ID del usuario que realiza la actualización.
 * @returns {Promise<Proposal>} La propuesta actualizada.
 */
export const updateTask = async (proposalId: string, taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'createdBy'>>, authorId: string): Promise<Proposal> => {
    await delay(250);
    const proposalIndex = db.proposals.findIndex(p => p.id === proposalId);
    if (proposalIndex === -1) throw new Error("Proposal not found");

    const proposal = db.proposals[proposalIndex];
    const taskIndex = proposal.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) throw new Error("Task not found");

    const originalTask = proposal.tasks[taskIndex];
    const updatedTask = { ...originalTask, ...updates };
    proposal.tasks[taskIndex] = updatedTask;
    
    const historyDescription = `Tarea actualizada: "${originalTask.title}".` + (updates.status ? ` Estado cambiado a ${updates.status}.` : '');
    const historyEntry: ProposalHistoryEntry = {
        id: `hist-${Date.now()}`,
        authorId,
        type: 'task',
        description: historyDescription,
        timestamp: new Date(),
    };
    proposal.history.unshift(historyEntry);

    return deepCopy(proposal);
};

/**
 * Elimina una tarea de una propuesta.
 * @param {string} proposalId - ID de la propuesta.
 * @param {string} taskId - ID de la tarea a eliminar.
 * @param {string} authorId - ID del usuario que elimina la tarea.
 * @returns {Promise<Proposal>} La propuesta actualizada.
 */
export const deleteTask = async (proposalId: string, taskId: string, authorId: string): Promise<Proposal> => {
    await delay(400);
    const proposalIndex = db.proposals.findIndex(p => p.id === proposalId);
    if (proposalIndex === -1) throw new Error("Proposal not found");

    const proposal = db.proposals[proposalIndex];
    const taskToDelete = proposal.tasks.find(t => t.id === taskId);
    if (!taskToDelete) throw new Error("Task not found");

    proposal.tasks = proposal.tasks.filter(t => t.id !== taskId);

    const historyEntry: ProposalHistoryEntry = {
        id: `hist-${Date.now()}`,
        authorId,
        type: 'task',
        description: `Tarea eliminada: "${taskToDelete.title}".`,
        timestamp: new Date(),
    };
    proposal.history.unshift(historyEntry);

    return deepCopy(proposal);
};


// --- CLIENTS ---

/**
 * Obtiene todos los clientes.
 * @returns {Promise<Client[]>} Una promesa que se resuelve en un array de clientes.
 */
export const getClients = async (): Promise<Client[]> => {
    await delay(200);
    return deepCopy(db.clients);
};

/**
 * Crea un nuevo cliente.
 * @param {Omit<Client, 'id'>} data - Datos del nuevo cliente.
 * @returns {Promise<Client>} El cliente recién creado.
 */
export const createClient = async (data: Omit<Client, 'id'>): Promise<Client> => {
    await delay(300);
    const newClient: Client = { id: `client-${Date.now()}`, ...data };
    db.clients.unshift(newClient);
    return deepCopy(newClient);
};

/**
 * Actualiza un cliente existente.
 * @param {string} clientId - ID del cliente a actualizar.
 * @param {Omit<Client, 'id'>} data - Nuevos datos para el cliente.
 * @returns {Promise<Client>} El cliente actualizado.
 */
export const updateClient = async (clientId: string, data: Omit<Client, 'id'>): Promise<Client> => {
    await delay(300);
    const clientIndex = db.clients.findIndex(c => c.id === clientId);
    if (clientIndex === -1) throw new Error("Client not found");
    db.clients[clientIndex] = { ...db.clients[clientIndex], ...data };
    return deepCopy(db.clients[clientIndex]);
};

/**
 * Elimina un cliente. Falla si el cliente está en uso.
 * @param {string} clientId - ID del cliente a eliminar.
 * @returns {Promise<{ success: true }>} Confirmación de eliminación.
 * @throws Lanza un error si el cliente está asociado a alguna propuesta.
 */
export const deleteClient = async (clientId: string): Promise<{ success: true }> => {
    await delay(400);
    const isClientInUse = db.proposals.some(p => p.clientId === clientId);
    if (isClientInUse) {
        throw new Error('No se puede eliminar este cliente porque está asociado a una o más propuestas.');
    }
    db.clients = db.clients.filter(c => c.id !== clientId);
    return { success: true };
};


// --- TEAM MEMBERS ---

/**
 * Obtiene todos los miembros del equipo.
 * @returns {Promise<TeamMember[]>} Una promesa que se resuelve en un array de miembros del equipo.
 */
export const getTeamMembers = async (): Promise<TeamMember[]> => {
    await delay(200);
    return deepCopy(db.teamMembers);
};

/**
 * Crea un nuevo miembro del equipo.
 * @param {Omit<TeamMember, 'id'>} data - Datos del nuevo miembro.
 * @returns {Promise<TeamMember>} El miembro recién creado.
 */
export const createTeamMember = async (data: Omit<TeamMember, 'id'>): Promise<TeamMember> => {
    await delay(300);
    const newMember: TeamMember = { id: `team-${Date.now()}`, ...data };
    db.teamMembers.unshift(newMember);
    return deepCopy(newMember);
};

/**
 * Actualiza un miembro del equipo existente.
 * @param {string} memberId - ID del miembro a actualizar.
 * @param {Omit<TeamMember, 'id'>} data - Nuevos datos para el miembro.
 * @returns {Promise<TeamMember>} El miembro actualizado.
 */
export const updateTeamMember = async (memberId: string, data: Omit<TeamMember, 'id'>): Promise<TeamMember> => {
    await delay(300);
    const memberIndex = db.teamMembers.findIndex(tm => tm.id === memberId);
    if (memberIndex === -1) throw new Error("Team member not found");
    db.teamMembers[memberIndex] = { ...db.teamMembers[memberIndex], ...data };
    return deepCopy(db.teamMembers[memberIndex]);
};

/**
 * Elimina un miembro del equipo. Falla si el miembro está en uso.
 * @param {string} memberId - ID del miembro a eliminar.
 * @returns {Promise<{ success: true }>} Confirmación de eliminación.
 * @throws Lanza un error si el miembro está asignado a alguna propuesta.
 */
export const deleteTeamMember = async (memberId: string): Promise<{ success: true }> => {
    await delay(400);
    const isMemberInUse = db.proposals.some(p => p.leaderId === memberId || p.assignedTeam.some(at => at.memberId === memberId));
    if (isMemberInUse) {
        throw new Error('No se puede eliminar este miembro porque está asignado como líder o participante en una o más propuestas.');
    }
    db.teamMembers = db.teamMembers.filter(tm => tm.id !== memberId);
    return { success: true };
};

/**
 * Importa miembros del equipo desde un string CSV.
 * @param {string} csvContent - Contenido del archivo CSV.
 * @returns {Promise<TeamMember[]>} Un array de los nuevos miembros importados.
 */
export const importTeamMembers = async (csvContent: string): Promise<TeamMember[]> => {
    await delay(500);
    const lines = csvContent.trim().split('\n');
    const newMembers: TeamMember[] = lines.map((line, index): TeamMember | null => {
        const [name, role, alias, email] = line.split(',').map(field => field ? field.trim() : '');
        if (!name || !role) return null;
        return {
            id: `team-import-${Date.now()}-${index}`,
            name,
            role,
            alias: alias || undefined,
            email: email || undefined,
            roles: ['TeamMember'],
        };
    }).filter((member): member is TeamMember => member !== null);

    if (newMembers.length > 0) {
        db.teamMembers = [...db.teamMembers, ...newMembers];
    }
    return deepCopy(newMembers);
};