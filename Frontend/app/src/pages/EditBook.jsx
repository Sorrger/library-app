import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/apiClient";

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState({
    title: "",
    author_ids: [],
    genre_ids: [],
    release_date: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);

  const [authorSearch, setAuthorSearch] = useState("");
  const [genreSearch, setGenreSearch] = useState("");

  useEffect(() => {
    api.get(`/books/${id}`)
      .then((res) => {
        const data = res.data;
        setBook({
          title: data.title,
          author_ids: data.authors.map(a => a.author_id),
          genre_ids: data.genres.map(g => g.genre_id),
          release_date: data.release_date,
        });
      })
      .catch(() => setError("Error loading book"))
      .finally(() => setLoading(false));

    api.get("/authors")
      .then((res) => setAuthors(res.data))
      .catch(() => setError("Error loading authors"));

    api.get("/genres")
      .then((res) => setGenres(res.data))
      .catch(() => setError("Error loading genres"));
  }, [id]);

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const toggleAuthor = (authorId) => {
    setBook((prev) => {
      const newAuthorIds = prev.author_ids.includes(authorId)
        ? prev.author_ids.filter((id) => id !== authorId)
        : [...prev.author_ids, authorId];
      return { ...prev, author_ids: newAuthorIds };
    });
  };

  const toggleGenre = (genreId) => {
    setBook((prev) => {
      const newGenreIds = prev.genre_ids.includes(genreId)
        ? prev.genre_ids.filter((id) => id !== genreId)
        : [...prev.genre_ids, genreId];
      return { ...prev, genre_ids: newGenreIds };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/books/${id}`, {
        title: book.title,
        release_date: book.release_date,
        author_ids: book.author_ids,
        genre_ids: book.genre_ids,
      });
      alert("Book updated!");
      navigate("/librarian-dashboard");
    } catch (err) {
      alert("Update error: " + (err.response?.data?.detail || err.message));
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="form-container">
      <h2>Edit Book</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={book.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <input
          type="date"
          name="release_date"
          value={book.release_date || ""}
          onChange={handleChange}
        />

        <div>
          <label>Authors:</label>
          <input
            type="text"
            placeholder="Search authors..."
            value={authorSearch}
            onChange={(e) => setAuthorSearch(e.target.value)}
          />
          <div
            className="multi-select-list"
            style={{
              maxHeight: "150px",
              overflowY: "auto",
              border: "1px solid #ccc",
              padding: "5px",
              borderRadius: "4px",
            }}
          >
            {authors
              .filter(
                (a) =>
                  a.name.toLowerCase().includes(authorSearch.toLowerCase()) ||
                  a.surname.toLowerCase().includes(authorSearch.toLowerCase())
              )
              .map((author) => (
                <label key={author.author_id} style={{ display: "block", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={book.author_ids.includes(author.author_id)}
                    onChange={() => toggleAuthor(author.author_id)}
                  />
                  {" "}{author.name} {author.surname}
                </label>
              ))}
          </div>
        </div>

        <div style={{ marginTop: "1rem" }}>
          <label>Genres:</label>
          <input
            type="text"
            placeholder="Search genres..."
            value={genreSearch}
            onChange={(e) => setGenreSearch(e.target.value)}
          />
          <div
            className="multi-select-list"
            style={{
              maxHeight: "150px",
              overflowY: "auto",
              border: "1px solid #ccc",
              padding: "5px",
              borderRadius: "4px",
            }}
          >
            {genres
              .filter((g) =>
                g.name.toLowerCase().includes(genreSearch.toLowerCase())
              )
              .map((genre) => (
                <label key={genre.genre_id} style={{ display: "block", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={book.genre_ids.includes(genre.genre_id)}
                    onChange={() => toggleGenre(genre.genre_id)}
                  />
                  {" "}{genre.name}
                </label>
              ))}
          </div>
        </div>

        <button type="submit" style={{ marginTop: "1rem" }}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditBook;
