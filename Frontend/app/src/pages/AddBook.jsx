import React, { useEffect, useState } from "react";
import api from "../api/apiClient";
import AddBookForm from "../components/AddBook/AddBookForm";
import "../statics/addBook/page.css";

export default function AddBook() {
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [authorsRes, genresRes] = await Promise.all([
          api.get("/authors"),
          api.get("/genres"),
        ]);
        setAuthors(authorsRes.data);
        setGenres(genresRes.data);
      } catch (err) {
        console.error("Błąd podczas pobierania autorów/gatunków", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="form-container">
      <h2>Dodaj nową książkę</h2>
      <AddBookForm
        authors={authors}
        genres={genres}
        setAuthors={setAuthors}
        setGenres={setGenres}
      />
    </div>
  );
}
