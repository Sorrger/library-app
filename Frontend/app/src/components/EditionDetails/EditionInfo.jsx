import React from "react";
import "../../statics/editionDetails/editionInfo.css";

const EditionInfo = ({ edition }) => {
  return (
    <div className="edition-info">
      <h2 className="edition-title">Edition ID: {edition.edition_id}</h2>
      <p><strong>Status:</strong> {edition.status}</p>
    </div>
  );
};

export default EditionInfo;
