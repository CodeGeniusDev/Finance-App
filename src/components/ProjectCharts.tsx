import React, { useMemo } from 'react';
import { Project } from '../types/Project';
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

interface ProjectChartsProps {
  projects: Project[];
}

export const ProjectCharts: React.FC<ProjectChartsProps> = ({ projects }) => {
  const COLORS = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];

  // Projects by Status
  const statusData = useMemo(() => {
    const statusCount = projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCount).map(([status, count]) => ({
      status: status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      count,
      percentage: (count / projects.length) * 100
    }));
  }, [projects]);

  // Projects by Type
  const typeData = useMemo(() => {
    const typeCount = projects.reduce((acc, project) => {
      const type = project.projectType || 'Unspecified';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(typeCount).map(([type, count]) => ({
      type,
      count,
      percentage: (count / projects.length) * 100
    }));
  }, [projects]);

  // Total Cost by Project Type
  const costByTypeData = useMemo(() => {
    const costByType = projects.reduce((acc, project) => {
      const type = project.projectType || 'Unspecified';
      const totalCost = project.entries.reduce((sum, entry) => sum + entry.cost, 0);
      acc[type] = (acc[type] || 0) + totalCost;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(costByType).map(([type, cost]) => ({
      type,
      cost
    }));
  }, [projects]);

  // Monthly Project Creation Trend
  const monthlyTrendData = useMemo(() => {
    const now = new Date();
    const sixMonthsAgo = subMonths(now, 5);
    const months = eachMonthOfInterval({ start: sixMonthsAgo, end: now });

    return months.map(month => {
      const monthProjects = projects.filter(project => {
        const projectDate = new Date(project.createdAt);
        return projectDate.getMonth() === month.getMonth() && 
               projectDate.getFullYear() === month.getFullYear();
      });

      const totalCost = monthProjects.reduce((sum, project) => 
        sum + project.entries.reduce((entrySum, entry) => entrySum + entry.cost, 0), 0
      );

      return {
        month: format(month, 'MMM yyyy'),
        projects: monthProjects.length,
        totalCost
      };
    });
  }, [projects]);

  // Progress Overview
  const progressData = useMemo(() => {
    const progressRanges = {
      '0-25%': 0,
      '26-50%': 0,
      '51-75%': 0,
      '76-100%': 0
    };

    projects.forEach(project => {
      const avgProgress = project.entries.length > 0 
        ? project.entries.reduce((sum, entry) => sum + entry.progress, 0) / project.entries.length
        : 0;

      if (avgProgress <= 25) progressRanges['0-25%']++;
      else if (avgProgress <= 50) progressRanges['26-50%']++;
      else if (avgProgress <= 75) progressRanges['51-75%']++;
      else progressRanges['76-100%']++;
    });

    return Object.entries(progressRanges).map(([range, count]) => ({
      range,
      count
    }));
  }, [projects]);

  const totalCost = projects.reduce((sum, project) => 
    sum + project.entries.reduce((entrySum, entry) => entrySum + entry.cost, 0), 0
  );

  const totalEntries = projects.reduce((sum, project) => sum + project.entries.length, 0);

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No project data available for charts</div>
        <p className="text-gray-400 mt-2">Create some projects to see statistics and visualizations</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{projects.length}</div>
          <div className="text-sm text-gray-600">Total Projects</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{totalEntries}</div>
          <div className="text-sm text-gray-600">Project Entries</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">Rs. {totalCost.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Cost</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-orange-600">
            {projects.filter(p => p.status === 'completed').length}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Project Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="projects" fill="#3B82F6" name="Projects Created" />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="totalCost" 
              stroke="#10B981" 
              strokeWidth={3}
              name="Total Cost (Rs.)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects by Status */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Projects by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, percentage }) => `${status} (${percentage.toFixed(1)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Projects by Type */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Projects by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ type, percentage }) => `${type} (${percentage.toFixed(1)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost by Project Type */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Cost by Project Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={costByTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, 'Cost']} />
              <Bar dataKey="cost" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Progress Distribution */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};