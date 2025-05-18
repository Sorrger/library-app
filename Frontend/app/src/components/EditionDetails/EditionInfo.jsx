import React from "react";
import "../../statics/editionDetails/editionInfo.css";

const EditionInfo = ({ edition }) => {
  return (
    <div className="edition-info">
      <h2 className="edition-title">Edition ID: {edition.edition_id}</h2>
      <p><strong>Status:</strong> {edition.status}</p>
      <p><strong>ISBN:</strong> {edition.isbn || "N/A"}</p>
      <p><strong>Language:</strong> {edition.language || "N/A"}</p>
      <p><strong>Published At:</strong> {edition.published_at ? new Date(edition.published_at).toLocaleDateString() : "N/A"}</p>
      <p><strong>Pages:</strong> {edition.page_count || "N/A"}</p>
      <p><strong>Format:</strong> {edition.format || "N/A"}</p>
      <p><strong>Book ID:</strong> {edition.book_id}</p>
    </div>
  );
};

export default EditionInfo;
