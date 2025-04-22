import React from "react";

const SearchBar = ({ query, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Wyszukaj książkę..."
      value={query}
      onChange={(e) => onChange(e.target.value)}
      className="border p-2 rounded w-full"
    />
  );
};

export default SearchBar;
