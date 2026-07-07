export type CaseStatus = "Em Análise" | "Concluído" | "Pendente";

export interface CaseEvent {
  id: string;
  date: string;
  time: string;
  description: string;
}

export interface PreservationSession {
  startDate: string;
  startTime: string;
  browser: string;
  os: string;
  started: boolean;
}

export interface Case {
  id: string;
  atlasCode: string; // ATLAS-XXXXXX format
  name: string;
  date: string;
  status: CaseStatus;
  responsible: string;
  description: string;
  evidenceType: "WhatsApp" | "Instagram" | "Facebook" | "E-mail" | "Outro";
  fileCount: number;
  preservationSession?: PreservationSession;
  events?: CaseEvent[];
}

export type FileCategory = "QR Code" | "Pós Login" | "Perfil" | "Informações do Contato" | "Conversa" | "Outros";

export interface EvidenceFile {
  id: string;
  caseId: string;
  caseName: string;
  atlasCode?: string;
  name: string;
  date: string; // Date of upload
  uploadTime?: string; // Time of upload
  size: string;
  type: string;
  hash: string;
  category?: FileCategory;
}

export interface GeneratedReport {
  id: string;
  caseId: string;
  caseName: string;
  atlasCode?: string;
  date: string;
  status: "Pronto" | "Processando";
  fileSize: string;
  downloadUrl?: string;
}

export interface SystemActivity {
  id: string;
  title: string;
  detail: string;
  type: "success" | "info" | "warning";
}

