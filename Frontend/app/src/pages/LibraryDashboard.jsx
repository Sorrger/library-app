import React from "react";
import "../statics/librarianDashboard/LibrarianDashboard.css";

const LibrarianDashboard = () => {
  return (
    <div className="librarian-dashboard">
      <section className="profile-section">
        <h2 className="section-title">Witaj, Bibliotekarzu!</h2>
        <p><strong>Imię:</strong> Jan</p>
        <p><strong>Email:</strong> jan.bibliotekarz@biblioteka.pl</p>
      </section>

      <section className="profile-section">
        <h2 className="section-title">Szybkie akcje</h2>
        <button className="action-button">➕ Dodaj książkę</button>
        <button className="action-button">➕ Dodaj edycję</button>
        <button className="action-button">📄 Lista wypożyczeń</button>
      </section>

      <section className="profile-section">
        <h2 className="section-title">Statystyki</h2>
        <p><strong>Książek:</strong> 124</p>
        <p><strong>Edycji:</strong> 381</p>
        <p><strong>Wypożyczeń:</strong> 89</p>
      </section>
    </div>
  );
};

export default LibrarianDashboard;
