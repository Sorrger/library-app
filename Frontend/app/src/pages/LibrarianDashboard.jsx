import "../statics/librarianDashboard/page.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserNameFromToken } from "../utils/auth";
import api from "../api/apiClient";

const LibrarianDashboard = () => {
  const name = getUserNameFromToken();
  const navigate = useNavigate();

  const [showBooksCount, setShowBooksCount] = useState("0");
  const [showEditionsCount, setShowEditionsCount] = useState("0");
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

  const [activeLoans, setActiveLoansCount] = useState("0");
  const [showLoansCount, setShowLoansCount] = useState("0");

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
    } catch (err) {
      setErrorLoans("Błąd podczas ładowania rezerwacji");
    } finally {
      setLoadingLoans(false);
    }
  };

  const fetchBorrowedLoans = async () => {
    try {
      const res = await api.get("/loans/borrowed");
      setBorrowedLoans(res.data);
    } catch (err) {
      setErrorBorrowed("Błąd podczas ładowania wypożyczeń");
    } finally {
      setLoadingBorrowed(false);
    }
  };

  useEffect(() => {
    api.get("/books/count")
      .then((response) => setShowBooksCount(response.data.count))
      .catch((error) => console.error("Error fetching books count:", error));

    api.get("/editions/count")
      .then((response) => setShowEditionsCount(response.data.count))
      .catch((error) => console.error("Error fetching editions count:", error));

    api.get("/active-loans/count")
      .then((response) => setActiveLoansCount(response.data.count))
      .catch((error) => console.error("Error fetching activeLoans count:", error));

    api.get("/loans/count")
      .then((response) => setShowLoansCount(response.data.count))
      .catch((error) => console.error("Error fetching loans count:", error));

    fetchBorrowedLoans();
    fetchReservedLoans();
  }, []);

  useEffect(() => {
    const fetchBookNames = async () => {
      const newBooks = {};
      for (const loan of reservedLoans) {
        try {
          const res = await api.get(`/editions/${loan.edition.edition_id}/book`);
          newBooks[loan.edition.edition_id] = res.data.title;
        } catch (err) {
          newBooks[loan.edition.edition_id] = "Błąd pobrania tytułu";
        }
      }
      setBooksByEditionId(newBooks);
    };

    if (reservedLoans.length > 0) {
      fetchBookNames();
    }
  }, [reservedLoans]);

  useEffect(() => {
    const fetchBorrowedBookNames = async () => {
      const newBooks = {};
      for (const loan of borrowedLoans) {
        try {
          const res = await api.get(`/editions/${loan.edition.edition_id}/book`);
          newBooks[loan.edition.edition_id] = res.data.title;
        } catch (err) {
          newBooks[loan.edition.edition_id] = "Błąd pobrania tytułu";
        }
      }
      setBorrowedBooksByEditionId(newBooks);
    };

    if (borrowedLoans.length > 0) {
      fetchBorrowedBookNames();
    }
  }, [borrowedLoans]);

  useEffect(() => {
    api.get("/books")
      .then((response) => setBooks(response.data))
      .catch((error) => console.error("Error fetching books:", error));

    api.get("/editions")
      .then((response) => setEditions(response.data))
      .catch((error) => console.error("Error fetching editions:", error));
  }, []);

  const handleChangeStatusToBorrowed = async (editionId) => {
    try {
      await api.patch(`/editions/${editionId}/borrowed/`);
      fetchReservedLoans();
      fetchBorrowedLoans();
      alert("Status zmieniony na BORROWED");
    } catch (err) {
      alert("Błąd zmiany statusu: " + (err.response?.data?.detail || err.message));
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
          booksMap[edition.edition_id] = "Błąd pobrania tytułu";
        }
        try {
          const resPublisher = await api.get(`/editions/${edition.edition_id}/publisher`);
          publishersMap[edition.edition_id] = resPublisher.data.name;
        } catch {
          publishersMap[edition.edition_id] = "Błąd pobrania wydawnictwa";
        }
      }
      setEditionBooks(booksMap);
      setEditionPublishers(publishersMap);
    };

    if (editions.length > 0) {
      fetchEditionBooksAndPublishers();
    }
  }, [editions]);


  const handleChangeStatusToAvailable = async (editionId, studentId) => {
    try {
      await api.patch(`/loans/${editionId}/return`);
      await api.patch(`/editions/${editionId}/available/`);
      await api.patch(`/students/${studentId}/limit-increase`);
      fetchReservedLoans();
      fetchBorrowedLoans();
      alert("Status zmieniony na AVAILABLE i zwiększono limit studenta");
    } catch (err) {
      alert("Błąd zmiany statusu: " + (err.response?.data?.detail || err.message));
    }
  };

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
    (book.title || "").toLowerCase().includes(searchBooks.toLowerCase()) ||
    (book.authors || "").toLowerCase().includes(searchBooks.toLowerCase())
  );

  const filteredEditions = editions.filter((edition) =>
    (edition.status?.toLowerCase().includes(searchEditions.toLowerCase())) ||
    (edition.publication_year?.toString().includes(searchEditions))
  );

  return (
    <div className="librarian-dashboard">
      <section className="profile-section">
        <h2 className="section-title">Witaj, Bibliotekarzu!</h2>
        <p><strong>Imię:</strong> {name}</p>
      </section>

      <section className="profile-section">
        <h2 className="section-title">Szybkie akcje</h2>
        <button className="action-button" onClick={() => navigate("books/add")}>
          ➕ Dodaj książkę
        </button>
        <button className="action-button" onClick={() => navigate("editions/add")}>
          ➕ Dodaj edycję
        </button>
      </section>

      <section className="profile-section">
        <h2 className="section-title">Statystyki</h2>
        <p><strong>Książek:</strong> {showBooksCount}</p>
        <p><strong>Edycji:</strong> {showEditionsCount}</p>
        <p><strong>Liczba aktualnych wypożyczeń:</strong> {activeLoans}</p>
        <p><strong>Liczba łącznie wypożyczeń:</strong> {showLoansCount}</p>
      </section>

      <section className="profile-section">
        <h2 className="section-title">Aktualnie zarezerwowane książki</h2>
        <input
          type="text"
          placeholder="Szukaj książki lub studenta..."
          className="search-input"
          value={searchReserved}
          onChange={(e) => setSearchReserved(e.target.value)}
        />

        {loadingLoans && <p>Ładowanie zarezerwowanych...</p>}
        {errorLoans && <p className="error">{errorLoans}</p>}
        {!loadingLoans && !errorLoans && filteredReservedLoans.length === 0 && (
          <p>Brak wyników.</p>
        )}

        {!loadingLoans && !errorLoans && filteredReservedLoans.length > 0 && (
          <div className="scrollable-table-container">
            <table className="borrowed-loans-table">
              <thead>
                <tr>
                  <th>Tytuł książki</th>
                  <th>Imię studenta</th>
                  <th>Nazwisko studenta</th>
                  <th>Akcja</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservedLoans.map((loan) => (
                  <tr key={loan.loan_id}>
                    <td>{booksByEditionId[loan.edition.edition_id] || "Ładowanie..."}</td>
                    <td>{loan.student.name}</td>
                    <td>{loan.student.surname}</td>
                    <td>
                      <button
                        className="action-button"
                        onClick={() => handleChangeStatusToBorrowed(loan.edition.edition_id)}
                      >
                        Zmień na BORROWED
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
        <h2 className="section-title">Aktualnie wypożyczone książki</h2>
        <input
          type="text"
          placeholder="Szukaj książki lub studenta..."
          className="search-input"
          value={searchBorrowed}
          onChange={(e) => setSearchBorrowed(e.target.value)}
        />

        {loadingBorrowed && <p>Ładowanie wypożyczeń...</p>}
        {errorBorrowed && <p className="error">{errorBorrowed}</p>}
        {!loadingBorrowed && !errorBorrowed && filteredBorrowedLoans.length === 0 && (
          <p>Brak wyników.</p>
        )}

        {!loadingBorrowed && !errorBorrowed && filteredBorrowedLoans.length > 0 && (
          <div className="scrollable-table-container">
            <table className="borrowed-loans-table">
              <thead>
                <tr>
                  <th>Tytuł książki</th>
                  <th>Imię studenta</th>
                  <th>Nazwisko studenta</th>
                  <th>Akcja</th>
                </tr>
              </thead>
              <tbody>
                {filteredBorrowedLoans.map((loan) => (
                  <tr key={loan.loan_id}>
                    <td>{borrowedBooksByEditionId[loan.edition.edition_id] || "Ładowanie..."}</td>
                    <td>{loan.student.name}</td>
                    <td>{loan.student.surname}</td>
                    <td>
                        <button
                          className="action-button"
                          onClick={() =>
                            handleChangeStatusToAvailable(loan.edition.edition_id, loan.student.student_id)
                          }
                        >
                          Zmień na AVAILABLE
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
        <h2 className="section-title">Lista książek</h2>
        <input
          type="text"
          placeholder="Szukaj po tytule..."
          className="search-input"
          value={searchBooks}
          onChange={(e) => setSearchBooks(e.target.value)}
        />
        <div className="scrollable-table-container">
          <table className="borrowed-loans-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tytuł książki</th>
                <th>Data publikacji</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr
                  key={book.book_id}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/books/edit/${book.book_id}`)}
                >
                  <td>{book.book_id}</td>
                  <td>{book.title}</td>
                  <td>{book.release_date || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="profile-section">
        <h2 className="section-title">Lista edycji</h2>
        <input
          type="text"
          placeholder="Szukaj po tytule, wydawnictwie lub statusie..."
          className="search-input"
          value={searchEditions}
          onChange={(e) => setSearchEditions(e.target.value)}
        />
        <div className="scrollable-table-container">
          <table className="borrowed-loans-table">
            <thead>
              <tr>
                <th>Tytuł książki</th>
                <th>Wydawnictwo</th>
                <th>Status</th>
                <th>Format</th>
              </tr>
            </thead>
            <tbody>
              {filteredEditions.map((edition) => (
                <tr
                  key={edition.edition_id}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/editions/edit/${edition.edition_id}`)}
                >
                  <td>{editionBooks[edition.edition_id] || "Ładowanie..."}</td>
                  <td>{editionPublishers[edition.edition_id] || "Ładowanie..."}</td>
                  <td>{edition.status}</td>
                  <td>{edition.book_format}</td>
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
