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

    useEffect(() => {
        api.get("/books/count")
            .then((response) => setShowBooksCount(response.data.count))
            .catch((error) => console.error("Error fetching books count:", error));

        api.get("/editions/count")
            .then((response) => setShowEditionsCount(response.data.count))
            .catch((error) => console.error("Error fetching editions count:", error));

        api.get("/loans/borrowed")
            .then((res) => setBorrowedLoans(res.data))
            .catch((err) => console.error("Error fetching borrowed loans:", err));
    }, []);

    const handleStatusChange = async (editionId) => {
        try {
            await api.patch(`/editions/${editionId}/borrowed/`);
            setBorrowedLoans((prev) =>
                prev.filter((loan) => loan.edition.edition_id !== editionId)
            );
            alert("Status edycji zmieniony na 'reserved'.");
        } catch (error) {
            alert("Błąd zmiany statusu: " + (error.response?.data?.detail || error.message));
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
                <button className="action-button" onClick={() => navigate("rented-editions")}>
                    📄 Lista wypożyczeń
                </button>
            </section>

            <section className="profile-section">
                <h2 className="section-title">Statystyki</h2>
                <p><strong>Książek:</strong> {showBooksCount}</p>
                <p><strong>Edycji:</strong> {showEditionsCount}</p>
                <p><strong>Wypożyczeń:</strong> {borrowedLoans.length}</p>
            </section>

            <section className="profile-section">
                <h2 className="section-title">Aktualnie wypożyczone książki</h2>
                {borrowedLoans.length === 0 ? (
                    <p>Brak wypożyczeń.</p>
                ) : (
                    <ul className="loan-list">
                        {borrowedLoans.map((loan) => (
                            <li key={loan.loan_id} className="loan-entry">
                                <p>
                                    <strong>Tytuł:</strong>{" "}
                                    {loan.edition.book.title}
                                </p>
                                <p>
                                    <strong>Student:</strong>{" "}
                                    {loan.student.first_name}{" "}
                                    {loan.student.last_name}
                                </p>
                                <button
                                    className="action-button"
                                    onClick={() =>
                                        handleStatusChange(
                                            loan.edition.edition_id
                                        )
                                    }
                                >
                                    🔁 Oznacz jako „reserved”
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
};

export default LibrarianDashboard;
