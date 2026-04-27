export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  timestamp: Date;
}

export interface Source {
  file: string;
  section?: string;
  docId?: string;
}

export interface ChatRequest {
  message: string;
}