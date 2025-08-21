import React, { useRef, useState } from 'react';
import { FinanceEntry } from '../types/Finance';
import { financeService } from '../services/financeService';
import { storageService } from '../services/storageService';
import { Download, Upload, FileText, Database, AlertCircle, CheckCircle } from 'lucide-react';

interface FinanceImportExportProps {
  entries: FinanceEntry[];
  onImport: (entries: FinanceEntry[]) => void;
}

export const FinanceImportExport: React.FC<FinanceImportExportProps> = ({
  entries,
  onImport
}) => {
  const jsonFileRef = useRef<HTMLInputElement>(null);
  const csvFileRef = useRef<HTMLInputElement>(null);
  const allDataFileRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleExportJSON = () => {
    financeService.exportToJSON(entries);
  };

  const handleExportCSV = () => {
    financeService.exportToCSV(entries);
  };

  const handleExportAllData = () => {
    const projects = storageService.loadProjects();
    const allData = {
      projects,
      financeEntries: entries,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `complete-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleImportJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const importedEntries = await financeService.importFromJSON(file);
      onImport(importedEntries);
      setImportStatus({
        type: 'success',
        message: `Successfully imported ${importedEntries.length} entries`
      });
    } catch (error) {
      setImportStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Import failed'
      });
    }

    if (jsonFileRef.current) {
      jsonFileRef.current.value = '';
    }
  };

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const importedEntries = await financeService.importFromCSV(file);
      onImport(importedEntries);
      setImportStatus({
        type: 'success',
        message: `Successfully imported ${importedEntries.length} entries`
      });
    } catch (error) {
      setImportStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Import failed'
      });
    }

    if (csvFileRef.current) {
      csvFileRef.current.value = '';
    }
  };

  const handleImportAllData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          
          if (data.projects && Array.isArray(data.projects)) {
            storageService.saveProjects(data.projects);
          }
          
          if (data.financeEntries && Array.isArray(data.financeEntries)) {
            onImport(data.financeEntries);
          }

          setImportStatus({
            type: 'success',
            message: 'Successfully imported complete backup data'
          });

          // Refresh the page to load all imported data
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } catch (error) {
          setImportStatus({
            type: 'error',
            message: 'Invalid backup file format'
          });
        }
      };
      reader.readAsText(file);
    } catch (error) {
      setImportStatus({
        type: 'error',
        message: 'Failed to read backup file'
      });
    }

    if (allDataFileRef.current) {
      allDataFileRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8">
      {/* Status Message */}
      {importStatus.type && (
        <div className={`p-4 rounded-lg flex items-center space-x-3 ${
          importStatus.type === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          {importStatus.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
          <span className={`font-medium ${
            importStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
          }`}>
            {importStatus.message}
          </span>
          <button
            onClick={() => setImportStatus({ type: null, message: '' })}
            className={`ml-auto text-sm ${
              importStatus.type === 'success' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            ×
          </button>
        </div>
      )}

      {/* Export Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Download className="w-5 h-5 mr-2" />
          Export Data
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleExportJSON}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-center"
          >
            <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <div className="font-medium text-gray-900">Export as JSON</div>
            <div className="text-sm text-gray-500">Finance entries only</div>
          </button>

          <button
            onClick={handleExportCSV}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors text-center"
          >
            <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <div className="font-medium text-gray-900">Export as CSV</div>
            <div className="text-sm text-gray-500">Spreadsheet format</div>
          </button>

          <button
            onClick={handleExportAllData}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors text-center"
          >
            <Database className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <div className="font-medium text-gray-900">Complete Backup</div>
            <div className="text-sm text-gray-500">All projects + finance</div>
          </button>
        </div>
      </div>

      {/* Import Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Upload className="w-5 h-5 mr-2" />
          Import Data
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <input
              ref={jsonFileRef}
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
            <button
              onClick={() => jsonFileRef.current?.click()}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-center"
            >
              <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <div className="font-medium text-gray-900">Import JSON</div>
              <div className="text-sm text-gray-500">Finance entries</div>
            </button>
          </div>

          <div>
            <input
              ref={csvFileRef}
              type="file"
              accept=".csv"
              onChange={handleImportCSV}
              className="hidden"
            />
            <button
              onClick={() => csvFileRef.current?.click()}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors text-center"
            >
              <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <div className="font-medium text-gray-900">Import CSV</div>
              <div className="text-sm text-gray-500">Spreadsheet format</div>
            </button>
          </div>

          <div>
            <input
              ref={allDataFileRef}
              type="file"
              accept=".json"
              onChange={handleImportAllData}
              className="hidden"
            />
            <button
              onClick={() => allDataFileRef.current?.click()}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors text-center"
            >
              <Database className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <div className="font-medium text-gray-900">Restore Backup</div>
              <div className="text-sm text-gray-500">Complete data restore</div>
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <div className="font-medium mb-1">Import Notes:</div>
              <ul className="list-disc list-inside space-y-1">
                <li>JSON imports will add to existing data</li>
                <li>CSV format: Date, Type, Category, Amount, Description</li>
                <li>Complete backup restore will replace all existing data</li>
                <li>Always backup your data before importing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Data Summary */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Data Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{entries.length}</div>
            <div className="text-sm text-gray-600">Finance Entries</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {entries.filter(e => e.type === 'income').length}
            </div>
            <div className="text-sm text-gray-600">Income Entries</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {entries.filter(e => e.type === 'expense').length}
            </div>
            <div className="text-sm text-gray-600">Expense Entries</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {storageService.loadProjects().length}
            </div>
            <div className="text-sm text-gray-600">Projects</div>
          </div>
        </div>
      </div>
    </div>
  );
};