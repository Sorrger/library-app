import React from 'react';
import '../statics/notFound/notfound.css';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="notfound-container">
      <h1>404 - Strona nie istnieje</h1>
      <p>Nie znaleziono takiej strony.</p>
      <Link to="/">Powrót na stronę główną</Link>
    </div>
  );
}

export default NotFound;
