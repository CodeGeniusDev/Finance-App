export interface ProjectFile {
  id: string;
  name: string;
  size: number;
  type: string;
  data: string; // base64 encoded
  uploadedAt: string;
}

export interface ProjectLink {
  id: string;
  url: string;
  title?: string;
  description?: string;
  image?: string;
  addedAt: string;
}

export interface ProjectEntry {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  progress: number; // 0-100
  cost: number;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  clientName: string;
  projectType: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled';
  notes: string;
  tags: string[];
  files: ProjectFile[];
  links: ProjectLink[];
  entries: ProjectEntry[];
  createdAt: string;
  updatedAt: string;
}