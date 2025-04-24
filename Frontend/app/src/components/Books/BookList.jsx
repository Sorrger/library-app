import React from "react";
import { Link } from "react-router-dom";

const BookList = ({ books }) => {
  if (books.length === 0) return <p>0 Books in the list.</p>;

  return (
    <ul className="mt-4 space-y-2">
      {books.map((book, index) => (
        <li key={index} className="p-2 border rounded shadow-sm">
          <Link to={`/books/${book.book_id}`} className="block">
          <strong>{book.title}</strong><br />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default BookList;
