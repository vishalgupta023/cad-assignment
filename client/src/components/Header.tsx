import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-primary-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">CAD Block Viewer</h1>
        <div className="text-sm">
          A simple tool to view blocks from CAD files
        </div>
      </div>
    </header>
  );
};

export default Header;