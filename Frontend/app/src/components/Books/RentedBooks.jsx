import React, {useEffect, useState} from 'react';
import api from '../../api/apiClient';


export default function RentedBooks() {
    const [rentedBooks, setRentedBooks] = useState([]);

    useEffect(() => {
        const fetchRentedBooks = async () => {
        const response = await api.get("/rented-editions");
        setRentedBooks(response.data);
    };
    fetchRentedBooks();
    },[]);
    return(
        <div className='rentedBooks'>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                    </tr>
                </thead>
                <tbody>
                {rentedBooks.map((rentedBook) => (
                    <tr key={rentedBook.edition_id}>
                    <td>{rentedBook.edition_id}</td>
                    <td>{rentedBook.book_format}</td>
                    <td>{rentedBook.status}</td>
                    <td>{rentedBook.publishing_house_id}</td>
                    </tr>
                ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="4">Total: {rentedBooks.length}</td>
                    </tr>
                </tfoot>       
            </table>
        </div>
    );
}

