import React from 'react';
import { ProjectLink } from '../types/Project';
import { ExternalLink, Trash2, Globe } from 'lucide-react';

interface LinkPreviewProps {
  link: ProjectLink;
  onDelete?: () => void;
}

export const LinkPreview: React.FC<LinkPreviewProps> = ({ link, onDelete }) => {
  const handleLinkClick = () => {
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex">
        {link.image && (
          <div className="w-24 h-24 flex-shrink-0 bg-gray-100">
            <img
              src={link.image}
              alt={link.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
        
        <div className="flex-1 p-4 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {link.title || 'Untitled Link'}
              </h4>
              {link.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {link.description}
                </p>
              )}
              <div className="flex items-center mt-2 text-xs text-gray-400">
                <Globe className="w-3 h-3 mr-1" />
                <span className="truncate">{new URL(link.url).hostname}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={handleLinkClick}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Open link"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};