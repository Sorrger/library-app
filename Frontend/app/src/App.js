import { BrowserRouter as Router, Route, Routes, Navigate  } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Books from './pages/Books';
import BookDetails from './pages/BookDetails';
import Register from './pages/Register';
import Login from './pages/Login';

import { isLoggedIn } from ".//utils/auth";

function App() {
  return (
    <Router>
      <Routes>
      { /* tak wygląda route do strony na która chce się przejśc tylko gdy jest sie zalogoweanym   -> na konto uzytkownika sie doda potem
      <Route
          path="/"
          element={
            isLoggedIn() ? <Home /> : <Navigate to="/login" />           
          }
        /> */}
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}


export default App;
