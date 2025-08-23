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

  const typeData = useMemo(() => {
    const typeCount = projects.reduce((acc, project) => {
      if (project.projectType) {
        acc[project.projectType] = (acc[project.projectType] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(typeCount).map(([type, count]) => ({
      type,
      count,
      percentage: (count / projects.length) * 100
    }));
  }, [projects]);

  const costData = useMemo(() => {
    const projectsWithCost = projects.filter(p => p.cost && p.cost > 0);
    const totalCost = projectsWithCost.reduce((sum, p) => sum + (p.cost || 0), 0);
    const avgCost = projectsWithCost.length > 0 ? totalCost / projectsWithCost.length : 0;

    const costByType = projects.reduce((acc, project) => {
      if (project.projectType && project.cost) {
        acc[project.projectType] = (acc[project.projectType] || 0) + project.cost;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      totalCost,
      avgCost,
      projectsWithCost: projectsWithCost.length,
      costByType: Object.entries(costByType).map(([type, cost]) => ({
        type,
        cost
      }))
    };
  }, [projects]);

  const monthlyData = useMemo(() => {
    const now = new Date();
    const sixMonthsAgo = subMonths(now, 5);
    const months = eachMonthOfInterval({ start: sixMonthsAgo, end: now });

    return months.map(month => {
      const monthProjects = projects.filter(project => {
        const createdDate = new Date(project.createdAt);
        return createdDate.getMonth() === month.getMonth() && 
               createdDate.getFullYear() === month.getFullYear();
      });

      const completedProjects = monthProjects.filter(p => p.status === 'completed').length;
      const totalCost = monthProjects.reduce((sum, p) => sum + (p.cost || 0), 0);

      return {
        month: format(month, 'MMM yyyy'),
        projects: monthProjects.length,
        completed: completedProjects,
        cost: totalCost
      };
    });
  }, [projects]);

  const COLORS = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No project data available for charts</div>
        <p className="text-gray-400 mt-2">Add some projects to see visualizations</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{projects.length}</div>
            <div className="text-sm text-gray-600">Total Projects</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {projects.filter(p => p.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              Rs. {costData.totalCost.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Value</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              Rs. {Math.round(costData.avgCost).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Average Cost</div>
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Project Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="projects" 
              stroke="#3B82F6" 
              strokeWidth={3}
              name="New Projects"
            />
            <Line 
              type="monotone" 
              dataKey="completed" 
              stroke="#10B981" 
              strokeWidth={3}
              name="Completed"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Status Distribution */}
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
              <Tooltip formatter={(value: number) => [value, 'Projects']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Project Type Distribution */}
        {typeData.length > 0 && (
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
                <Tooltip formatter={(value: number) => [value, 'Projects']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Cost Analysis */}
      {costData.costByType.length > 0 && (
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Value by Type</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={costData.costByType}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, 'Total Value']} />
              <Bar dataKey="cost" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Status vs Type Matrix */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Status Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['planning', 'in-progress', 'completed', 'on-hold', 'cancelled'].map(status => {
            const count = projects.filter(p => p.status === status).length;
            const percentage = projects.length > 0 ? (count / projects.length) * 100 : 0;
            
            return (
              <div key={status} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-600 capitalize mb-2">
                  {status.replace('-', ' ')}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {percentage.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};