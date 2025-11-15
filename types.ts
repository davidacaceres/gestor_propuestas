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

export type Client = {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
};

export type Proposal = {
  id: string;
  title: string;
  clientId: string;
  description: string;
  deadline: Date;
  status: ProposalStatus;
  createdAt: Date;
  documents: Document[];
};

export type ModalState = {
  type: 'createProposal' | 'uploadDocument' | 'viewHistory' | 'createClient' | null;
  data?: any;
};