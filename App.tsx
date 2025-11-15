import React, { useState, useCallback } from 'react';
import { Proposal, Document, DocumentVersion, ProposalStatus, ModalState } from './types';
import Header from './components/Header';
import ProposalList from './components/ProposalList';
import ProposalDetail from './components/ProposalDetail';
import Modal from './components/Modal';
import { PlusIcon, UploadIcon, XIcon, DownloadIcon } from './components/Icon';

const initialProposals: Proposal[] = [
  {
    id: 'prop-1',
    title: 'Rediseño del Sitio Web Corporativo',
    client: 'Innovatech Solutions',
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
  },
  {
    id: 'prop-2',
    title: 'Campaña de Marketing Digital Q1 2024',
    client: 'Quantum Leap Inc.',
    status: 'Aceptado',
    createdAt: new Date(2023, 11, 5),
    documents: [],
  },
  {
    id: 'prop-3',
    title: 'Desarrollo de App Móvil',
    client: 'Stellar Goods',
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
  },
];

const App: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>(initialProposals);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [modalState, setModalState] = useState<ModalState>({ type: null });
  const [showArchived, setShowArchived] = useState(false);

  const handleCreateProposal = (title: string, client: string) => {
    const newProposal: Proposal = {
      id: `prop-${Date.now()}`,
      title,
      client,
      status: 'Borrador',
      createdAt: new Date(),
      documents: [],
    };
    setProposals(prev => [newProposal, ...prev]);
    setModalState({ type: null });
  };
  
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

  const handleSelectProposal = (proposal: Proposal) => {
    setSelectedProposal(proposal);
  };
  
  const handleBackToList = () => {
    setSelectedProposal(null);
  };
  
  const handleToggleShowArchived = () => {
    setShowArchived(prev => !prev);
  }

  const renderModalContent = () => {
    switch (modalState.type) {
      case 'createProposal':
        return <CreateProposalForm onSubmit={handleCreateProposal} onCancel={() => setModalState({ type: null })} />;
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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {!selectedProposal ? (
          <ProposalList
            proposals={visibleProposals}
            onSelectProposal={handleSelectProposal}
            onCreateProposal={() => setModalState({ type: 'createProposal' })}
            showArchived={showArchived}
            onToggleShowArchived={handleToggleShowArchived}
          />
        ) : (
          <ProposalDetail
            proposal={selectedProposal}
            onBack={handleBackToList}
            onUploadNew={() => setModalState({ type: 'uploadDocument', data: { proposalId: selectedProposal.id } })}
            onUploadVersion={(documentId, documentName) => setModalState({ type: 'uploadDocument', data: { proposalId: selectedProposal.id, documentId, documentName } })}
            onViewHistory={(document) => setModalState({ type: 'viewHistory', data: { document } })}
            onUpdateStatus={handleUpdateProposalStatus}
          />
        )}
      </main>
      <Modal isOpen={!!modalState.type} onClose={() => setModalState({ type: null })}>
        {renderModalContent()}
      </Modal>
    </div>
  );
};

// Modal Content Components

interface CreateProposalFormProps {
  onSubmit: (title: string, client: string) => void;
  onCancel: () => void;
}

const CreateProposalForm: React.FC<CreateProposalFormProps> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && client.trim()) {
      onSubmit(title, client);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Nueva Propuesta</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título de la Propuesta</label>
          <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" required />
        </div>
        <div>
          <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
          <input type="text" id="client" value={client} onChange={e => setClient(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" required />
        </div>
      </div>
      <div className="mt-8 flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">Cancelar</button>
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center">
          <PlusIcon className="w-5 h-5 mr-2" />
          Crear Propuesta
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{isNewVersion ? `Nueva Versión para "${documentName}"` : 'Añadir Nuevo Documento'}</h2>
      <div className="space-y-4">
        {!isNewVersion && (
          <div>
            <label htmlFor="docName" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Documento</label>
            <input type="text" id="docName" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" required />
          </div>
        )}
        <div>
           <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">Archivo</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <div className="flex text-sm text-gray-600">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                  <span>Subir un archivo</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} required />
                </label>
                <p className="pl-1">o arrastrar y soltar</p>
              </div>
              <p className="text-xs text-gray-500">{file ? file.name : 'PNG, JPG, PDF, etc.'}</p>
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notas de la Versión</label>
          <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" placeholder={isNewVersion ? 'Ej: Correcciones basadas en feedback.' : 'Ej: Versión inicial del documento.'} required></textarea>
        </div>
      </div>
      <div className="mt-8 flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">Cancelar</button>
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
        const link = document.createElement('a');
        link.href = version.fileContent;
        link.download = version.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Historial de Versiones</h2>
                    <p className="text-gray-600 mt-1">"{document.name}"</p>
                </div>
                <button onClick={onCancel} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <XIcon className="w-6 h-6" />
                </button>
            </div>
            <div className="mt-6 flow-root">
                <ul role="list" className="-mb-8 max-h-[60vh] overflow-y-auto pr-4">
                    {document.versions.map((version, versionIdx) => (
                        <li key={version.versionNumber}>
                            <div className="relative pb-8">
                                {versionIdx !== document.versions.length - 1 ? (
                                    <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                ) : null}
                                <div className="relative flex space-x-3 items-start">
                                    <div>
                                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${versionIdx === 0 ? 'bg-primary-500' : 'bg-gray-400'}`}>
                                            <span className="text-white font-bold text-sm">V{version.versionNumber}</span>
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0 pt-1.5">
                                        <div className="flex justify-between items-center text-sm">
                                            <p className="text-gray-500">
                                                {version.createdAt.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                            <div className="flex items-center gap-x-3">
                                                <p className="font-medium text-gray-700 truncate" title={version.fileName}>{version.fileName}</p>
                                                <button onClick={() => handleDownload(version)} className="text-primary-600 hover:text-primary-800 transition-colors" title={`Descargar ${version.fileName}`}>
                                                    <DownloadIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-2 p-3 bg-gray-50 rounded-md">
                                            <p className="text-sm text-gray-800">{version.notes}</p>
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