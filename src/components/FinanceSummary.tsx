import React from 'react';
import { FinanceEntry } from '../types/Finance';
import { financeService } from '../services/financeService';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';

interface FinanceSummaryProps {
  entries: FinanceEntry[];
}

export const FinanceSummary: React.FC<FinanceSummaryProps> = ({ entries }) => {
  const summary = financeService.calculateSummary(entries);
  const incomeCategories = financeService.getCategorySummary(entries, 'income');
  const expenseCategories = financeService.getCategorySummary(entries, 'expense');

  return (
    <div className="space-y-6">
      {/* Overall Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Total Income
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-green-700">All Time:</span>
              <span className="text-2xl font-bold text-green-800">
                ${summary.totalIncome.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-green-700">This Month:</span>
              <span className="text-xl font-semibold text-green-800">
                ${summary.monthlyIncome.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
          <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
            <TrendingDown className="w-5 h-5 mr-2" />
            Total Expenses
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-red-700">All Time:</span>
              <span className="text-2xl font-bold text-red-800">
                ${summary.totalExpenses.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-red-700">This Month:</span>
              <span className="text-xl font-semibold text-red-800">
                ${summary.monthlyExpenses.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Net Balance */}
      <div className={`p-6 rounded-xl border-2 ${
        summary.balance >= 0 
          ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200' 
          : 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 flex items-center ${
          summary.balance >= 0 ? 'text-blue-800' : 'text-orange-800'
        }`}>
          <DollarSign className="w-5 h-5 mr-2" />
          Net Balance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between items-center">
            <span className={summary.balance >= 0 ? 'text-blue-700' : 'text-orange-700'}>
              All Time:
            </span>
            <span className={`text-3xl font-bold ${
              summary.balance >= 0 ? 'text-blue-800' : 'text-orange-800'
            }`}>
              ${summary.balance.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className={summary.monthlyBalance >= 0 ? 'text-blue-700' : 'text-orange-700'}>
              This Month:
            </span>
            <span className={`text-2xl font-semibold ${
              summary.monthlyBalance >= 0 ? 'text-blue-800' : 'text-orange-800'
            }`}>
              ${summary.monthlyBalance.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Income Categories */}
        {incomeCategories.length > 0 && (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Top Income Categories
            </h3>
            <div className="space-y-3">
              {incomeCategories.slice(0, 5).map(category => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {category.category}
                      </span>
                      <span className="text-sm font-semibold text-green-600">
                        ${category.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Expense Categories */}
        {expenseCategories.length > 0 && (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingDown className="w-5 h-5 mr-2 text-red-600" />
              Top Expense Categories
            </h3>
            <div className="space-y-3">
              {expenseCategories.slice(0, 5).map(category => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {category.category}
                      </span>
                      <span className="text-sm font-semibold text-red-600">
                        ${category.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {entries.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No financial data yet</h3>
          <p className="text-gray-500">Start by adding your first income or expense entry</p>
        </div>
      )}
    </div>
  );
};