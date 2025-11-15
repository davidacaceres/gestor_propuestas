
import React, { useState, useCallback } from 'react';
import { Proposal, Document, DocumentVersion, ProposalStatus, ModalState, Client, TeamMember, AssignedMember } from './types';
import Header from './components/Header';
import ProposalList from './components/ProposalList';
import ProposalDetail from './components/ProposalDetail';
import ClientList from './components/ClientList';
import ClientDetail from './components/ClientDetail';
import Modal from './components/Modal';
import { PlusIcon, UploadIcon, XIcon, DownloadIcon } from './components/Icon';

const initialClients: Client[] = [
  { id: 'client-1', companyName: 'Innovatech Solutions', contactName: 'Ana Pérez', contactEmail: 'ana.perez@innovatech.com', contactPhone: '555-0101' },
  { id: 'client-2', companyName: 'Quantum Leap Inc.', contactName: 'Carlos García', contactEmail: 'c.garcia@quantumleap.io', contactPhone: '555-0102' },
  { id: 'client-3', companyName: 'Stellar Goods', contactName: 'Laura Martínez', contactEmail: 'laura.m@stellargoods.co', contactPhone: '555-0103' },
];

const initialTeamMembers: TeamMember[] = [
  { id: 'team-1', name: 'Juan Rodríguez', role: 'Diseñador UX/UI' },
  { id: 'team-2', name: 'Sofía López', role: 'Desarrolladora Frontend' },
  { id: 'team-3', name: 'Miguel Hernández', role: 'Jefe de Proyecto' },
  { id: 'team-4', name: 'Valentina Gómez', role: 'Especialista en Marketing' },
];

const initialProposals: Proposal[] = [
  {
    id: 'prop-1',
    title: 'Rediseño del Sitio Web Corporativo',
    clientId: 'client-1',
    description: 'Propuesta completa para el rediseño del sitio web corporativo de Innovatech Solutions, incluyendo UX/UI y desarrollo frontend.',
    deadline: new Date(2023, 10, 30),
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
  },
  {
    id: 'prop-2',
    title: 'Campaña de Marketing Digital Q1 2024',
    clientId: 'client-2',
    description: 'Estrategia y ejecución de campaña de marketing digital para el primer trimestre de 2024.',
    deadline: new Date(2023, 11, 20),
    status: 'Aceptado',
    createdAt: new Date(2023, 11, 5),
    documents: [],
    assignedTeam: [
      { memberId: 'team-4', assignedHours: 60 },
    ],
  },
  {
    id: 'prop-3',
    title: 'Desarrollo de App Móvil',
    clientId: 'client-3',
    description: 'Desarrollo de una aplicación móvil nativa para iOS y Android para Stellar Goods.',
    deadline: new Date(2024, 0, 15),
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
  },
];

type View = 'proposals' | 'clients';

