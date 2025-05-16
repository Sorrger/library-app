import React, { useEffect, useState } from 'react';
import api from '../api/apiClient';

export default function AddEdition() {
  const [status, setStatus] = useState("available");
  const [bookFormat, setBookFormat] = useState("");
  const [bookId, setBookId] = useState("");
  const [publishingHouseId, setPublishingHouseId] = useState("");
  const [books, setBooks] = useState([]);
  const [publishingHouses, setPublishingHouses] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/editions", {
      status,
      book_format: bookFormat,
      book_id: Number(bookId),
      publishing_house_id: Number(publishingHouseId),
    });

    setBookFormat("");
    setBookId("");
    setPublishingHouseId("");
    setStatus("available");
  };

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await api.get("/books");
      setBooks(response.data);
    };

    const fetchPublishingHouses = async () => {
      const response = await api.get("/publishingHouses");
      setPublishingHouses(response.data);
    };

    fetchBooks();
    fetchPublishingHouses();
  }, []);

  return (
    <div className="form-container">
      <h2>Dodaj nową edycję</h2>
      <form onSubmit={handleSubmit}>
        <label>Książka:</label>
        <select
          name="books"
          value={bookId}
          required
          onChange={(e) => setBookId(e.target.value)}
        >
          <option value="">-- Wybierz książkę --</option>
          {books.map((book) => (
            <option key={book.book_id} value={book.book_id}>
              {book.title}
            </option>
          ))}
        </select>

        <label>Wydawnictwo:</label>
        <select
          name="publishingHouse"
          value={publishingHouseId}
          required
          onChange={(e) => setPublishingHouseId(e.target.value)}
        >
          <option value="">-- Wybierz wydawnictwo --</option>
          {publishingHouses.map((house) => (
            <option key={house.publishing_house_id} value={house.publishing_house_id}>
              {house.name}
            </option>
          ))}
        </select>

        <label>Status:</label>
        <select
          name="status"
          value={status}
          required
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="available">Dostępna</option>
          <option value="borrowed">Niedostępna</option>
          <option value="lost">Stracona</option>
        </select>

        <label>Format:</label>
        <input
          type="text"
          name="book_format"
          value={bookFormat}
          required
          onChange={(e) => setBookFormat(e.target.value)}
        />

        <button type="submit">Dodaj</button>
      </form>
    </div>
  );
}
