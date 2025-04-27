import React from "react";
import "../../statics/bookDetails/bookInfo.css"; 
import "../../statics/bookDetails/page.css";

const BookInfo = ({ book }) => {
  return (
    <div className="book-info">
      <h1 className="book-title">{book.title}</h1>
      <p><strong>Autorzy:</strong> {book.authors.map((author) => author.name).join(", ")}</p>
      <p><strong>Gatunki:</strong> {book.genres.map((genre) => genre.name).join(", ")}</p>
      <p><strong>Data wydania:</strong> {new Date(book.release_date).toLocaleDateString()}</p>
      <p><strong>Opis:</strong> {book.description || "Brak opisu."}</p>
    </div>
  );
};

export default BookInfo;