const App: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>(initialProposals);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [modalState, setModalState] = useState<ModalState>({ type: null });
  const [showArchived, setShowArchived] = useState(false);
  const [currentView, setCurrentView] = useState<View>('proposals');

  const handleCreateProposal = (title: string, clientId: string, description: string, deadline: Date) => {
    const newProposal: Proposal = {
      id: `prop-${Date.now()}`,
      title,
      clientId,
      description,
      deadline,
      status: 'Borrador',
      createdAt: new Date(),
      documents: [],
      assignedTeam: [],
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
  }

  const handleAddOrUpdateDocument = (proposalId: string, documentData: { name: string; file: { name: string; content: string }; notes: string }, documentId?: string) => {
    const updatedProposals = proposals.map(p => {
      if (p.id === proposalId) {
        const newVersion: DocumentVersion = {
          versionNumber: 1, // Default for new docs
          fileName: documentData.file.name,
          fileContent: documentData.file.content,
          createdAt: new Date(),
          notes: documentData.notes,
        };

        let updatedDocuments: Document[];

        if (documentId) { // Update existing document
          updatedDocuments = p.documents.map(d => {
            if (d.id === documentId) {
              const latestVersionNumber = d.versions[0]?.versionNumber || 0;
              newVersion.versionNumber = latestVersionNumber + 1;
              return { ...d, versions: [newVersion, ...d.versions] };
            }
            return d;
          });
        } else { // Add new document
          const newDocument: Document = {
            id: `doc-${Date.now()}`,
            name: documentData.name,
            createdAt: new Date(),
            versions: [newVersion],
          };
          updatedDocuments = [...p.documents, newDocument];
        }
        return { ...p, documents: updatedDocuments };
      }
      return p;
    });

    setProposals(updatedProposals);
    const updatedSelectedProposal = updatedProposals.find(p => p.id === proposalId) || null;
    setSelectedProposal(updatedSelectedProposal);
    setModalState({ type: null });
  };
  
  const handleUpdateProposalStatus = (proposalId: string, status: ProposalStatus) => {
    const originalProposal = proposals.find(p => p.id === proposalId);
    if (!originalProposal) return;

    const wasArchived = originalProposal.status === 'Archivado';
    const isNowArchived = status === 'Archivado';
    
    const isArchiving = !wasArchived && isNowArchived;
    const isUnarchiving = wasArchived && !isNowArchived;

    const updatedProposals = proposals.map(p =>
      p.id === proposalId ? { ...p, status } : p
    );
    setProposals(updatedProposals);

    if (isArchiving) {
      setSelectedProposal(null);
    } else if (isUnarchiving) {
      setShowArchived(false);
      setSelectedProposal(null);
    } else {
      if (selectedProposal && selectedProposal.id === proposalId) {
        setSelectedProposal(prev => (prev ? { ...prev, status } : null));
      }
    }
  };

  const handleAssignMember = (proposalId: string, memberId: string, hours: number) => {
    const updatedProposals = proposals.map(p => {
        if (p.id === proposalId) {
            const newAssignment: AssignedMember = { memberId, assignedHours: hours };
            if (p.assignedTeam.some(m => m.memberId === memberId)) {
                return p;
            }
            return { ...p, assignedTeam: [...p.assignedTeam, newAssignment] };
        }
        return p;
    });

    setProposals(updatedProposals);
    if (selectedProposal && selectedProposal.id === proposalId) {
        setSelectedProposal(updatedProposals.find(p => p.id === proposalId) || null);
    }
  };

  const handleUnassignMember = (proposalId: string, memberId: string) => {
    const updatedProposals = proposals.map(p => {
        if (p.id === proposalId) {
            return {
                ...p,
                assignedTeam: p.assignedTeam.filter(m => m.memberId !== memberId)
            };
        }
        return p;
    });
    setProposals(updatedProposals);
    if (selectedProposal && selectedProposal.id === proposalId) {
        setSelectedProposal(updatedProposals.find(p => p.id === proposalId) || null);
    }
  };
  
  const handleUpdateAssignedHours = (proposalId: string, memberId: string, hours: number) => {
    const updatedProposals = proposals.map(p => {
        if (p.id === proposalId) {
            const updatedTeam = p.assignedTeam.map(m =>
                m.memberId === memberId ? { ...m, assignedHours: hours } : m
            );
            return { ...p, assignedTeam: updatedTeam };
        }
        return p;
    });

    setProposals(updatedProposals);
    if (selectedProposal && selectedProposal.id === proposalId) {
        setSelectedProposal(updatedProposals.find(p => p.id === proposalId) || null);
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
      default:
        return null;
    }
  };

  const visibleProposals = proposals.filter(p => 
    showArchived ? p.status === 'Archivado' : p.status !== 'Archivado'
  );

  const renderCurrentView = () => {
    // A selected proposal always has rendering priority
    if (selectedProposal) {
      return (
         <ProposalDetail
            proposal={selectedProposal}
            clients={clients}
            teamMembers={teamMembers}
            onBack={handleBackFromProposalDetail}
            onUploadNew={() => setModalState({ type: 'uploadDocument', data: { proposalId: selectedProposal.id } })}
            onUploadVersion={(documentId, documentName) => setModalState({ type: 'uploadDocument', data: { proposalId: selectedProposal.id, documentId, documentName } })}
            onViewHistory={(document) => setModalState({ type: 'viewHistory', data: { document } })}
            onUpdateStatus={handleUpdateProposalStatus}
            onAssignMember={handleAssignMember}
            onUnassignMember={handleUnassignMember}
            onUpdateAssignedHours={handleUpdateAssignedHours}
          />
      );
    }

    switch (currentView) {
      case 'proposals':
        return (
          <ProposalList
            proposals={visibleProposals}
            clients={clients}
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
            onSelectClient={handleSelectClient}
            onCreateClient={() => setModalState({ type: 'createClient' })} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200">
      <Header currentView={currentView} onNavigate={handleNavigate} />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {renderCurrentView()}
      </main>
      <Modal isOpen={!!modalState.type} onClose={() => setModalState({ type: null })}>
        {renderModalContent()}
      </Modal>
    </div>
  );
};

// Modal Content Components

interface CreateProposalFormProps {
  clients: Client[];
  onSubmit: (title: string, clientId: string, description: string, deadline: Date) => void;
  onCancel: () => void;
}

const CreateProposalForm: React.FC<CreateProposalFormProps> = ({ clients, onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [clientId, setClientId] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && clientId && description.trim() && deadline) {
      const [year, month, day] = deadline.split('-').map(Number);
      const deadlineDate = new Date(year, month - 1, day);
      onSubmit(title, clientId, description, deadlineDate);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Nueva Propuesta</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título de la Propuesta</label>
          <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required />
        </div>
        <div>
          <label htmlFor="client" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cliente</label>
          <select id="client" value={clientId} onChange={e => setClientId(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
            <option value="" disabled>Selecciona un cliente</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.companyName}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
          <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required></textarea>
        </div>
        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha Límite de Entrega</label>
          <input type="date" id="deadline" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
        </div>
      </div>
      <div className="mt-8 flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500">Cancelar</button>
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center">
          <PlusIcon className="w-5 h-5 mr-2" />
          Crear Propuesta
        </button>
      </div>
    </form>
  );
};


interface CreateClientFormProps {
  onSubmit: (companyName: string, contactName: string, contactEmail: string, contactPhone: string) => void;
  onCancel: () => void;
}

const CreateClientForm: React.FC<CreateClientFormProps> = ({ onSubmit, onCancel }) => {
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyName.trim() && contactName.trim() && contactEmail.trim() && contactPhone.trim()) {
      onSubmit(companyName, contactName, contactEmail, contactPhone);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Nuevo Cliente</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Empresa</label>
          <input type="text" id="companyName" value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required />
        </div>
        <div>
          <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre de Contacto</label>
          <input type="text" id="contactName" value={contactName} onChange={e => setContactName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required />
        </div>
        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email de Contacto</label>
          <input type="email" id="contactEmail" value={contactEmail} onChange={e => setContactEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required />
        </div>
        <div>
          <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono de Contacto</label>
          <input type="tel" id="contactPhone" value={contactPhone} onChange={e => setContactPhone(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required />
        </div>
      </div>
      <div className="mt-8 flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500">Cancelar</button>
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center">
          <PlusIcon className="w-5 h-5 mr-2" />
          Crear Cliente
        </button>
      </div>
    </form>
  );
};


interface UploadDocumentFormProps {
  proposalId: string;
  documentId?: string;
  documentName?: string;
  onSubmit: (proposalId: string, data: { name: string; file: { name: string, content: string }; notes: string }, documentId?: string) => void;
  onCancel: () => void;
}

const UploadDocumentForm: React.FC<UploadDocumentFormProps> = ({ proposalId, documentId, documentName, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [file, setFile] = useState<{name: string, content: string} | null>(null);
  const [notes, setNotes] = useState('');

  const isNewVersion = !!documentId;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFile({ name: f.name, content: event.target?.result as string });
      };
      reader.readAsDataURL(f);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file && (isNewVersion || name.trim())) {
      onSubmit(proposalId, { name: isNewVersion ? documentName! : name, file, notes }, documentId);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">{isNewVersion ? `Nueva Versión para "${documentName}"` : 'Añadir Nuevo Documento'}</h2>
      <div className="space-y-4">
        {!isNewVersion && (
          <div>
            <label htmlFor="docName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre del Documento</label>
            <input type="text" id="docName" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
          </div>
        )}
        <div>
           <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Archivo</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md dark:border-gray-600">
            <div className="space-y-1 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <div className="flex text-sm text-gray-600 dark:text-gray-400">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                  <span>Subir un archivo</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} required />
                </label>
                <p className="pl-1">o arrastrar y soltar</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">{file ? file.name : 'PNG, JPG, PDF, etc.'}</p>
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notas de la Versión</label>
          <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder={isNewVersion ? 'Ej: Correcciones basadas en feedback.' : 'Ej: Versión inicial del documento.'} required></textarea>
        </div>
      </div>
      <div className="mt-8 flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500">Cancelar</button>
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center">
          <UploadIcon className="w-5 h-5 mr-2" />
          {isNewVersion ? 'Subir Versión' : 'Añadir Documento'}
        </button>
      </div>
    </form>
  );
};


interface DocumentHistoryProps {
    document: Document;
    onCancel: () => void;
}

const DocumentHistory: React.FC<DocumentHistoryProps> = ({ document, onCancel }) => {
    
    const handleDownload = (version: DocumentVersion) => {
        if (!version.fileContent) {
            alert('El contenido del archivo no está disponible para descargar.');
            return;
        }
        // FIX: Use `window.document` to avoid conflict with the `document` prop, which was shadowing the global document object.
        const link = window.document.createElement('a');
        link.href = version.fileContent;
        link.download = version.fileName;
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
    };

    return (
        <div>
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Historial de Versiones</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">"{document.name}"</p>
                </div>
                <button onClick={onCancel} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:hover:bg-gray-700 dark:hover:text-gray-300">
                    <XIcon className="w-6 h-6" />
                </button>
            </div>
            <div className="mt-6 flow-root">
                <ul role="list" className="-mb-8 max-h-[60vh] overflow-y-auto pr-4">
                    {document.versions.map((version, versionIdx) => (
                        <li key={version.versionNumber}>
                            <div className="relative pb-8">
                                {versionIdx !== document.versions.length - 1 ? (
                                    <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
                                ) : null}
                                <div className="relative flex space-x-3 items-start">
                                    <div>
                                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800 ${versionIdx === 0 ? 'bg-primary-500' : 'bg-gray-400'}`}>
                                            <span className="text-white font-bold text-sm">V{version.versionNumber}</span>
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0 pt-1.5">
                                        <div className="flex justify-between items-center text-sm">
                                            <p className="text-gray-500 dark:text-gray-400">
                                                {version.createdAt.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                            <div className="flex items-center gap-x-3">
                                                <p className="font-medium text-gray-700 dark:text-gray-300 truncate" title={version.fileName}>{version.fileName}</p>
                                                <button onClick={() => handleDownload(version)} className="text-primary-600 hover:text-primary-800 transition-colors dark:text-primary-400 dark:hover:text-primary-300" title={`Descargar ${version.fileName}`}>
                                                    <DownloadIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                                            <p className="text-sm text-gray-800 dark:text-gray-200">{version.notes}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default App;
