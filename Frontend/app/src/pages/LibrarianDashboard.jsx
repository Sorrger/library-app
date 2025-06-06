import "../statics/librarianDashboard/page.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserNameFromToken } from "../utils/auth";
import api from "../api/apiClient";

const LibrarianDashboard = () => {
  const name = getUserNameFromToken();
  const navigate = useNavigate();

  const [booksCount, setBooksCount] = useState("0");
  const [editionsCount, setEditionsCount] = useState("0");
  const [reservedLoans, setReservedLoans] = useState([]);
  const [loadingLoans, setLoadingLoans] = useState(true);
  const [errorLoans, setErrorLoans] = useState(null);
  const [books, setBooks] = useState([]);
  const [editions, setEditions] = useState([]);

  const [borrowedLoans, setBorrowedLoans] = useState([]);
  const [loadingBorrowed, setLoadingBorrowed] = useState(true);
  const [errorBorrowed, setErrorBorrowed] = useState(null);

  const [booksByEditionId, setBooksByEditionId] = useState({});
  const [borrowedBooksByEditionId, setBorrowedBooksByEditionId] = useState({});

  const [activeLoans, setActiveLoans] = useState("0");
  const [loansCount, setLoansCount] = useState("0");

  const [editionBooks, setEditionBooks] = useState({});
  const [editionPublishers, setEditionPublishers] = useState({});

  const [searchReserved, setSearchReserved] = useState("");
  const [searchBorrowed, setSearchBorrowed] = useState("");
  const [searchBooks, setSearchBooks] = useState("");
  const [searchEditions, setSearchEditions] = useState("");

  const fetchReservedLoans = async () => {
    try {
      const res = await api.get("/loans/reservated");
      setReservedLoans(res.data);
    } catch {
      setErrorLoans("Error while loading reservations");
    } finally {
      setLoadingLoans(false);
    }
  };

  const fetchBorrowedLoans = async () => {
    try {
      const res = await api.get("/loans/borrowed");
      setBorrowedLoans(res.data);
    } catch {
      setErrorBorrowed("Error while loading borrowings");
    } finally {
      setLoadingBorrowed(false);
    }
  };

  useEffect(() => {
    api.get("/books/count").then((res) => setBooksCount(res.data.count));
    api.get("/editions/count").then((res) => setEditionsCount(res.data.count));
    api.get("/active-loans/count").then((res) => setActiveLoans(res.data.count));
    api.get("/loans/count").then((res) => setLoansCount(res.data.count));

    fetchReservedLoans();
    fetchBorrowedLoans();
  }, []);

  useEffect(() => {
    const fetchBookNames = async () => {
      const map = {};
      for (const loan of reservedLoans) {
        try {
          const res = await api.get(`/editions/${loan.edition.edition_id}/book`);
          map[loan.edition.edition_id] = res.data.title;
        } catch {
          map[loan.edition.edition_id] = "Error fetching title";
        }
      }
      setBooksByEditionId(map);
    };
    if (reservedLoans.length > 0) fetchBookNames();
  }, [reservedLoans]);

  useEffect(() => {
    const fetchBorrowedBookNames = async () => {
      const map = {};
      for (const loan of borrowedLoans) {
        try {
          const res = await api.get(`/editions/${loan.edition.edition_id}/book`);
          map[loan.edition.edition_id] = res.data.title;
        } catch {
          map[loan.edition.edition_id] = "Error fetching title";
        }
      }
      setBorrowedBooksByEditionId(map);
    };
    if (borrowedLoans.length > 0) fetchBorrowedBookNames();
  }, [borrowedLoans]);

  useEffect(() => {
    api.get("/books").then((res) => setBooks(res.data));
    api.get("/editions").then((res) => setEditions(res.data));
  }, []);

  const handleChangeStatusToBorrowed = async (editionId) => {
    try {
      await api.patch(`/editions/${editionId}/borrowed/`);
      fetchReservedLoans();
      fetchBorrowedLoans();
      alert("Status changed to BORROWED");
    } catch (err) {
      alert("Error changing status: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleChangeStatusToAvailable = async (editionId, studentId) => {
    try {
      await api.patch(`/loans/${editionId}/return`);
      await api.patch(`/editions/${editionId}/available/`);
      await api.patch(`/students/${studentId}/limit-increase`);
      fetchReservedLoans();
      fetchBorrowedLoans();
      alert("Status changed to AVAILABLE and student's limit increased");
    } catch (err) {
      alert("Error changing status: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleDeleteBook = async (bookId) => {
    const confirm = window.confirm("Are you sure you want to delete this book?");
    if (!confirm) return;
    try {
      await api.delete(`/books/${bookId}`);
      setBooks((prev) => prev.filter((b) => b.book_id !== bookId));
      alert("Book deleted successfully.");
      window.location.reload();
    } catch (err) {
      alert("Error deleting book: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleDeleteEdition = async (editionId) => {
    const confirm = window.confirm("Are you sure you want to delete this edition?");
    if (!confirm) return;
    try {
      await api.delete(`/editions/${editionId}`);
      setEditions((prev) => prev.filter((e) => e.edition_id !== editionId));
      alert("Edition deleted successfully.");
    } catch (err) {
      alert("Error deleting edition: " + (err.response?.data?.detail || err.message));
    }
  };

  useEffect(() => {
    const fetchEditionBooksAndPublishers = async () => {
      const booksMap = {};
      const publishersMap = {};
      for (const edition of editions) {
        try {
          const resBook = await api.get(`/editions/${edition.edition_id}/book`);
          booksMap[edition.edition_id] = resBook.data.title;
        } catch {
          booksMap[edition.edition_id] = "Error fetching title";
        }
        try {
          const resPublisher = await api.get(`/editions/${edition.edition_id}/publisher`);
          publishersMap[edition.edition_id] = resPublisher.data.name;
        } catch {
          publishersMap[edition.edition_id] = "Error fetching publisher";
        }
      }
      setEditionBooks(booksMap);
      setEditionPublishers(publishersMap);
    };

    if (editions.length > 0) {
      fetchEditionBooksAndPublishers();
    }
  }, [editions]);

  const filteredReservedLoans = reservedLoans.filter((loan) =>
    (booksByEditionId[loan.edition.edition_id] || "")
      .toLowerCase()
      .includes(searchReserved.toLowerCase()) ||
    loan.student.name.toLowerCase().includes(searchReserved.toLowerCase()) ||
    loan.student.surname.toLowerCase().includes(searchReserved.toLowerCase())
  );

  const filteredBorrowedLoans = borrowedLoans.filter((loan) =>
    (borrowedBooksByEditionId[loan.edition.edition_id] || "")
      .toLowerCase()
      .includes(searchBorrowed.toLowerCase()) ||
    loan.student.name.toLowerCase().includes(searchBorrowed.toLowerCase()) ||
    loan.student.surname.toLowerCase().includes(searchBorrowed.toLowerCase())
  );

  const filteredBooks = books.filter((book) =>
    (book.title || "").toLowerCase().includes(searchBooks.toLowerCase())
  );

  const filteredEditions = editions.filter((edition) =>
    (edition.status?.toLowerCase().includes(searchEditions.toLowerCase())) ||
    (edition.publication_year?.toString().includes(searchEditions))
  );

  return (
    <div className="librarian-dashboard">
      <section className="profile-section">
        <h2 className="section-title">Hi, Librarian!</h2>
        <p><strong>Name:</strong> {name}</p>
      </section>

      <section className="profile-section">
        <h2 className="section-title">Quick Actions</h2>
        <button className="action-button" onClick={() => navigate("books/add")}>
          ➕ Add Book
        </button>
        <button className="action-button" onClick={() => navigate("editions/add")}>
          ➕ Add Edition
        </button>
      </section>

      <section className="profile-section">
        <h2 className="section-title">Statistics</h2>
        <p><strong>Books:</strong> {booksCount}</p>
        <p><strong>Editions:</strong> {editionsCount}</p>
        <p><strong>Active Reservations:</strong> {activeLoans}</p>
        <p><strong>Total Loans:</strong> {loansCount}</p>
      </section>

      <section className="profile-section">
        <h2 className="section-title">Currently Reserved Books</h2>
        <input
          type="text"
          className="search-input"
          placeholder="Search by book or student..."
          value={searchReserved}
          onChange={(e) => setSearchReserved(e.target.value)}
        />
        {filteredReservedLoans.length > 0 && (
          <div className="scrollable-table-container">
            <table className="borrowed-loans-table">
              <thead>
                <tr>
                  <th>Book Title</th>
                  <th>Student First Name</th>
                  <th>Student Last Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservedLoans.map((loan) => (
                  <tr key={loan.loan_id}>
                    <td>{booksByEditionId[loan.edition.edition_id] || "..."}</td>
                    <td>{loan.student.name}</td>
                    <td>{loan.student.surname}</td>
                    <td>
                      <button
                        className="action-button"
                        onClick={() => handleChangeStatusToBorrowed(loan.edition.edition_id)}
                      >
                        Change to BORROWED
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="profile-section">
        <h2 className="section-title">Currently Borrowed Books</h2>
        <input
          type="text"
          className="search-input"
          placeholder="Search by book or student..."
          value={searchBorrowed}
          onChange={(e) => setSearchBorrowed(e.target.value)}
        />
        {filteredBorrowedLoans.length > 0 && (
          <div className="scrollable-table-container">
            <table className="borrowed-loans-table">
              <thead>
                <tr>
                  <th>Book Title</th>
                  <th>Student First Name</th>
                  <th>Student Last Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBorrowedLoans.map((loan) => (
                  <tr key={loan.loan_id}>
                    <td>{borrowedBooksByEditionId[loan.edition.edition_id] || "..."}</td>
                    <td>{loan.student.name}</td>
                    <td>{loan.student.surname}</td>
                    <td>
                      <button
                        className="action-button"
                        onClick={() => handleChangeStatusToAvailable(loan.edition.edition_id, loan.student.student_id)}
                      >
                        AVAILABLE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="profile-section">
        <h2 className="section-title">Choose a Book to Edit</h2>
        <input
          type="text"
          className="search-input"
          placeholder="Search by title..."
          value={searchBooks}
          onChange={(e) => setSearchBooks(e.target.value)}
        />
        <div className="scrollable-table-container">
          <table className="borrowed-loans-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Book Title</th>
                <th>Publication Date</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr key={book.book_id}>
                  <td onClick={() => navigate(`/books/edit/${book.book_id}`)}>{book.book_id}</td>
                  <td onClick={() => navigate(`/books/edit/${book.book_id}`)}>{book.title}</td>
                  <td onClick={() => navigate(`/books/edit/${book.book_id}`)}>{book.release_date}</td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteBook(book.book_id)}
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="profile-section">
        <h2 className="section-title">Choose an Edition to Edit</h2>
        <input
          type="text"
          className="search-input"
          placeholder="Search by status, title or publisher..."
          value={searchEditions}
          onChange={(e) => setSearchEditions(e.target.value)}
        />
        <div className="scrollable-table-container">
          <table className="borrowed-loans-table">
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Publisher</th>
                <th>Status</th>
                <th>Format</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredEditions.map((edition) => (
                <tr key={edition.edition_id}>
                  <td onClick={() => navigate(`/editions/edit/${edition.edition_id}`)}>{editionBooks[edition.edition_id]}</td>
                  <td onClick={() => navigate(`/editions/edit/${edition.edition_id}`)}>{editionPublishers[edition.edition_id]}</td>
                  <td onClick={() => navigate(`/editions/edit/${edition.edition_id}`)}>{edition.status}</td>
                  <td onClick={() => navigate(`/editions/edit/${edition.edition_id}`)}>{edition.book_format}</td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteEdition(edition.edition_id)}
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default LibrarianDashboard;
