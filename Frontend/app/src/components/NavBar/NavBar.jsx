import React from 'react';
import '../../statics/NavBar.css';
import { Link, useNavigate } from 'react-router-dom';
import { isLoggedIn, removeToken } from '../../utils/auth';

const NavBar = () => {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">MyWebsite</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/books">Books</Link></li>
        <li><Link to="/about">About</Link></li>
        {loggedIn ? (
          <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
