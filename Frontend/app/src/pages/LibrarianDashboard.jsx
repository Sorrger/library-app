    import "../statics/librarianDashboard/page.css";
    import { useNavigate } from "react-router-dom";
    import { useState, useEffect } from "react";
    import { getUserNameFromToken } from "../utils/auth";
    import api from "../api/apiClient";

    const LibrarianDashboard = () => {
        const name = getUserNameFromToken();
        const navigate = useNavigate();

        const [showBooksCount, setShowBooksCount] = useState("0")
        const [showEditionsCount, setShowEditionsCount] = useState("0")
        const [showRentedCount, setShowRentedCount] = useState("0")

        useEffect(() => {
            api.get("/books/count")
                .then((response)=> setShowBooksCount(response.data.count))
                .catch((error) => console.error("Error fetching books count:", error));
    
            api.get("/editions/count")
                .then((response)=> setShowEditionsCount(response.data.count))
                .catch((error) => console.error("Error fetching editions count:", error));
            // api.get("/rented/count")
            //     .then((response)=> setShowRentedCount(response.data.count))
            //     .catch((error) => console.error("Error fetching rented count:", error));
        },
        [showBooksCount, showEditionsCount]);

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
            <p><strong>Książek:</strong>{showBooksCount}</p>
            <p><strong>Edycji:</strong>{showEditionsCount}</p>
            <p><strong>Wypożyczeń:</strong>{showRentedCount}</p>
        </section>
        </div>
    );
    };

    export default LibrarianDashboard;
