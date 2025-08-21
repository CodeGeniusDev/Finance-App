import React, { useMemo } from 'react';
import { FinanceEntry } from '../types/Finance';
import { financeService } from '../services/financeService';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { format, startOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';

interface FinanceChartsProps {
  entries: FinanceEntry[];
}

export const FinanceCharts: React.FC<FinanceChartsProps> = ({ entries }) => {
  const incomeCategories = financeService.getCategorySummary(entries, 'income');
  const expenseCategories = financeService.getCategorySummary(entries, 'expense');

  const monthlyData = useMemo(() => {
    const now = new Date();
    const sixMonthsAgo = subMonths(now, 5);
    const months = eachMonthOfInterval({ start: sixMonthsAgo, end: now });

    return months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEntries = entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.getMonth() === month.getMonth() && 
               entryDate.getFullYear() === month.getFullYear();
      });

      const income = monthEntries
        .filter(entry => entry.type === 'income')
        .reduce((sum, entry) => sum + entry.amount, 0);

      const expenses = monthEntries
        .filter(entry => entry.type === 'expense')
        .reduce((sum, entry) => sum + entry.amount, 0);

      return {
        month: format(month, 'MMM yyyy'),
        income,
        expenses,
        balance: income - expenses
      };
    });
  }, [entries]);

  const COLORS = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No data available for charts</div>
        <p className="text-gray-400 mt-2">Add some income and expense entries to see visualizations</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Monthly Trend */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trend (Last 6 Months)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, '']} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="income" 
              stroke="#10B981" 
              strokeWidth={3}
              name="Income"
            />
            <Line 
              type="monotone" 
              dataKey="expenses" 
              stroke="#EF4444" 
              strokeWidth={3}
              name="Expenses"
            />
            <Line 
              type="monotone" 
              dataKey="balance" 
              stroke="#3B82F6" 
              strokeWidth={3}
              name="Balance"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Categories Pie Chart */}
        {incomeCategories.length > 0 && (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Income by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incomeCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percentage }) => `${category} (${percentage.toFixed(1)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {incomeCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Expense Categories Pie Chart */}
        {expenseCategories.length > 0 && (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percentage }) => `${category} (${percentage.toFixed(1)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {expenseCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Category Comparison Bar Chart */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Income vs Expenses by Category</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={[
              ...incomeCategories.map(cat => ({ ...cat, type: 'Income' })),
              ...expenseCategories.map(cat => ({ ...cat, type: 'Expense', amount: -cat.amount }))
            ]}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => [
                `Rs. ${Math.abs(value).toLocaleString()}`, 
                value >= 0 ? 'Income' : 'Expense'
              ]} 
            />
            <Legend />
            <Bar dataKey="amount" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};