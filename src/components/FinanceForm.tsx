import React, { useState, useEffect } from 'react';
import { FinanceEntry, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../types/Finance';
import { X, Save, DollarSign } from 'lucide-react';

interface FinanceFormProps {
  entry?: FinanceEntry | null;
  onSave: (entry: Omit<FinanceEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const FinanceForm: React.FC<FinanceFormProps> = ({
  entry,
  onSave,
  onCancel
}) => {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (entry) {
      setType(entry.type);
      setAmount(entry.amount.toString());
      setCategory(entry.category);
      setDescription(entry.description);
      setDate(entry.date);
    }
  }, [entry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !date) return;

    onSave({
      type,
      amount: parseFloat(amount),
      category,
      description,
      date
    });
  };

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl h-[calc(100vh-4rem)] max-w-md w-full overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-black">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <DollarSign className="w-6 h-6 mr-2 text-green-600" />
            {entry ? 'Edit Entry' : 'New Entry'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('income')}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  type === 'income'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                Income
              </button>
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  type === 'expense'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                Expense
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">Rs.</span>
              </div>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7F6353] focus:border-transparent"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7F6353] focus:border-transparent"
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7F6353] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7F6353] focus:border-transparent resize-none"
              placeholder="Optional notes about this entry"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-[#7F6353] text-white rounded-lg hover:bg-[#695346] transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{entry ? 'Update' : 'Save'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};