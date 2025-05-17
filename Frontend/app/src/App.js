import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Books from './pages/Books';
import BookDetails from './pages/BookDetails';
import Register from './pages/Register';
import Login from './pages/Login';
import About from './pages/About';
import Profile from './pages/Profile';
import NavBar from './components/Template/NavBar';
import LibrarianDashboard from './pages/LibrarianDashboard';
import AddBook from './pages/AddBook';
import AddEdition from './pages/AddEdition';
import RentedBooks from './pages/RentedBooks';
import { isLoggedIn, getUserRoleFromToken } from "./utils/auth";
import { Fragment } from 'react';



function AppWrapper() {
  const location = useLocation();
  const hideNavBarPaths = ['/login', '/register'];
  const hideNavBar = hideNavBarPaths.includes(location.pathname);
  const userRole = getUserRoleFromToken();

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
        <Route 
          path="/profile" 
          element={!isLoggedIn() ? <Navigate to="/" /> : <Profile />} 
        />
        <Route 
          path="/librarian-dashboard"  
          elemnet={!isLoggedIn() || userRole !== 'librarian'? <Navigate to="/" /> : <LibrarianDashboard/>}
        />
        <Route 
          path="/librarian-dashboard/books/add" 
          elemnet={!isLoggedIn() || userRole !== 'librarian'? <Navigate to="/" /> : <AddBook/>}
        />
        <Route 
          path="/librarian-dashboard/editions/add" 
          elemnet={!isLoggedIn() || userRole !== 'librarian' ? <Navigate to="/" /> : <AddEdition/>}
        />
        <Route 
          path="/librarian-dashboard/rented-editions" 
          elemnet={!isLoggedIn() || userRole !== 'librarian' ? <Navigate to="/" /> : <RentedBooks/>}
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
