import React from 'react';
import '../../statics/template/NavBar.css';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { isLoggedIn, removeToken } from '../../utils/auth';
import accountIcon from '../../assets/icons/account.png';



const NavBar = () => {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();


  const handleLogout = () => {
    removeToken();
    navigate('/');
  };


  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">MyWebsite</Link>
      </div>
      <ul className="navbar-links">
          <li><NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
          <li><NavLink to="/books" className={({ isActive }) => isActive ? 'active' : ''}>Books</NavLink></li>
          <li><NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink></li>
          {loggedIn ? (
            <>
              <li><NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}><img src={accountIcon} alt='Profile' /></NavLink></li>
              <li onClick={handleLogout}>Logout</li>
            </>
          ) : (
            <>
              <li><NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>Login</NavLink></li>
            </>
          )}
    </ul>

    </nav>
  );
};

export default NavBar;