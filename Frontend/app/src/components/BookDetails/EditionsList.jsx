import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../statics/bookDetails/editionList.css";

const EditionsList = ({ editions }) => {
  const navigate = useNavigate();

  const [formatFilter, setFormatFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [publishingHouseFilter, setPublishingHouseFilter] = useState("");

  const handleViewDetails = (editionId) => {
    navigate(`/editions/${editionId}`);
  };

  const filteredEditions = editions.filter((edition) => {
    const formatMatch = edition.book_format.toLowerCase().includes(formatFilter.toLowerCase());
    const statusMatch = edition.status.toLowerCase().includes(statusFilter.toLowerCase());
    const publishingHouseName = edition.publishing_house ? edition.publishing_house.name : "";
    const publishingHouseMatch = publishingHouseName.toLowerCase().includes(publishingHouseFilter.toLowerCase());

    return formatMatch && statusMatch && publishingHouseMatch;
  });

  return (
    <div className="editions-list">
      <h2 className="editions-title">Editions</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by format"
          value={formatFilter}
          onChange={(e) => setFormatFilter(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by publishing house"
          value={publishingHouseFilter}
          onChange={(e) => setPublishingHouseFilter(e.target.value)}
        />
      </div>

      {filteredEditions.length === 0 ? (
        <p className="no-editions">No editions match your search criteria.</p>
      ) : (
        <ul className="editions-items">
          {filteredEditions.map((edition) => (
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
