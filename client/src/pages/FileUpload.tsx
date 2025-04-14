import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadFile } from '../services/api';

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const navigate = useNavigate();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];

      // Validate file type
      const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
      if (fileExt !== 'dxf' && fileExt !== 'dwg') {
        setError('Only DXF and DWG files are supported');
        setFile(null);
        return;
      }

      // Validate file size (10MB max)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit');
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 300);

      const response = await uploadFile(file);

      clearInterval(progressInterval);
      setProgress(100);

      if (response.success && response.fileId) {
        // Navigate to file details page after upload
        setTimeout(() => {
          navigate(`/file/${response.fileId}`);
        }, 1000);
      } else {
        setError(response.message || 'Upload failed');
      }
    } catch (err: any) {
      setError('Upload failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSampleFile = () => {
    window.open('https://dwgmodels.com/', '_blank');
  };

  return (
    <section className="max-w-xl mx-auto  border-2 h-[calc(100vh-5rem)] flex justify-center items-center">
      <main>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Upload CAD File</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Select DXF or DWG File
              </label>

              <div className="border-2 border-dashed relative border-gray-300 rounded-lg p-6 text-center">
                {file ? (
                  <div className="mb-4">
                    <p className="text-green-600 font-medium">{file.name}</p>
                    <p className="text-gray-500 text-sm mt-1">
                      {file.size < 1024 * 1024
                        ? `${(file.size / 1024).toFixed(1)} KB`
                        : `${(file.size / (1024 * 1024)).toFixed(1)} MB`}
                    </p>
                  </div>
                ) : (
                  <div className="py-4">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">
                      Drag and drop your file here, or click to select
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      DXF or DWG files only (max 10MB)
                    </p>
                  </div>
                )}


                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 border-2 border-red-800 cursor-pointer"
                  onChange={handleFileChange}
                  accept=".dxf,.dwg"
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p>{error}</p>
              </div>
            )}

            {loading && (
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-gray-600 text-sm mt-2">
                  Processing CAD file... {progress}%
                </p>
              </div>
            )}

            <div className="flex justify-between">
              <button
                type="button"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition-colors"
                onClick={handleDownloadSampleFile}
              >
                Get Sample File
              </button>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors disabled:opacity-50"
                disabled={!file || loading}
              >
                {loading ? 'Uploading...' : 'Upload File'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-blue-800 font-semibold mb-2">Note:</h3>
          <p className="text-blue-700 text-sm">
            This application supports viewing blocks from DXF and DWG files. For best results, use simpler CAD files with well-defined blocks.
          </p>
          <p className="text-blue-700 text-sm mt-2">
            You can download sample CAD files from <a href="https://dwgmodels.com/" target="_blank" rel="noopener noreferrer" className="underline">dwgmodels.com</a> for testing.
          </p>
        </div>
      </main>
    </section>
  );
};

export default FileUpload;