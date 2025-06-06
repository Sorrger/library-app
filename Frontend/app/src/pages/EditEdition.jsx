import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/apiClient";

const EditEdition = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [edition, setEdition] = useState({
    book_format: "",
    book_id: "",
    publishing_house_id: "",
  });

  const [books, setBooks] = useState([]);
  const [publishingHouses, setPublishingHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [editionRes, booksRes, housesRes] = await Promise.all([
          api.get(`/editions/${id}`),
          api.get("/books"),
          api.get("/publishingHouses"),
        ]);

        setBooks(booksRes.data);
        setPublishingHouses(housesRes.data);
        setEdition({
          book_format: editionRes.data.book_format || "",
          book_id: editionRes.data.book?.book_id
            ? String(editionRes.data.book.book_id)
            : "",
          publishing_house_id: editionRes.data.publishing_house?.publishing_house_id
            ? String(editionRes.data.publishing_house.publishing_house_id)
            : "",
        });
      } catch (err) {
        setError("Error loading data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEdition((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/editions/${id}`, {
        book_format: edition.book_format,
        book_id: Number(edition.book_id),
        publishing_house_id: Number(edition.publishing_house_id),
      });
      alert("Edition updated!");
      navigate("/librarian-dashboard");
    } catch (err) {
      alert("Update error: " + (err.response?.data?.detail || err.message));
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="form-container">
      <h2>Edit Edition</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="book_id">Book:</label>
        <select
          id="book_id"
          name="book_id"
          value={edition.book_id}
          onChange={handleChange}
          required
        >
          <option value="">-- Select a book --</option>
          {books.map((book) => (
            <option key={book.book_id} value={String(book.book_id)}>
              {book.title}
            </option>
          ))}
        </select>

        <label htmlFor="publishing_house_id">Publisher:</label>
        <select
          id="publishing_house_id"
          name="publishing_house_id"
          value={edition.publishing_house_id}
          onChange={handleChange}
          required
        >
          <option value="">-- Select a publisher --</option>
          {publishingHouses.map((house) => (
            <option key={house.publishing_house_id} value={String(house.publishing_house_id)}>
              {house.name}
            </option>
          ))}
        </select>

        <label htmlFor="book_format">Format:</label>
        <input
          id="book_format"
          type="text"
          name="book_format"
          value={edition.book_format}
          onChange={handleChange}
          placeholder="Format"
          required
        />

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditEdition;
