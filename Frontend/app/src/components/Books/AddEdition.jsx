import React, { useEffect } from 'react';
import api from '../../api/apiClient'

export default function AddEdition() {
    const [status, setStatus] = React.useState("");
    const [available, setAvailable] = React.useState("");
    const [bookId, setBookId] = React.useState("");
    const [publishingHouse, setPublishingHouse] = React.useState("");
    const [books, setBooks] = React.useState([]);
    const [publicHouses, setPublicHouses] = React.useState([]);
    // const handleSubit = async(e) => {
    //     continue;
    // }

    useEffect(() => {
        const fetchBooks = async()=>{
            const response = await api.get("/books");
            setBooks(response.data);
        };
            const fetchPublishingHouses = async()=>{
                const response = await api.get("/publishingHouses");
                setPublicHouses(response.data);
        };
        fetchBooks();
        fetchPublishingHouses();
    },[]);

    return(
        <div className="form-container">
            <h2>Dodaj nową edycję</h2>
            <form>
                <label>Książka:</label>
                <select name='books' onChange={(e)=> setBookId(e.target.value)}>
                    {books.map((book) => (
                        <option key={book.id} value={book.id}>{book.title}</option>
                    ))}
                    </select>
                <label>Wydawnictwo:</label>
                <select name='publishingHouse' onChange={(e)=> setBookId(e.target.value)}>
                    {publicHouses.map((publicHouse) => (
                        <option key={publicHouse.id} value={publicHouse.id}>{publicHouse.name}</option>
                    ))}
                    </select>
               </form>
        </div>
    );

};