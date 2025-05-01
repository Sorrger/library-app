import React from "react";
import "../../statics/bookDetails/bookInfo.css"; 
import "../../statics/bookDetails/page.css";

const BookInfo = ({ book }) => {
  return (
    <div className="book-info">
      <h1 className="book-title">{book.title}</h1>
      <p><strong>Authors:</strong> {book.authors.map((author) => author.name).join(", ")}</p>
      <p><strong>Species:</strong> {book.genres.map((genre) => genre.name).join(", ")}</p>
      <p><strong>Release date:</strong> {new Date(book.release_date).toLocaleDateString()}</p>
      <p><strong>Description:</strong> {book.description || "No description."}</p>
    </div>
  );
};

export default BookInfo;
