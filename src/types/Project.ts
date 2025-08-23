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
  cost?: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}