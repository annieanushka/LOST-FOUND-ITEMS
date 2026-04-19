import React from 'react';

function SearchBar({ filters, setFilters }) {
  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleReset = () => {
    setFilters({
      search: '',
      type: 'all',
      category: 'all',
      dateFilter: 'all',
    });
  };

  return (
    <div className="filters-container">
      <div className="search-wrap">
        <input
          type="text"
          name="search"
          placeholder="Search items by name, category, location, or description"
          value={filters.search}
          onChange={handleChange}
        />
      </div>

      <div className="filter-group">
        <select
          className="filter-select"
          name="type"
          value={filters.type}
          onChange={handleChange}
        >
          <option value="all">All Types</option>
          <option value="lost">Lost Only</option>
          <option value="found">Found Only</option>
        </select>

        <select
          className="filter-select"
          name="category"
          value={filters.category}
          onChange={handleChange}
        >
          <option value="all">All Categories</option>
          <option>Electronics</option>
          <option>Wallet</option>
          <option>Bags</option>
          <option>Books</option>
          <option>ID Cards</option>
          <option>Keys</option>
          <option>Clothing</option>
          <option>Other</option>
        </select>

        <select
          className="filter-select"
          name="dateFilter"
          value={filters.dateFilter}
          onChange={handleChange}
        >
          <option value="all">Any Date</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>

        <button
          type="button"
          className="reset-btn"
          onClick={handleReset}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
