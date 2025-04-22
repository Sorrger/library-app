import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/apiClient";


const BookDetails = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookDetails = async () => {
          try {
            const response = await api.get(`/books/${id}`);
            setBook(response.data);
          } catch (err) {
            setError("Błąd podczas ładowania szczegółów książki.");
          } finally {
            setLoading(false);
          }
        };
        fetchBookDetails();
  }, [id]);

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{book.title}</h1>
      <p><strong>Autorzy:</strong> {book.authors.map((author) => author.name).join(", ")}</p>
      <p><strong>Gatunki:</strong> {book.genres.map((genre) => genre.name).join(", ")}</p>
      <p><strong>Data wydania:</strong> {new Date(book.release_date).toLocaleDateString()}</p>
      <p><strong>Opis:</strong> {book.description}</p> {}
    </div>
  );
};

export default BookDetails;