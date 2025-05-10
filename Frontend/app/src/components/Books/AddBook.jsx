import React, { useState } from "react";
import api from "../../api/apiClient"
import "../../statics/books/addBook.css";

export default function AddBook() {
    const [title, setTitle] = useState("");
    const [releaseDate, setReleaseDate] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await api.post("/books", {
            title: title,
            release_date: releaseDate,
            });
            setTitle("");
            setReleaseDate("");
        } catch (err) {
            console.error(err);
            setError("Błąd podczas dodawania książki.");
        }
}

return (
    <div className="form-container">
      <h2>Dodaj nową książkę</h2>
      <form onSubmit={handleSubmit}>
        <label>Tytuł:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Data wydania:</label>
        <input
          type="date"
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
          required
        />

        <button type="submit">Dodaj</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
