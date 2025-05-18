    import "../statics/librarianDashboard/page.css";
    import { useNavigate } from "react-router-dom";
    import { getUserNameFromToken } from "../utils/auth";
    const LibrarianDashboard = () => {
        const name = getUserNameFromToken();
        const navigate = useNavigate();
        return (
        <div className="librarian-dashboard">
        <section className="profile-section">
            <h2 className="section-title">Witaj, Bibliotekarzu!</h2>
            <p><strong>Imię:</strong> {name}</p>
        </section>

        <section className="profile-section">
            <h2 className="section-title">Szybkie akcje</h2>
            <button className="action-button" onClick={()=>navigate("books/add")}>➕ Dodaj książkę</button>
            <button className="action-button" onClick={()=>navigate("editions/add")}>➕ Dodaj edycję</button>
            <button className="action-button" onClick={()=>navigate("rented-editions")}>📄 Lista wypożyczeń</button>
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
