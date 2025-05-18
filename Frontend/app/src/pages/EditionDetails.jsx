import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/apiClient";
import EditionInfo from "../components/EditionDetails/EditionInfo";
import "../statics/editionDetails/page.css";

const EditionDetails = () => {
  const { id } = useParams();
  const [edition, setEdition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEditionDetails = async () => {
      try {
        const response = await api.get(`/editions/${id}`);
        setEdition(response.data);
      } catch (err) {
        setError("Failed to load edition details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEditionDetails();
  }, [id]);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="edition-details">
      <EditionInfo edition={edition} />
    </div>
  );
};

export default EditionDetails;
