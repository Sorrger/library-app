import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Books from './pages/Books';
import BookDetails from './pages/BookDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/books" element={<Books />} />
        <Route path="/books/:id" element={<BookDetails />} />
      </Routes>
    </Router>
  );
}


export default App;
