import { Project } from '../types/Project';

const STORAGE_KEY = 'project-tracker-data';

export const storageService = {
  saveProjects: (projects: Project[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
      console.error('Failed to save projects:', error);
      alert('Failed to save projects. Storage might be full.');
    }
  },

  loadProjects: (): Project[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load projects:', error);
      return [];
    }
  },

  exportProjects: (): void => {
    const projects = storageService.loadProjects();
    const dataStr = JSON.stringify(projects, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `projects-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  },

  importProjects: (file: File): Promise<Project[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const projects = JSON.parse(event.target?.result as string);
          if (Array.isArray(projects)) {
            resolve(projects);
          } else {
            reject(new Error('Invalid file format'));
          }
        } catch (error) {
          reject(new Error('Failed to parse file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }
};