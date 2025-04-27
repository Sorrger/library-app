import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/apiClient";
import BookInfo from "../components/BookDetails/BookInfo";
import EditionsList from "../components/BookDetails/EditionsList";
import "../statics/bookDetails/page.css";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [editions, setEditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const [bookResponse, editionsResponse] = await Promise.all([
          api.get(`/books/${id}`),
          api.get(`/books/${id}/editions`)
        ]);
        setBook(bookResponse.data);
        setEditions(editionsResponse.data);
      } catch (err) {
        setError("Błąd podczas ładowania szczegółów książki.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  if (loading) return <p className="loading">Ładowanie...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="book-details">
      <BookInfo book={book} />
      <EditionsList editions={editions} />
    </div>
  );
};

export default BookDetails;
