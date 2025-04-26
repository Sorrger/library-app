import React from 'react';
import '../../statics/NavBar.css'; 

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        LibraryApp
      </div>
      <ul className="navbar-links">
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/login">Login</a></li>
        <li><a href="/register">Register</a></li>
      </ul>
    </nav>
  );
};

export default NavBar;
