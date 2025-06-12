import React from "react";
import "../../statics/bookDetails/bookInfo.css"; 
import "../../statics/bookDetails/page.css";

const BookInfo = ({ book }) => {
  const authorsString = book.authors
    .map(author => `${author.name} ${author.surname}`)
    .join(", ");

  return (
    <div className="book-info">
      <h1 className="book-title">{book.title}</h1>
      <p>
        <strong>Authors:</strong> {authorsString}
      </p>
      <p>
        <strong>Genres:</strong> {book.genres.map(g => g.name).join(", ")}
      </p>
      <p>
        <strong>Release date:</strong> {new Date(book.release_date).toLocaleDateString()}
      </p>
      <p>
        <strong>Description:</strong> {book.description || "No description."}
      </p>
    </div>
  );
};

export default BookInfo;
