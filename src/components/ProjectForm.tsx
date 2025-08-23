import React, { useState, useEffect } from 'react';
import { Project, ProjectFile, ProjectLink, ProjectEntry } from '../types/Project';
import { FileManager } from './FileManager';
import { LinkManager } from './LinkManager';
import { ProjectEntryForm } from './ProjectEntryForm';
import { ProjectEntryList } from './ProjectEntryList';
import { X, Save, FileText, Link as LinkIcon } from 'lucide-react';

interface ProjectFormProps {
  project?: Project | null;
  onSave: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  onSave,
  onCancel
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [clientName, setClientName] = useState('');
  const [projectType, setProjectType] = useState('');
  const [status, setStatus] = useState<'planning' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled'>('planning');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [links, setLinks] = useState<ProjectLink[]>([]);
  const [entries, setEntries] = useState<ProjectEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'details' | 'files' | 'links'>('details');
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ProjectEntry | null>(null);

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setDescription(project.description);
      setClientName(project.clientName || '');
      setProjectType(project.projectType || '');
      setStatus(project.status || 'planning');
      setNotes(project.notes || '');
      setTags(project.tags);
      setFiles(project.files);
      setLinks(project.links);
      setEntries(project.entries || []);
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim(),
      clientName: clientName.trim(),
      projectType: projectType.trim(),
      status,
      notes: notes.trim(),
      tags,
      files,
      links,
      entries
    });
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSaveEntry = (entry: Omit<ProjectEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    let updatedEntries;
    
    if (editingEntry) {
      updatedEntries = entries.map(e => 
        e.id === editingEntry.id 
          ? { ...entry, id: e.id, createdAt: e.createdAt, updatedAt: new Date().toISOString() }
          : e
      );
    } else {
      const newEntry: ProjectEntry = {
        ...entry,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      updatedEntries = [...entries, newEntry];
    }

    setEntries(updatedEntries);
    setShowEntryForm(false);
    setEditingEntry(null);
  };

  const handleEditEntry = (entry: ProjectEntry) => {
    setEditingEntry(entry);
    setShowEntryForm(true);
  };

  const handleDeleteEntry = (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setEntries(entries.filter(e => e.id !== id));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-black">
          <h2 className="text-2xl font-semibold text-gray-900">
            {project ? 'Edit Project' : 'New Project'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'details'
                  ? 'border-[#7F6353] text-[#7F6353]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Project Details
            </button>
            <button
              onClick={() => setActiveTab('entries')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center ${
                activeTab === 'entries'
                  ? 'border-[#7F6353] text-[#7F6353]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              Entries ({entries.length})
            </button>
            <button
              onClick={() => setActiveTab('entries')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center ${
                activeTab === 'entries'
                  ? 'border-[#7F6353] text-[#7F6353]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              Entries ({entries.length})
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center ${
                activeTab === 'files'
                  ? 'border-[#7F6353] text-[#7F6353]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              Files ({files.length})
            </button>
            <button
              onClick={() => setActiveTab('links')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center ${
                activeTab === 'links'
                  ? 'border-[#7F6353] text-[#7F6353]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <LinkIcon className="w-4 h-4 mr-2" />
              Links ({links.length})
            </button>
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7F6353] focus:border-transparent"
                    placeholder="Enter project title"
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
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7F6353] focus:border-transparent resize-none"
                    placeholder="Describe your project"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-2">
                      Client Name
                    </label>
                    <input
                      type="text"
                      id="clientName"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7F6353] focus:border-transparent"
                      placeholder="Enter client name"
                    />
                  </div>

                  <div>
                    <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-2">
                      Project Type
                    </label>
                    <input
                      type="text"
                      id="projectType"
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7F6353] focus:border-transparent"
                      placeholder="e.g., Website, Mobile App, Design"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7F6353] focus:border-transparent"
                  >
                    <option value="planning">Planning</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="on-hold">On Hold</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7F6353] focus:border-transparent resize-none"
                    placeholder="Additional notes about this project"
                  />
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#7F6353] text-[#695346]"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-[#7F6353] hover:text-[#695346]"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-[#7F6353] focus:border-transparent"
                      placeholder="Add a tag"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-4 py-3 bg-[#7F6353] border border-l-0 border-black rounded-r-lg hover:bg-[#695346] text-white transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'entries' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Project Entries</h3>
                  <button
                    type="button"
                    onClick={() => setShowEntryForm(true)}
                    className="px-4 py-2 bg-[#7F6353] text-white rounded-lg hover:bg-[#695346] transition-colors"
                  >
                    Add Entry
                  </button>
                </div>
                <ProjectEntryList
                  entries={entries}
                  onEdit={handleEditEntry}
                  onDelete={handleDeleteEntry}
                />
              </div>
            )}

            {activeTab === 'files' && (
              <FileManager
                files={files}
                onFilesChange={setFiles}
              />
            )}

            {activeTab === 'links' && (
              <LinkManager
                links={links}
                onLinksChange={setLinks}
              />
            )}
          </div>

          <div className="border-t border-black p-6">
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border border-black text-black rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-[#7F6353] text-white rounded-lg hover:bg-[#695346] transition-colors flex items-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>{project ? 'Update' : 'Create'} Project</span>
              </button>
            </div>
          </div>
        </form>

        {showEntryForm && (
          <ProjectEntryForm
            entry={editingEntry}
            onSave={handleSaveEntry}
            onCancel={() => {
              setShowEntryForm(false);
              setEditingEntry(null);
            }}
          />
        )}
      </div>
    </div>
  );
};