import React, { useState } from 'react';
import { ProjectEntry } from '../types/Project';
import { Edit3, Trash2, Calendar, DollarSign, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface ProjectEntryListProps {
  entries: ProjectEntry[];
  onEdit: (entry: ProjectEntry) => void;
  onDelete: (id: string) => void;
}

export const ProjectEntryList: React.FC<ProjectEntryListProps> = ({
  entries,
  onEdit,
  onDelete
}) => {
  const [sortBy, setSortBy] = useState<'startDate' | 'progress' | 'cost'>('startDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
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
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const sortedEntries = [...entries].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'startDate') {
      comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    } else if (sortBy === 'progress') {
      comparison = a.progress - b.progress;
    } else {
      comparison = a.cost - b.cost;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">No project entries yet</h3>
        <p className="text-gray-500">Start tracking your project progress by adding entries</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Sort Controls */}
      <div className="flex justify-end">
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split('-');
            setSortBy(field as any);
            setSortOrder(order as any);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="startDate-desc">Newest First</option>
          <option value="startDate-asc">Oldest First</option>
          <option value="progress-desc">Highest Progress</option>
          <option value="progress-asc">Lowest Progress</option>
          <option value="cost-desc">Highest Cost</option>
          <option value="cost-asc">Lowest Cost</option>
        </select>
      </div>

      {/* Entries List */}
      <div className="space-y-3">
        {sortedEntries.map(entry => (
          <div
            key={entry.id}
            className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-semibold text-gray-900 truncate">
                    {entry.title}
                  </h4>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                    {getStatusIcon(entry.status)}
                    <span className="ml-1 capitalize">{entry.status.replace('-', ' ')}</span>
                  </span>
                </div>
                
                {entry.description && (
                  <p className="text-gray-600 mb-3">{entry.description}</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{format(new Date(entry.startDate), 'MMM dd, yyyy')}</span>
                  </div>
                  
                  {entry.endDate && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span>End: {format(new Date(entry.endDate), 'MMM dd, yyyy')}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                    <span>Rs. {entry.cost.toLocaleString()}</span>
                  </div>
                  
                  {entry.category && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      <span>{entry.category}</span>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-gray-600">{entry.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(entry.progress)}`}
                      style={{ width: `${entry.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => onEdit(entry)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit entry"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(entry.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};