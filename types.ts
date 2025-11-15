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
  id:string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  alias?: string;
  email?: string;
};

export type AssignedMember = {
  memberId: string;
  assignedHours: number;
};

export type ProposalHistoryEntryType = 'creation' | 'status' | 'document' | 'team' | 'general';

export type ProposalHistoryEntry = {
  id: string;
  type: ProposalHistoryEntryType;
  description: string;
  timestamp: Date;
};

export type Comment = {
  id: string;
  authorId: string;
  text: string;
  createdAt: Date;
};

export type Proposal = {
  id: string;
  title: string;
  clientId: string;
  description: string;
  deadline: Date;
  alertDate?: Date;
  status: ProposalStatus;
  createdAt: Date;
  documents: Document[];
  assignedTeam: AssignedMember[];
  history: ProposalHistoryEntry[];
  comments: Comment[];
  leaderId?: string;
};

export type Notification = {
  id: string;
  message: string;
  proposalId: string;
  read: boolean;
  createdAt: Date;
};

export type ModalState = {
  type: 'createProposal' | 'uploadDocument' | 'viewHistory' | 'createClient' | 'confirmAction' | 'createTeamMember' | 'editClient' | 'editTeamMember' | null;
  data?: any;
};