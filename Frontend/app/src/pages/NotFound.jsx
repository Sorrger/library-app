import React from 'react';
import '../statics/notFound/notfound.css';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="notfound-container">
      <h1>404 - Page Not Found</h1>
      <p>This page does not exist.</p>
      <Link to="/">Return to homepage</Link>
    </div>
  );
}

export default NotFound;
