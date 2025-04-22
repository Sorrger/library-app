import React from "react";

const BookList = ({ books }) => {
  if (books.length === 0) return <p>0 Books in the list.</p>;

  return (
    <ul className="mt-4 space-y-2">
      {books.map((book, index) => (
        <li key={index} className="p-2 border rounded shadow-sm">
          <strong>{book.title}</strong><br />
          <span className="text-sm text-gray-600">
            Autorzy: {book.authors.map((author) => author.name).join(", ")}
          </span><br />
          <span className="text-sm text-gray-600">
            Gatunki: {book.genres.map((genre) => genre.name).join(", ")}
          </span><br />
          <span className="text-sm text-gray-500">
            Data wydania: {new Date(book.release_date).toLocaleDateString()}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default BookList;
