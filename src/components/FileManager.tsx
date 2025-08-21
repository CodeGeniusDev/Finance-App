import React, { useRef } from 'react';
import { ProjectFile } from '../types/Project';
import { Upload, Download, Trash2, FileText, Image, Video, Music } from 'lucide-react';

interface FileManagerProps {
  files: ProjectFile[];
  onFilesChange?: (files: ProjectFile[]) => void;
  readOnly?: boolean;
}

export const FileManager: React.FC<FileManagerProps> = ({
  files,
  onFilesChange,
  readOnly = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(e.target.files || []);
    
    uploadedFiles.forEach(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const newFile: ProjectFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          data: event.target?.result as string,
          uploadedAt: new Date().toISOString()
        };

        onFilesChange?.([...files, newFile]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileDownload = (file: ProjectFile) => {
    const link = document.createElement('a');
    link.href = file.data;
    link.download = file.name;
    link.click();
  };

  const handleFileDelete = (fileId: string) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      onFilesChange?.(files.filter(f => f.id !== fileId));
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return Image;
    if (fileType.startsWith('video/')) return Video;
    if (fileType.startsWith('audio/')) return Music;
    return FileText;
  };

  return (
    <div className="space-y-4">
      {!readOnly && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            accept="*/*"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-600 font-medium">Click to upload files</p>
            <p className="text-sm text-gray-500 mt-1">Maximum file size: 10MB</p>
          </button>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-3">
          {files.map(file => {
            const FileIcon = getFileIcon(file.type);
            return (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center flex-1 min-w-0">
                  <FileIcon className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleFileDownload(file)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Download file"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  {!readOnly && (
                    <button
                      onClick={() => handleFileDelete(file.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {files.length === 0 && readOnly && (
        <div className="text-center py-8 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No files uploaded</p>
        </div>
      )}
    </div>
  );
};