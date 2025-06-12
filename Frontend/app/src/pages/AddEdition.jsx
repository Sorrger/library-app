import React, { useEffect, useState } from 'react';
import api from '../api/apiClient';
import "../statics/addEdition/addEdition.css"

export default function AddEdition() {
  const [status, setStatus] = useState("available");
  const [bookFormat, setBookFormat] = useState("");
  const [bookId, setBookId] = useState("");
  const [publishingHouseId, setPublishingHouseId] = useState("");
  const [books, setBooks] = useState([]);
  const [publishingHouses, setPublishingHouses] = useState([]);
  const [newPublishingHouseName, setNewPublishingHouseName] = useState("");
  const [newPublishingHouseHQ, setNewPublishingHouseHQ] = useState("");

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

  const handleCreatePublishingHouse = async () => {
    if (!newPublishingHouseName.trim()) return;

    try {
      const response = await api.post("/publishingHouses", {
        name: newPublishingHouseName,
        headquarters: newPublishingHouseHQ || null,
      });
      setPublishingHouses([...publishingHouses, response.data]);
      setNewPublishingHouseName("");
      setNewPublishingHouseHQ("");
    } catch (error) {
      console.error("Error while adding publishing house:", error);
    }
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
      <h2>Add a New Edition</h2>
      <form onSubmit={handleSubmit}>
        <label>Book:</label>
        <select
          value={bookId}
          required
          onChange={(e) => setBookId(e.target.value)}
        >
          <option value="">-- Select a book --</option>
          {books.map((book) => (
            <option key={book.book_id} value={book.book_id}>
              {book.title}
            </option>
          ))}
        </select>

        <label>Publishing House:</label>
        <select
          value={publishingHouseId}
          required
          onChange={(e) => setPublishingHouseId(e.target.value)}
        >
          <option value="">-- Select a publisher --</option>
          {publishingHouses.map((house) => (
            <option key={house.publishing_house_id} value={house.publishing_house_id}>
              {house.name}
            </option>
          ))}
        </select>

        <label>Status:</label>
        <select
          value={status}
          required
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="available">Available</option>
          <option value="borrowed">Borrowed</option>
          <option value="lost">Lost</option>
        </select>

        <label>Format:</label>
        <input
          type="text"
          value={bookFormat}
          required
          onChange={(e) => setBookFormat(e.target.value)}
        />

        <button type="submit">Add Edition</button>
      </form>

      <hr />

      <div className="publisher-section">
      <h3>Add a New Publishing House</h3>
      <input
        type="text"
        placeholder="Publishing house name"
        value={newPublishingHouseName}
        onChange={(e) => setNewPublishingHouseName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Headquarters (optional)"
        value={newPublishingHouseHQ}
        onChange={(e) => setNewPublishingHouseHQ(e.target.value)}
      />
      <button onClick={handleCreatePublishingHouse}>➕ Add Publisher</button>
      </div>
    </div>
      );
}
