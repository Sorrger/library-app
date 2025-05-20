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
  const [borrowedLoans, setBorrowedLoans] = useState([]);
  const [loadingLoans, setLoadingLoans] = useState(true);
  const [errorLoans, setErrorLoans] = useState(null);

  const [booksByEditionId, setBooksByEditionId] = useState({});

  useEffect(() => {
    api.get("/books/count")
      .then((response) => setShowBooksCount(response.data.count))
      .catch((error) => console.error("Error fetching books count:", error));

    api.get("/editions/count")
      .then((response) => setShowEditionsCount(response.data.count))
      .catch((error) => console.error("Error fetching editions count:", error));

    const fetchBorrowedLoans = async () => {
      try {
        const res = await api.get("/loans/reservated");
        setBorrowedLoans(res.data);
      } catch (err) {
        setErrorLoans("Błąd podczas ładowania wypożyczeń");
      } finally {
        setLoadingLoans(false);
      }
    };
    fetchBorrowedLoans();
  }, []);

  useEffect(() => {
    const fetchBookNames = async () => {
      const newBooks = {};
      for (const loan of borrowedLoans) {
        try {
          const res = await api.get(`/editions/${loan.edition.edition_id}/book`);
          newBooks[loan.edition.edition_id] = res.data.title;
        } catch (err) {
          newBooks[loan.edition.edition_id] = "Błąd pobrania tytułu";
        }
      }
      setBooksByEditionId(newBooks);
    };

    if (borrowedLoans.length > 0) {
      fetchBookNames();
    }
  }, [borrowedLoans]);

  const handleChangeStatusToReserved = async (editionId) => {
    try {
      await api.patch(`/editions/${editionId}/borrowed/`);
      setBorrowedLoans((prev) =>
        prev.filter((loan) => loan.edition.edition_id !== editionId)
      );
      alert("Status zmieniony na BORROWED");
    } catch (err) {
      alert("Błąd zmiany statusu: " + (err.response?.data?.detail || err.message));
    }
  };

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
        <button className="action-button">
          📄 Lista wypożyczeń !!!!!!!!TO DO!!!!!!!! 
        </button>
      </section>

      <section className="profile-section">
        <h2 className="section-title">Statystyki</h2>
        <p><strong>Książek:</strong> {showBooksCount}</p>
        <p><strong>Edycji:</strong> {showEditionsCount}</p>
        <p><strong>Wypożyczeń:</strong> NIE PISZ TU</p>
      </section>

      <section className="profile-section">
        <h2 className="section-title">Aktualnie wypożyczone książki</h2>

        {loadingLoans && <p>Ładowanie wypożyczeń...</p>}
        {errorLoans && <p className="error">{errorLoans}</p>}
        {!loadingLoans && !errorLoans && borrowedLoans.length === 0 && (
          <p>Brak aktualnie wypożyczonych książek.</p>
        )}

        {!loadingLoans && !errorLoans && borrowedLoans.length > 0 && (
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
              {borrowedLoans.map((loan) => (
                <tr key={loan.loan_id}>
                  <td>{booksByEditionId[loan.edition.edition_id] || "Ładowanie..."}</td>
                  <td>{loan.student.name}</td>
                  <td>{loan.student.surname}</td>
                  <td>
                    <button
                      className="action-button"
                      onClick={() => handleChangeStatusToReserved(loan.edition.edition_id)}
                    >
                      Zmień na BORROWED
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default LibrarianDashboard;
