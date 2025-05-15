import React from "react";
import "../../statics/books/filterBar.css";

const FilterBar = ({ filters, onChange }) => {
  return (
    <div className="filter-bar">
      <input
        type="text"
        placeholder="Author"
        value={filters.author}
        onChange={(e) => onChange({ ...filters, author: e.target.value })}
      />
      <input
        type="text"
        placeholder="Genre"
        value={filters.genre}
        onChange={(e) => onChange({ ...filters, genre: e.target.value })}
      />
    </div>
  );
};

export default FilterBar;
