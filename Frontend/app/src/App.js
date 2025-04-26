import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Books from './pages/Books';
import BookDetails from './pages/BookDetails';
import Register from './pages/Register';
import Login from './pages/Login';
import NavBar from './components/NavBar/NavBar';
import { isLoggedIn } from "./utils/auth";
import { Fragment } from 'react';
import About from './pages/About';

function AppWrapper() {
  const location = useLocation();
  const hideNavBarPaths = ['/login', '/register'];
  const hideNavBar = hideNavBarPaths.includes(location.pathname);

  return (
    <Fragment>
      {!hideNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/about" element={<About />} />
        <Route 
          path="/register" 
          element={isLoggedIn() ? <Navigate to="/" /> : <Register />} 
        />
        <Route 
          path="/login" 
          element={isLoggedIn() ? <Navigate to="/" /> : <Login />} 
        />
      </Routes>
    </Fragment>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
