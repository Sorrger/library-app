import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/apiClient";


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
    

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{book.title}</h1>
      <p><strong>Autorzy:</strong> {book.authors.map((author) => author.name).join(", ")}</p>
      <p><strong>Gatunki:</strong> {book.genres.map((genre) => genre.name).join(", ")}</p>
      <p><strong>Data wydania:</strong> {new Date(book.release_date).toLocaleDateString()}</p>
      <p><strong>Opis:</strong> {book.description}</p> {}
      
      <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Edycje</h2>
      {editions.length === 0 ? (
        <p className="text-gray-600 italic">Brak dostępnych edycji dla tej książki.</p>
      ) : (
        <ul className="list-disc pl-5 space-y-1">
          {editions.map((edition) => (
            <li key={edition.edition_id}>
              <strong>Format:</strong> {edition.book_format} <strong>Status:</strong> {edition.status}
            </li>
          ))}
        </ul>
      )}
    </div>

        </div>
      )};

export default BookDetails;