import React, { useEffect, useState } from 'react';
import { getFiles } from '../services/api';
import { File } from '../types';
import { toast } from 'react-toastify';

interface FilesListProps {
  onFileSelect: (fileId: number) => void;
  selectedFileId: number | null;
}

const FilesList: React.FC<FilesListProps> = ({ onFileSelect, selectedFileId }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      const response = await getFiles();
      if (response.success) {
        setFiles(response.files);
      }
    } catch (error) {
      toast.error('Error fetching files');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="card mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Uploaded Files</h2>
        <button 
          onClick={fetchFiles} 
          className="btn btn-secondary text-sm px-3 py-1"
        >
          Refresh
        </button>
      </div>
      
      {isLoading ? (
        <div className="py-8 text-center text-gray-500">Loading files...</div>
      ) : files.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          No files uploaded yet. Upload a CAD file to get started.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Filename
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upload Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {files.map((file) => (
                <tr 
                  key={file.id} 
                  className={selectedFileId === file.id ? 'bg-primary-50' : ''}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {file.original_filename}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {file.file_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatFileSize(file.file_size)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(file.upload_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => onFileSelect(file.id)}
                      className={`btn ${
                        selectedFileId === file.id
                          ? 'bg-primary-600 text-white'
                          : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                      } text-sm px-3 py-1`}
                    >
                      {selectedFileId === file.id ? 'Selected' : 'View Blocks'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FilesList;