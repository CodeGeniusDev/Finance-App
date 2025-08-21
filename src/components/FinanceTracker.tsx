import React, { useState, useEffect } from 'react';
import { FinanceEntry } from '../types/Finance';
import { financeService } from '../services/financeService';
import { FinanceForm } from './FinanceForm';
import { FinanceList } from './FinanceList';
import { FinanceSummary } from './FinanceSummary';
import { FinanceCharts } from './FinanceCharts';
import { FinanceImportExport } from './FinanceImportExport';
import { Plus, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export const FinanceTracker: React.FC = () => {
  const [entries, setEntries] = useState<FinanceEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FinanceEntry | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'entries' | 'charts' | 'import-export'>('overview');

  useEffect(() => {
    const loadedEntries = financeService.loadEntries();
    setEntries(loadedEntries);
  }, []);

  const handleSaveEntry = (entry: Omit<FinanceEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    let updatedEntries;
    
    if (editingEntry) {
      updatedEntries = entries.map(e => 
        e.id === editingEntry.id 
          ? { ...entry, id: e.id, createdAt: e.createdAt, updatedAt: new Date().toISOString() }
          : e
      );
    } else {
      const newEntry: FinanceEntry = {
        ...entry,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      updatedEntries = [...entries, newEntry];
    }

    setEntries(updatedEntries);
    financeService.saveEntries(updatedEntries);
    setShowForm(false);
    setEditingEntry(null);
  };

  const handleEditEntry = (entry: FinanceEntry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleDeleteEntry = (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      const updatedEntries = entries.filter(e => e.id !== id);
      setEntries(updatedEntries);
      financeService.saveEntries(updatedEntries);
    }
  };

  const handleImportEntries = (importedEntries: FinanceEntry[]) => {
    const updatedEntries = [...entries, ...importedEntries];
    setEntries(updatedEntries);
    financeService.saveEntries(updatedEntries);
  };

  const summary = financeService.calculateSummary(entries);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Finance Tracker</h2>
          <p className="text-gray-600">Track your income and expenses</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="hover:bg-green-600 border border-green-600 hover:border-green-600 hover:text-white text-green-600 px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span>Add Entry</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Balance</p>
              <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${summary.balance.toLocaleString()}
              </p>
            </div>
            <DollarSign className={`w-8 h-8 ${summary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Income</p>
              <p className="text-2xl font-bold text-green-600">
                ${summary.monthlyIncome.toLocaleString()}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Expenses</p>
              <p className="text-2xl font-bold text-red-600">
                ${summary.monthlyExpenses.toLocaleString()}
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'entries', label: 'Entries' },
              { id: 'charts', label: 'Charts' },
              { id: 'import-export', label: 'Import/Export' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && <FinanceSummary entries={entries} />}
          {activeTab === 'entries' && (
            <FinanceList
              entries={entries}
              onEdit={handleEditEntry}
              onDelete={handleDeleteEntry}
            />
          )}
          {activeTab === 'charts' && <FinanceCharts entries={entries} />}
          {activeTab === 'import-export' && (
            <FinanceImportExport
              entries={entries}
              onImport={handleImportEntries}
            />
          )}
        </div>
      </div>

      {showForm && (
        <FinanceForm
          entry={editingEntry}
          onSave={handleSaveEntry}
          onCancel={() => {
            setShowForm(false);
            setEditingEntry(null);
          }}
        />
      )}
    </div>
  );
};