import React, { useState, useEffect } from "react";
import "../../statics/profile/studentData.css";
import api from "../../api/apiClient";

const StudentData = ({
  student = {},
  reservations = [],
  borrowed = [],
  allLoans = [],
  onCancelReservation
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [fines, setFines] = useState([]);
  const [hidePaid, setHidePaid] = useState(false); // NEW

  useEffect(() => {
    const fetchFines = async () => {
      if (!student?.student_id) return;
      try {
        const res = await api.get(`/students/${student.student_id}/fines`);
        setFines(res.data);
      } catch (err) {
        console.error("Error fetching student fines", err);
      }
    };

    fetchFines();
  }, [student?.student_id]);

  const filteredLoans = allLoans.filter(loan =>
    loan.edition?.book?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unpaidFines = fines.filter(f => !f.is_paid);
  const paidFines = fines.filter(f => f.is_paid);

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

      <div className="profile-subsection">
        <h3>Fines</h3>
        <label style={{ display: "block", marginBottom: "10px" }}>
          <input
            type="checkbox"
            checked={hidePaid}
            onChange={() => setHidePaid(!hidePaid)}
            style={{ marginRight: "8px" }}
          />
          Hide Paid Fines
        </label>

        <div className="fines-list-scroll">
          <ul>
            {unpaidFines.map(fine => (
            <li className="fine-unpaid" key={`unpaid-${fine.fine_id}`}>
              <strong>#{fine.fine_id}</strong> - {fine.title} - {fine.fine_type.replaceAll("_", " ")} – {fine.value} zł –
              Unpaid ❌ – Assigned: {new Date(fine.assigned_at).toLocaleDateString()}
            </li>
            ))}

            {!hidePaid &&
              paidFines.map(fine => (
            <li className="fine-paid" key={`paid-${fine.fine_id}`}>
              <strong>#{fine.fine_id}</strong> {fine.fine_type.replaceAll("_", " ")} – {fine.value} zł – 
              Paid ✅ – Paid on: {new Date(fine.paid_at).toLocaleDateString()}
            </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentData;
