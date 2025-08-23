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
  Line,
  Area,
  AreaChart
} from 'recharts';
import { TrendingUp, DollarSign, FolderOpen, Calendar } from 'lucide-react';

interface ProjectChartsProps {
  projects: Project[];
}

export const ProjectCharts: React.FC<ProjectChartsProps> = ({ projects }) => {
  const chartData = useMemo(() => {
    // Projects by Status
    const statusData = projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusChartData = Object.entries(statusData).map(([status, count]) => ({
      status: status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      count,
      percentage: (count / projects.length) * 100
    }));

    // Projects by Type
    const typeData = projects.reduce((acc, project) => {
      const type = project.projectType || 'Unspecified';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const typeChartData = Object.entries(typeData).map(([type, count]) => ({
      type,
      count,
      percentage: (count / projects.length) * 100
    }));

    // Total costs and entries
    const totalProjectCost = projects.reduce((sum, project) => {
      return sum + project.entries.reduce((entrySum, entry) => entrySum + entry.cost, 0);
    }, 0);

    const totalEntries = projects.reduce((sum, project) => sum + project.entries.length, 0);

    // Monthly project creation trend
    const monthlyData = projects.reduce((acc, project) => {
      const month = new Date(project.createdAt).toISOString().slice(0, 7); // YYYY-MM
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const monthlyChartData = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6) // Last 6 months
      .map(([month, count]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        projects: count
      }));

    // Cost by project type
    const costByType = projects.reduce((acc, project) => {
      const type = project.projectType || 'Unspecified';
      const projectCost = project.entries.reduce((sum, entry) => sum + entry.cost, 0);
      acc[type] = (acc[type] || 0) + projectCost;
      return acc;
    }, {} as Record<string, number>);

    const costByTypeData = Object.entries(costByType).map(([type, cost]) => ({
      type,
      cost,
      percentage: totalProjectCost > 0 ? (cost / totalProjectCost) * 100 : 0
    }));

    // Progress overview
    const progressData = projects.map(project => {
      const avgProgress = project.entries.length > 0 
        ? project.entries.reduce((sum, entry) => sum + entry.progress, 0) / project.entries.length
        : 0;
      
      return {
        name: project.title.length > 20 ? project.title.substring(0, 20) + '...' : project.title,
        progress: Math.round(avgProgress),
        entries: project.entries.length,
        cost: project.entries.reduce((sum, entry) => sum + entry.cost, 0)
      };
    }).slice(0, 10); // Top 10 projects

    return {
      statusChartData,
      typeChartData,
      monthlyChartData,
      costByTypeData,
      progressData,
      totalProjectCost,
      totalEntries
    };
  }, [projects]);

  const COLORS = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">No project data available</h3>
        <p className="text-gray-500">Create some projects to see statistics and charts</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold text-blue-600">{projects.length}</p>
            </div>
            <FolderOpen className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Entries</p>
              <p className="text-2xl font-bold text-green-600">{chartData.totalEntries}</p>
            </div>
            <Calendar className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cost</p>
              <p className="text-2xl font-bold text-purple-600">
                Rs. {chartData.totalProjectCost.toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Cost/Project</p>
              <p className="text-2xl font-bold text-orange-600">
                Rs. {projects.length > 0 ? Math.round(chartData.totalProjectCost / projects.length).toLocaleString() : 0}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects by Status */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Projects by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.statusChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, percentage }) => `${status} (${percentage.toFixed(1)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {chartData.statusChartData.map((entry, index) => (
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
                data={chartData.typeChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ type, percentage }) => `${type} (${percentage.toFixed(1)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {chartData.typeChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Project Creation Trend */}
      {chartData.monthlyChartData.length > 1 && (
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Creation Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData.monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="projects" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Cost by Project Type */}
      {chartData.costByTypeData.length > 0 && chartData.totalProjectCost > 0 && (
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Distribution by Project Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.costByTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, 'Cost']} />
              <Bar dataKey="cost" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Project Progress Overview */}
      {chartData.progressData.length > 0 && (
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Progress Overview</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData.progressData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === 'progress') return [`${value}%`, 'Progress'];
                  if (name === 'entries') return [value, 'Entries'];
                  if (name === 'cost') return [`Rs. ${value.toLocaleString()}`, 'Cost'];
                  return [value, name];
                }}
              />
              <Bar dataKey="progress" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};