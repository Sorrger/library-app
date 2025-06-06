import React from "react";
import "../../statics/profile/studentData.css";

const StudentData = ({ student, reservations, borrowed, onCancelReservation}) => {
  return (
    <div className="profile-section">
      <h2 className="section-title">Student Data</h2>
      <p><strong>Name:</strong> {student.name ?? "Brak imienia"}</p>
      <p><strong>Surname:</strong> {student.surname ?? "Brak nazwiska"}</p>
      <p><strong>Phone number:</strong> {student.phone_number ?? "Brak numeru"}</p>
      <p><strong>Rented Books:</strong> {student.books_limit ?? "Brak"}/5</p>

      <div className="profile-subsection">
        <h3>Reservations</h3>
        {reservations.length > 0 ? (
          <ul>
            {reservations.map(res => (
              <li key={res.id}>
                {res.edition?.book?.title ?? `Edycja #${res.edition?.edition_id}`}
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
              <li key={b.id}>
                {b.edition?.book?.title ?? `Edycja #${b.edition?.edition_id}`}
              </li>
            ))}
          </ul>
        ) : (
          <p>No borrowed books</p>
        )}
      </div>
    </div>
  );
};

export default StudentData;