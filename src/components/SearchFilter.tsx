import React from 'react';
import { Search, X, Tag, Filter } from 'lucide-react';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  availableTags: string[];
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchTerm,
  onSearchChange,
  selectedTags,
  onTagsChange,
  availableTags
}) => {
  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const clearAllFilters = () => {
    onSearchChange('');
    onTagsChange([]);
  };

  const hasActiveFilters = searchTerm || selectedTags.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects by title or description..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {availableTags.length > 0 && (
          <div className="lg:w-1/3">
            <div className="flex items-center mb-3">
              <Filter className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter by tags:</span>
            </div>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {searchTerm && `Searching for "${searchTerm}"`}
            {searchTerm && selectedTags.length > 0 && ' • '}
            {selectedTags.length > 0 && `${selectedTags.length} tag${selectedTags.length === 1 ? '' : 's'} selected`}
          </div>
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};