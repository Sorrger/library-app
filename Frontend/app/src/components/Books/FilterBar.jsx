import React, { useState } from "react";
import "../../statics/books/filterBar.css";

const FilterBar = ({ filters, onChange, authors, genres }) => {
  const [authorSearch, setAuthorSearch] = useState("");
  const [genreSearch, setGenreSearch] = useState("");

  const handleCheckboxChange = (type, value) => {
    const newValues = filters[type].includes(value)
      ? filters[type].filter((v) => v !== value)
      : [...filters[type], value];
    onChange({ ...filters, [type]: newValues });
  };

  const filteredAuthors = authors.filter((author) =>
    author.name.toLowerCase().includes(authorSearch.toLowerCase())
  );

  const filteredGenres = genres.filter((genre) =>
    genre.name.toLowerCase().includes(genreSearch.toLowerCase())
  );

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label>Authors:</label>
        <input
          type="text"
          placeholder="Search authors..."
          value={authorSearch}
          onChange={(e) => setAuthorSearch(e.target.value)}
          className="filter-search"
        />
        <div className="scroll-list">
          {filteredAuthors.map((author) => (
            <label key={author.id} className="filter-item">
              <input
                type="checkbox"
                checked={filters.author.includes(author.name)}
                onChange={() => handleCheckboxChange("author", author.name)}
              />
              {author.name} {author.surname}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label>Genres:</label>
        <input
          type="text"
          placeholder="Search genres..."
          value={genreSearch}
          onChange={(e) => setGenreSearch(e.target.value)}
          className="filter-search"
        />
        <div className="scroll-list">
          {filteredGenres.map((genre) => (
            <label key={genre.id} className="filter-item">
              <input
                type="checkbox"
                checked={filters.genre.includes(genre.name)}
                onChange={() => handleCheckboxChange("genre", genre.name)}
              />
              {genre.name}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
