import React, { useState } from "react";
import api from "../../api/apiClient";
import "../../statics/addBook/addBookForm.css";

export default function AddBookForm({ authors, genres, setAuthors, setGenres }) {
  const [title, setTitle] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [newAuthorName, setNewAuthorName] = useState("");
  const [newAuthorSurname, setNewAuthorSurname] = useState("");
  const [newGenre, setNewGenre] = useState("");
  const [error, setError] = useState("");

  const handleAddAuthor = async () => {
    if (!newAuthorName || !newAuthorSurname) return;
    try {
      const res = await api.post("/authors", {
        name: newAuthorName,
        surname: newAuthorSurname,
      });
      setAuthors((prev) => [...prev, res.data]);
      setSelectedAuthors((prev) => [...prev, res.data.author_id]);
      setNewAuthorName("");
      setNewAuthorSurname("");
    } catch (err) {
      console.error("Error adding author", err);
    }
  };

  const handleAddGenre = async () => {
    if (!newGenre) return;
    try {
      const res = await api.post("/genres", { name: newGenre });
      setGenres((prev) => [...prev, res.data]);
      setSelectedGenres((prev) => [...prev, res.data.genre_id]);
      setNewGenre("");
    } catch (err) {
      console.error("Error adding genre", err);
    }
  };

  const toggleAuthor = (id) => {
    setSelectedAuthors((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const toggleGenre = (id) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (selectedAuthors.length === 0) {
      setError("Please select at least one author.");
      return;
    }

    if (selectedGenres.length === 0) {
      setError("Please select at least one genre.");
      return;
    }

    try {
      await api.post("/books", {
        title,
        release_date: releaseDate,
        author_ids: selectedAuthors,
        genre_ids: selectedGenres,
      });
      setTitle("");
      setReleaseDate("");
      setSelectedAuthors([]);
      setSelectedGenres([]);
    } catch (err) {
      console.error(err);
      setError("Error while adding book.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Title:</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label>Release Date:</label>
      <input
        type="date"
        value={releaseDate}
        onChange={(e) => setReleaseDate(e.target.value)}
        required
      />

      <label>Authors:</label>
      <div
        className={`checkbox-list ${
          selectedAuthors.length === 0 && error.includes("author")
            ? "error-border"
            : ""
        }`}
        aria-invalid={selectedAuthors.length === 0 && error.includes("author")}
      >
        {authors.map((a) => (
          <label key={a.author_id}>
            <input
              type="checkbox"
              checked={selectedAuthors.includes(a.author_id)}
              onChange={() => toggleAuthor(a.author_id)}
            />
            {a.name} {a.surname}
          </label>
        ))}
      </div>
      {selectedAuthors.length === 0 && error.includes("author") && (
        <p className="error">{error}</p>
      )}

      <div className="inline-inputs">
        <input
          placeholder="First name"
          value={newAuthorName}
          onChange={(e) => setNewAuthorName(e.target.value)}
        />
        <input
          placeholder="Last name"
          value={newAuthorSurname}
          onChange={(e) => setNewAuthorSurname(e.target.value)}
        />
        <button type="button" onClick={handleAddAuthor}>
          ➕ Add Author
        </button>
      </div>

      <label>Genres:</label>
      <div
        className={`checkbox-list ${
          selectedGenres.length === 0 && error.includes("genre")
            ? "error-border"
            : ""
        }`}
        aria-invalid={selectedGenres.length === 0 && error.includes("genre")}
      >
        {genres.map((g) => (
          <label key={g.genre_id}>
            <input
              type="checkbox"
              checked={selectedGenres.includes(g.genre_id)}
              onChange={() => toggleGenre(g.genre_id)}
            />
            {g.name}
          </label>
        ))}
      </div>
      {selectedGenres.length === 0 && error.includes("genre") && (
        <p className="error">{error}</p>
      )}

      <div className="inline-inputs">
        <input
          placeholder="New genre"
          value={newGenre}
          onChange={(e) => setNewGenre(e.target.value)}
        />
        <button type="button" onClick={handleAddGenre}>
          ➕ Add Genre
        </button>
      </div>

      <button type="submit">Add Book</button>

      {!error.includes("author") &&
        !error.includes("genre") &&
        error && <p className="error">{error}</p>}
    </form>
  );
}
