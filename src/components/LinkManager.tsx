import React, { useState } from 'react';
import { ProjectLink } from '../types/Project';
import { linkPreviewService } from '../services/linkPreviewService';
import { LinkPreview } from './LinkPreview';
import { Plus, Link as LinkIcon } from 'lucide-react';

interface LinkManagerProps {
  links: ProjectLink[];
  onLinksChange: (links: ProjectLink[]) => void;
}

export const LinkManager: React.FC<LinkManagerProps> = ({
  links,
  onLinksChange
}) => {
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddLink = async () => {
    if (!newLinkUrl.trim()) return;

    setIsLoading(true);
    try {
      const linkData = await linkPreviewService.fetchLinkPreview(newLinkUrl);
      const newLink: ProjectLink = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        ...linkData
      } as ProjectLink;

      onLinksChange([...links, newLink]);
      setNewLinkUrl('');
    } catch (error) {
      console.error('Failed to add link:', error);
      alert('Failed to add link. Please check the URL and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLink = (linkId: string) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      onLinksChange(links.filter(link => link.id !== linkId));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddLink();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="newLink" className="block text-sm font-medium text-gray-700 mb-2">
          Add New Link
        </label>
        <div className="flex space-x-3">
          <input
            type="url"
            id="newLink"
            value={newLinkUrl}
            onChange={(e) => setNewLinkUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="https://example.com"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={handleAddLink}
            disabled={!newLinkUrl.trim() || isLoading}
            className="px-6 py-3 bg-[#7F6353] text-white rounded-lg hover:bg-[#695346] disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>{isLoading ? 'Adding...' : 'Add'}</span>
          </button>
        </div>
      </div>

      {links.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Added Links</h3>
          <div className="space-y-3">
            {links.map(link => (
              <div key={link.id} className="relative">
                <LinkPreview 
                  link={link} 
                  onDelete={() => handleDeleteLink(link.id)} 
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {links.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <LinkIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No links added yet</p>
        </div>
      )}
    </div>
  );
};