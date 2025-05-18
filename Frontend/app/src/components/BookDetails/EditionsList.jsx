import React from "react";
import { useNavigate } from "react-router-dom";
import "../../statics/bookDetails/editionList.css";

const EditionsList = ({ editions }) => {
  const navigate = useNavigate();

  const handleViewDetails = (editionId) => {
    navigate(`/editions/${editionId}`);
  };

  return (
    <div className="editions-list">
      <h2 className="editions-title">Editions</h2>
      {editions.length === 0 ? (
        <p className="no-editions">No editions available for this book.</p>
      ) : (
        <ul className="editions-items">
          {editions.map((edition) => (
            <li key={edition.edition_id} className="edition-item">
              <p>
                <strong>Format:</strong> {edition.book_format},{" "}
                <strong>Status:</strong> {edition.status},{" "}
                <strong>Publishing house:</strong>{" "}
                {edition.publishing_house ? edition.publishing_house.name : "No information"}
              </p>
              <button
                className="view-details-button"
                onClick={() => handleViewDetails(edition.edition_id)}
              >
                View Details
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EditionsList;
