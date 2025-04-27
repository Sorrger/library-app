import React from "react";
import "../../statics/books/searchBar.css";

const SearchBar = ({ query, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Search for a book..."
      value={query}
      onChange={(e) => onChange(e.target.value)}
      className="search-bar"
    />
  );
};

export default SearchBar;
