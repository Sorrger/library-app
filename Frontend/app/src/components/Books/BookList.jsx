import React from "react";
import { Link } from "react-router-dom";
import bookIcon from '../../assets/images/book.png';
import "../../statics/books/bookList.css";

const BookList = ({ books }) => {
  if (books.length === 0) return <p className="no-books">Brak książek do wyświetlenia.</p>;

  return (
    <ul className="book-list">
      {books.map((book, index) => (
        <li key={index} className="book-item">
          <div className="book-icon">
            <img src={bookIcon} alt="Book" className="icon-image" />
          </div>
          <Link to={`/books/${book.book_id}`} className="book-link">
            <strong>{book.title}</strong>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default BookList;
