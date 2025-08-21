import { FinanceEntry, FinanceSummary, CategorySummary } from '../types/Finance';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

const FINANCE_STORAGE_KEY = 'finance-tracker-data';

export const financeService = {
  saveEntries: (entries: FinanceEntry[]): void => {
    try {
      localStorage.setItem(FINANCE_STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Failed to save finance entries:', error);
      throw new Error('Failed to save finance data. Storage might be full.');
    }
  },

  loadEntries: (): FinanceEntry[] => {
    try {
      const data = localStorage.getItem(FINANCE_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load finance entries:', error);
      return [];
    }
  },

  calculateSummary: (entries: FinanceEntry[]): FinanceSummary => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const totalIncome = entries
      .filter(entry => entry.type === 'income')
      .reduce((sum, entry) => sum + entry.amount, 0);

    const totalExpenses = entries
      .filter(entry => entry.type === 'expense')
      .reduce((sum, entry) => sum + entry.amount, 0);

    const monthlyEntries = entries.filter(entry => 
      isWithinInterval(new Date(entry.date), { start: monthStart, end: monthEnd })
    );

    const monthlyIncome = monthlyEntries
      .filter(entry => entry.type === 'income')
      .reduce((sum, entry) => sum + entry.amount, 0);

    const monthlyExpenses = monthlyEntries
      .filter(entry => entry.type === 'expense')
      .reduce((sum, entry) => sum + entry.amount, 0);

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      monthlyIncome,
      monthlyExpenses,
      monthlyBalance: monthlyIncome - monthlyExpenses
    };
  },

  getCategorySummary: (entries: FinanceEntry[], type: 'income' | 'expense'): CategorySummary[] => {
    const filteredEntries = entries.filter(entry => entry.type === type);
    const total = filteredEntries.reduce((sum, entry) => sum + entry.amount, 0);

    const categoryMap = new Map<string, { amount: number; count: number }>();

    filteredEntries.forEach(entry => {
      const existing = categoryMap.get(entry.category) || { amount: 0, count: 0 };
      categoryMap.set(entry.category, {
        amount: existing.amount + entry.amount,
        count: existing.count + 1
      });
    });

    return Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        amount: data.amount,
        count: data.count,
        percentage: total > 0 ? (data.amount / total) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);
  },

  exportToJSON: (entries: FinanceEntry[]): void => {
    const dataStr = JSON.stringify(entries, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `finance-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  },

  exportToCSV: (entries: FinanceEntry[]): void => {
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Description'];
    const csvContent = [
      headers.join(','),
      ...entries.map(entry => [
        entry.date,
        entry.type,
        `"${entry.category}"`,
        entry.amount,
        `"${entry.description.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `finance-data-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  },

  importFromJSON: (file: File): Promise<FinanceEntry[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const entries = JSON.parse(event.target?.result as string);
          if (Array.isArray(entries)) {
            resolve(entries);
          } else {
            reject(new Error('Invalid JSON format'));
          }
        } catch (error) {
          reject(new Error('Failed to parse JSON file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  },

  importFromCSV: (file: File): Promise<FinanceEntry[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const csvContent = event.target?.result as string;
          const lines = csvContent.split('\n').filter(line => line.trim());
          const headers = lines[0].split(',');
          
          const entries: FinanceEntry[] = lines.slice(1).map((line, index) => {
            const values = line.split(',').map(val => val.replace(/^"|"$/g, '').replace(/""/g, '"'));
            
            return {
              id: `imported-${Date.now()}-${index}`,
              date: values[0],
              type: values[1] as 'income' | 'expense',
              category: values[2],
              amount: parseFloat(values[3]) || 0,
              description: values[4] || '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
          });

          resolve(entries);
        } catch (error) {
          reject(new Error('Failed to parse CSV file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }
};