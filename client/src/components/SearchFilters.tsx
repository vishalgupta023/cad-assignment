import React, { useState } from 'react';

interface SearchFilterProps {
  onFilterChange: (filters: { search: string; blockType: string }) => void;
  blockTypes: string[];
}

const SearchFilter: React.FC<SearchFilterProps> = ({ onFilterChange, blockTypes }) => {
  const [search, setSearch] = useState<string>('');
  const [blockType, setBlockType] = useState<string>('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleBlockTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBlockType(e.target.value);
  };

  const handleApplyFilters = () => {
    onFilterChange({ search, blockType });
  };

  const handleResetFilters = () => {
    setSearch('');
    setBlockType('');
    onFilterChange({ search: '', blockType: '' });
  };

  return (
    <div className="card mb-6">
      <h2 className="text-lg font-semibold mb-4">Search & Filter</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search by Name
          </label>
          <input
            type="text"
            id="search"
            value={search}
            onChange={handleSearchChange}
            placeholder="Enter block name..."
            className="input"
          />
        </div>
        <div>
          <label htmlFor="blockType" className="block text-sm font-medium text-gray-700 mb-1">
            Block Type
          </label>
          <select
            id="blockType"
            value={blockType}
            onChange={handleBlockTypeChange}
            className="input"
          >
            <option value="">All Types</option>
            {blockTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-4 flex justify-end space-x-4">
        <button onClick={handleResetFilters} className="btn btn-secondary">
          Reset
        </button>
        <button onClick={handleApplyFilters} className="btn btn-primary">
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default SearchFilter;