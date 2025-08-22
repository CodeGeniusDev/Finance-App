import React from 'react';
import { ProjectCard } from './ProjectCard';
import { Project } from '../types/Project';

interface ProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onDuplicate: (project: Project) => void;
  onUpdate: (project: Project) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onEdit,
  onDelete,
  onDuplicate,
  onUpdate
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(project => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={() => onEdit(project)}
          onDelete={() => onDelete(project.id)}
          onDuplicate={() => onDuplicate(project)}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};