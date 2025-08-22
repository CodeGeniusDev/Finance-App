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
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

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
      {sortedEntries.length > 0 ? (
        <div className="space-y-3">
          {sortedEntries.map(entry => (
            <div
              key={entry.id}
              className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate mb-1">
                    {entry.title}
                  </h4>
                  {entry.description && (
                    <p className="text-sm text-gray-600 mb-2">{entry.description}</p>
                  )}
                  
                  {/* Status Badge */}
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                    {getStatusIcon(entry.status)}
                    <span className="ml-1 capitalize">{entry.status.replace('-', ' ')}</span>
                  </span>
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

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  <div>
                    <div className="font-medium">Start: {format(new Date(entry.startDate), 'MMM dd, yyyy')}</div>
                    {entry.endDate && (
                      <div>End: {format(new Date(entry.endDate), 'MMM dd, yyyy')}</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="font-medium">Rs. {entry.cost.toLocaleString()}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <TrendingUp className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="font-medium">{entry.progress}% Complete</span>
                </div>
              </div>

              {entry.notes && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">{entry.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No project entries yet</p>
        </div>
      )}
    </div>
  );
};