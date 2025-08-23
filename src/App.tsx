import React, { useState, useEffect } from 'react';
import { FinanceTracker } from './components/FinanceTracker';
import { ProjectList } from './components/ProjectList';
import { ProjectForm } from './components/ProjectForm';
import { SearchFilter } from './components/SearchFilter';
import { Project } from './types/Project';
import { storageService } from './services/storageService';
import { ProjectCharts } from './components/ProjectCharts';
import { Plus, FolderOpen, DollarSign, BarChart3 } from 'lucide-react';
import Footer from './components/Footer';

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState<'projects' | 'finance' | 'charts'>('projects');
  const [activeProjectTab, setActiveProjectTab] = useState<'list' | 'charts'>('list');

  useEffect(() => {
    const loadedProjects = storageService.loadProjects();
    setProjects(loadedProjects);
    setFilteredProjects(loadedProjects);
  }, []);

  useEffect(() => {
    const filtered = projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTags = selectedTags.length === 0 || 
                         selectedTags.some(tag => project.tags.includes(tag));
      return matchesSearch && matchesTags;
    });
    setFilteredProjects(filtered);
  }, [projects, searchTerm, selectedTags]);

  const handleSaveProject = (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    let updatedProjects;
    
    if (editingProject) {
      updatedProjects = projects.map(p => 
        p.id === editingProject.id 
          ? { ...project, id: p.id, createdAt: p.createdAt, updatedAt: new Date().toISOString() }
          : p
      );
    } else {
      const newProject: Project = {
        ...project,
        id: Date.now().toString(),
        entries: project.entries || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      updatedProjects = [...projects, newProject];
    }

    setProjects(updatedProjects);
    storageService.saveProjects(updatedProjects);
    setShowForm(false);
    setEditingProject(null);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const updatedProjects = projects.filter(p => p.id !== id);
      setProjects(updatedProjects);
      storageService.saveProjects(updatedProjects);
    }
  };

  const handleDuplicateProject = (project: Project) => {
    const duplicatedProject: Project = {
      ...project,
      id: Date.now().toString(),
      title: `${project.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updatedProjects = [...projects, duplicatedProject];
    setProjects(updatedProjects);
    storageService.saveProjects(updatedProjects);
  };

  const allTags = Array.from(new Set(projects.flatMap(p => p.tags)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-[#7F6353]" />
              <h1 className="text-3xl font-bold text-gray-900">Finance & Project Tracker</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex bg-white rounded-lg p-1 shadow-md">
                <button
                  onClick={() => setActiveSection('projects')}
                  className={`px-4 py-2 rounded-md flex items-center space-x-2 transition-colors ${
                    activeSection === 'projects'
                      ? 'bg-[#7F6353] text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>Projects</span>
                </button>
                <button
                  onClick={() => setActiveSection('finance')}
                  className={`px-4 py-2 rounded-md flex items-center space-x-2 transition-colors ${
                    activeSection === 'finance'
                      ? 'bg-[#7F6353] text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Finance</span>
                </button>
              </div>
              
              {activeSection === 'projects' && (
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-white border-black border hover:bg-[#695346] hover:text-white text-[#7F6353] px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-5 h-5" />
                  <span>New Project</span>
                </button>
              )}
            </div>
          </div>
          
          {activeSection === 'projects' && (
            <SearchFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
              availableTags={allTags}
            />
          )}
          
          {activeSection === 'projects' && (
            <div className="flex justify-center mb-6">
              <div className="flex bg-white rounded-lg p-1 shadow-md">
                <button
                  onClick={() => setActiveProjectTab('list')}
                  className={`px-4 py-2 rounded-md flex items-center space-x-2 transition-colors ${
                    activeProjectTab === 'list'
                      ? 'bg-[#7F6353] text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>Projects</span>
                </button>
                <button
                  onClick={() => setActiveProjectTab('charts')}
                  className={`px-4 py-2 rounded-md flex items-center space-x-2 transition-colors ${
                    activeProjectTab === 'charts'
                      ? 'bg-[#7F6353] text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics</span>
                </button>
              </div>
            </div>
          )}
        </header>

        <main>
          {activeSection === 'finance' && <FinanceTracker />}
          
          {activeSection === 'projects' && (
            <>
              {activeProjectTab === 'charts' && <ProjectCharts projects={projects} />}
              
              {activeProjectTab === 'list' && (
                <>
                  {showForm && (
                    <ProjectForm
                      project={editingProject}
                      onSave={handleSaveProject}
                      onCancel={() => {
                        setShowForm(false);
                        setEditingProject(null);
                      }}
                    />
                  )}

                  <ProjectList
                    projects={filteredProjects}
                    onEdit={handleEditProject}
                    onDelete={handleDeleteProject}
                    onDuplicate={handleDuplicateProject}
                  />
                  
                  {filteredProjects.length === 0 && projects.length > 0 && (
                    <div className="text-center py-12">
                      <div className="text-gray-500 text-lg">No projects match your search criteria</div>
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedTags([]);
                        }}
                        className="mt-4 text-[#7F6353] hover:text-[#695346] font-medium"
                      >
                        Clear filters
                      </button>
                    </div>
                  )}
                  
                  {projects.length === 0 && (
                    <div className="text-center py-20">
                      <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-gray-900 mb-2">No projects yet</h3>
                      <p className="text-gray-500 mb-6">Get started by creating your first project</p>
                      <button
                        onClick={() => setShowForm(true)}
                        className="bg-[#7F6353] hover:bg-[#695346] text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto transition-colors duration-200"
                      >
                        <Plus className="w-5 h-5" />
                        <span>Create Project</span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </main>
      </div>
        <Footer />
    </div>
  );
}

export default App;