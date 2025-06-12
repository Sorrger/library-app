import React, { useState, useEffect } from "react";
import SearchBar from "../components/Books/SearchBar";
import FilterBar from "../components/Books/FilterBar";
import BookList from "../components/Books/BookList";
import api from "../api/apiClient";
import "../statics/books/page.css";

const Books = () => {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ author: [], genre: [] });
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchBooks = async () => {
    setLoading(true);
    try {
      // 1) budujemy URLSearchParams, który stworzy ?author=A&author=B
      const params = new URLSearchParams();
      if (query.trim()) {
        params.append("title", query.trim());
      }
      filters.author.forEach((a) => params.append("author", a));
      filters.genre.forEach((g) => params.append("genre", g));

      // 2) doklejamy stringa do endpointu
      const response = await api.get(`/books/filter?${params.toString()}`);
      setBooks(response.data);
      setError(null);
    } catch (err) {
      setError("Error while loading books.");
    } finally {
      setLoading(false);
    }
  };

  fetchBooks();
}, [query, filters]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [authorsRes, genresRes] = await Promise.all([
          api.get("/authors"),
          api.get("/genres"),
        ]);
        setAuthors(authorsRes.data);
        setGenres(genresRes.data);
      } catch (err) {
        console.error("Error loading authors or genres", err);
      }
    };

    fetchFilters();
  }, []);

  return (
    <div className="books-page">
      <h1 className="page-title">Book Search</h1>
      <SearchBar query={query} onChange={setQuery} />
      <FilterBar
        filters={filters}
        onChange={setFilters}
        authors={authors}
        genres={genres}
      />
      {loading && <p className="loading-text">Loading...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && <BookList books={books} />}
    </div>
  );
};

export default Books;
