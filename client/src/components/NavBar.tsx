import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };

  return (
    <nav className="bg-blue-600 h-20 flex items-center text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold">CAD Block Viewer</Link>
          
          <div className="space-x-4">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded hover:bg-blue-700 transition-colors ${isActive('/')}`}
            >
              Home
            </Link>
            <Link 
              to="/upload" 
              className={`px-3 py-2 rounded hover:bg-blue-700 transition-colors ${isActive('/upload')}`}
            >
              Upload CAD File
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;