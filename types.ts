export type ProposalStatus = 'Borrador' | 'Enviado' | 'Aceptado' | 'Rechazado';

export type Role = 'Admin' | 'ProjectManager' | 'TeamMember';

export type User = {
  id: string;
  name: string;
  roles: Role[];
};

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
  roles: Role[];
};

export type AssignedMember = {
  memberId: string;
  assignedHours: number;
};

export type ProposalHistoryEntryType = 'creation' | 'status' | 'document' | 'team' | 'general' | 'archive' | 'task';

export type ProposalHistoryEntry = {
  id: string;
  authorId: string;
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

export type TaskStatus = 'Pendiente' | 'En Progreso' | 'Completada';

export type TaskPriority = 'Alta' | 'Media' | 'Baja';

export type Task = {
  id: string;
  title: string;
  description?: string;
  assignedToId?: string;
  dueDate?: Date;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Date;
  createdBy: string;
  comments?: Comment[];
};

export type Proposal = {
  id: string;
  title: string;
  clientId: string;
  description: string;
  deadline: Date;
  alertDate?: Date;
  status: ProposalStatus;
  isArchived: boolean;
  createdAt: Date;
  documents: Document[];
  assignedTeam: AssignedMember[];
  history: ProposalHistoryEntry[];
  comments: Comment[];
  tasks: Task[];
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
  type: 'createProposal' | 'uploadDocument' | 'viewHistory' | 'createClient' | 'confirmAction' | 'createTeamMember' | 'editClient' | 'editTeamMember' | 'viewDocumentVersions' | null;
  data?: any;
};

export type View = 'dashboard' | 'proposals' | 'clients' | 'team';

// Props for paginated lists
export interface ProposalListProps {
  proposals: Proposal[];
  totalProposals: number;
  clients: Client[];
  teamMembers: TeamMember[];
  currentUser: User | null;
  onSelectProposal: (proposal: Proposal) => void;
  onCreateProposal: () => void;
  showArchived: boolean;
  onToggleShowArchived: () => void;
  proposalViewMode: 'card' | 'gantt';
  onSetProposalViewMode: (mode: 'card' | 'gantt') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onShowDocumentVersions: (data: { proposalTitle: string, date: Date, versions: DocumentVersion[] }) => void;
}

export interface ClientListProps {
  clients: Client[];
  currentUser: User | null;
  onCreateClient: () => void;
  onSelectClient: (client: Client) => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (client: Client) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface TeamListProps {
  teamMembers: TeamMember[];
  currentUser: User | null;
  onCreateTeamMember: () => void;
  onImportTeamMembers: (fileContent: string) => void;
  onEditTeamMember: (member: TeamMember) => void;
  onDeleteTeamMember: (member: TeamMember) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}