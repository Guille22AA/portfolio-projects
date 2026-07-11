import React, { useState } from "react";
import { filterOptions } from "../data/championsData";
import "../styles/SearchBar.css";

const SearchBar = ({ onSearchChange, onFilterChange }) => {
  // keeps track of whether the filter panel is open or not
  const [showFilters, setShowFilters] = useState(false);

  // stores the chosen filters grouped by type, so it’s easier to manage them later
  const [selectedFilters, setSelectedFilters] = useState({
    anime: [],
    class: [],
    role: [],
    difficulty: []
  });

  // sends the typed text up to the parent component
  const handleSearchInput = (e) => {
    onSearchChange(e.target.value);
  };

  // tiny switch to open/close the filter box
  const handleFilterToggle = () => {
    setShowFilters(!showFilters);
  };

  // when a filter is clicked, it adds or removes it from that category
  const handleFilterSelect = (filterType, value) => {
    let updatedFilters = { ...selectedFilters };
    
    if (updatedFilters[filterType].includes(value)) {
      updatedFilters[filterType] = updatedFilters[filterType].filter(item => item !== value);
    } else {
      updatedFilters[filterType] = [...updatedFilters[filterType], value];
    }
    
    setSelectedFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  // resets everything so the user can start from scratch
  const handleClearAll = () => {
    const emptyFilters = {
      anime: [],
      class: [],
      role: [],
      difficulty: []
    };
    setSelectedFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  // counts how many filters are active so the little badge can show the number
  const totalSelectedFilters = Object.values(selectedFilters).flat().length;

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <div className="search-input-wrapper">
        <img src="/iconos/lens_icon.png" alt="Search" className="search-icon" />
          <input
            type="text"
            placeholder="Search champion..."
            className="search-input"
            onChange={handleSearchInput}
          />
        </div>

        <button className="filter-toggle" onClick={handleFilterToggle}>
        <img src="/iconos/filters_icon.png" alt="Filters" className="filter-icon" />
          <span className="filter-text">FILTERS</span>
          {totalSelectedFilters > 0 && (
            <span className="filter-badge">{totalSelectedFilters}</span>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filters-grid">
            {/* anime section, just a list of checkboxes from the data */}
            <div className="filter-group">
              <label className="filter-label">Anime</label>
              <div className="filter-options">
                {filterOptions.anime.map((anime) => (
                  <div key={anime} className="filter-option">
                    <input
                      type="checkbox"
                      id={`anime-${anime}`}
                      checked={selectedFilters.anime.includes(anime)}
                      onChange={() => handleFilterSelect("anime", anime)}
                    />
                    <label htmlFor={`anime-${anime}`}>{anime}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* class section, same idea as the anime one */}
            <div className="filter-group">
              <label className="filter-label">Class</label>
              <div className="filter-options">
                {filterOptions.class.map((className) => (
                  <div key={className} className="filter-option">
                    <input
                      type="checkbox"
                      id={`class-${className}`}
                      checked={selectedFilters.class.includes(className)}
                      onChange={() => handleFilterSelect("class", className)}
                    />
                    <label htmlFor={`class-${className}`}>{className}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* role section, another checkbox group in the same panel */}
            <div className="filter-group">
              <label className="filter-label">Role</label>
              <div className="filter-options">
                {filterOptions.role.map((role) => (
                  <div key={role} className="filter-option">
                    <input
                      type="checkbox"
                      id={`role-${role}`}
                      checked={selectedFilters.role.includes(role)}
                      onChange={() => handleFilterSelect("role", role)}
                    />
                    <label htmlFor={`role-${role}`}>{role}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* difficulty section, same pattern repeated for the last category */}
            <div className="filter-group">
              <label className="filter-label">Difficulty</label>
              <div className="filter-options">
                {filterOptions.difficulty.map((difficulty) => (
                  <div key={difficulty} className="filter-option">
                    <input
                      type="checkbox"
                      id={`difficulty-${difficulty}`}
                      checked={selectedFilters.difficulty.includes(difficulty)}
                      onChange={() => handleFilterSelect("difficulty", difficulty)}
                    />
                    <label htmlFor={`difficulty-${difficulty}`}>{difficulty}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="filters-actions">
            <button className="clear-all-btn" onClick={handleClearAll}>
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;