import React, { useState } from 'react';
import { uploadFile } from '../services/api';
import { toast } from 'react-toastify';

interface FileUploadProps {
  onFileUploaded: (fileId: number) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUploaded }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      
      if (fileExt !== 'dxf' && fileExt !== 'dwg') {
        toast.error('Only DXF and DWG files are supported');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }
    
    try {
      setIsUploading(true);
      const response = await uploadFile(selectedFile);
      
      if (response.success && response.fileId) {
        toast.success(`File uploaded successfully! ${response.blocksProcessed} blocks extracted.`);
        onFileUploaded(response.fileId);
        setSelectedFile(null);
      } else {
        toast.error(response.message || 'Error uploading file');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error uploading file');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="card mb-6">
      <h2 className="text-lg font-semibold mb-4">Upload CAD File</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <input
            type="file"
            accept=".dxf,.dwg"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary-50 file:text-primary-700
                      hover:file:bg-primary-100"
          />
        </div>
        <div>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className={`btn ${
              isUploading || !selectedFile
                ? 'bg-gray-300 cursor-not-allowed'
                : 'btn-primary'
            }`}
          >
            {isUploading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Supported file types: DXF, DWG</p>
        <p>Max file size: 10MB</p>
        <p className="mt-2">
          <a 
            href="https://dwgmodels.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary-600 hover:underline"
          >
            Get sample CAD files from dwgmodels.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default FileUpload;