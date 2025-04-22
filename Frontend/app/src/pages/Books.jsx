import React, { useState, useEffect } from "react";
import SearchBar from "../components/Books/SearchBar"
import BookList from "../components/Books/BookList";

import api from "../api/apiClient";


const Books = () => {
    const [query, setQuery] = useState("");
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchBooks = async () => {
        try {
          const response = await api.get("/books");
          setBooks(response.data);
        } catch (err) {
          setError("Błąd podczas ładowania książek.");
        } finally {
          setLoading(false);
        }
      };
  
      fetchBooks();
    }, []);
  
    const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(query.toLowerCase())
    );
  
    return (
      <div className="max-w-xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Wyszukiwarka książek</h1>
        <SearchBar query={query} onChange={setQuery} />
        {loading && <p>Ładowanie...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && <BookList books={filteredBooks} />}
      </div>
    );
  };
  
  export default Books;