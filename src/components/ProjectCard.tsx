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
  User,
  Briefcase,
  CheckCircle,
  Clock,
  XCircle,
  Pause,
  AlertCircle,
  StickyNote,
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'on-hold':
        return <Pause className="w-4 h-4 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className="p-6 group">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900 truncate flex-1 mr-4">
            {project.title}
          </h3>
          <div className="flex space-x-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
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

        {/* Status Badge */}
        <div className="mb-3">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
            {getStatusIcon(project.status)}
            <span className="ml-1 capitalize">{project.status.replace('-', ' ')}</span>
          </span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Client and Project Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {project.clientName && (
            <div className="flex items-center text-sm text-gray-600">
              <User className="w-4 h-4 mr-2 text-gray-400" />
              <span className="truncate">{project.clientName}</span>
            </div>
          )}
          {project.projectType && (
            <div className="flex items-center text-sm text-gray-600">
              <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
              <span className="truncate">{project.projectType}</span>
            </div>
          )}
        </div>

        {/* Notes */}
        {project.notes && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-start">
              <StickyNote className="w-4 h-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600 line-clamp-2">{project.notes}</p>
            </div>
          </div>
        )}

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