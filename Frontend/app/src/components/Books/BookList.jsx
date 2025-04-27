import React from "react";
import { Link } from "react-router-dom";
import bookIcon from '../../assets/images/book.png';

const BookList = ({ books }) => {
  if (books.length === 0) return <p>0 Books in the list.</p>;

  return (
    <ul className="mt-4 space-y-2">
      {books.map((book, index) => (
        <li key={index} className="p-2 border rounded shadow-sm flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
            <img src={bookIcon} alt="Book" className="w-6 h-6 object-contain" />
          </div>
          <Link to={`/books/${book.book_id}`} className="text-blue-600 hover:underline">
            <strong>{book.title}</strong>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default BookList;
