import React, { useState, useMemo } from 'react';
import { FinanceEntry } from '../types/Finance';
import { Edit3, Trash2, Search, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';

interface FinanceListProps {
  entries: FinanceEntry[];
  onEdit: (entry: FinanceEntry) => void;
  onDelete: (id: string) => void;
}

export const FinanceList: React.FC<FinanceListProps> = ({
  entries,
  onEdit,
  onDelete
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedEntries = useMemo(() => {
    let filtered = entries.filter(entry => {
      const matchesSearch = entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           entry.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || entry.type === filterType;
      return matchesSearch && matchesType;
    });

    return filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        comparison = a.amount - b.amount;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [entries, searchTerm, filterType, sortBy, sortOrder]);

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field as any);
              setSortOrder(order as any);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Entries List */}
      {filteredAndSortedEntries.length > 0 ? (
        <div className="space-y-3">
          {filteredAndSortedEntries.map(entry => (
            <div
              key={entry.id}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className={`p-2 rounded-lg ${
                    entry.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {entry.type === 'income' ? (
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900 truncate">
                        {entry.category}
                      </h4>
                      <span className={`font-bold text-lg ${
                        entry.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {entry.type === 'income' ? '+' : '-'}Rs. {entry.amount.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="truncate mr-2">
                        {entry.description || 'No description'}
                      </span>
                      <span className="whitespace-nowrap">
                        {format(new Date(entry.date), 'MMM dd, yyyy')}
                      </span>
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
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">
            {entries.length === 0 ? 'No entries yet' : 'No entries match your filters'}
          </div>
          {entries.length > 0 && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};