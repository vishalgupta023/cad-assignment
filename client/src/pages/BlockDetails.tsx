import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

// Define the types for the block data structure
interface Point {
  x: number;
  y: number;
  z: number;
}

interface Bounds {
  max: {
    x: number;
    y: number;
  };
  min: {
    x: number;
    y: number;
  };
}

interface Coordinates {
  bounds: Bounds;
  center: {
    x: number;
    y: number;
  };
  points: Point[];
}

interface BlockProperties {
  name: string;
  layer: string;
  handle: string;
  entityCounts: Record<string, number>;
  totalEntities: number;
}

interface Block {
  id: number;
  file_id: number;
  block_name: string;
  block_type: string;
  coordinates: Coordinates;
  properties: BlockProperties;
  created_at: string;
}

const BlockDetailsPage = () => {
  const { id } = useParams();
  const [block, setBlock] = useState<Block | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/blocks/${id}`)
      .then((res) => {
        if(!res.data.block?.coordinates?.bounds){
          throw new Error("Unknown Block!")
        }
        setBlock(res.data.block);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching block:", err);
        setError(err.message || "Failed to load block details");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
        <button onClick={()=>navigate(-1)}>
          Back to Blocks
        </button>
      </div>
    );
  }

  if (!block) return <div className="p-8">No block data found</div>;

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

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
      <button onClick={()=>navigate(-1)}>
          Back to Blocks
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-4">Block Details: {block.block_name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Block Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Basic Information</h2>
          
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-gray-600">ID:</div>
              <div className="col-span-2 font-medium">{block.id}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-gray-600">File ID:</div>
              <div className="col-span-2 font-medium">{block.file_id}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-gray-600">Name:</div>
              <div className="col-span-2 font-medium">{block.block_name}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-gray-600">Type:</div>
              <div className="col-span-2 font-medium">{block.block_type}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-gray-600">Created:</div>
              <div className="col-span-2 font-medium">{formatDate(block.created_at)}</div>
            </div>
          </div>
        </div>

        {/* Properties */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Properties</h2>
          
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-gray-600">Name:</div>
              <div className="col-span-2 font-medium">{block.properties.name}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-gray-600">Layer:</div>
              <div className="col-span-2 font-medium">{block.properties.layer}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-gray-600">Handle:</div>
              <div className="col-span-2 font-medium">{block.properties.handle}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-gray-600">Total Entities:</div>
              <div className="col-span-2 font-medium">{block.properties.totalEntities}</div>
            </div>
            
            <div>
              <div className="text-gray-600 mb-1">Entity Counts:</div>
              <div className="ml-4">
                {Object.entries(block.properties.entityCounts).map(([entity, count]) => (
                  <div key={entity} className="flex justify-between border-b border-gray-100 py-1">
                    <span>{entity}:</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Coordinates */}
        <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Coordinates</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bounds and Center */}
            <div>
              <h3 className="text-lg font-medium mb-3">Bounds & Center</h3>
              
              <div className="overflow-hidden shadow-md rounded-lg">
                <table className="min-w-full bg-white border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
                      <th className="py-3 px-6 text-left border-b border-gray-200">Point</th>
                      <th className="py-3 px-6 text-left border-b border-gray-200">X</th>
                      <th className="py-3 px-6 text-left border-b border-gray-200">Y</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm">
                    <tr className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="py-3 px-6 border-b border-gray-200 font-medium">Max</td>
                      <td className="py-3 px-6 border-b border-gray-200 font-mono">
                        {block.coordinates.bounds.max.x.toFixed(4)}
                      </td>
                      <td className="py-3 px-6 border-b border-gray-200 font-mono">
                        {block.coordinates.bounds.max.y.toFixed(4)}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="py-3 px-6 border-b border-gray-200 font-medium">Min</td>
                      <td className="py-3 px-6 border-b border-gray-200 font-mono">
                        {block.coordinates.bounds.min.x.toFixed(9)}
                      </td>
                      <td className="py-3 px-6 border-b border-gray-200 font-mono">
                        {block.coordinates.bounds.min.y.toFixed(9)}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="py-3 px-6 font-medium">Center</td>
                      <td className="py-3 px-6 font-mono">
                        {block.coordinates.center.x.toFixed(4)}
                      </td>
                      <td className="py-3 px-6 font-mono">
                        {block.coordinates.center.y.toFixed(4)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Points Visualization Placeholder */}
            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500 mb-2">Visualization placeholder</p>
                <p className="text-sm text-gray-400">A graphical representation of the block would appear here.</p>
              </div>
            </div>
          </div>
          
          {/* Points Data */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Points ({block.coordinates.points.length})</h3>
            
            <div className="overflow-x-auto shadow-md rounded-lg">
              <table className="min-w-full bg-white border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
                    <th className="py-3 px-6 text-left border-b border-gray-200">Point</th>
                    <th className="py-3 px-6 text-left border-b border-gray-200">X</th>
                    <th className="py-3 px-6 text-left border-b border-gray-200">Y</th>
                    <th className="py-3 px-6 text-left border-b border-gray-200">Z</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {block.coordinates.points.map((point, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="py-3 px-6 border-b border-gray-200 font-medium">{index + 1}</td>
                      <td className="py-3 px-6 border-b border-gray-200 font-mono">
                        {point.x.toFixed(point.x < 0.001 ? 9 : 4)}
                      </td>
                      <td className="py-3 px-6 border-b border-gray-200 font-mono">
                        {point.y.toFixed(point.y < 0.001 ? 9 : 4)}
                      </td>
                      <td className="py-3 px-6 border-b border-gray-200 font-mono">
                        {point.z.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockDetailsPage;