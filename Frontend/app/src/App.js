import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Books from './pages/Books';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/books" element={<Books />} />
      </Routes>
    </Router>
  );
}


export default App;
