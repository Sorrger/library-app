import React, { useState } from "react";
import "../../statics/profile/studentData.css";

const StudentData = ({
  student = {},
  reservations = [],
  borrowed = [],
  allLoans = [],
  onCancelReservation
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLoans = allLoans.filter(loan =>
    loan.edition?.book?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="profile-section">
      <h2 className="section-title">Student Data</h2>
      <p><strong>Name:</strong> {student.name ?? "No name"}</p>
      <p><strong>Surname:</strong> {student.surname ?? "No surname"}</p>
      <p><strong>Phone number:</strong> {student.phone_number ?? "No number"}</p>
      <p><strong>Book Limit:</strong> {student.books_limit ?? "None"}/5</p>

      <div className="profile-subsection">
        <h3>Reservations</h3>
        {reservations.length > 0 ? (  
          <ul>
            {reservations.map(res => (
              <li key={res.loan_id}>
                {`${res.edition?.book?.title ?? "No title"} - Format: ${res.edition?.book_format ?? "?"}`}
                {onCancelReservation && (
                  <button
                    className="cancel-button"
                    onClick={() => onCancelReservation(res.id)}
                    aria-label={`Cancel reservation for ${res.edition?.book?.title}`}
                  >
                    Cancel
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No reservations</p>
        )}
      </div>

      <div className="profile-subsection">
        <h3>Borrowed Books</h3>
        {borrowed.length > 0 ? (
          <ul>
            {borrowed.map(b => (
              <li key={b.loan_id}>
                {`${b.edition?.book?.title ?? "No title"} - Format: ${b.edition?.book_format ?? "?"}`}
              </li>
            ))}
          </ul>
        ) : (
          <p>No borrowed books</p>
        )}
      </div>

      <div className="profile-subsection loan-history-section">
        <h3>All Loans</h3>
        <input
          type="text"
          placeholder="Search loan history..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="loan-search"
        />
        {filteredLoans.length > 0 ? (
          <div className="loan-list-scroll">
            <ul>
              {filteredLoans.map(loan => (
                <li key={loan.loan_id}>
                  {`${loan.edition?.book?.title ?? "No title"} - Format: ${loan.edition?.book_format ?? "?"}`} – 
                  borrowed: {new Date(loan.loan_date).toLocaleDateString()}
                  {loan.return_date && ` – returned: ${new Date(loan.return_date).toLocaleDateString()}`}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No loan history</p>
        )}
      </div>
    </div>
  );
};

export default StudentData;