import { useState, useEffect, FormEvent } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBlocks, getFileById } from '../services/api';
// import { getFileById, getBlocksByFileId } from '../services/api';
import { File, BlocksQueryParams, BlockDetail } from '../types';
import GetCoordinates from '../components/GetCoordinates';

const FileDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate()
  const [file, setFile] = useState<File | null>(null);
  const [blocks, setBlocks] = useState<BlockDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search and pagination state
  const [search, setSearch] = useState<string>('');
  const [blockType, setBlockType] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    if (!id) return;
    
    const fetchFileAndBlocks = async () => {
      try {
        setLoading(true);
        
        // Fetch file details
        const fileResponse = await getFileById(parseInt(id));
        setFile(fileResponse.file);
        
        // Fetch blocks for this file
        await fetchBlocks();
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchFileAndBlocks();
  }, [id]);

  const fetchBlocks = async () => {
    if (!id) return;
    
    try {
      const params: BlocksQueryParams = {
        page,
        limit,
        search: search.toLowerCase() || undefined,
        block_type: blockType.toLowerCase() || undefined
      };
      
      const response = await getBlocks(parseInt(id), params);
      console.log(response)
      if(!response.success){
        throw new Error(response.error)
      }
      
      setBlocks(response.blocks!);
      setTotal(response.pagination.total);
      setTotalPages(response.pagination.totalPages);
    } catch (err: any) {
      setError('Failed to load blocks: ' + err.message);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBlocks();
    }
  }, [id, page, limit]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
    fetchBlocks();
  };

  const clearFilters = () => {
    setSearch('');
    setBlockType('');
    setPage(1);
    // Only trigger a fetch if we had active filters
    if (search || blockType) {
      setTimeout(fetchBlocks, 0);
    }
  };

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading && !blocks.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !blocks.length) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back to Files
        </Link>
      </div>

      {file && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{file.original_filename}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">File Type</p>
              <p className="font-medium">{file.file_type}</p>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Upload Date</p>
              <p className="font-medium">{formatDate(file.upload_date)}</p>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">File Size</p>
              <p className="font-medium">
                {file.file_size < 1024 * 1024
                  ? `${(file.file_size / 1024).toFixed(1)} KB`
                  : `${(file.file_size / (1024 * 1024)).toFixed(1)} MB`}
              </p>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Block Information</h2>
          
          <form onSubmit={handleSearch} className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search blocks..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="blockType" className="block text-sm font-medium text-gray-700 mb-1">
                Block Type
              </label>
              <select
                id="blockType"
                value={blockType}
                onChange={(e) => setBlockType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                <option value="INSERT">INSERT</option>
                <option value="POLYLINE">POLYLINE</option>
                <option value="LINEAR">LINEAR</option>
                <option value="CURVED">CURVED</option>
                <option value="NESTED">NESTED</option>
                <option value="UNKNOWN">UNKNOWN</option>
                <option value="CIRCLE">CIRCLE</option>
                <option value="ARC">ARC</option>
                <option value="TEXT">TEXT</option>
              </select>
            </div>
            
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Search
              </button>
              <button
                type="button"
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Clear
              </button>
            </div>
          </form>
          
          {loading && (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{error}</p>
            </div>
          )}
          
          {!loading && blocks.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4">
              <p>No blocks found. Try adjusting your search criteria.</p>
            </div>
          )}
          
          {blocks.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Block Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Block Type
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Coordinates
                    </th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Properties
                    </th> */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {blocks.map((block) => (
                    <tr key={block.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {block.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {block.block_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {block.block_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {block.coordinates.bounds ? <GetCoordinates coordinates={block?.coordinates} /> : '-'}
                      </td>
                      {/* <td className="px-6 py-4 text-sm text-gray-900">
                        <pre className="whitespace-pre-wrap bg-gray-50 p-2 rounded text-xs max-w-xs overflow-auto">
                          {JSON.stringify(block.properties, null, 2)}
                        </pre>
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button 
                          className="text-blue-600 hover:text-blue-800 mr-2"
                          onClick={() => {navigate(`/block/${block.id}`)}}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {blocks.length > 0 && totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{((page - 1) * limit) + 1}</span> to <span className="font-medium">{Math.min(page * limit, total)}</span> of{' '}
                <span className="font-medium">{total}</span> blocks
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className={`px-3 py-1 rounded-md ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`px-3 py-1 rounded-md ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
                  >
                    {i + 1}
                  </button>
                )).slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))}
                
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className={`px-3 py-1 rounded-md ${page === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileDetails;