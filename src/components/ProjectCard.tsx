import React, { useState } from 'react';
import { Project } from '../types/Project';
import { FileManager } from './FileManager';
import { LinkPreview } from './LinkPreview';
import { 
  Edit3, 
  Trash2, 
  Copy, 
  Calendar, 
  Tag, 
  FileText, 
  Link as LinkIcon,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
  onDuplicate
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900 truncate flex-1 mr-4">
            {project.title}
          </h3>
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onEdit}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit project"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={onDuplicate}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Duplicate project"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {project.description}
        </p>

        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                +{project.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(project.updatedAt)}
          </div>
          <div className="flex items-center space-x-4">
            {project.files.length > 0 && (
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                {project.files.length}
              </div>
            )}
            {project.links.length > 0 && (
              <div className="flex items-center">
                <LinkIcon className="w-4 h-4 mr-1" />
                {project.links.length}
              </div>
            )}
          </div>
        </div>

        {(project.files.length > 0 || project.links.length > 0) && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <>
                <span className="mr-2">Hide Details</span>
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                <span className="mr-2">Show Details</span>
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>

      {isExpanded && (project.files.length > 0 || project.links.length > 0) && (
        <div className="border-t border-gray-100 p-6 bg-gray-50">
          {project.files.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Files ({project.files.length})
              </h4>
              <FileManager files={project.files} readOnly />
            </div>
          )}

          {project.links.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <LinkIcon className="w-4 h-4 mr-2" />
                Links ({project.links.length})
              </h4>
              <div className="space-y-3">
                {project.links.map(link => (
                  <LinkPreview key={link.id} link={link} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};