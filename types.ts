export type ProposalStatus = 'Borrador' | 'Enviado' | 'Aceptado' | 'Rechazado' | 'Archivado';

export type DocumentVersion = {
  versionNumber: number;
  fileName: string;
  fileContent: string; // base64 encoded string
  createdAt: Date;
  notes: string;
};

export type Document = {
  id: string;
  name: string;
  versions: DocumentVersion[];
  createdAt: Date;
};

export type Proposal = {
  id: string;
  title: string;
  client: string;
  status: ProposalStatus;
  createdAt: Date;
  documents: Document[];
};

export type ModalState = {
  type: 'createProposal' | 'uploadDocument' | 'viewHistory' | null;
  data?: any;
};