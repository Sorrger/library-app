import React from "react";
import "../../statics/bookDetails/editionList.css"

const EditionsList = ({ editions }) => {
  return (
    <div className="editions-list">
      <h2 className="editions-title">Edycje</h2>
      {editions.length === 0 ? (
        <p className="no-editions">Brak dostępnych edycji dla tej książki.</p>
      ) : (
        <ul className="editions-items">
          {editions.map((edition) => (
            <li key={edition.edition_id} className="edition-item">
              <strong>Format:</strong> {edition.book_format},{" "}
              <strong>Status:</strong> {edition.status},{" "}
              <strong>Wydawnictwo:</strong> {edition.publishing_house ? edition.publishing_house.name : "Brak informacji"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EditionsList;
